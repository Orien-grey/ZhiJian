<template>
  <div class="map-wrapper">
    <!-- 悬浮统计卡 -->
    <div class="stats-overlay">
      <div class="stats-row">
        <div class="stat-card">
          <div class="stat-card-inner">
            <div class="stat-corner tl" /><div class="stat-corner tr" /><div class="stat-corner bl" /><div class="stat-corner br" />
            <div class="stat-scanline" />
            <div class="stat-grid" />
            <span v-for="r in displayStats.region" :key="r.name" class="stat-item">
              <span class="stat-name">{{ r.name }}</span>
              <span class="stat-count">{{ r.count }}</span>
              <span class="stat-change" :class="r.change >= 0 ? 'up' : 'down'">{{ r.change >= 0 ? '+' : '' }}{{ r.change }}</span>
            </span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-card-inner">
            <div class="stat-corner tl" /><div class="stat-corner tr" /><div class="stat-corner bl" /><div class="stat-corner br" />
            <div class="stat-scanline" />
            <div class="stat-grid" />
            <span class="stat-label">近24H处理</span>
            <span class="stat-big">{{ displayStats.notam24h }}</span>
            <span class="stat-unit">条</span>
            <span class="stat-divider" />
            <span class="stat-label">有效禁航</span>
            <span class="stat-big">{{ displayStats.activeProhibited }}</span>
            <span class="stat-unit">条</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-card-inner">
            <div class="stat-corner tl" /><div class="stat-corner tr" /><div class="stat-corner bl" /><div class="stat-corner br" />
            <div class="stat-scanline" />
            <div class="stat-grid" />
            <span v-for="c in displayStats.international" :key="c.name" class="stat-item">
              <span class="stat-name">{{ c.name }}</span>
              <span class="stat-count">{{ c.count }}</span>
            </span>
          </div>
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
MOCK_CIRCLE_ZONES.forEach(z => { zoneMap[z.name] = { id:z.id,name:z.name,type:'圆形限制区',notamRef:z.notams[0]?.notamId||'',effective:z.notams[0]?.effectiveStart+'~'+z.notams[0]?.effectiveEnd||'',altitude:z.notams[0]?.altitudeLow+'→'+z.notams[0]?.altitudeHigh||'',radius:z.radius,controllingUnit:'东部战区空军航管中心',contactFreq:'132.50 MHz',detail:z.notams[0]?.content||'',affectedRoutes:z.notams[0]?.affectedRoutes||[],purpose:'实弹射击训练' }})
MOCK_POLYGON_ZONES.forEach(z => { zoneMap[z.name] = { id:z.id,name:z.name,type:'禁航区',notamRef:z.notams[0]?.notamId||'',effective:z.notams[0]?.effectiveStart+'~'+z.notams[0]?.effectiveEnd||'',altitude:z.notams[0]?.altitudeLow+'→'+z.notams[0]?.altitudeHigh||'',controllingUnit:'空军作战指挥中心',contactFreq:'128.75 MHz',detail:z.notams[0]?.content||'',affectedRoutes:z.notams[0]?.affectedRoutes||[],purpose:'联合军事演习' }})

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

