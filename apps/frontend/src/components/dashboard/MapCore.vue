<template>
  <div class="map-wrapper">
    <!-- 悬浮统计卡 -->
    <div class="stats-overlay">
      <div class="stats-row">
        <div class="stat-card">
          <span v-for="r in displayStats.region" :key="r.name" class="stat-item">
            <span class="stat-name">{{ r.name }}</span>
            <span class="stat-count">{{ r.count }}</span>
            <span class="stat-change" :class="r.change >= 0 ? 'up' : 'down'">{{ r.change >= 0 ? '+' : '' }}{{ r.change }}</span>
          </span>
        </div>
        <div class="stat-card">
          <span class="stat-label">近24H处理</span>
          <span class="stat-big">{{ displayStats.notam24h }}</span>
          <span class="stat-unit">条</span>
          <span class="stat-divider">|</span>
          <span class="stat-label">有效禁航</span>
          <span class="stat-big">{{ displayStats.activeProhibited }}</span>
          <span class="stat-unit">条</span>
        </div>
        <div class="stat-card">
          <span v-for="c in displayStats.international" :key="c.name" class="stat-item">
            <span class="stat-name">{{ c.name }}</span>
            <span class="stat-count">{{ c.count }}</span>
          </span>
        </div>
      </div>
    </div>

    <!-- ECharts -->
    <div ref="chartRef" class="chart-container" />

    <!-- 限制区弹窗 -->
    <Teleport to="body">
      <div v-if="selectedZone" class="zone-overlay" @click.self="selectedZone = null">
        <div class="zone-modal">
          <div class="zone-modal-header">
            <span class="zone-modal-title">{{ selectedZone.name }}</span>
            <button class="zone-close" @click="selectedZone = null">✕</button>
          </div>
          <div v-for="n in selectedZone.notams" :key="n.notamId" class="zone-item">
            <div class="zone-item-top">
              <span class="zone-id">{{ n.notamId }}</span>
              <span class="zone-time">{{ n.effectiveStart }} ~ {{ n.effectiveEnd }}</span>
            </div>
            <div class="zone-alt">{{ n.altitudeLow }} → {{ n.altitudeHigh }}</div>
            <p class="zone-content">{{ n.content }}</p>
            <div class="zone-routes">
              受影响航路：
              <span v-for="r in n.affectedRoutes" :key="r" class="zone-route">{{ r }}</span>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- 悬停情报浮窗 -->
    <MapTooltip
      :visible="tip.show"
      :x="tip.x" :y="tip.y"
      :type="tip.type"
      :wp="tip.wp" :rt="tip.rt" :cz="tip.cz" :pz="tip.pz" :ap="tip.ap"
      @close="tip.show = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import {
  MOCK_WAYPOINTS, MOCK_ROUTES, MOCK_POLYGON_ZONES, MOCK_CIRCLE_ZONES,
  MOCK_FIR_BOUNDARIES, MOCK_MAP_STATS, type PolygonZone,
} from '@/views/dashboard/mock/mapData'
import { WAYPOINT_DETAILS, ROUTE_DETAILS, AIRPORT_DETAILS, type WaypointDetail, type RouteDetail, type ZoneDetail, type AirportDetail } from '@/views/dashboard/mock/mapTooltip'
import MapTooltip from './MapTooltip.vue'

const props = withDefaults(defineProps<{
  filters?: { prohibited: boolean; restricted: boolean; waypoints: boolean; routes: boolean; airports: boolean; allAirports: boolean }
  activeTime?: 'today' | 'tomorrow' | 'both'
}>(), { filters: () => ({ prohibited: true, restricted: true, waypoints: true, routes: true, airports: true, allAirports: false }), activeTime: 'today' })
const emit = defineEmits<{ (e: 'airport-click', icao: string): void }>()

const chartRef = ref<HTMLDivElement | null>(null)
let instance: echarts.ECharts | null = null
const selectedZone = ref<PolygonZone | null>(null)
const mapStats = MOCK_MAP_STATS

// ---- 悬停浮窗状态 ----
const tip = ref({ show:false, x:0, y:0, type:'' as string, wp:null as WaypointDetail|null, rt:null as RouteDetail|null, cz:null as ZoneDetail|null, pz:null as ZoneDetail|null, ap:null as AirportDetail|null })

