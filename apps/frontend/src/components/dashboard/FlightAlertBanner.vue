<template>
  <div class="banner" :class="delayMinutes > 40 ? 'critical' : 'warning'">
    <!-- 动态背景纹理 -->
    <div class="banner-bg" />
    <div class="banner-scanline" />

    <div class="banner-left">
      <div class="banner-icon-wrap">
        <svg class="banner-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>
        </svg>
        <div class="icon-ring" />
      </div>
      <div class="banner-info">
        <div class="banner-label-row">
          <span class="banner-label">航班延误预警</span>
          <span class="severity-badge" :class="delayMinutes > 40 ? 'critical' : 'warning'">
            {{ delayMinutes > 40 ? '严重延误' : '一般延误' }}
          </span>
        </div>
        <span class="banner-detail">
          预计延误
          <strong class="delay-val">{{ delayMinutes }}</strong>
          <span class="delay-unit">分钟</span>
          <span class="divider">·</span>
          <span class="time-group">
            <span class="mono">{{ scheduledDeparture }}</span>
            <svg class="arrow-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
            </svg>
            <span class="mono delayed">{{ estimatedDeparture }}</span>
          </span>
        </span>
      </div>
    </div>

    <div class="banner-right">
      <div class="severity-indicator">
        <span class="severity-dot" :class="delayMinutes > 40 ? 'critical' : 'warning'" />
        <div class="severity-rings">
          <div class="ring ring-1" />
          <div class="ring ring-2" />
          <div class="ring ring-3" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  delayMinutes: number
  scheduledDeparture: string
  estimatedDeparture: string
}>()
</script>

<style scoped>
.banner {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  flex-shrink: 0;
  overflow: hidden;
  border-bottom: 1px solid transparent;
  transition: border-color 0.3s;
}
.banner.critical {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(239, 68, 68, 0.02) 50%, rgba(0, 0, 0, 0.1) 100%);
  border-bottom-color: rgba(239, 68, 68, 0.12);
}
.banner.warning {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(245, 158, 11, 0.02) 50%, rgba(0, 0, 0, 0.1) 100%);
  border-bottom-color: rgba(245, 158, 11, 0.12);
}

/* 动态背景 */
.banner-bg {
  position: absolute;
  inset: 0;
  opacity: 0.4;
  background:
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 40px,
      rgba(255, 255, 255, 0.01) 40px,
      rgba(255, 255, 255, 0.01) 41px
    );
  pointer-events: none;
}
.banner-scanline {
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.03), transparent);
  animation: scan 4s ease-in-out infinite;
  pointer-events: none;
}
@keyframes scan {
  0% { left: -100%; }
  100% { left: 200%; }
}

.banner-left {
  display: flex;
  align-items: center;
  gap: 14px;
  position: relative;
  z-index: 1;
}

/* 图标区域 */
.banner-icon-wrap {
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.banner-icon {
  color: #ef4444;
  z-index: 1;
  animation: pulse-warn 2s ease-in-out infinite;
}
.banner.warning .banner-icon { color: #f59e0b; }
@keyframes pulse-warn {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.1); }
}
.icon-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 1px solid rgba(239, 68, 68, 0.15);
  animation: ring-expand 2s ease-out infinite;
}
.banner.warning .icon-ring { border-color: rgba(245, 158, 11, 0.15); }
@keyframes ring-expand {
  0% { transform: scale(0.8); opacity: 1; }
  100% { transform: scale(1.4); opacity: 0; }
}

/* 信息区域 */
.banner-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.banner-label-row {
  display: flex;
  align-items: center;
  gap: 10px;
}
.banner-label {
  font-size: 14px;
  font-weight: 700;
  color: #fca5a5;
  letter-spacing: 0.02em;
  font-family: 'Noto Sans SC', 'PingFang SC', sans-serif;
}
.banner.warning .banner-label { color: #fcd34d; }

.severity-badge {
  font-size: 9px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 6px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  font-family: 'IBM Plex Mono', monospace;
}
.severity-badge.critical {
  color: #fca5a5;
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.2);
}
.severity-badge.warning {
  color: #fcd34d;
  background: rgba(245, 158, 11, 0.12);
  border: 1px solid rgba(245, 158, 11, 0.2);
}

.banner-detail {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #94a3b8;
}
.delay-val {
  color: #ef4444;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 16px;
  font-weight: 700;
  text-shadow: 0 0 12px rgba(239, 68, 68, 0.3);
}
.banner.warning .delay-val {
  color: #f59e0b;
  text-shadow: 0 0 12px rgba(245, 158, 11, 0.3);
}
.delay-unit {
  font-size: 11px;
  color: #64748b;
}
.divider {
  color: #334155;
  margin: 0 2px;
}
.time-group {
  display: flex;
  align-items: center;
  gap: 5px;
}
.mono {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 12px;
  color: #cbd5e1;
  padding: 2px 6px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
}
.mono.delayed {
  color: #fca5a5;
  background: rgba(239, 68, 68, 0.06);
  border-color: rgba(239, 68, 68, 0.1);
}
.banner.warning .mono.delayed {
  color: #fcd34d;
  background: rgba(245, 158, 11, 0.06);
  border-color: rgba(245, 158, 11, 0.1);
}
.arrow-icon {
  color: #475569;
}

/* 右侧严重度指示器 */
.banner-right {
  position: relative;
  z-index: 1;
}
.severity-indicator {
  position: relative;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.severity-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  z-index: 2;
}
.severity-dot.critical {
  background: #ef4444;
  box-shadow: 0 0 16px rgba(239, 68, 68, 0.6);
}
.severity-dot.warning {
  background: #f59e0b;
  box-shadow: 0 0 16px rgba(245, 158, 11, 0.5);
}
.severity-rings {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.ring {
  position: absolute;
  border-radius: 50%;
  border: 1px solid transparent;
}
.ring-1 {
  width: 20px;
  height: 20px;
  animation: severity-ring 2s ease-out infinite;
}
.ring-2 {
  width: 32px;
  height: 32px;
  animation: severity-ring 2s ease-out 0.4s infinite;
}
.ring-3 {
  width: 44px;
  height: 44px;
  animation: severity-ring 2s ease-out 0.8s infinite;
}
.banner.critical .ring {
  border-color: rgba(239, 68, 68, 0.12);
}
.banner.warning .ring {
  border-color: rgba(245, 158, 11, 0.12);
}
@keyframes severity-ring {
  0% { transform: scale(0.6); opacity: 1; }
  100% { transform: scale(1.2); opacity: 0; }
}
</style>
