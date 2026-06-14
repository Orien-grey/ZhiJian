<template>
  <div class="section">
    <div class="sec-header">
      <div class="sec-title-wrap">
        <div class="sec-icon">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 7h8M7 4l3 3-3 3" stroke="rgba(74,222,128,0.6)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="11" cy="7" r="2" stroke="rgba(74,222,128,0.4)" stroke-width="1" fill="none"/>
          </svg>
        </div>
        <p class="sec-title">备选航线</p>
        <span class="sec-subtitle">共 {{ routes.length }} 条</span>
      </div>
      <div class="sec-badge" v-if="selectedCount > 0">
        <span class="sec-badge-dot" />
        <span class="sec-badge-text">已选 {{ selectedCount }} 条</span>
      </div>
    </div>

    <div v-if="routes.length === 0" class="no-data">
      <div class="no-icon-wrap">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h2v2h-2v-2zm0-2h2V7h-2v8z" stroke="rgba(100,116,139,0.4)" stroke-width="1.2" fill="none"/>
        </svg>
      </div>
      <span class="no-text">该航班暂无备选航线</span>
    </div>

    <div v-for="(r, idx) in routes" :key="r.id" class="route-card" :class="{ selected: r.selected, 'route-enter': true }" :style="{ animationDelay: idx * 60 + 'ms' }">
      <!-- 左侧装饰线 -->
      <div class="card-accent" :class="r.selected ? 'accent-active' : 'accent-default'" />

      <div class="card-left">
        <!-- 勾选框 -->
        <div class="cb" :class="{ checked: r.selected }" @click="toggleRoute(r)">
          <svg v-if="r.selected" width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M1 5l3 3 5-6" stroke="#00d4ff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>

      <div class="card-body" @click="toggleRoute(r)">
        <div class="card-top">
          <div class="route-name-wrap">
            <span class="route-name">{{ r.name }}</span>
            <div class="route-pills">
              <span class="pill pill-dist">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <circle cx="5" cy="5" r="3.5" stroke="currentColor" stroke-width="1" fill="none"/>
                  <line x1="5" y1="2" x2="5" y2="5" stroke="currentColor" stroke-width="1" stroke-linecap="round"/>
                  <line x1="5" y1="5" x2="7" y2="6" stroke="currentColor" stroke-width="1" stroke-linecap="round"/>
                </svg>
                {{ r.distance }} NM
              </span>
              <span class="pill" :class="parseInt(r.fuelDelta) > 20 ? 'pill-warn' : 'pill-ok'">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M5 1v4l2.5 2" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                {{ r.fuelDelta }}
              </span>
            </div>
          </div>
        </div>
        <div class="route-text mono">{{ r.route }}</div>
        <div class="waypoint-chips">
          <span
            v-for="wp in r.waypoints"
            :key="wp"
            class="wp-chip"
            :class="{ affected: r.affectedWaypoints.includes(wp) }"
          >{{ wp }}</span>
        </div>
      </div>

      <div class="card-right">
        <button class="preview-btn" :class="{ active: r.selected }" @click.stop="$emit('preview', r.id)" :title="r.selected ? '取消预览' : '预览航线'">
          <svg v-if="r.selected" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="2.5" fill="#00d4ff"/>
            <circle cx="7" cy="7" r="5" stroke="#00d4ff" stroke-width="1" opacity="0.5"/>
          </svg>
          <svg v-else width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="5" stroke="#475569" stroke-width="1" stroke-dasharray="2,2"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { AlternateRoute } from '@/views/dashboard/mock/flightAnalysis'

const props = defineProps<{ routes: AlternateRoute[] }>()
const emit = defineEmits<{
  (e: 'toggle', id: string): void
  (e: 'preview', id: string): void
}>()

const selectedCount = computed(() => props.routes.filter(r => r.selected).length)

const toggleRoute = (r: AlternateRoute) => {
  r.selected = !r.selected
  emit('toggle', r.id)
}
</script>

<style scoped>
.section {
  padding: 22px 24px;
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
  background: rgba(74, 222, 128, 0.08);
  border: 1px solid rgba(74, 222, 128, 0.12);
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
  background: rgba(0, 212, 255, 0.05);
  border: 1px solid rgba(0, 212, 255, 0.1);
}

