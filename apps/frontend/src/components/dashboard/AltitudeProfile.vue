<template>
  <div class="section">
    <p class="sec-title">高度剖面图 · 垂直态势显示</p>

    <div v-if="!hasProfile" class="no-data">暂无飞行剖面数据</div>

    <div v-else class="chart-area">
      <!-- SVG 图表 -->
      <svg :viewBox="`0 0 ${W} ${H}`" class="chart-svg">
        <!-- 网格线 -->
        <line v-for="gy in gridY" :key="'gy-'+gy" :x1="PAD_L" :y1="gy" :x2="W-PAD_R" :y2="gy" stroke="rgba(255,255,255,0.04)" stroke-dasharray="3,5" />
        <line v-for="gx in gridX" :key="'gx-'+gx" :x1="gx" :y1="PAD_T" :x2="gx" :y2="H-PAD_B" stroke="rgba(255,255,255,0.03)" stroke-dasharray="2,4" />

        <!-- 禁航区（红色半透明矩形） -->
        <rect v-for="(z, i) in zoneRects" :key="'z-'+i"
          :x="z.x" :y="z.y" :width="z.w" :height="z.h"
          fill="rgba(239,68,68,0.18)" stroke="rgba(239,68,68,0.4)" stroke-width="1" stroke-dasharray="4,3" rx="2" />
        <!-- 禁航区 NOTAM 标签 -->
        <text v-for="(z, i) in zoneLabels" :key="'zl-'+i"
          :x="z.x" :y="z.y" fill="#fca5a5" font-size="9" font-family="IBM Plex Mono" font-weight="600">{{ z.text }}</text>

        <!-- 飞行曲线（折线） -->
        <polyline :points="curvePoints" fill="none" stroke="#38bdf8" stroke-width="2.5"
          stroke-linejoin="round" stroke-linecap="round"
          style="filter: drop-shadow(0 0 6px rgba(56,189,248,0.28))" />

        <!-- 曲线下方面积 -->
        <polygon :points="areaPoints" fill="url(#areaGrad)" />

        <!-- 渐变定义 -->
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="rgba(56,189,248,0.11)" />
            <stop offset="100%" stop-color="rgba(56,189,248,0)" />
          </linearGradient>
        </defs>

        <!-- 数据点圆点 -->
        <circle v-for="(dp, i) in dataDots" :key="'dp-'+i"
          :cx="dp.x" :cy="dp.y" r="3"
          fill="#0b1221" stroke="#38bdf8" stroke-width="1.5" />

        <!-- X 轴标签 -->
        <text v-for="(xl, i) in xLabels" :key="'xl-'+i"
          :x="xl.x" :y="H-6" fill="#475569" font-size="8.5" font-family="IBM Plex Mono" text-anchor="middle">{{ xl.text }}</text>

        <!-- Y 轴标签 -->
        <text v-for="(yl, i) in yLabels" :key="'yl-'+i"
          :x="PAD_L-8" :y="yl.y+3" fill="#475569" font-size="8.5" font-family="IBM Plex Mono" text-anchor="end">{{ yl.text }}</text>
      </svg>

      <!-- 图例 -->
      <div class="legend-row">
        <span class="legend"><span class="ld flight" />计划航迹</span>
        <span class="legend" v-if="hasZones"><span class="ld danger" />禁航区</span>
        <span class="legend" v-if="hasZones"><span class="ld notam" />NOTAM</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { AltitudePoint, RestrictionZone } from '@/views/dashboard/mock/flightAnalysis'

const props = defineProps<{
  altitudeProfile: AltitudePoint[]
  restrictionZones: RestrictionZone[]
  flightNo: string
}>()

const hasProfile = computed(() => props.altitudeProfile.length > 0)
const hasZones = computed(() => props.restrictionZones.length > 0)

// SVG 布局常量
const W = 700; const H = 260
const PAD_L = 48; const PAD_R = 24; const PAD_T = 20; const PAD_B = 30
const chartW = W - PAD_L - PAD_R; const chartH = H - PAD_T - PAD_B

/** "HH:MM" → 分钟数 */
const toMin = (t: string) => { const [h, m] = t.split(':').map(Number); return h * 60 + m }

// ---- 数据范围 ----
const ranges = computed(() => {
  const pts = props.altitudeProfile
  if (!pts.length) return { xMin: 0, xMax: 100, yMin: 0, yMax: 40000 }
  const xs = pts.map(p => toMin(p.time))
  const ys = pts.map(p => p.altitude * 100) // FL → feet
  const xMin = Math.min(...xs) - 8
  const xMax = Math.max(...xs) + 8
  const yMax = Math.max(...ys) * 1.15
  return { xMin, xMax, yMin: 0, yMax: Math.max(yMax, 10000) }
})

