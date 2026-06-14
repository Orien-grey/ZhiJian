<template>
  <header class="topbar">
    <!-- 左侧：Logo + 标题 -->
    <div class="top-left">
      <div class="logo-wrap">
        <img :src="logoUrl" class="logo" alt="logo" />
        <div class="logo-glow" />
      </div>
      <div class="title-group">
        <h1 class="title">航行情报动态信息看板</h1>
        <span class="subtitle">AERONAUTICAL INFORMATION DASHBOARD</span>
      </div>
    </div>

    <!-- 中间：双周期生效时间 -->
    <div class="top-center">
      <div class="cycle-pill">
        <span class="cycle-dot active" />
        <span class="cycle-label">250501 周期</span>
        <span class="cycle-value">05月15日 08:00</span>
      </div>
      <div class="cycle-connector">
        <svg width="28" height="12" viewBox="0 0 28 12">
          <line x1="0" y1="6" x2="24" y2="6" stroke="rgba(0,212,255,0.15)" stroke-width="1" stroke-dasharray="3,3" />
          <polygon points="24,3 28,6 24,9" fill="rgba(0,212,255,0.2)" />
        </svg>
      </div>
      <div class="cycle-pill">
        <span class="cycle-dot" />
        <span class="cycle-label">250502 周期</span>
        <span class="cycle-value">06月12日 08:00</span>
      </div>
    </div>

    <!-- 右侧：时间切换 -->
    <div class="top-right">
      <div class="time-btns">
        <button
          v-for="btn in timeButtons"
          :key="btn.key"
          :class="btn.key === activeTime ? 'tb-active' : 'tb'"
          @click="emit('update:activeTime', btn.key)"
        >
          <span class="tb-glow" v-if="btn.key === activeTime" />
          <span class="tb-text">{{ btn.label }}</span>
        </button>
      </div>
      <div class="live-indicator">
        <span class="live-pulse" />
        <span class="live-text">LIVE</span>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import logoUrl from '@/assets/logo.png'

defineProps<{ activeTime: 'today' | 'tomorrow' | 'both' }>()
const emit = defineEmits<{ (e: 'update:activeTime', v: 'today' | 'tomorrow' | 'both'): void }>()

const timeButtons = [
  { key: 'today' as const, label: '今日' },
  { key: 'tomorrow' as const, label: '明日' },
  { key: 'both' as const, label: '两日' },
]
</script>

<style scoped>
.topbar {
  display: flex;
  align-items: center;
  height: 56px;
  flex-shrink: 0;
  background: linear-gradient(180deg, rgba(6, 10, 24, 0.98) 0%, rgba(8, 14, 32, 0.96) 100%);
  border-bottom: 1px solid rgba(0, 212, 255, 0.08);
  padding: 0 22px;
  gap: 24px;
  position: relative;
  overflow: hidden;
}

/* 顶部微光扫描线 */
.topbar::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 60%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.4), transparent);
  animation: scan 6s ease-in-out infinite;
}

@keyframes scan {
  0% { left: -60%; }
  50% { left: 100%; }
  100% { left: 100%; }
}

/* ===== 左侧 ===== */
.top-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.logo-wrap {
  position: relative;
  width: 32px;
  height: 32px;
}

.logo {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  object-fit: contain;
  position: relative;
  z-index: 2;
}

.logo-glow {
  position: absolute;
  inset: -4px;
  border-radius: 10px;
  background: radial-gradient(circle, rgba(0, 212, 255, 0.25) 0%, transparent 70%);
  z-index: 1;
  animation: breathe 3s ease-in-out infinite;
}

@keyframes breathe {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
}

.title-group {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.title {
  font-size: 15px;
  font-weight: 800;
  letter-spacing: 0.06em;
  color: #f8fafc;
  margin: 0;
  white-space: nowrap;
  text-shadow: 0 0 20px rgba(0, 212, 255, 0.15);
}

.subtitle {
  font-size: 8px;
  font-weight: 500;
  letter-spacing: 0.14em;
  color: rgba(100, 116, 139, 0.7);
  font-family: 'IBM Plex Mono', monospace;
}

/* ===== 中间 ===== */
.top-center {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.cycle-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 14px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
  transition: all 0.3s ease;
}

.cycle-pill:hover {
  border-color: rgba(0, 212, 255, 0.12);
  background: rgba(0, 212, 255, 0.02);
}

.cycle-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(100, 116, 139, 0.4);
  position: relative;
}

.cycle-dot.active {
  background: #00d4ff;
  box-shadow: 0 0 8px rgba(0, 212, 255, 0.5);
  animation: pulse-dot 2s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%, 100% { box-shadow: 0 0 6px rgba(0, 212, 255, 0.4); }
  50% { box-shadow: 0 0 14px rgba(0, 212, 255, 0.7); }
}

.cycle-label {
  font-size: 10px;
  color: #64748b;
  font-family: 'IBM Plex Mono', monospace;
  letter-spacing: 0.02em;
}

.cycle-value {
  font-size: 10px;
  font-weight: 700;
  color: #38bdf8;
  font-family: 'IBM Plex Mono', monospace;
}

.cycle-connector {
  display: flex;
  align-items: center;
  opacity: 0.6;
}

/* ===== 右侧 ===== */
.top-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.time-btns {
  display: flex;
  position: relative;
  background: rgba(255, 255, 255, 0.015);
  border-radius: 8px;
  padding: 3px;
  border: 1px solid rgba(255, 255, 255, 0.04);
}

.tb {
  position: relative;
  padding: 5px 16px;
  font-size: 11px;
  cursor: pointer;
  background: transparent;
  color: #64748b;
  border: none;
  transition: all 0.25s ease;
  font-family: 'IBM Plex Mono', monospace;
  border-radius: 6px;
  overflow: hidden;
  z-index: 1;
}

.tb:hover {
  color: #94a3b8;
  background: rgba(255, 255, 255, 0.03);
}

.tb-active {
  position: relative;
  padding: 5px 16px;
  font-size: 11px;
  cursor: pointer;
  background: rgba(0, 212, 255, 0.08);
  color: #00d4ff;
  font-weight: 700;
  border: none;
  font-family: 'IBM Plex Mono', monospace;
  border-radius: 6px;
  overflow: hidden;
  z-index: 1;
  text-shadow: 0 0 10px rgba(0, 212, 255, 0.3);
}

.tb-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, rgba(0, 212, 255, 0.15) 0%, transparent 70%);
  z-index: -1;
}

.tb-text {
  position: relative;
  z-index: 2;
}

/* LIVE 指示器 */
.live-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 12px;
  background: rgba(74, 222, 128, 0.05);
  border: 1px solid rgba(74, 222, 128, 0.1);
}

.live-pulse {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #4ade80;
  animation: live-blink 1.5s ease-in-out infinite;
}

@keyframes live-blink {
  0%, 100% { opacity: 1; box-shadow: 0 0 4px rgba(74, 222, 128, 0.4); }
  50% { opacity: 0.4; box-shadow: 0 0 8px rgba(74, 222, 128, 0.8); }
}

.live-text {
  font-size: 9px;
  font-weight: 800;
  color: #4ade80;
  letter-spacing: 0.1em;
  font-family: 'IBM Plex Mono', monospace;
}
</style>
