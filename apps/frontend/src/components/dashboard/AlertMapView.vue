<template>
  <div :class="wrapperCls">
    <div :class="headerCls">
      <div :class="headerLeftCls">
        <span :class="dotCls" />
        <span :class="titleCls">空域情报态势</span>
        <span :class="badgeCls">{{ alertCount }} 条告警</span>
      </div>
      <div :class="legendCls">
        <span :class="legendItemCls"><span :class="legendDotCritical" />紧急</span>
        <span :class="legendItemCls"><span :class="legendDotWarning" />预警</span>
        <span :class="legendItemCls"><span :class="legendDotInfo" />信息</span>
        <span :class="legendItemCls"><span :class="legendDotRoute" />航线</span>
      </div>
    </div>
    <div ref="chartRef" :class="chartCls" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import 'echarts-extension-amap'  // 引入高德地图扩展（注册扩展）
import AMapLoader from '@amap/amap-jsapi-loader'  // 使用官方加载器加载API
import { css } from '@/styled-system/css'
import { AMAP_KEY, AMAP_STYLE } from '@/config/amap'
import type { AeroAlert } from '@/views/dashboard/mock/dashboardData'

const props = defineProps<{ alerts: AeroAlert[]; alertCount: number }>()

const chartRef = ref<HTMLDivElement | null>(null)
let instance: echarts.ECharts | null = null

// 机场坐标库
const AIRPORT: Record<string, [number, number]> = {
  ZBAA: [116.585, 40.073], ZSSS: [121.336, 31.198], ZGGG: [113.300, 23.393],
  ZUUU: [103.947, 30.579], ZLXY: [108.754, 34.446], ZUCK: [106.642, 29.719],
  ZHCC: [113.842, 34.521], ZSAM: [118.129, 24.546], ZSNJ: [118.860, 31.742],
  ZBTJ: [117.347, 39.127], ZGSZ: [113.811, 22.640], ZSHC: [120.432, 30.229],
  ZYTL: [121.540, 38.965], ZPPP: [102.919, 25.101], ZYTX: [123.493, 41.640],
  ZUGY: [106.802, 26.539], ZSPD: [121.806, 31.144], ZHHH: [114.210, 30.784],
  ZJHK: [110.462, 19.939], ZYHB: [126.252, 45.626],
}

// 模拟航线（主要枢纽之间的航线）
interface FlightRoute { from: string; to: string; fromCoord: [number, number]; toCoord: [number, number]; count: number }
const FLIGHT_ROUTES: FlightRoute[] = [
  { from: 'ZBAA', to: 'ZSSS', fromCoord: AIRPORT.ZBAA, toCoord: AIRPORT.ZSSS, count: 28 },
  { from: 'ZBAA', to: 'ZGGG', fromCoord: AIRPORT.ZBAA, toCoord: AIRPORT.ZGGG, count: 22 },
  { from: 'ZBAA', to: 'ZUUU', fromCoord: AIRPORT.ZBAA, toCoord: AIRPORT.ZUUU, count: 18 },
  { from: 'ZBAA', to: 'ZLXY', fromCoord: AIRPORT.ZBAA, toCoord: AIRPORT.ZLXY, count: 12 },
  { from: 'ZSSS', to: 'ZGGG', fromCoord: AIRPORT.ZSSS, toCoord: AIRPORT.ZGGG, count: 24 },
  { from: 'ZSSS', to: 'ZUUU', fromCoord: AIRPORT.ZSSS, toCoord: AIRPORT.ZUUU, count: 16 },
  { from: 'ZGGG', to: 'ZUUU', fromCoord: AIRPORT.ZGGG, toCoord: AIRPORT.ZUUU, count: 14 },
  { from: 'ZGGG', to: 'ZJHK', fromCoord: AIRPORT.ZGGG, toCoord: AIRPORT.ZJHK, count: 10 },
  { from: 'ZUUU', to: 'ZUCK', fromCoord: AIRPORT.ZUUU, toCoord: AIRPORT.ZUCK, count: 8 },
  { from: 'ZBAA', to: 'ZBTJ', fromCoord: AIRPORT.ZBAA, toCoord: AIRPORT.ZBTJ, count: 6 },
  { from: 'ZSSS', to: 'ZSNJ', fromCoord: AIRPORT.ZSSS, toCoord: AIRPORT.ZSNJ, count: 8 },
  { from: 'ZSSS', to: 'ZSHC', fromCoord: AIRPORT.ZSSS, toCoord: AIRPORT.ZSHC, count: 10 },
  { from: 'ZBAA', to: 'ZYTX', fromCoord: AIRPORT.ZBAA, toCoord: AIRPORT.ZYTX, count: 7 },
  { from: 'ZGGG', to: 'ZGSZ', fromCoord: AIRPORT.ZGGG, toCoord: AIRPORT.ZGSZ, count: 6 },
  { from: 'ZUUU', to: 'ZPPP', fromCoord: AIRPORT.ZUUU, toCoord: AIRPORT.ZPPP, count: 7 },
  { from: 'ZBAA', to: 'ZHHH', fromCoord: AIRPORT.ZBAA, toCoord: AIRPORT.ZHHH, count: 9 },
  { from: 'ZSSS', to: 'ZSAM', fromCoord: AIRPORT.ZSSS, toCoord: AIRPORT.ZSAM, count: 7 },
  { from: 'ZLXY', to: 'ZUCK', fromCoord: AIRPORT.ZLXY, toCoord: AIRPORT.ZUCK, count: 5 },
  { from: 'ZBAA', to: 'ZSPD', fromCoord: AIRPORT.ZBAA, toCoord: AIRPORT.ZSPD, count: 14 },
  { from: 'ZHCC', to: 'ZSSS', fromCoord: AIRPORT.ZHCC, toCoord: AIRPORT.ZSSS, count: 6 },
]