/** 数据点 → SVG 坐标 */
const toX = (time: string) => PAD_L + ((toMin(time) - ranges.value.xMin) / (ranges.value.xMax - ranges.value.xMin)) * chartW
const toY = (alt: number) => PAD_T + chartH - ((alt * 100 - ranges.value.yMin) / (ranges.value.yMax - ranges.value.yMin)) * chartH

// ---- 飞行曲线 ----
const curvePoints = computed(() =>
  props.altitudeProfile.map(p => `${toX(p.time).toFixed(1)},${toY(p.altitude).toFixed(1)}`).join(' ')
)
const areaPoints = computed(() => {
  const first = props.altitudeProfile[0]; const last = props.altitudeProfile[props.altitudeProfile.length - 1]
  const bottom = PAD_T + chartH
  return `${toX(first.time).toFixed(1)},${bottom} ` + curvePoints.value + ` ${toX(last.time).toFixed(1)},${bottom}`
})
const dataDots = computed(() =>
  props.altitudeProfile.map(p => ({ x: toX(p.time), y: toY(p.altitude) }))
)

// ---- 禁航区 ----
const zoneRects = computed(() =>
  props.restrictionZones.map(z => {
    const x1 = toX(z.startTime); const x2 = toX(z.endTime)
    const y1 = toY(z.maxAlt); const y2 = toY(z.minAlt)
    return { x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.abs(x2 - x1), h: Math.abs(y2 - y1) }
  })
)
const zoneLabels = computed(() =>
  props.restrictionZones.map(z => {
    const x1 = toX(z.startTime); const x2 = toX(z.endTime)
    const y1 = toY(z.maxAlt)
    return { x: (x1 + x2) / 2, y: y1 + 14, text: z.notamRef }
  })
)

// ---- 坐标标签 ----
const gridY = computed(() => {
  const lines: number[] = []
  for (let i = 1; i <= 4; i++) lines.push(PAD_T + (chartH * i) / 5)
  return lines
})
const gridX = computed(() => {
  const lines: number[] = []
  for (let i = 1; i <= 3; i++) lines.push(PAD_L + (chartW * i) / 4)
  return lines
})

const xLabels = computed(() => {
  const r = ranges.value; const labels: { x: number; text: string }[] = []
  for (let i = 0; i <= 4; i++) {
    const min = r.xMin + (r.xMax - r.xMin) * i / 4
    const hh = String(Math.floor(min / 60) % 24).padStart(2, '0')
    const mm = String(Math.round(min % 60)).padStart(2, '0')
    labels.push({ x: toX(`${hh}:${mm}`), text: `${hh}:${mm}` })
  }
  return labels
})

const yLabels = computed(() => {
  const r = ranges.value; const labels: { y: number; text: string }[] = []
  for (let i = 0; i <= 4; i++) {
    const alt = r.yMin + (r.yMax - r.yMin) * i / 4
    labels.push({ y: toY(alt / 100), text: `FL${Math.round(alt / 100)}` })
  }
  return labels
})
</script>

<style scoped>
.section { padding: 17px 20px; border-bottom: 1px solid rgba(0,212,255,0.05); }
.sec-title { font-size: 11px; font-weight: 600; color: #64748b; margin: 0 0 14px; letter-spacing: 0.06em; text-transform: uppercase; }
.no-data { display: flex; align-items: center; justify-content: center; height: 100px; font-size: 11px; color: #334155; }
.chart-area { width: 100%; }
.chart-svg { width: 100%; height: auto; display: block; background: rgba(0,0,0,0.15); border-radius: 6px; border: 1px solid rgba(255,255,255,0.03); }
.legend-row { display: flex; gap: 16px; padding: 6px 0 0; }
.legend { display: flex; align-items: center; gap: 5px; font-size: 9px; color: #475569; }
.ld { display: inline-block; width: 12px; height: 3px; border-radius: 2px; flex-shrink: 0; }
.ld.flight { background: #38bdf8; }
.ld.danger { background: rgba(239,68,68,0.4); border: 1px dashed rgba(239,68,68,0.5); height: 7px; }
.ld.notam { width: 7px; height: 7px; border-radius: 50%; background: #fca5a5; }
</style>