/* ── 悬浮统计卡 ── */
.stats-overlay { position: absolute; top: 14px; left: 16px; right: 16px; z-index: 10; pointer-events: none; }
.stats-row { display: flex; gap: 10px; justify-content: center; }
.stat-card {
  position: relative;
  padding: 1px;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(0,212,255,0.25), rgba(0,212,255,0.05) 40%, rgba(245,158,11,0.05) 60%, rgba(245,158,11,0.15));
  pointer-events: auto;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 30px rgba(0,0,0,0.4);
}
.stat-card:hover {
  transform: translateY(-4px) scale(1.03);
  box-shadow: 0 20px 50px rgba(0,0,0,0.5), 0 0 40px rgba(0,212,255,0.1);
}
.stat-card-inner {
  position: relative;
  background: linear-gradient(165deg, rgba(8,14,36,0.97) 0%, rgba(12,22,48,0.95) 50%, rgba(6,12,30,0.97) 100%);
  border-radius: 15px;
  padding: 10px 18px;
  display: flex; align-items: center; gap: 10px;
  overflow: hidden;
  backdrop-filter: blur(24px);
}
.stat-card-inner::before {
  content: '';
  position: absolute; top: 0; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent 0%, rgba(0,212,255,0.4) 30%, rgba(245,158,11,0.3) 70%, transparent 100%);
}
.stat-corner {
  position: absolute; width: 6px; height: 6px; pointer-events: none; z-index: 3;
  border-color: rgba(0,212,255,0.35);
  transition: all 0.4s;
}
.stat-corner.tl { top: 6px; left: 6px; border-top: 1.5px solid; border-left: 1.5px solid; border-top-left-radius: 4px; }
.stat-corner.tr { top: 6px; right: 6px; border-top: 1.5px solid; border-right: 1.5px solid; border-top-right-radius: 4px; }
.stat-corner.bl { bottom: 6px; left: 6px; border-bottom: 1.5px solid; border-left: 1.5px solid; border-bottom-left-radius: 4px; }
.stat-corner.br { bottom: 6px; right: 6px; border-bottom: 1.5px solid; border-right: 1.5px solid; border-bottom-right-radius: 4px; }
.stat-card:hover .stat-corner { border-color: rgba(0,212,255,0.7); width: 10px; height: 10px; }
.stat-scanline {
  position: absolute; top: 0; left: -100%; width: 60%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0,212,255,0.04), transparent);
  animation: scan-sweep 4s ease-in-out infinite;
  pointer-events: none; z-index: 1;
}
.stat-grid {
  position: absolute; inset: 0; pointer-events: none; z-index: 0; opacity: 0.4;
  background-image:
    linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px);
  background-size: 16px 16px;
  mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 70%);
  -webkit-mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 70%);
}
@keyframes scan-sweep {
  0%, 100% { left: -60%; opacity: 0; }
  50% { opacity: 1; }
  100% { left: 100%; opacity: 0; }
}
.stat-item { display: flex; align-items: center; gap: 4px; font-size: 11px; position: relative; z-index: 2; }
.stat-name { color: #475569; font-weight: 600; letter-spacing: 0.04em; }
.stat-count { font-weight: 800; font-family: 'IBM Plex Mono', monospace; color: #f8fafc; text-shadow: 0 0 16px rgba(255,255,255,0.15); }
.stat-change { font-size: 9px; font-weight: 800; font-family: 'IBM Plex Mono', monospace; padding: 2px 6px; border-radius: 5px; letter-spacing: 0.02em; }
.stat-change.up { color: #f87171; background: rgba(239,68,68,0.14); border: 1px solid rgba(239,68,68,0.2); }
.stat-change.down { color: #34d399; background: rgba(16,185,129,0.14); border: 1px solid rgba(16,185,129,0.2); }
.stat-label { font-size: 10px; color: #475569; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; }
.stat-big { font-size: 17px; font-weight: 900; font-family: 'IBM Plex Mono', monospace; color: #00d4ff; text-shadow: 0 0 24px rgba(0,212,255,0.35), 0 0 8px rgba(0,212,255,0.2); }
.stat-unit { font-size: 10px; color: #475569; }
.stat-divider { width: 1px; height: 14px; background: linear-gradient(180deg, transparent, rgba(0,212,255,0.2), transparent); margin: 0 4px; }

/* ── 限制区弹窗 ── */
.zone-overlay { position: fixed; inset: 0; z-index: 1000; background: rgba(0,0,0,0.75); backdrop-filter: blur(12px) saturate(1.2); display: flex; align-items: center; justify-content: center; }
.zone-modal {
  max-width: 540px; width: 90%; max-height: 70vh; overflow-y: auto;
  background: linear-gradient(165deg, rgba(10,16,40,0.98) 0%, rgba(14,24,52,0.96) 50%, rgba(8,14,36,0.98) 100%);
  border: 1px solid rgba(239,68,68,0.3);
  border-radius: 24px;
  padding: 32px;
  box-shadow:
    0 0 100px rgba(239,68,68,0.12),
    0 30px 80px rgba(0,0,0,0.6),
    inset 0 1px 0 rgba(255,255,255,0.05);
  position: relative; overflow: hidden;
  animation: modal-in 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes modal-in {
  from { opacity: 0; transform: scale(0.92) translateY(20px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
.zone-modal::before {
  content: '';
  position: absolute; top: 0; left: 20%; right: 20%; height: 2px;
  background: linear-gradient(90deg, transparent, rgba(239,68,68,0.8), rgba(245,158,11,0.5), transparent);
  border-radius: 1px;
}
.zone-modal::after {
  content: '';
  position: absolute; inset: 0;
  background:
    radial-gradient(ellipse 50% 30% at 50% 0%, rgba(239,68,68,0.08) 0%, transparent 60%),
    radial-gradient(ellipse 40% 40% at 80% 100%, rgba(245,158,11,0.04) 0%, transparent 50%);
  pointer-events: none;
}
.zone-modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 22px; position: relative; z-index: 1; }
.zone-modal-title { font-size: 18px; font-weight: 900; color: #fca5a5; letter-spacing: 0.04em; text-shadow: 0 0 30px rgba(239,68,68,0.25); }
.zone-close {
  width: 36px; height: 36px; border-radius: 12px;
  border: 1.5px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.03);
  color: #64748b; cursor: pointer; font-size: 15px;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex; align-items: center; justify-content: center;
  position: relative; overflow: hidden;
}
.zone-close::before {
  content: '';
  position: absolute; inset: 0;
  background: radial-gradient(circle at center, rgba(239,68,68,0.2) 0%, transparent 70%);
  opacity: 0; transition: opacity 0.3s;
}
.zone-close:hover { border-color: rgba(239,68,68,0.4); color: #fca5a5; transform: rotate(135deg) scale(1.1); }
.zone-close:hover::before { opacity: 1; }
.zone-item {
  padding: 18px 0;
  border-bottom: 1px solid rgba(255,255,255,0.04);
  position: relative; z-index: 1;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.zone-item:hover {
  background: rgba(255,255,255,0.025);
  margin: 0 -16px; padding-left: 16px; padding-right: 16px;
  border-radius: 14px;
  border-bottom-color: transparent;
}
.zone-item:last-child { border-bottom: none; }
.zone-item-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.zone-id { font-size: 12px; font-weight: 900; color: #ef4444; font-family: 'IBM Plex Mono', monospace; text-shadow: 0 0 16px rgba(239,68,68,0.3); letter-spacing: 0.02em; }
.zone-time { font-size: 10px; color: #475569; font-family: 'IBM Plex Mono', monospace; background: rgba(100,116,139,0.08); padding: 3px 10px; border-radius: 6px; border: 1px solid rgba(100,116,139,0.1); }
.zone-alt { font-size: 11px; color: #64748b; margin-bottom: 10px; font-family: 'IBM Plex Mono', monospace; display: flex; align-items: center; gap: 6px; }
.zone-alt::before { content: '↕'; color: rgba(0,212,255,0.4); font-size: 10px; }
.zone-content { font-size: 12px; color: #94a3b8; line-height: 1.8; margin: 0 0 12px; }
.zone-routes { font-size: 10px; color: #475569; display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.zone-route {
  color: #38bdf8; background: rgba(56,189,248,0.08);
  padding: 3px 10px; border-radius: 6px;
  font-family: 'IBM Plex Mono', monospace; font-weight: 700; font-size: 9px;
  border: 1px solid rgba(56,189,248,0.15);
  transition: all 0.25s; letter-spacing: 0.02em;
}
.zone-route:hover { background: rgba(56,189,248,0.18); border-color: rgba(56,189,248,0.35); box-shadow: 0 0 12px rgba(56,189,248,0.15); transform: translateY(-1px); }
</style>
