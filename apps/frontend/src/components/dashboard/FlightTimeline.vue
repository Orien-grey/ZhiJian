<template>
  <div class="section">
    <p class="sec-title">航班时间轴</p>

    <!-- 滑块拖动轨道 -->
    <div class="slider-track" ref="trackRef" @mousedown="onTrackClick">
      <!-- 计划飞行条 -->
      <div class="sched-bar" :style="schedBarStyle" />

      <!-- 延误条 -->
      <div v-if="delayMinutes > 0" class="delay-bar" :style="delayBarStyle" />

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
        <span class="wp-tooltip">{{ wp.label }}</span>
      </div>

      <!-- 可拖拽滑块 -->
      <div
        class="slider-thumb"
        :style="thumbStyle"
        @mousedown.stop="onThumbDown"
      >
        <span class="thumb-time">{{ sliderTime }}</span>
      </div>
    </div>

    <!-- 时间标签（轨道外部） -->
    <div class="time-labels">
      <span class="time-label">{{ scheduledDeparture }}</span>
      <span v-if="delayMinutes > 0" class="time-label sched-arr">{{ scheduledArrival }}</span>
      <span v-if="delayMinutes > 0" class="time-label delay-label">{{ estimatedArrival }}</span>
      <span v-else class="time-label">{{ scheduledArrival }}</span>
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
.section { padding: 18px 19px; border-bottom: 1px solid rgba(0,212,255,0.05); }
.sec-title { font-size: 11px; font-weight: 600; color: #64748b; margin: 0 0 14px; letter-spacing: 0.06em; text-transform: uppercase; }

/* 轨道 */
.slider-track {
  position: relative; height: 36px; margin: 0 4px 6px;
  background: rgba(255,255,255,0.02); border-radius: 6px;
  border: 1px solid rgba(255,255,255,0.03); cursor: pointer;
}

/* 计划条 */
.sched-bar {
  position: absolute; top: 9px; height: 18px; border-radius: 4px 0 0 4px;
  background: linear-gradient(90deg, #1d4ed8, #3b82f6);
  box-shadow: 0 0 12px rgba(59,130,246,0.28);
  min-width: 4px;
}

/* 延误条 */
.delay-bar {
  position: absolute; top: 9px; height: 18px; border-radius: 0 4px 4px 0;
  background: linear-gradient(90deg, #f59e0b, #fbbf24);
  box-shadow: 0 0 12px rgba(245,158,11,0.3);
  min-width: 4px;
}

/* 航路点 */
.wp-dot {
  position: absolute; top: 13px; width: 10px; height: 10px;
  border-radius: 50%; background: #e2e8f0; border: 2px solid #0b1221;
  transform: translateX(-50%); cursor: pointer; z-index: 3; transition: all 0.15s;
}
.wp-dot:hover { transform: translateX(-50%) scale(1.4); }
.wp-dot.affected { background: #ef4444; border-color: #ef4444; box-shadow: 0 0 8px rgba(239,68,68,0.5); }
.wp-tooltip {
  position: absolute; top: -18px; left: 50%; transform: translateX(-50%);
  font-size: 8px; font-family: 'IBM Plex Mono', monospace; background: #1e293b;
  color: #94a3b8; padding: 1px 5px; border-radius: 3px; white-space: nowrap; opacity: 0;
  transition: opacity 0.15s; pointer-events: none;
}
.wp-dot:hover .wp-tooltip { opacity: 1; }

/* 滑块 */
.slider-thumb {
  position: absolute; top: -1px; width: 28px; height: 38px;
  background: #0b1221; border: 2px solid #00d4ff; border-radius: 6px;
  transform: translateX(-50%); cursor: grab; z-index: 5;
  display: flex; align-items: flex-end; justify-content: center;
  box-shadow: 0 0 14px rgba(0,212,255,0.3);
  transition: box-shadow 0.15s;
}
.slider-thumb:active { cursor: grabbing; box-shadow: 0 0 22px rgba(0,212,255,0.5); }
.thumb-time {
  font-size: 8px; font-family: 'IBM Plex Mono', monospace; color: #00d4ff;
  font-weight: 700; margin-bottom: -15px; white-space: nowrap;
}

/* 时间标签（轨道外部） */
.time-labels {
  display: flex; justify-content: space-between; align-items: flex-start;
  padding: 0 4px; margin-bottom: 4px;
}
.time-label { font-size: 9px; font-family: 'IBM Plex Mono', monospace; color: #475569; }
.time-label.sched-arr { color: #64748b; text-align: center; }
.time-label.delay-label { color: #f59e0b; text-align: right; }

/* 图例 */
.legend-row { display: flex; gap: 16px; padding: 4px 4px 0; }
.legend { display: flex; align-items: center; gap: 5px; font-size: 9px; color: #475569; }
.ld { display: inline-block; width: 12px; height: 6px; border-radius: 2px; flex-shrink: 0; }
.ld.sched { background: #3b82f6; }
.ld.delay { background: #f59e0b; }
.ld.wp-dot-legend { width: 7px; height: 7px; border-radius: 50%; background: #e2e8f0; }
.ld.wp-affected { width: 7px; height: 7px; border-radius: 50%; background: #ef4444; }
</style>