function bezierCoords(from: [number, number], to: [number, number]): [number, number][] {
  const dx = to[0] - from[0], dy = to[1] - from[1]
  const dist = Math.sqrt(dx * dx + dy * dy)
  const midX = (from[0] + to[0]) / 2, midY = (from[1] + to[1]) / 2
  const offset = Math.min(dist * 0.35, 4)
  const perpX = -dy / dist * offset, perpY = dx / dist * offset
  const cx = midX + perpX, cy = midY + perpY
  const steps = 30
  const pts: [number, number][] = []
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    pts.push([
      (1 - t) * (1 - t) * from[0] + 2 * (1 - t) * t * cx + t * t * to[0],
      (1 - t) * (1 - t) * from[1] + 2 * (1 - t) * t * cy + t * t * to[1],
    ])
  }
  return pts
}

function buildOptions(): echarts.EChartsOption {
  const routeSeries = FLIGHT_ROUTES.map((route, idx) => ({
    type: 'lines' as const,
    coordinateSystem: 'amap' as const,
    polyline: true,
    data: [{ coords: bezierCoords(route.fromCoord, route.toCoord) }],
    lineStyle: { color: 'rgba(0, 212, 255, 0.08)', width: Math.max(0.5, route.count / 16), type: 'solid' as const },
    effect: {
      show: true, period: 6 + idx * 0.5, trailLength: 0.12,
      symbol: 'circle', symbolSize: 2.5, color: 'rgba(0, 212, 255, 0.35)',
    },
    zlevel: 0,
  }))

  const airportSet = new Set<string>()
  FLIGHT_ROUTES.forEach(r => { airportSet.add(r.from); airportSet.add(r.to) })

  const airportSeries = {
    name: '机场', type: 'scatter' as const, coordinateSystem: 'amap' as const,
    data: Array.from(airportSet).map(code => ({
      name: code, value: [...AIRPORT[code], 1] as [number, number, number],
    })),
    symbolSize: 8,
    itemStyle: {
      color: '#00d4ff', borderColor: 'rgba(10, 18, 40, 0.9)',
      borderWidth: 2, shadowBlur: 8, shadowColor: 'rgba(0, 212, 255, 0.5)',
    },
    label: { show: true, position: 'right', color: '#94a3b8', fontSize: 10, fontFamily: 'monospace', distance: 8 },
    zlevel: 2,
  }

  const criticalPts: Array<{ name: string; value: [number, number, number] }> = []
  const warningPts: Array<{ name: string; value: [number, number, number] }> = []
  const infoPts: Array<{ name: string; value: [number, number, number] }> = []

  for (const a of props.alerts) {
    const coord = AIRPORT[a.airportIcao] || a.coordinates
    const pt = { name: `${a.airportIcao}`, value: [...coord, 1] as [number, number, number] }
    if (a.severity === 'critical') criticalPts.push(pt)
    else if (a.severity === 'warning') warningPts.push(pt)
    else infoPts.push(pt)
  }

  return {
    backgroundColor: 'transparent',
    // 使用高德地图作为底图
    amap: {
      apiKey: AMAP_KEY,
      center: [104.5, 36],
      zoom: 5,
      roam: true,
      mapStyle: AMAP_STYLE,
      viewMode: '2D',
      renderOnMoving: true,
    },
    series: [
      ...routeSeries,
      airportSeries,
      {
        name: '紧急', type: 'effectScatter', coordinateSystem: 'amap', data: criticalPts,
        symbolSize: 14, showEffectOn: 'render',
        rippleEffect: { brushType: 'stroke', scale: 4, period: 3 },
        itemStyle: { color: '#ef4444', shadowBlur: 16, shadowColor: '#ef4444' },
        label: { show: true, formatter: '{b}', position: 'right', color: '#ef4444', fontSize: 10, distance: 16 },
        zlevel: 4,
      },
      {
        name: '预警', type: 'effectScatter', coordinateSystem: 'amap', data: warningPts,
        symbolSize: 11, showEffectOn: 'render',
        rippleEffect: { brushType: 'stroke', scale: 3, period: 4 },
        itemStyle: { color: '#f59e0b', shadowBlur: 10, shadowColor: '#f59e0b' },
        label: { show: true, formatter: '{b}', position: 'right', color: '#fbbf24', fontSize: 9, distance: 13 },
        zlevel: 3,
      },
      {
        name: '信息', type: 'effectScatter', coordinateSystem: 'amap', data: infoPts,
        symbolSize: 8, showEffectOn: 'render',
        rippleEffect: { brushType: 'stroke', scale: 2.5, period: 5 },
        itemStyle: { color: '#3b82f6', shadowBlur: 6, shadowColor: '#3b82f6' },
        label: { show: false },
        zlevel: 2,
      },
    ],
  } as echarts.EChartsOption
}

