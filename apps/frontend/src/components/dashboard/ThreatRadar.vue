<template>
  <div :class="wrapperCls">
    <div :class="headerCls">
      <div :class="headerLeftCls">
        <span :class="dotCls" />
        <span :class="titleCls">威胁态势雷达</span>
      </div>
      <span :class="liveTagCls">LIVE</span>
    </div>

    <div :class="stageCls">
      <!-- 雷达 SVG -->
      <div :class="radarContainerCls">
        <svg viewBox="0 0 300 300" :class="svgCls">
          <defs>
            <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="rgba(0,212,255,0.08)" />
              <stop offset="100%" stop-color="transparent" />
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <!-- 背景圆 -->
          <circle cx="150" cy="150" r="140" fill="none" stroke="rgba(0,212,255,0.04)" stroke-width="1" />
          <circle cx="150" cy="150" r="105" fill="none" stroke="rgba(0,212,255,0.06)" stroke-width="1" />
          <circle cx="150" cy="150" r="70" fill="none" stroke="rgba(0,212,255,0.08)" stroke-width="1" />
          <circle cx="150" cy="150" r="35" fill="none" stroke="rgba(0,212,255,0.1)" stroke-width="1" />
          <circle cx="150" cy="150" r="140" fill="url(#radarGlow)" />

          <!-- 十字线 -->
          <line x1="10" y1="150" x2="290" y2="150" stroke="rgba(0,212,255,0.05)" stroke-width="1" />
          <line x1="150" y1="10" x2="150" y2="290" stroke="rgba(0,212,255,0.05)" stroke-width="1" />
          <line x1="45" y1="45" x2="255" y2="255" stroke="rgba(0,212,255,0.03)" stroke-width="0.5" />
          <line x1="255" y1="45" x2="45" y2="255" stroke="rgba(0,212,255,0.03)" stroke-width="0.5" />

          <!-- 刻度 -->
          <circle cx="150" cy="150" r="140" fill="none" stroke="rgba(0,212,255,0.12)" stroke-width="1" stroke-dasharray="2 6" />

          <!-- 扫描扇形（包在 g 中旋转，用 scoped class 保证生效） -->
          <g class="scan-group">
            <path d="M150,150 L150,10 A140,140 0 0,1 290,150 Z" fill="url(#radarGlow)" />
            <line x1="150" y1="150" x2="150" y2="10" stroke="#00d4ff" stroke-width="2" opacity="0.8" />
          </g>

          <!-- 目标点 -->
          <circle
            v-for="(b, i) in blips"
            :key="`blip-${i}`"
            :cx="b.x" :cy="b.y" :r="b.r"
            :fill="b.fill"
            :opacity="b.opacity"
            :class="blipCls"
            :style="{ animationDelay: `${i * 0.25}s` }"
            filter="url(#glow)"
          />

          <!-- 目标外环 -->
          <circle
            v-for="(b, i) in blips"
            :key="`ring-${i}`"
            :cx="b.x" :cy="b.y" :r="b.r + 4"
            fill="none"
            :stroke="b.fill"
            stroke-width="0.5"
            :opacity="0.3"
            :class="blipRingCls"
            :style="{ animationDelay: `${i * 0.25}s` }"
          />

          <!-- 中心点 -->
          <circle cx="150" cy="150" r="3" fill="#00d4ff" opacity="0.8">
            <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.8;0.4;0.8" dur="2s" repeatCount="indefinite" />
          </circle>
        </svg>

        <!-- 旋转外环装饰 -->
        <div :class="outerRingCls" />
        <div :class="outerRingReverseCls" />
      </div>

      <!-- 指标面板 -->
      <div :class="metricsCls">
        <div
          v-for="(m, i) in metrics"
          :key="m.label"
          :class="metricItemCls"
          :style="metricItemStyle(i)"
        >
          <div :class="metricIconCls">
            <div :class="metricDotCls" :style="{ background: m.dotColor, boxShadow: `0 0 10px ${m.dotColor}` }" />
            <div :class="metricWaveCls" :style="{ borderColor: m.dotColor }" />
          </div>
          <div :class="metricTextCls">
            <p :class="metricLabelCls">{{ m.label }}</p>
            <p :class="metricValueCls" :style="{ color: m.dotColor, textShadow: `0 0 16px ${m.dotColor}40` }">{{ m.value }}</p>
          </div>
          <div :class="metricBarCls">
            <div :class="metricBarFillCls" :style="{ width: `${m.percent}%`, background: `linear-gradient(90deg, ${m.dotColor}60, ${m.dotColor})` }" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { css } from '@/styled-system/css'

const props = defineProps<{ criticalCount: number; warningCount: number; infoCount: number }>()

interface Blip { x: number; y: number; r: number; fill: string; opacity: number }
const blips = computed<Blip[]>(() => {
  const result: Blip[] = []
  const cx = 150, cy = 150
  const add = (count: number, fill: string, r: number, range: [number, number]) => {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / Math.max(count, 1) + (Math.random() - 0.5) * 0.5
      const radius = range[0] + Math.random() * (range[1] - range[0])
      result.push({ x: cx + Math.cos(angle) * radius, y: cy + Math.sin(angle) * radius, r, fill, opacity: 0.7 + Math.random() * 0.3 })
    }
  }
  add(props.criticalCount, '#ef4444', 5, [25, 90])
  add(props.warningCount, '#f59e0b', 3.5, [55, 120])
  add(props.infoCount, '#3b82f6', 2.5, [80, 135])
  return result
})

const threatIndex = computed(() => Math.min(99, props.criticalCount * 15 + props.warningCount * 5 + props.infoCount))

