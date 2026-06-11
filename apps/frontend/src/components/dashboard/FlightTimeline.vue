<template>
  <div class="section">
    <div class="sec-header">
      <div class="sec-title-group">
        <div class="sec-icon">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
        </div>
        <p class="sec-title">航班时间轴</p>
      </div>
      <span v-if="delayMinutes > 0" class="delay-badge">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>
        </svg>
        延误 {{ delayMinutes }} 分钟
      </span>
    </div>

    <!-- 时间轨道 -->
    <div class="timeline-container">
      <div class="slider-track" ref="trackRef" @mousedown="onTrackClick">
        <!-- 轨道背景网格 -->
        <div class="track-grid">
          <div v-for="i in 6" :key="i" class="grid-line" :style="{ left: `${(i - 1) * 20}%` }" />
        </div>

        <!-- 计划飞行条 -->
        <div class="sched-bar" :style="schedBarStyle">
          <div class="bar-glow" />
        </div>

        <!-- 延误条 -->
        <div v-if="delayMinutes > 0" class="delay-bar" :style="delayBarStyle">
          <div class="bar-glow delay" />
        </div>

        <!-- 航路点标记 -->
        <div
          v-for="wp in waypoints"
          :key="wp.label"
          class="wp-dot"
          :class="{ affected: wp.isAffected }"
          :style="wpStyle(wp)"
          :title="`${wp.time} ${wp.label}${wp.isAffected ? ' ⚠受影响' : ''}`"
          @click.stop="$emit('waypoint-click', wp)"
        >
          <div class="wp-ring" />
          <span class="wp-tooltip">
            <span class="tooltip-time">{{ wp.time }}</span>
            <span class="tooltip-label">{{ wp.label }}</span>
            <span v-if="wp.isAffected" class="tooltip-warn">受影响</span>
          </span>
        </div>

        <!-- 可拖拽滑块 -->
        <div
          class="slider-thumb"
          :style="thumbStyle"
          @mousedown.stop="onThumbDown"
        >
          <div class="thumb-body">
            <div class="thumb-indicator" />
          </div>
          <span class="thumb-time">{{ sliderTime }}</span>
        </div>
      </div>

      <!-- 时间标签 -->
      <div class="time-labels">
        <div class="time-group">
          <span class="time-label">{{ scheduledDeparture }}</span>
          <span class="time-sublabel">计划起飞</span>
        </div>
        <div v-if="delayMinutes > 0" class="time-group center">
          <span class="time-label sched-arr">{{ scheduledArrival }}</span>
          <span class="time-sublabel">计划到达</span>
        </div>
        <div class="time-group" :class="{ 'delay-end': delayMinutes > 0 }">
          <span class="time-label" :class="{ 'delay-label': delayMinutes > 0 }">{{ estimatedArrival }}</span>
          <span class="time-sublabel">{{ delayMinutes > 0 ? '预计到达' : '计划到达' }}</span>
        </div>
      </div>
    </div>

    <!-- 图例 -->
    <div class="legend-row">
      <span class="legend"><span class="ld sched" />计划</span>
      <span v-if="delayMinutes > 0" class="legend"><span class="ld delay" />延误</span>
      <span class="legend"><span class="ld wp-dot-legend" />航路点</span>
      <span class="legend"><span class="ld wp-affected" />受影响</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { TimelinePoint } from '@/views/dashboard/mock/flightAnalysis'

const props = defineProps<{
  timeline: TimelinePoint[]
  scheduledDeparture: string
  estimatedDeparture: string
  delayMinutes: number
}>()

defineEmits<{ (e: 'waypoint-click', wp: TimelinePoint): void }>()

const sliderPercent = ref(0)
const trackRef = ref<HTMLElement | null>(null)

const waypoints = computed(() => props.timeline.filter(p => p.isWaypoint))

/** 时刻字符串 → 分钟数（从 00:00 起算） */
const toMinutes = (t: string) => { const [h, m] = t.split(':').map(Number); return h * 60 + m }

/** 总时间跨度：从计划出发到预计到达（含延误） */
const totalMin = computed(() => {
  if (props.timeline.length < 2) return 120
  const dep = toMinutes(props.timeline[0].time)
  const arr = toMinutes(props.timeline[props.timeline.length - 1].time)
  return arr - dep + props.delayMinutes
})

/** 计划到达时间 */
const scheduledArrival = computed(() => {
  if (props.timeline.length < 2) return '--:--'
  return props.timeline[props.timeline.length - 1].time
})

/** 预计到达时间 */
const estimatedArrival = computed(() => {
  if (props.timeline.length < 2) return '--:--'
  const [h, m] = props.timeline[props.timeline.length - 1].time.split(':').map(Number)
  const totalMins = h * 60 + m + props.delayMinutes
  const nh = Math.floor(totalMins / 60) % 24
  const nm = totalMins % 60
  return `${String(nh).padStart(2, '0')}:${String(nm).padStart(2, '0')}`
})