function render() {
  if (!chartRef.value) return
  if (!instance) instance = echarts.init(chartRef.value)
  instance.setOption(buildOptions(), true)
}

onMounted(async () => {
  // 使用官方加载器加载高德地图API
  try {
    await AMapLoader.load({
      key: AMAP_KEY,
      version: '2.0',
      plugins: ['AMap.Scale', 'AMap.ToolBar'],
    })
    console.log('[AlertMapView] 高德地图API加载成功')
  } catch (err) {
    console.error('[AlertMapView] 高德地图API加载失败:', err)
    return
  }
  
  // API加载完成后渲染地图
  render()
})

watch(() => props.alerts, () => render(), { deep: true })
onUnmounted(() => { instance?.dispose(); instance = null })

// ---- Panda CSS styles (computed once, reused) ----
const wrapperCls = css({
  borderRadius: 'xl', bg: 'rgba(10,18,40,0.75)', overflow: 'hidden',
  border: '1px solid rgba(0,212,255,0.08)', backdropFilter: 'blur(12px)',
  display: 'flex', flexDirection: 'column',
})
const headerCls = css({ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: '5', py: '3.5', borderBottom: '1px solid rgba(0,212,255,0.06)', flexShrink: '0' })
const headerLeftCls = css({ display: 'flex', alignItems: 'center', gap: '3' })
const dotCls = css({ w: '8px', h: '8px', borderRadius: 'full', bg: 'cyan.400', boxShadow: '0 0 8px token(colors.cyan.400)' })
const titleCls = css({ fontSize: 'sm', fontWeight: '600', letterSpacing: '0.02em' })
const badgeCls = css({ fontSize: 'xs', color: 'slate.500', bg: 'rgba(0,212,255,0.06)', px: '2', py: '0.5', borderRadius: 'md' })
const legendCls = css({ display: 'flex', gap: '4' })
const legendItemCls = css({ display: 'inline-flex', alignItems: 'center', gap: '1.5', fontSize: 'xs', color: 'slate.400' })
const legendDotCritical = css({ w: '8px', h: '8px', borderRadius: 'full', bg: 'red.500', boxShadow: '0 0 6px token(colors.red.500)' })
const legendDotWarning = css({ w: '8px', h: '8px', borderRadius: 'full', bg: 'amber.500', boxShadow: '0 0 6px token(colors.amber.500)' })
const legendDotInfo = css({ w: '8px', h: '8px', borderRadius: 'full', bg: 'blue.500', boxShadow: '0 0 6px token(colors.blue.500)' })
const legendDotRoute = css({ w: '12px', h: '2px', borderRadius: 'full', bg: 'rgba(0,212,255,0.3)' })
const chartCls = css({ flex: '1', minH: '360px', w: '100%' })
</script>