.sec-badge-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #00d4ff;
  box-shadow: 0 0 6px rgba(0, 212, 255, 0.4);
}

.sec-badge-text {
  font-size: 9px;
  font-weight: 700;
  color: #00d4ff;
  font-family: 'IBM Plex Mono', monospace;
}

/* ===== 无数据 ===== */
.no-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 0;
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

/* ===== 航线卡片 ===== */
.route-card {
  display: flex;
  gap: 0;
  margin-bottom: 10px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.03);
  background: rgba(255, 255, 255, 0.008);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  overflow: hidden;
  position: relative;
  opacity: 0;
  animation: route-enter 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes route-enter {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.route-card:hover {
  border-color: rgba(0, 212, 255, 0.08);
  background: rgba(0, 212, 255, 0.015);
  transform: translateY(-1px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.route-card.selected {
  border-color: rgba(0, 212, 255, 0.15);
  background: rgba(0, 212, 255, 0.025);
  box-shadow: 0 0 30px rgba(0, 212, 255, 0.05);
}

.card-accent {
  width: 3px;
  flex-shrink: 0;
  transition: background 0.3s ease;
}

.card-accent.accent-default {
  background: rgba(255, 255, 255, 0.02);
}

.card-accent.accent-active {
  background: linear-gradient(180deg, #00d4ff, rgba(0, 212, 255, 0.3));
}

.card-left {
  display: flex;
  align-items: flex-start;
  padding: 16px 0 16px 14px;
}

.cb {
  width: 18px;
  height: 18px;
  border-radius: 5px;
  border: 1.5px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.015);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.cb:hover {
  border-color: rgba(0, 212, 255, 0.3);
}

.cb.checked {
  background: rgba(0, 212, 255, 0.12);
  border-color: #00d4ff;
  box-shadow: 0 0 10px rgba(0, 212, 255, 0.15);
}

.card-body {
  flex: 1;
  min-width: 0;
  padding: 14px 16px;
}

.card-top {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.route-name-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.route-name {
  font-size: 13px;
  font-weight: 800;
  color: #e2e8f0;
  font-family: 'IBM Plex Mono', monospace;
  letter-spacing: -0.01em;
}

.route-pills {
  display: flex;
  align-items: center;
  gap: 6px;
}

.pill {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 9px;
  font-family: 'IBM Plex Mono', monospace;
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: 600;
}

.pill-dist {
  color: #64748b;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.04);
}

.pill-ok {
  color: #4ade80;
  background: rgba(74, 222, 128, 0.08);
  border: 1px solid rgba(74, 222, 128, 0.12);
}

.pill-warn {
  color: #f59e0b;
  background: rgba(245, 158, 11, 0.08);
  border: 1px solid rgba(245, 158, 11, 0.12);
}

.route-text {
  font-size: 10px;
  color: #475569;
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: 0.02em;
}

.mono {
  font-family: 'IBM Plex Mono', monospace;
}

.waypoint-chips {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}

.wp-chip {
  font-size: 8.5px;
  font-family: 'IBM Plex Mono', monospace;
  color: #64748b;
  padding: 2px 8px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.04);
  transition: all 0.2s ease;
}

.wp-chip:hover {
  border-color: rgba(255, 255, 255, 0.08);
  color: #94a3b8;
}

.wp-chip.affected {
  color: #ef4444;
  border-color: rgba(239, 68, 68, 0.2);
  background: rgba(239, 68, 68, 0.04);
}

.card-right {
  display: flex;
  align-items: flex-start;
  padding: 14px 14px 14px 0;
}

.preview-btn {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(255, 255, 255, 0.015);
  color: #475569;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.preview-btn:hover {
  color: #00d4ff;
  border-color: rgba(0, 212, 255, 0.2);
  background: rgba(0, 212, 255, 0.04);
  transform: scale(1.05);
}

.preview-btn.active {
  color: #00d4ff;
  border-color: rgba(0, 212, 255, 0.25);
  background: rgba(0, 212, 255, 0.06);
  box-shadow: 0 0 12px rgba(0, 212, 255, 0.1);
}

.preview-btn:active {
  transform: scale(0.95);
}
</style>
