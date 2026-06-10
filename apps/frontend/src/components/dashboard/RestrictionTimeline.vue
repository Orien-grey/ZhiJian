<template>
  <div class="timeline-section">
    <div class="timeline-scroll" @wheel.prevent="onWheel">
      <div class="timeline-track">
        <div
          v-for="(alert, index) in alerts"
          :key="alert.id"
          class="tl-card"
          :class="[`tl-${alert.severity}`, newAlertIds.has(alert.id) && 'tl-new']"
          :style="{ animationDelay: `${index * 0.02}s` }"
          @click="$emit('click', alert)"
        >
          <div class="tl-glow" />
          <div class="tl-content">
            <div class="tl-top">
              <span class="tl-time">{{ alert.time }}</span>
              <span v-if="alert.severity === 'critical'" class="tl-critical-dot" />
            </div>
            <span class="tl-icao">{{ alert.icao }}</span>
            <span class="tl-summary">{{ alert.summary }}</span>
          </div>
          <span v-if="newAlertIds.has(alert.id)" class="tl-new-tag">NEW</span>
        </div>
      </div>
    </div>
    <!-- 左右渐变遮罩 -->
    <div class="tl-fade tl-fade-left" />
    <div class="tl-fade tl-fade-right" />
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
  position: relative;
  height: 110px;
  flex-shrink: 0;
  padding: 14px 0;
  z-index: 1;
}

.timeline-scroll {
  overflow-x: auto;
  overflow-y: hidden;
  height: 100%;
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 212, 255, 0.12) transparent;
  mask-image: linear-gradient(90deg, transparent 0%, black 16px, black calc(100% - 16px), transparent 100%);
  -webkit-mask-image: linear-gradient(90deg, transparent 0%, black 16px, black calc(100% - 16px), transparent 100%);
}

.timeline-scroll::-webkit-scrollbar { height: 3px; }
.timeline-scroll::-webkit-scrollbar-track { background: transparent; }
.timeline-scroll::-webkit-scrollbar-thumb { background: rgba(0, 212, 255, 0.12); border-radius: 4px; }
.timeline-scroll::-webkit-scrollbar-thumb:hover { background: rgba(0, 212, 255, 0.28); }

.timeline-track {
  display: flex;
  gap: 10px;
  padding: 0 18px;
  min-width: max-content;
  align-items: center;
  height: 100%;
}

/* ===== 卡片 ===== */
.tl-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 88px;
  height: 72px;
  border-radius: 12px;
  flex-shrink: 0;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  border: 1px solid transparent;
  animation: card-enter 0.5s ease-out both;
}

@keyframes card-enter {
  from { transform: translateY(12px) scale(0.94); opacity: 0; }
  to { transform: translateY(0) scale(1); opacity: 1; }
}

.tl-card:hover {
  transform: translateY(-3px) scale(1.03);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.tl-glow {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
}

.tl-card:hover .tl-glow {
  opacity: 1;
}

.tl-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
}

/* ===== 严重级别样式 ===== */
.tl-critical {
  background: linear-gradient(145deg, rgba(80, 15, 15, 0.65) 0%, rgba(50, 10, 10, 0.55) 100%);
  border-color: rgba(239, 68, 68, 0.45);
  box-shadow: 0 2px 14px rgba(239, 68, 68, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.05);
}
.tl-critical .tl-glow {
  background: radial-gradient(circle at 50% 0%, rgba(239, 68, 68, 0.22) 0%, transparent 70%);
}
.tl-critical:hover {
  border-color: rgba(239, 68, 68, 0.6);
  box-shadow: 0 6px 28px rgba(239, 68, 68, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

.tl-warning {
  background: linear-gradient(145deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.85) 100%);
  border-color: rgba(245, 158, 11, 0.25);
  box-shadow: 0 2px 12px rgba(245, 158, 11, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.04);
}
.tl-warning .tl-glow {
  background: radial-gradient(circle at 50% 0%, rgba(245, 158, 11, 0.12) 0%, transparent 70%);
}
.tl-warning:hover {
  border-color: rgba(245, 158, 11, 0.4);
  box-shadow: 0 6px 28px rgba(245, 158, 11, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.06);
}

.tl-info {
  background: linear-gradient(145deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.85) 100%);
  border-color: rgba(0, 212, 255, 0.15);
  box-shadow: 0 2px 12px rgba(0, 212, 255, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.04);
}
.tl-info .tl-glow {
  background: radial-gradient(circle at 50% 0%, rgba(0, 212, 255, 0.1) 0%, transparent 70%);
}
.tl-info:hover {
  border-color: rgba(0, 212, 255, 0.3);
  box-shadow: 0 6px 28px rgba(0, 212, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.06);
}

/* ===== 内部文字 ===== */
.tl-top {
  display: flex;
  align-items: center;
  gap: 5px;
}

.tl-time {
  font-size: 10px;
  font-family: 'IBM Plex Mono', 'SF Mono', monospace;
  opacity: 0.8;
  letter-spacing: 0.02em;
  color: inherit;
}

.tl-critical .tl-time,
.tl-critical .tl-icao {
  color: #f87171;
}
.tl-critical .tl-summary {
  color: #fca5a5;
}

.tl-warning .tl-time,
.tl-warning .tl-icao,
.tl-warning .tl-summary {
  color: #fbbf24;
}

.tl-info .tl-time,
.tl-info .tl-icao,
.tl-info .tl-summary {
  color: #7dd3fc;
}

.tl-icao {
  font-size: 13px;
  font-weight: 800;
  font-family: 'IBM Plex Mono', 'SF Mono', monospace;
  letter-spacing: 0.04em;
}

.tl-summary {
  font-size: 8px;
  font-weight: 500;
  opacity: 0.65;
  max-width: 76px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tl-critical-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #ef4444;
  box-shadow: 0 0 6px rgba(239, 68, 68, 0.5);
  animation: pulse-dot 1.5s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
}

/* ===== NEW 标签 ===== */
.tl-new-tag {
  position: absolute;
  top: -5px;
  right: -4px;
  font-size: 7px;
  font-weight: 900;
  color: #00d4ff;
  background: rgba(6, 10, 20, 0.9);
  border: 1px solid rgba(0, 212, 255, 0.4);
  padding: 1px 4px;
  border-radius: 3px;
  letter-spacing: 0.1em;
  animation: fade-out 3s forwards;
  z-index: 3;
  box-shadow: 0 0 8px rgba(0, 212, 255, 0.2);
}

@keyframes fade-out {
  0%, 70% { opacity: 1; }
  100% { opacity: 0; }
}

.tl-new {
  animation: slide-in-right 0.45s cubic-bezier(0.4, 0, 0.2, 1) both;
}

@keyframes slide-in-right {
  from { transform: translateX(40px) scale(0.9); opacity: 0; }
  to { transform: translateX(0) scale(1); opacity: 1; }
}

/* ===== 左右渐变遮罩 ===== */
.tl-fade {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 24px;
  pointer-events: none;
  z-index: 2;
}
.tl-fade-left {
  left: 0;
  background: linear-gradient(90deg, #0c1220 0%, transparent 100%);
}
.tl-fade-right {
  right: 0;
  background: linear-gradient(-90deg, #0c1220 0%, transparent 100%);
}
</style>