const zoneMap: Record<string,ZoneDetail> = {}
MOCK_CIRCLE_ZONES.forEach(z => { zoneMap[z.name] = { id:z.id,name:z.name,type:'圆形限制区',notamRef:z.notams[0]?.notamId||'',effective:z.notams[0]?.effectiveStart+'~'+z.notams[0]?.effectiveEnd||'',altitude:z.notams[0]?.altitudeLow+'→'+z.notams[0]?.altitudeHigh||'',radius:z.radius,controllingUnit:'空军航管中心',contactFreq:'132.50 MHz',detail:z.notams[0]?.content||'',affectedRoutes:z.notams[0]?.affectedRoutes||[] }})
MOCK_POLYGON_ZONES.forEach(z => { zoneMap[z.name] = { id:z.id,name:z.name,type:'禁航区',notamRef:z.notams[0]?.notamId||'',effective:z.notams[0]?.effectiveStart+'~'+z.notams[0]?.effectiveEnd||'',altitude:z.notams[0]?.altitudeLow+'→'+z.notams[0]?.altitudeHigh||'',controllingUnit:'空军航管中心',contactFreq:'132.50 MHz',detail:z.notams[0]?.content||'',affectedRoutes:z.notams[0]?.affectedRoutes||[] }})

// 时间维度驱动统计卡变化
const timeMultiplier = computed(() => props.activeTime === 'tomorrow' ? 1.15 : props.activeTime === 'both' ? 1.3 : 1)
const displayStats = computed(() => ({
  region: MOCK_MAP_STATS.region.map(r => ({ ...r, count: Math.round(r.count * timeMultiplier.value) })),
  notam24h: Math.round(MOCK_MAP_STATS.notam24h * timeMultiplier.value),
  activeProhibited: Math.round(MOCK_MAP_STATS.activeProhibited * timeMultiplier.value),
  international: MOCK_MAP_STATS.international.map(c => ({ ...c, count: Math.round(c.count * timeMultiplier.value) })),
}))

// 机场坐标（用于地图标记）
const AIRPORT_MARKERS: { icao: string; lng: number; lat: number }[] = [
  { icao:'ZBAA', lng:116.585, lat:40.073 }, { icao:'ZSSS', lng:121.336, lat:31.198 },
  { icao:'ZGGG', lng:113.300, lat:23.393 }, { icao:'ZUUU', lng:103.947, lat:30.579 },
  { icao:'ZLXY', lng:108.754, lat:34.446 }, { icao:'ZUCK', lng:106.642, lat:29.719 },
  { icao:'ZHCC', lng:113.842, lat:34.521 }, { icao:'ZSAM', lng:118.129, lat:24.546 },
  { icao:'ZSNJ', lng:118.860, lat:31.742 }, { icao:'ZBTJ', lng:117.347, lat:39.127 },
  { icao:'ZSPD', lng:121.806, lat:31.144 }, { icao:'ZSHC', lng:120.432, lat:30.229 },
  { icao:'ZGSZ', lng:113.811, lat:22.640 }, { icao:'ZJHK', lng:110.462, lat:19.939 },
  { icao:'ZYTX', lng:123.493, lat:41.640 }, { icao:'ZPPP', lng:102.919, lat:25.101 },
  { icao:'ZSJN', lng:116.983, lat:36.857 }, { icao:'ZUGY', lng:106.802, lat:26.539 },
  { icao:'ZWWW', lng:87.474, lat:43.907 },
]

function findWaypoint(code: string): [number, number] | null {
  const w = MOCK_WAYPOINTS.find(wp => wp.code === code)
  return w ? [w.lng, w.lat] : null
}

function bezierCoords(from: [number, number], to: [number, number]): [number, number][] {
  const dx = to[0] - from[0], dy = to[1] - from[1]
  const dist = Math.sqrt(dx * dx + dy * dy)
  const midX = (from[0] + to[0]) / 2, midY = (from[1] + to[1]) / 2
  const off = Math.min(dist * 0.25, 3)
  const perpX = -dy / dist * off, perpY = dx / dist * off
  const pts: [number, number][] = []
  for (let i = 0; i <= 25; i++) {
    const t = i / 25
    pts.push([(1 - t) ** 2 * from[0] + 2 * (1 - t) * t * (midX + perpX) + t ** 2 * to[0], (1 - t) ** 2 * from[1] + 2 * (1 - t) * t * (midY + perpY) + t ** 2 * to[1]])
  }
  return pts
}

function circlePts(center: [number, number], rKm: number): [number, number][] {
  const pts: [number, number][] = []
  const k = 111.32
  for (let i = 0; i <= 48; i++) {
    const a = (Math.PI * 2 * i) / 48
    pts.push([center[0] + (rKm * Math.cos(a)) / (k * Math.cos((center[1] * Math.PI) / 180)), center[1] + (rKm * Math.sin(a)) / k])
  }
  return pts
}

