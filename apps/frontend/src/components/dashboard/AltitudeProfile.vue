<template>
  <div class="section">
    <div class="sec-header">
      <div class="sec-title-wrap">
        <div class="sec-icon">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 13L4 7 7 10 10 3 13 1" stroke="rgba(56,189,248,0.6)" stroke-width="1.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="13" cy="1" r="1.2" fill="rgba(56,189,248,0.6)"/>
          </svg>
        </div>
        <p class="sec-title">高度剖面图</p>
        <span class="sec-subtitle">垂直态势显示</span>
      </div>
      <div class="sec-badge">
        <span class="sec-badge-dot" />
        <span class="sec-badge-text">FL{{ maxFL }}</span>
      </div>
    </div>

    <div v-if="!hasProfile" class="no-data">
      <div class="no-icon-wrap">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M3 17h4l3-8 4 10 3-6h4" stroke="rgba(100,116,139,0.4)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <span class="no-text">暂无飞行剖面数据</span>
    </div>

    <div v-else class="chart-area">
      <!-- SVG 图表 -->
      <div class="chart-wrap">
        <svg :viewBox="`0 0 ${W} ${H}`" class="chart-svg">
          <!-- 背景网格 -->
          <line v-for="gy in gridY" :key="'gy-'+gy" :x1="PAD_L" :y1="gy" :x2="W-PAD_R" :y2="gy" stroke="rgba(255,255,255,0.025)" stroke-dasharray="4,6" />
          <line v-for="gx in gridX" :key="'gx-'+gx" :x1="gx" :y1="PAD_T" :x2="gx" :y2="H-PAD_B" stroke="rgba(255,255,255,0.02)" stroke-dasharray="3,5" />

          <!-- 禁航区（红色半透明矩形） -->
          <rect v-for="(z, i) in zoneRects" :key="'z-'+i"
            :x="z.x" :y="z.y" :width="z.w" :height="z.h"
            fill="rgba(239,68,68,0.12)" stroke="rgba(239,68,68,0.35)" stroke-width="1" stroke-dasharray="5,4" rx="3" />

          <!-- 禁航区 NOTAM 标签背景 -->
          <rect v-for="(z, i) in zoneLabels" :key="'zlb-'+i"
            :x="z.x - 22" :y="z.y - 12" width="44" height="16" rx="4"
            fill="rgba(239,68,68,0.15)" />

          <!-- 禁航区 NOTAM 标签 -->
          <text v-for="(z, i) in zoneLabels" :key="'zl-'+i"
            :x="z.x" :y="z.y" fill="#fca5a5" font-size="8.5" font-family="IBM Plex Mono" font-weight="700" text-anchor="middle">{{ z.text }}</text>

          <!-- 曲线下方面积 -->
          <polygon :points="areaPoints" fill="url(#areaGrad)" />

          <!-- 渐变定义 -->
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="rgba(56,189,248,0.14)" />
              <stop offset="60%" stop-color="rgba(56,189,248,0.04)" />
              <stop offset="100%" stop-color="rgba(56,189,248,0)" />
            </linearGradient>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#0ea5e9" />
              <stop offset="50%" stop-color="#38bdf8" />
              <stop offset="100%" stop-color="#7dd3fc" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur"/>
              <feComposite in="SourceGraphic" in2="blur" operator="over"/>
            </filter>
          </defs>

          <!-- 飞行曲线（折线） -->
          <polyline :points="curvePoints" fill="none" stroke="url(#lineGrad)" stroke-width="2.5"
            stroke-linejoin="round" stroke-linecap="round"
            style="filter: drop-shadow(0 0 8px rgba(56,189,248,0.35))" />

          <!-- 数据点圆点 -->
          <circle v-for="(dp, i) in dataDots" :key="'dp-'+i"
            :cx="dp.x" :cy="dp.y" r="3.5"
            fill="#0b1221" stroke="#38bdf8" stroke-width="1.8" />

          <!-- 数据点发光 -->
          <circle v-for="(dp, i) in dataDots" :key="'dpg-'+i"
            :cx="dp.x" :cy="dp.y" r="6"
            fill="none" stroke="rgba(56,189,248,0.15)" stroke-width="1" />

          <!-- X 轴标签 -->
          <text v-for="(xl, i) in xLabels" :key="'xl-'+i"
            :x="xl.x" :y="H-8" fill="#475569" font-size="8.5" font-family="IBM Plex Mono" text-anchor="middle">{{ xl.text }}</text>

          <!-- Y 轴标签 -->
          <text v-for="(yl, i) in yLabels" :key="'yl-'+i"
            :x="PAD_L-10" :y="yl.y+3" fill="#475569" font-size="8.5" font-family="IBM Plex Mono" text-anchor="end">{{ yl.text }}</text>

          <!-- 轴标题 -->
          <text :x="PAD_L-10" :y="PAD_T-6" fill="#475569" font-size="7" font-family="IBM Plex Mono" text-anchor="end">ALT</text>
          <text :x="W-PAD_R" :y="H-8" fill="#475569" font-size="7" font-family="IBM Plex Mono" text-anchor="end">TIME</text>
        </svg>
      </div>

      <!-- 图例 -->
      <div class="legend-row">
        <div class="legend-item">
          <div class="legend-line" />
          <span class="legend-text">计划航迹</span>
        </div>
        <div class="legend-item" v-if="hasZones">
          <div class="legend-zone" />
          <span class="legend-text">禁航区</span>
        </div>
        <div class="legend-item" v-if="hasZones">
          <div class="legend-notam" />
          <span class="legend-text">NOTAM</span>
        </div>
        <div class="legend-spacer" />
        <div class="legend-meta">
          <span class="meta-item">最大高度 <span class="mono" style="color:#38bdf8">FL{{ maxFL }}</span></span>
          <span class="meta-divider" />
          <span class="meta-item">航段 <span class="mono" style="color:#38bdf8">{{ altitudeProfile.length }}</span></span>
        </div>
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
const W = 700; const H = 280
const PAD_L = 52; const PAD_R = 28; const PAD_T = 24; const PAD_B = 34
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

