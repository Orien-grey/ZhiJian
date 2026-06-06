<template>
  <div class="section">
    <p class="sec-title">高度剖面图 · 垂直态势显示</p>
    <div class="chart-wrap">
      <div ref="chartRef" class="chart" />
      <div v-if="!hasProfile" class="no-data">暂无飞行剖面数据</div>
    </div>
    <div class="legend-row" v-if="hasProfile">
      <span class="legend"><span class="ld flight" />计划航迹</span>
      <span class="legend"><span class="ld danger" />禁航区</span>
      <span class="legend"><span class="ld notam" />NOTAM</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import * as echarts from 'echarts'
import type { AltitudePoint, RestrictionZone } from '@/views/dashboard/mock/flightAnalysis'

const props = defineProps<{
  altitudeProfile: AltitudePoint[]
  restrictionZones: RestrictionZone[]
  flightNo: string
}>()

const chartRef = ref<HTMLDivElement | null>(null)
let instance: echarts.ECharts | null = null
let resizeObserver: ResizeObserver | null = null

const hasProfile = computed(() => props.altitudeProfile.length > 0)
const hasZones = computed(() => props.restrictionZones.length > 0)

/** 时间 "HH:MM" → 分钟数 */
const toMin = (t: string) => { const [h, m] = t.split(':').map(Number); return h * 60 + m }
/** 分钟数 → "HH:MM" */
const toTime = (min: number) => `${String(Math.floor(min / 60) % 24).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`

const render = () => {
  if (!chartRef.value || !hasProfile.value) return
  if (!instance) instance = echarts.init(chartRef.value)

  // 用分钟数值作为 X 轴，确保 markArea 禁航区能精确渲染
  const profilePts = props.altitudeProfile.map(p => [toMin(p.time), p.altitude * 100] as [number, number])
  const allTimes = profilePts.map(p => p[0])
  const xMin = Math.min(...allTimes)
  const xMax = Math.max(...allTimes)

  // 禁航区 markAreas — coord 格式
  const markAreas: any[] = hasZones.value ? props.restrictionZones.map(z => ({
    name: z.label,
    itemStyle: {
      color: 'rgba(239,68,68,0.15)',
      borderColor: 'rgba(239,68,68,0.4)',
      borderWidth: 1,
      borderType: 'dashed' as const,
    },
    data: [[
      { coord: [toMin(z.startTime), z.minAlt * 100] },
      { coord: [toMin(z.endTime), z.maxAlt * 100] },
    ]],
    label: {
      show: true, position: 'insideTop', distance: 4,
      color: '#fca5a5', fontSize: 9, fontFamily: 'IBM Plex Mono',
      formatter: z.notamRef,
    },
  })) : []

  instance.setOption({
    grid: { left: 55, right: 30, top: 28, bottom: 36 },
    xAxis: {
      type: 'value',
      min: xMin, max: xMax,
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
      axisTick: { show: false },
      axisLabel: {
        color: '#475569', fontSize: 9, fontFamily: 'IBM Plex Mono',
        formatter: (v: number) => toTime(v),
        interval: Math.max(1, Math.floor(profilePts.length / 6)),
      },
      splitLine: { show: false },
    },
    yAxis: {
      type: 'value',
      name: 'FL (×100ft)', nameLocation: 'end',
      nameTextStyle: { color: '#475569', fontSize: 9, fontFamily: 'IBM Plex Mono' },
      axisLabel: { color: '#475569', fontSize: 9, fontFamily: 'IBM Plex Mono', formatter: (v: number) => `FL${v / 100}` },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.03)' } },
    },
    series: [{
      type: 'line',
      data: profilePts,
      smooth: 0.3,
      symbol: 'none',
      lineStyle: { color: '#38bdf8', width: 2.5, shadowBlur: 10, shadowColor: 'rgba(56,189,248,0.3)' },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(56,189,248,0.08)' },
          { offset: 1, color: 'rgba(56,189,248,0)' },
        ]),
      },
      markArea: { silent: true, data: markAreas },
    }],
  }, true)
}

onMounted(() => {
  if (hasProfile.value) nextTick(render)
  watch(() => props.restrictionZones, () => nextTick(render))
  if (chartRef.value) {
    resizeObserver = new ResizeObserver(() => instance?.resize())
    resizeObserver.observe(chartRef.value)
  }
})

onUnmounted(() => {
  resizeObserver?.disconnect()
  instance?.dispose(); instance = null
})
</script>

<style scoped>
.section { padding: 18px 20px; border-bottom: 1px solid rgba(0,212,255,0.05); }
.sec-title { font-size: 11px; font-weight: 600; color: #64748b; margin: 0 0 14px; letter-spacing: 0.06em; text-transform: uppercase; }
.chart-wrap { position: relative; }
.chart { width: 100%; height: 200px; }
.no-data {
  display: flex; align-items: center; justify-content: center; height: 120px;
  font-size: 11px; color: #334155; letter-spacing: 0.03em;
}
.legend-row { display: flex; gap: 16px; padding: 6px 0 0; }
.legend { display: flex; align-items: center; gap: 5px; font-size: 9px; color: #475569; }
.ld { display: inline-block; width: 12px; height: 3px; border-radius: 2px; flex-shrink: 0; }
.ld.flight { background: #38bdf8; }
.ld.danger { background: rgba(239,68,68,0.4); border: 1px dashed rgba(239,68,68,0.5); height: 6px; }
.ld.notam { width: 6px; height: 6px; border-radius: 50%; background: #fca5a5; }
</style>