function render() {
  if (!chartRef.value) return
  if (!instance) instance = echarts.init(chartRef.value)

  const filters = props.filters || { prohibited: true, restricted: true, waypoints: true, routes: true, airports: true, allAirports: false }
  const series: any[] = [
    // FIR 边界
    ...MOCK_FIR_BOUNDARIES.map(fir => ({
      type: 'lines', coordinateSystem: 'geo', polyline: true, silent: true, zlevel: 0,
      data: [{ coords: fir.coords }],
      lineStyle: { color: 'rgba(0,212,255,0.1)', width: 1, type: 'dashed' },
    })),
    // 航路（受过滤控制）
    ...(filters.routes ? MOCK_ROUTES.map((route, i) => {
      const coords: [number, number][] = []
      for (let j = 0; j < route.waypoints.length - 1; j++) {
        const f = findWaypoint(route.waypoints[j]), t = findWaypoint(route.waypoints[j + 1])
        if (f && t) coords.push(...bezierCoords(f, t))
      }
      return coords.length > 0 ? {
        type: 'lines', coordinateSystem: 'geo', polyline: true, zlevel: 1,
        data: [{ coords, name: route.name }],
        lineStyle: { color: 'rgba(0,212,255,0.06)', width: 1 },
        emphasis: { lineStyle: { color: 'rgba(0,212,255,0.5)', width: 2.5 } },
        effect: { show: true, period: 5 + i * 0.6, trailLength: 0.1, symbol: 'circle', symbolSize: 2, color: 'rgba(0,212,255,0.38)' },
      } : null
    }).filter(Boolean) : []),
    // 航路点（受过滤控制）
    ...(filters.waypoints ? [{
      type: 'scatter', coordinateSystem: 'geo', zlevel: 3,
      data: MOCK_WAYPOINTS.map(w => ({ name: w.code, value: [w.lng, w.lat] })),
      symbolSize: 5, itemStyle: { color: '#fff', borderColor: 'rgba(0,180,220,0.58)', borderWidth: 1.5 },
      label: { show: true, position: 'right', color: '#94a3b8', fontSize: 9, fontFamily: 'monospace', distance: 4 },
    }] : []),
    // 圆形限制区（受限制区过滤，含同心圆雷达环）
    ...(filters.restricted ? MOCK_CIRCLE_ZONES.flatMap(z => [
      { type:'lines' as const, coordinateSystem:'geo' as const, polyline:true, zlevel:1,
        data:[{ coords:circlePts(z.center, z.radius*1.5), name: z.name }],
        lineStyle:{ color:'rgba(56,189,248,0.05)', width:1, type:'dashed' } },
      { type:'lines' as const, coordinateSystem:'geo' as const, polyline:true, zlevel:1,
        data:[{ coords:circlePts(z.center, z.radius*0.6), name: z.name }],
        lineStyle:{ color:'rgba(56,189,248,0.1)', width:1 } },
      { type:'lines' as const, coordinateSystem:'geo' as const, polyline:true, zlevel:2,
        data:[{ coords:circlePts(z.center, z.radius), name: z.name }],
        lineStyle:{ color:'rgba(56,189,248,0.48)', width:2 } },
      { type:'scatter' as const, coordinateSystem:'geo' as const, zlevel:1,
        data:[[z.center[0], z.center[1], 1] as [number,number,number]],
        symbolSize:40, itemStyle:{ color:'rgba(56,189,248,0.05)' } },
      { type:'scatter' as const, coordinateSystem:'geo' as const, zlevel:2,
        data:[{ name:z.name, value:[z.center[0], z.center[1], 1] as [number,number,number] }],
        symbolSize:8, itemStyle:{ color:'rgba(56,189,248,0.6)', borderColor:'#fff', borderWidth:1 },
        label:{ show:true, formatter:z.name, color:'#7dd3fc', fontSize:9, position:'top', distance:8 } },
    ]) : []),
    // 机场标记（受运行机场/所有机场过滤）
    ...((filters.airports || filters.allAirports) ? [{
      type: 'scatter' as const, coordinateSystem: 'geo' as const, zlevel: 4,
      data: AIRPORT_MARKERS.map(a => ({ name: a.icao, value: [a.lng, a.lat] })),
      symbolSize: 8, itemStyle: { color: '#00d4ff', borderColor: '#fff', borderWidth: 2, shadowBlur: 6, shadowColor: 'rgba(0,212,255,0.5)' },
      label: { show: true, position: 'right', color: '#e2e8f0', fontSize: 10, fontFamily: 'monospace', distance: 6 },
    }] : []),
    // 多边形限制区（受禁航通告过滤）
    ...(filters.prohibited ? MOCK_POLYGON_ZONES.flatMap(z => {
      const cx = z.coords.reduce((s,c) => s + c[0], 0) / z.coords.length
      const cy = z.coords.reduce((s,c) => s + c[1], 0) / z.coords.length
      const pts = z.coords.map(c => [...c, 1] as [number, number, number])
      return [
        // 半透明填充多边形（用顶点散点模拟面）
        ...z.coords.map(c => ({
          type: 'scatter' as const, coordinateSystem: 'geo' as const, zlevel: 1,
          data: [{ name: z.name, value: [...c, 1] as [number, number, number] }],
          symbolSize: 6, itemStyle: { color: 'rgba(239,68,68,0.12)' },
        })),
        // 中心大面积光晕
        {
          type: 'scatter' as const, coordinateSystem: 'geo' as const, zlevel: 1,
          data: [{ name: z.name, value: [cx, cy, 1] as [number, number, number] }],
          symbolSize: 50, itemStyle: { color: 'rgba(239,68,68,0.1)' },
        },
        // 红色边框
        {
          type: 'lines' as const, coordinateSystem: 'geo' as const, polyline: true, zlevel: 2,
          data: [{ coords: z.coords, name: z.name }],
          lineStyle: { color: 'rgba(239,68,68,0.5)', width: 2, type: 'dashed' },
          label: { show: true, formatter: z.name, color: '#fca5a5', fontSize: 10 },
          emphasis: { lineStyle: { color: 'rgba(239,68,68,0.85)', width: 3 } },
        },
      ]
    }) : []),
    // 禁航区→受影响航路点连接线
    ...(filters.prohibited ? MOCK_POLYGON_ZONES.flatMap(z => {
      const cx = z.coords.reduce((s,c) => s + c[0], 0) / z.coords.length
      const cy = z.coords.reduce((s,c) => s + c[1], 0) / z.coords.length
      const wps = [...new Set(z.notams.flatMap(n => n.affectedRoutes.flatMap(r => { const rt = MOCK_ROUTES.find(rt => rt.name === r); return rt ? rt.waypoints : [] })))]
      return wps.map(wpCode => { const wp = findWaypoint(wpCode); if (!wp) return null; return { type: "lines", coordinateSystem:"geo", zlevel:1, silent:true, data:[{ coords:[[cx,cy], wp] }], lineStyle:{ color:"rgba(239,68,68,0.2)", width:0.5, type:"dotted" } } }).filter(Boolean)
    }) : []),
  ]

  instance.setOption({
    backgroundColor: 'transparent',
    geo: {
      map: 'china', roam: true, zoom: 1.2, center: [105, 34], aspectScale: 0.85,
      tooltip: { show: true, trigger: 'item' },
      itemStyle: { areaColor: 'rgba(8,14,32,0.8)', borderColor: 'rgba(0,212,255,0.12)', borderWidth: 1 },
      emphasis: { disabled: true },
      regions: [{ name: '南海诸岛', itemStyle: { areaColor: 'rgba(8,14,32,0.8)', borderColor: 'rgba(0,212,255,0.06)' } }],
    },
    series,
  }, true)
}

