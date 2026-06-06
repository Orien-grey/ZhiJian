<template>
  <header class="topbar">
    <!-- 左侧：Logo + 标题 -->
    <div class="top-left">
      <img :src="logoUrl" class="logo" alt="logo" />
      <h1 class="title">航行情报动态信息看板</h1>
    </div>

    <!-- 中间：双周期生效时间 -->
    <div class="top-center">
      <div class="cycle-item">
        <span class="cycle-label">250501 周期生效时间：</span>
        <span class="cycle-value">05月15日 08:00</span>
      </div>
      <span class="cycle-divider">|</span>
      <div class="cycle-item">
        <span class="cycle-label">250502 周期生效时间：</span>
        <span class="cycle-value">06月12日 08:00</span>
      </div>
    </div>

    <!-- 右侧：时间切换 -->
    <div class="top-right">
      <div class="time-btns">
        <button v-for="btn in timeButtons" :key="btn.key" :class="btn.key === activeTime ? 'tb-active' : 'tb'" @click="emit('update:activeTime', btn.key)">{{ btn.label }}</button>
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
  display: flex; align-items: center; height: 48px; flex-shrink: 0;
  background: rgba(8,14,32,0.95); border-bottom: 1px solid rgba(0,212,255,0.08);
  padding: 0 16px; gap: 20px;
}
.top-left { display: flex; align-items: center; gap: 10px; }
.logo { width: 28px; height: 28px; border-radius: 6px; object-fit: contain; }
.title { font-size: 14px; font-weight: 700; letter-spacing: 0.04em; color: #f1f5f9; margin: 0; white-space: nowrap; }

.top-center { flex: 1; display: flex; align-items: center; justify-content: center; gap: 12px; }
.cycle-item { display: flex; align-items: center; gap: 4px; }
.cycle-label { font-size: 11px; color: #64748b; font-family: 'IBM Plex Mono', monospace; }
.cycle-label::first-line { color: #64748b; }
.cycle-value { font-size: 11px; font-weight: 600; color: #00d4ff; font-family: 'IBM Plex Mono', monospace; }
.cycle-divider { color: rgba(0,212,255,0.12); font-size: 12px; }

.top-right { display: flex; align-items: center; }
.time-btns { display: flex; }
.tb {
  padding: 4px 14px; font-size: 11px; cursor: pointer;
  background: none; color: #64748b; border: 1px solid rgba(255,255,255,0.05);
  transition: all 0.2s; font-family: monospace;
}
.tb:first-child { border-radius: 4px 0 0 4px; }
.tb:last-child { border-radius: 0 4px 4px 0; }
.tb:hover { color: #00d4ff; border-color: rgba(0,212,255,0.2); }
.tb-active {
  padding: 4px 14px; font-size: 11px; cursor: pointer;
  background: rgba(0,212,255,0.12); color: #00d4ff; font-weight: 600;
  border: 1px solid rgba(0,212,255,0.3); font-family: monospace;
}
.tb-active:first-child { border-radius: 4px 0 0 4px; }
.tb-active:last-child { border-radius: 0 4px 4px 0; }
</style>