/** 计划条位置：从 0% 到 (飞行时长/总时长)% */
const schedBarStyle = computed(() => {
  const t = totalMin.value
  const sched = t - props.delayMinutes
  return { left: '0%', width: `${(sched / t) * 100}%` }
})

/** 延误条位置：从计划条末尾到 100% */
const delayBarStyle = computed(() => {
  const t = totalMin.value
  const sched = t - props.delayMinutes
  return { left: `${(sched / t) * 100}%`, width: `${(props.delayMinutes / t) * 100}%` }
})

/** 航路点位置 */
const wpStyle = (wp: TimelinePoint) => {
  if (props.timeline.length < 2) return { left: '50%' }
  const dep = toMinutes(props.timeline[0].time)
  const wpMin = toMinutes(wp.time) - dep
  const pct = (wpMin / totalMin.value) * 100
  return { left: `${Math.min(98, Math.max(2, pct))}%` }
}

/** 滑块时间 */
const sliderTime = computed(() => {
  if (props.timeline.length < 2) return '--:--'
  const dep = toMinutes(props.timeline[0].time)
  const offsetMin = Math.round((sliderPercent.value / 100) * totalMin.value)
  const totalMins = dep + offsetMin
  const hh = String(Math.floor(totalMins / 60) % 24).padStart(2, '0')
  const mm = String(totalMins % 60).padStart(2, '0')
  return `${hh}:${mm}`
})

const thumbStyle = computed(() => ({
  left: `${Math.min(100, Math.max(0, sliderPercent.value))}%`,
}))

// ---- 拖拽 & 点击 ----
const onTrackClick = (e: MouseEvent) => {
  if (!trackRef.value) return
  const rect = trackRef.value.getBoundingClientRect()
  sliderPercent.value = ((e.clientX - rect.left) / rect.width) * 100
}

let dragging = false
const onThumbDown = (e: MouseEvent) => {
  e.preventDefault()
  dragging = true
  const onMove = (ev: MouseEvent) => {
    if (!dragging || !trackRef.value) return
    const rect = trackRef.value.getBoundingClientRect()
    sliderPercent.value = Math.min(100, Math.max(0, ((ev.clientX - rect.left) / rect.width) * 100))
  }
  const onUp = () => {
    dragging = false
    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('mouseup', onUp)
  }
  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onUp)
}
</script>

<style scoped>
.section { padding: 18px 19px; border-bottom: 1px solid rgba(0, 212, 255, 0.05); }

/* 头部 */
.sec-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.sec-title-group {
  display: flex;
  align-items: center;
  gap: 8px;
}
.sec-icon {
  width: 26px;
  height: 26px;
  border-radius: 8px;
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(0, 212, 255, 0.03) 100%);
  border: 1px solid rgba(0, 212, 255, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #00d4ff;
}
.sec-title {
  font-size: 12px;
  font-weight: 600;
  color: #94a3b8;
  margin: 0;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  font-family: 'Noto Sans SC', 'PingFang SC', sans-serif;
}
.delay-badge {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 10px;
  font-weight: 600;
  color: #f59e0b;
  padding: 3px 10px;
  border-radius: 8px;
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.03) 100%);
  border: 1px solid rgba(245, 158, 11, 0.15);
  font-family: 'IBM Plex Mono', monospace;
}

/* 时间轨道容器 */
.timeline-container {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%);
  border-radius: 12px;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.04);
  margin-bottom: 12px;
}

/* 轨道 */
.slider-track {
  position: relative;
  height: 44px;
  background: rgba(0, 0, 0, 0.15);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.04);
  cursor: pointer;
  overflow: hidden;
}

/* 网格线 */
.track-grid {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.grid-line {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1px;
  background: linear-gradient(180deg,
    transparent 0%,
    rgba(255, 255, 255, 0.03) 30%,
    rgba(255, 255, 255, 0.03) 70%,
    transparent 100%
  );
}

/* 计划条 */
.sched-bar {
  position: absolute;
  top: 12px;
  height: 20px;
  border-radius: 6px 0 0 6px;
  background: linear-gradient(90deg, #1e40af, #3b82f6, #60a5fa);
  min-width: 4px;
  overflow: hidden;
}
.bar-glow {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.15) 50%,
    transparent 100%
  );
  animation: bar-shimmer 3s ease-in-out infinite;
}
.bar-glow.delay {
  background: linear-gradient(90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.2) 50%,
    transparent 100%
  );
}
@keyframes bar-shimmer {
  0%, 100% { transform: translateX(-100%); }
  50% { transform: translateX(100%); }
}