const maxFL = computed(() => {
  if (!props.altitudeProfile.length) return 0
  return Math.max(...props.altitudeProfile.map(p => p.altitude))
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
    return { x: (x1 + x2) / 2, y: y1 + 16, text: z.notamRef }
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
.section {
  padding: 22px 24px;
  border-bottom: 1px solid rgba(0, 212, 255, 0.04);
}

/* ===== 区块头部 ===== */
.sec-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.sec-title-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sec-icon {
  width: 26px;
  height: 26px;
  border-radius: 6px;
  background: rgba(56, 189, 248, 0.08);
  border: 1px solid rgba(56, 189, 248, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
}

.sec-title {
  font-size: 11px;
  font-weight: 700;
  color: #94a3b8;
  margin: 0;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.sec-subtitle {
  font-size: 9px;
  color: #475569;
  font-family: 'IBM Plex Mono', monospace;
  letter-spacing: 0.04em;
}

.sec-badge {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 3px 10px;
  border-radius: 10px;
  background: rgba(56, 189, 248, 0.05);
  border: 1px solid rgba(56, 189, 248, 0.1);
}

.sec-badge-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #38bdf8;
  box-shadow: 0 0 6px rgba(56, 189, 248, 0.4);
}

.sec-badge-text {
  font-size: 9px;
  font-weight: 700;
  color: #38bdf8;
  font-family: 'IBM Plex Mono', monospace;
}

/* ===== 无数据 ===== */
.no-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 140px;
  gap: 10px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.005);
  border: 1px solid rgba(255, 255, 255, 0.02);
}

.no-icon-wrap {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(100, 116, 139, 0.04);
  border: 1px solid rgba(100, 116, 139, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
}

.no-text {
  font-size: 11px;
  color: #475569;
}

/* ===== 图表 ===== */
.chart-area {
  width: 100%;
}

.chart-wrap {
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.03);
  overflow: hidden;
  position: relative;
}

.chart-wrap::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.1), transparent);
  z-index: 2;
}

.chart-svg {
  width: 100%;
  height: auto;
  display: block;
}

/* ===== 图例 ===== */
.legend-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 10px 0 0;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.legend-line {
  width: 14px;
  height: 3px;
  border-radius: 2px;
  background: linear-gradient(90deg, #0ea5e9, #38bdf8);
}

.legend-zone {
  width: 12px;
  height: 8px;
  border-radius: 2px;
  background: rgba(239, 68, 68, 0.2);
  border: 1px dashed rgba(239, 68, 68, 0.4);
}

.legend-notam {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #fca5a5;
}

.legend-text {
  font-size: 9px;
  color: #475569;
  font-family: 'IBM Plex Mono', monospace;
}

.legend-spacer {
  flex: 1;
}

.legend-meta {
  display: flex;
  align-items: center;
  gap: 10px;
}

.meta-item {
  font-size: 9px;
  color: #475569;
}

.meta-divider {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: rgba(100, 116, 139, 0.3);
}

.mono {
  font-family: 'IBM Plex Mono', monospace;
}
</style>