onMounted(async () => {
  if (!(echarts as any).getMap('china')) {
    try { const g = await import('@/assets/map/china.json'); echarts.registerMap('china', g.default as any) } catch { /* */ }
  }
  render()
  instance?.on('click', (p: any) => {
    if (p.seriesType === 'lines' && p.data?.name) {
      const z = MOCK_POLYGON_ZONES.find(z => z.name === p.data.name)
      if (z) selectedZone.value = z
    }
    // 点击机场标记 → 弹出详情
    if (p.seriesType === 'scatter' && AIRPORT_MARKERS.some(a => a.icao === p.name)) {
      emit('airport-click', p.name)
    }
  })
  instance?.on('dblclick', () => { instance?.dispatchAction({ type: 'restore' }) })

  // 悬停事件
  instance?.on('mouseover', (p: any) => {
    const e = (p as any).event?.event ?? (p as any).event
    if (!e) return
    const x = (e as any).clientX, y = (e as any).clientY
    // 航路点
    if (p.seriesType === 'scatter' && p.name && WAYPOINT_DETAILS[p.name]) {
      tip.value = { show:true, x, y, type:'waypoint', wp:WAYPOINT_DETAILS[p.name], rt:null, cz:null, pz:null, ap:null }
    }
    // 航路
    else if (p.seriesType === 'lines' && p.name && ROUTE_DETAILS[p.name]) {
      tip.value = { show:true, x, y, type:'route', wp:null, rt:ROUTE_DETAILS[p.name], cz:null, pz:null, ap:null }
    }
    // 圆形/多边形限制区
    else if ((p.seriesType === 'lines' || p.seriesType === 'scatter') && p.data?.name && zoneMap[p.data.name]) {
      const z = zoneMap[p.data.name]
      tip.value = { show:true, x, y, type:z.type==='禁航区'?'polygon':'circle', wp:null, rt:null, cz:z.type==='圆形限制区'?z:null, pz:z.type==='禁航区'?z:null, ap:null }
    }
    // 机场
    else if (p.seriesType === 'scatter' && p.name && AIRPORT_DETAILS[p.name]) {
      tip.value = { show:true, x, y, type:'airport', wp:null, rt:null, cz:null, pz:null, ap:AIRPORT_DETAILS[p.name] }
    }
  })
  instance?.on('mouseout', () => { tip.value = { ...tip.value, show:false } })

  // 监听容器尺寸变化，拖拽面板时自动适配地图大小
  if (chartRef.value) {
    resizeObserver = new ResizeObserver(() => {
      instance?.resize()
    })
    resizeObserver.observe(chartRef.value)
  }
})