const metrics = computed(() => [
  { label: '紧急威胁', value: props.criticalCount, dotColor: '#ef4444', percent: Math.min(100, props.criticalCount * 20) },
  { label: '预警威胁', value: props.warningCount, dotColor: '#f59e0b', percent: Math.min(100, props.warningCount * 12) },
  { label: '情报信息', value: props.infoCount, dotColor: '#3b82f6', percent: Math.min(100, props.infoCount * 12) },
  { label: '威胁指数', value: `${threatIndex.value}%`, dotColor: threatIndex.value > 60 ? '#ef4444' : threatIndex.value > 30 ? '#f59e0b' : '#10b981', percent: threatIndex.value },
])

const metricItemStyle = (i: number) => ({
  animationDelay: `${i * 0.15}s`,
})

// ---- Panda CSS ----
const wrapperCls = css({
  borderRadius: 'xl',
  bg: 'rgba(10,18,40,0.75)',
  border: '1px solid rgba(0,212,255,0.08)',
  backdropFilter: 'blur(12px)',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
})

const headerCls = css({
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  px: '5', py: '3.5', borderBottom: '1px solid rgba(0,212,255,0.06)',
})
const headerLeftCls = css({ display: 'flex', alignItems: 'center', gap: '3' })
const dotCls = css({
  w: '8px', h: '8px', borderRadius: 'full', bg: 'cyan.400',
  boxShadow: '0 0 8px token(colors.cyan.400)',
  animation: 'dot-pulse 2s ease-in-out infinite',
})
const titleCls = css({ fontSize: 'sm', fontWeight: '600', letterSpacing: '0.02em' })
const liveTagCls = css({
  fontSize: '9px', fontWeight: '800', letterSpacing: '0.15em',
  color: '#ef4444', px: '2', py: '0.5', borderRadius: 'sm',
  border: '1px solid rgba(239,68,68,0.3)',
  background: 'rgba(239,68,68,0.08)',
  animation: 'live-blink 1.5s ease-in-out infinite',
})

const stageCls = css({
  display: 'flex', flexDirection: 'column', flex: '1', p: '4', gap: '4',
})

const radarContainerCls = css({
  position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
  width: '100%', aspectRatio: '1',
})

const svgCls = css({
  w: '100%', h: '100%', maxW: '240px', maxH: '240px',
  position: 'relative', zIndex: '2',
})

const scanCls = css({
  animation: 'radar-spin 3s linear infinite',
  transformOrigin: '150px 150px',
  transformBox: 'view-box',
})

const blipCls = css({ animation: 'blip-glow 2s ease-in-out infinite' })
const blipRingCls = css({ animation: 'blip-ring 2s ease-in-out infinite' })

const outerRingCls = css({
  position: 'absolute', inset: '8%', borderRadius: 'full',
  border: '1px dashed rgba(0,212,255,0.1)',
  animation: 'ring-rotate 20s linear infinite',
  pointerEvents: 'none',
})

const outerRingReverseCls = css({
  position: 'absolute', inset: '4%', borderRadius: 'full',
  border: '1px dashed rgba(0,212,255,0.06)',
  animation: 'ring-rotate 30s linear infinite reverse',
  pointerEvents: 'none',
})

const metricsCls = css({
  display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2', px: '1',
})

const metricItemCls = css({
  display: 'flex', alignItems: 'center', gap: '2.5',
  px: '3', py: '2.5', borderRadius: 'lg',
  bg: 'rgba(0,0,0,0.2)',
  border: '1px solid rgba(255,255,255,0.03)',
  position: 'relative', overflow: 'hidden',
  animation: 'metric-slide-in 0.5s ease-out both',
  transition: 'all 0.3s',
  _hover: {
    bg: 'rgba(255,255,255,0.03)',
    borderColor: 'rgba(255,255,255,0.06)',
  },
})

const metricIconCls = css({
  position: 'relative', w: '10px', h: '10px', flexShrink: '0',
})

const metricDotCls = css({
  position: 'absolute', inset: '0', borderRadius: 'full', zIndex: '2',
})

const metricWaveCls = css({
  position: 'absolute', inset: '-6px', borderRadius: 'full',
  border: '1px solid',
  animation: 'wave-expand 2s ease-out infinite',
})

const metricTextCls = css({ flex: '1', minW: '0' })
const metricLabelCls = css({ fontSize: '10px', color: 'slate.500', mb: '0.5', letterSpacing: '0.04em' })
const metricValueCls = css({ fontSize: 'md', fontWeight: '800', fontFamily: 'mono', lineHeight: '1.2' })

const metricBarCls = css({
  position: 'absolute', bottom: '0', left: '0', right: '0', h: '2px',
  bg: 'rgba(255,255,255,0.03)',
})

const metricBarFillCls = css({
  h: '100%', borderRadius: 'full', transition: 'width 1s ease-out',
})
</script>

<style scoped>
.scan-group {
  animation: radar-spin 3s linear infinite;
  transform-origin: 150px 150px;
  transform-box: view-box;
}
@keyframes radar-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
@keyframes blip-glow {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.8); }
}
@keyframes blip-ring {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.1; transform: scale(1.5); }
}
@keyframes ring-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
@keyframes dot-pulse {
  0%, 100% { opacity: 1; box-shadow: 0 0 8px rgba(0,212,255,0.6); }
  50% { opacity: 0.5; box-shadow: 0 0 16px rgba(0,212,255,0.3); }
}
@keyframes live-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
@keyframes wave-expand {
  0% { transform: scale(0.8); opacity: 0.6; }
  100% { transform: scale(2); opacity: 0; }
}
@keyframes metric-slide-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
