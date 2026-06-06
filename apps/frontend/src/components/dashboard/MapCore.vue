<template>
  <div class="map-wrapper">
    <!-- 悬浮统计卡 -->
    <div class="stats-overlay">
      <div class="stats-row">
        <div class="stat-card">
          <span v-for="r in mapStats.region" :key="r.name" class="stat-item">
            <span class="stat-name">{{ r.name }}</span>
            <span class="stat-count">{{ r.count }}</span>
            <span class="stat-change" :class="r.change >= 0 ? 'up' : 'down'">{{ r.change >= 0 ? '+' : '' }}{{ r.change }}</span>
          </span>
        </div>
        <div class="stat-card">
          <span class="stat-label">近24H处理</span>
          <span class="stat-big">{{ mapStats.notam24h }}</span>
          <span class="stat-unit">条</span>
          <span class="stat-divider">|</span>
          <span class="stat-label">有效禁航</span>
          <span class="stat-big">{{ mapStats.activeProhibited }}</span>
          <span class="stat-unit">条</span>
        </div>
        <div class="stat-card">
          <span v-for="c in mapStats.international" :key="c.name" class="stat-item">
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import {
  MOCK_WAYPOINTS, MOCK_ROUTES, MOCK_POLYGON_ZONES, MOCK_CIRCLE_ZONES,
  MOCK_FIR_BOUNDARIES, MOCK_MAP_STATS, type PolygonZone,
} from '@/views/dashboard/mock/mapData'

const chartRef = ref<HTMLDivElement | null>(null)
let instance: echarts.ECharts | null = null
const selectedZone = ref<PolygonZone | null>(null)
const mapStats = MOCK_MAP_STATS

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

  const series: any[] = [
    // FIR 边界
    ...MOCK_FIR_BOUNDARIES.map(fir => ({
      type: 'lines', coordinateSystem: 'geo', polyline: true, silent: true, zlevel: 0,
      data: [{ coords: fir.coords }],
      lineStyle: { color: 'rgba(0,212,255,0.1)', width: 1, type: 'dashed' },
    })),
    // 航路
    ...MOCK_ROUTES.map((route, i) => {
      const coords: [number, number][] = []
      for (let j = 0; j < route.waypoints.length - 1; j++) {
        const f = findWaypoint(route.waypoints[j]), t = findWaypoint(route.waypoints[j + 1])
        if (f && t) coords.push(...bezierCoords(f, t))
      }
      return coords.length > 0 ? {
        type: 'lines', coordinateSystem: 'geo', polyline: true, zlevel: 1,
        data: [{ coords }],
        lineStyle: { color: 'rgba(0,212,255,0.06)', width: 1 },
        effect: { show: true, period: 5 + i * 0.6, trailLength: 0.1, symbol: 'circle', symbolSize: 2, color: 'rgba(0,212,255,0.4)' },
      } : null
    }).filter(Boolean),
    // 航路点
    {
      type: 'scatter', coordinateSystem: 'geo', zlevel: 3, silent: true,
      data: MOCK_WAYPOINTS.map(w => ({ name: w.code, value: [w.lng, w.lat] })),
      symbolSize: 5, itemStyle: { color: '#fff', borderColor: 'rgba(0,180,220,0.6)', borderWidth: 1.5 },
      label: { show: true, position: 'right', color: '#94a3b8', fontSize: 9, fontFamily: 'monospace', distance: 4 },
    },
    // 圆形限制区
    ...MOCK_CIRCLE_ZONES.map(z => ({
      type: 'lines', coordinateSystem: 'geo', polyline: true, zlevel: 2, silent: true,
      data: [{ coords: circlePts(z.center, z.radius) }],
      lineStyle: { color: 'rgba(56,189,248,0.35)', width: 2 },
    })),
    // 多边形限制区
    ...MOCK_POLYGON_ZONES.map(z => ({
      type: 'lines', coordinateSystem: 'geo', polyline: true, zlevel: 2,
      data: [{ coords: z.coords, name: z.name }],
      lineStyle: { color: 'rgba(239,68,68,0.45)', width: 1.5 },
      label: { show: true, formatter: z.name, color: '#fca5a5', fontSize: 10, position: 'insideTopLeft' },
    })),
  ]

  instance.setOption({
    backgroundColor: 'transparent',
    geo: {
      map: 'china', roam: true, zoom: 1.2, center: [105, 34], aspectScale: 0.85,
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
  // 点击限制区事件
  instance?.on('click', (p: any) => {
    if (p.seriesType === 'lines' && p.data?.name) {
      const z = MOCK_POLYGON_ZONES.find(z => z.name === p.data.name)
      if (z) selectedZone.value = z
    }
  })
})

onUnmounted(() => { instance?.dispose(); instance = null })
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