// 监听过滤变化，重新渲染
watch(() => props.filters, () => render(), { deep: true })

let resizeObserver: ResizeObserver | null = null

onUnmounted(() => {
  resizeObserver?.disconnect()
  instance?.dispose(); instance = null
})
</script>

<style scoped>
.map-wrapper { position: relative; flex: 1; display: flex; flex-direction: column; overflow: hidden; }
.chart-container { flex: 1; min-height: 0; }

.stats-overlay { position: absolute; top: 10px; left: 16px; right: 16px; z-index: 10; pointer-events: none; }
.stats-row { display: flex; gap: 8px; justify-content: center; }
.stat-card { background: rgba(10,18,40,0.85); border: 1px solid rgba(0,212,255,0.12); border-radius: 10px; padding: 6px 12px; backdrop-filter: blur(12px); display: flex; align-items: center; gap: 8px; pointer-events: auto; }
.stat-item { display: flex; align-items: center; gap: 3px; font-size: 11px; }
.stat-name { color: #64748b; }
.stat-count { font-weight: 700; font-family: 'IBM Plex Mono', monospace; color: #e2e8f0; }
.stat-change { font-size: 10px; font-weight: 600; }
.stat-change.up { color: #ef4444; }
.stat-change.down { color: #10b981; }
.stat-label { font-size: 10px; color: #64748b; }
.stat-big { font-size: 15px; font-weight: 800; font-family: 'IBM Plex Mono', monospace; color: #00d4ff; }
.stat-unit { font-size: 10px; color: #64748b; }
.stat-divider { color: rgba(0,212,255,0.1); margin: 0 3px; }

.zone-overlay { position: fixed; inset: 0; z-index: 1000; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; }
.zone-modal { max-width: 500px; width: 90%; max-height: 70vh; overflow-y: auto; background: rgba(14,22,50,0.98); border: 1px solid rgba(239,68,68,0.2); border-radius: 16px; padding: 24px; box-shadow: 0 0 60px rgba(239,68,68,0.1); }
.zone-modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
.zone-modal-title { font-size: 15px; font-weight: 700; color: #fca5a5; }
.zone-close { width: 28px; height: 28px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.08); background: none; color: #94a3b8; cursor: pointer; font-size: 14px; }
.zone-close:hover { background: rgba(255,255,255,0.06); color: #fff; }
.zone-item { padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.04); }
.zone-item-top { display: flex; justify-content: space-between; margin-bottom: 6px; }
.zone-id { font-size: 12px; font-weight: 700; color: #ef4444; font-family: 'IBM Plex Mono', monospace; }
.zone-time { font-size: 10px; color: #64748b; }
.zone-alt { font-size: 11px; color: #94a3b8; margin-bottom: 6px; }
.zone-content { font-size: 12px; color: #cbd5e1; line-height: 1.6; margin: 0 0 6px; }
.zone-routes { font-size: 10px; color: #64748b; display: flex; align-items: center; gap: 4px; flex-wrap: wrap; }
.zone-route { color: #00d4ff; background: rgba(0,212,255,0.1); padding: 1px 6px; border-radius: 3px; font-family: 'IBM Plex Mono', monospace; }
</style>
