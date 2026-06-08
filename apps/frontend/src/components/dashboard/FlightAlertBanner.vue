<template>
  <div class="banner">
    <div class="banner-left">
      <span class="banner-icon">⚠</span>
      <div class="banner-info">
        <span class="banner-label">航班延误预警</span>
        <span class="banner-detail">
          预计延误 <strong class="delay-val">{{ delayMinutes }}</strong> 分钟 ·
          <span class="mono">{{ scheduledDeparture }}</span> → <span class="mono delayed">{{ estimatedDeparture }}</span>
        </span>
      </div>
    </div>
    <div class="banner-right">
      <span class="severity-dot" :class="delayMinutes > 40 ? 'critical' : 'warning'" />
      <span class="severity-text">{{ delayMinutes > 40 ? '严重延误' : '一般延误' }}</span>
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
  display: flex; align-items: center; justify-content: space-between;
  padding: 13px 20px; flex-shrink: 0;
  background: linear-gradient(90deg, rgba(239,68,68,0.11) 0%, rgba(239,68,68,0.03) 50%, rgba(239,68,68,0.02) 100%);
  border-bottom: 1px solid rgba(239,68,68,0.15);
}
.banner-left { display: flex; align-items: center; gap: 14px; }
.banner-icon { font-size: 22px; animation: pulse-warn 2s ease-in-out infinite; }
@keyframes pulse-warn {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.15); }
}
.banner-info { display: flex; flex-direction: column; gap: 3px; }
.banner-label { font-size: 13px; font-weight: 700; color: #fca5a5; letter-spacing: 0.04em; }
.banner-detail { font-size: 11px; color: #94a3b8; }
.delay-val { color: #ef4444; font-family: 'IBM Plex Mono', monospace; font-size: 14px; }
.mono { font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: #cbd5e1; }
.mono.delayed { color: #fca5a5; }
.banner-right { display: flex; align-items: center; gap: 8px; }
.severity-dot { width: 8px; height: 8px; border-radius: 50%; }
.severity-dot.critical { background: #ef4444; box-shadow: 0 0 10px rgba(239,68,68,0.6); }
.severity-dot.warning { background: #f59e0b; box-shadow: 0 0 10px rgba(245,158,11,0.5); }
.severity-text { font-size: 10px; font-weight: 600; color: #fca5a5; letter-spacing: 0.06em; text-transform: uppercase; }
</style>
