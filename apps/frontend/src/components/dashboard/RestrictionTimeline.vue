<template>
  <div class="timeline-section">
    <div class="timeline-scroll" @wheel.prevent="onWheel">
      <div class="timeline-track">
        <div
          v-for="alert in alerts"
          :key="alert.id"
          class="tl-card"
          :class="[`tl-${alert.severity}`, newAlertIds.has(alert.id) && 'tl-new']"
          @click="$emit('click', alert)"
        >
          <span v-if="alert.severity === 'critical'" class="tl-tag">告</span>
          <span v-if="newAlertIds.has(alert.id)" class="tl-new-tag">NEW</span>
          <span class="tl-time">{{ alert.time }}</span>
          <span class="tl-icao">{{ alert.icao }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TimelineAlert } from '@/views/dashboard/mock/airportRestrictions'

defineProps<{
  alerts: TimelineAlert[]
  newAlertIds: Set<string>
}>()

defineEmits<{
  (e: 'click', alert: TimelineAlert): void
}>()

const onWheel = (e: WheelEvent) => {
  const el = e.currentTarget as HTMLElement
  el.scrollLeft += e.deltaY
}
</script>

<style scoped>
.timeline-section {
  height: 56px; flex-shrink: 0; border-bottom: 1px solid rgba(0,212,255,0.04);
  padding: 8px 1px;
}
.timeline-scroll { overflow-x: auto; height: 100%; scrollbar-width: none; }
.timeline-scroll::-webkit-scrollbar { display: none; }
.timeline-track { display: flex; gap: 8px; padding: 0 12px; min-width: max-content; align-items: center; height: 100%; }

.tl-card {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  min-width: 56px; height: 38px; border-radius: 6px; cursor: pointer;
  flex-shrink: 0; position: relative; transition: transform 0.15s;
}
.tl-card:hover { transform: translateY(-2px); }
.tl-critical { background: #ff4757; color: #fff; }
.tl-warning { background: #112240; border: 1px solid rgba(245,158,11,0.38); }
.tl-info { background: #112240; border: 1px solid rgba(0,212,255,0.19); }

.tl-tag {
  position: absolute; top: -4px; left: -4px;
  font-size: 8px; font-weight: 800; color: #fff; background: #dc2626;
  padding: 0 2px; border-radius: 2px; line-height: 1.4; z-index: 2;
}
.tl-time { font-size: 10px; font-family: 'IBM Plex Mono', monospace; opacity: 0.85; }
.tl-icao { font-size: 11px; font-weight: 700; font-family: 'IBM Plex Mono', monospace; margin-top: 1px; }

.tl-new { animation: slide-in-right 0.4s ease-out; }
.tl-new-tag {
  position: absolute; top: -6px; right: -4px;
  font-size: 7px; font-weight: 800; color: #00d4ff;
  background: rgba(0,0,0,0.8); border: 1px solid #00d4ff;
  padding: 0 3px; border-radius: 2px; letter-spacing: 0.08em;
  animation: fade-out 3s forwards;
}

@keyframes slide-in-right {
  from { transform: translateX(30px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}
@keyframes fade-out {
  0%, 70% { opacity: 1; }
  100% { opacity: 0; }
}
</style>