/* 延误条 */
.delay-bar {
  position: absolute;
  top: 12px;
  height: 20px;
  border-radius: 0 6px 6px 0;
  background: linear-gradient(90deg, #d97706, #f59e0b, #fbbf24);
  min-width: 4px;
  overflow: hidden;
}

/* 航路点 */
.wp-dot {
  position: absolute;
  top: 16px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #e2e8f0;
  border: 2px solid rgba(11, 18, 33, 0.8);
  transform: translateX(-50%);
  cursor: pointer;
  z-index: 3;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.wp-dot:hover {
  transform: translateX(-50%) scale(1.5);
  box-shadow: 0 0 16px rgba(226, 232, 240, 0.4);
}
.wp-dot.affected {
  background: #ef4444;
  border-color: rgba(239, 68, 68, 0.8);
  box-shadow: 0 0 12px rgba(239, 68, 68, 0.5);
  animation: wp-pulse 2s ease-in-out infinite;
}
@keyframes wp-pulse {
  0%, 100% { box-shadow: 0 0 8px rgba(239, 68, 68, 0.4); }
  50% { box-shadow: 0 0 16px rgba(239, 68, 68, 0.7); }
}
.wp-ring {
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.1);
  opacity: 0;
  transition: all 0.25s;
}
.wp-dot:hover .wp-ring {
  opacity: 1;
  inset: -6px;
}
.wp-tooltip {
  position: absolute;
  top: -52px;
  left: 50%;
  transform: translateX(-50%) scale(0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  font-size: 9px;
  font-family: 'IBM Plex Mono', monospace;
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  color: #94a3b8;
  padding: 6px 10px;
  border-radius: 8px;
  white-space: nowrap;
  opacity: 0;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  z-index: 10;
}
.tooltip-time {
  font-size: 10px;
  font-weight: 700;
  color: #e2e8f0;
}
.tooltip-label {
  color: #64748b;
}
.tooltip-warn {
  color: #f87171;
  font-weight: 600;
  font-size: 8px;
  padding: 1px 5px;
  border-radius: 4px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.15);
}
.wp-dot:hover .wp-tooltip {
  opacity: 1;
  transform: translateX(-50%) scale(1);
}

/* 滑块 */
.slider-thumb {
  position: absolute;
  top: -4px;
  width: 32px;
  height: 52px;
  transform: translateX(-50%);
  cursor: grab;
  z-index: 5;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.15s;
}
.slider-thumb:active { cursor: grabbing; transform: translateX(-50%) scale(1.05); }
.thumb-body {
  width: 28px;
  height: 40px;
  background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
  border: 2px solid #00d4ff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 20px rgba(0, 212, 255, 0.25), 0 4px 12px rgba(0, 0, 0, 0.3);
}
.thumb-indicator {
  width: 4px;
  height: 16px;
  border-radius: 2px;
  background: linear-gradient(180deg, #00d4ff, #0891b2);
  box-shadow: 0 0 8px rgba(0, 212, 255, 0.5);
}
.thumb-time {
  font-size: 9px;
  font-family: 'IBM Plex Mono', monospace;
  color: #00d4ff;
  font-weight: 700;
  margin-top: 6px;
  white-space: nowrap;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(0, 212, 255, 0.08);
  border: 1px solid rgba(0, 212, 255, 0.12);
}

/* 时间标签 */
.time-labels {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 12px 4px 0;
}
.time-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
}
.time-group.center { align-items: center; }
.time-group.delay-end { align-items: flex-end; }
.time-label {
  font-size: 11px;
  font-family: 'IBM Plex Mono', monospace;
  color: #475569;
  font-weight: 600;
}
.time-label.sched-arr { color: #64748b; }
.time-label.delay-label { color: #f59e0b; }
.time-sublabel {
  font-size: 9px;
  color: #334155;
  font-weight: 500;
}

/* 图例 */
.legend-row {
  display: flex;
  gap: 16px;
  padding: 0 4px;
}
.legend {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  color: #475569;
  font-weight: 500;
}
.ld {
  display: inline-block;
  width: 14px;
  height: 6px;
  border-radius: 3px;
  flex-shrink: 0;
}
.ld.sched {
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
  box-shadow: 0 0 6px rgba(59, 130, 246, 0.3);
}
.ld.delay {
  background: linear-gradient(90deg, #f59e0b, #fbbf24);
  box-shadow: 0 0 6px rgba(245, 158, 11, 0.3);
}
.ld.wp-dot-legend {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #e2e8f0;
  box-shadow: 0 0 4px rgba(226, 232, 240, 0.3);
}
.ld.wp-affected {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ef4444;
  box-shadow: 0 0 6px rgba(239, 68, 68, 0.4);
}
</style>
