<template>
  <div class="flight-list">
    <div
      v-for="(f, idx) in flights"
      :key="f.id"
      class="flight-item"
      :class="{ affected: f.isAffected, starred: f.star }"
      :style="{ animationDelay: `${idx * 0.04}s` }"
      @click="$emit('select', f)"
    >
      <!-- 左侧装饰条 -->
      <div class="item-accent" :style="{ background: FLIGHT_STATUS_MAP[f.status].color }" />

      <div class="item-content">
        <div class="flight-top">
          <div class="flight-id-group">
            <span class="star" :class="{ starred: f.star }" @click.stop="$emit('toggle-star', f)">
              <svg v-if="f.star" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            </span>
            <span class="flight-no">{{ f.flightNo }}</span>
            <span v-if="f.isCompanyRoute" class="tag-company">
              <span class="company-dot" />
              公司航线
            </span>
          </div>
          <span class="sch-time">{{ f.scheduledTime }}</span>
        </div>

        <div class="flight-route">
          <div class="airport dep">
            <span class="icao">{{ f.depIcao }}</span>
            <span class="name">{{ f.depName }}</span>
          </div>
          <div class="route-line">
            <span class="route-plane">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M2 12h20"/><path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6"/><path d="m22 12-5-5"/><path d="m22 12-5 5"/>
              </svg>
            </span>
          </div>
          <div class="airport arr">
            <span class="icao">{{ f.arrIcao }}</span>
            <span class="name">{{ f.arrName }}</span>
          </div>
        </div>

        <div class="flight-bottom">
          <div class="est-group">
            <span class="est-label">预计</span>
            <span class="est-time">{{ f.estimatedTime }}</span>
          </div>
          <span
            class="status-tag"
            :style="{
              color: FLIGHT_STATUS_MAP[f.status].color,
              background: FLIGHT_STATUS_MAP[f.status].color + '12',
              border: '1px solid ' + FLIGHT_STATUS_MAP[f.status].color + '30',
              boxShadow: '0 0 12px ' + FLIGHT_STATUS_MAP[f.status].color + '15',
            }"
          >
            <span class="status-dot" :style="{ background: FLIGHT_STATUS_MAP[f.status].color }" />
            {{ f.statusLabel }}
          </span>
          <span class="countdown">{{ f.countdown }}</span>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="flights.length === 0" class="empty-state">
      <div class="empty-icon">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>
        </svg>
      </div>
      <span class="empty-text">暂无匹配航班</span>
      <span class="empty-hint">请调整筛选条件</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FLIGHT_STATUS_MAP, type FlightItem } from '@/views/dashboard/mock/flightData'

defineProps<{
  flights: FlightItem[]
}>()

defineEmits<{
  (e: 'toggle-star', flight: FlightItem): void
  (e: 'select', flight: FlightItem): void
}>()
</script>

<style scoped>
.flight-list {
  flex: 1;
  overflow-y: auto;
  padding: 0 12px 12px;
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 212, 255, 0.12) transparent;
}
.flight-list::-webkit-scrollbar { width: 4px; }
.flight-list::-webkit-scrollbar-track { background: transparent; }
.flight-list::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, rgba(0, 212, 255, 0.15), rgba(139, 92, 246, 0.1));
  border-radius: 4px;
}

/* 航班卡片 */
.flight-item {
  position: relative;
  display: flex;
  margin-bottom: 8px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.01) 100%);
  border: 1px solid rgba(255, 255, 255, 0.05);
  cursor: pointer;
  overflow: hidden;
  opacity: 0;
  transform: translateY(12px);
  animation: item-enter 0.5s ease forwards;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
@keyframes item-enter {
  to { opacity: 1; transform: translateY(0); }
}

.flight-item:hover {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0.02) 100%);
  border-color: rgba(0, 212, 255, 0.12);
  transform: translateX(2px);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2), 0 0 16px rgba(0, 212, 255, 0.04);
}

.flight-item.affected {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.06) 0%, rgba(245, 158, 11, 0.01) 100%);
  border-color: rgba(245, 158, 11, 0.1);
}
.flight-item.affected:hover {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.02) 100%);
  border-color: rgba(245, 158, 11, 0.18);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2), 0 0 16px rgba(245, 158, 11, 0.06);
}

.flight-item.starred {
  border-color: rgba(245, 158, 11, 0.15);
}

/* 左侧状态色条 */
.item-accent {
  width: 3px;
  flex-shrink: 0;
  border-radius: 12px 0 0 12px;
  opacity: 0.7;
  transition: opacity 0.2s;
}
.flight-item:hover .item-accent { opacity: 1; }

.item-content {
  flex: 1;
  padding: 7px 12px;
  min-width: 0;
}

/* 顶部行 */
.flight-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2px;
}

.flight-id-group {
  display: flex;
  align-items: center;
  gap: 5px;
}

.star {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  color: #475569;
}
.star:not(.starred):hover {
  color: #f59e0b;
  background: rgba(245, 158, 11, 0.08);
  transform: scale(1.15) rotate(15deg);
}
.star.starred {
  color: #f59e0b;
  background: rgba(245, 158, 11, 0.1);
}
.star.starred:hover {
  transform: scale(1.15) rotate(-15deg);
}

.flight-no {
  font-size: 12px;
  font-weight: 700;
  font-family: 'IBM Plex Mono', monospace;
  color: #f1f5f9;
  letter-spacing: 0.02em;
}

.sch-time {
  font-size: 11px;
  color: #64748b;
  font-family: 'IBM Plex Mono', monospace;
  padding: 2px 8px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.04);
}

.tag-company {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 9px;
  font-weight: 600;
  color: #f87171;
  padding: 2px 8px;
  border-radius: 6px;
  border: 1px solid rgba(239, 68, 68, 0.2);
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(239, 68, 68, 0.02) 100%);
}
.company-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #ef4444;
  box-shadow: 0 0 6px rgba(239, 68, 68, 0.4);
}

/* 航线行 */
.flight-route {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 3px;
  padding: 0 2px;
}

.airport {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}
.airport.dep { align-items: flex-start; }
.airport.arr { align-items: flex-end; }

.icao {
  font-size: 14px;
  font-weight: 700;
  font-family: 'IBM Plex Mono', monospace;
  color: #e2e8f0;
  letter-spacing: 0.04em;
}
.name {
  font-size: 10px;
  color: #64748b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 80px;
}

.route-line {
  flex: 1;
  height: 1px;
  margin: 0 12px;
  background: linear-gradient(90deg,
    rgba(0, 212, 255, 0.3) 0%,
    rgba(0, 212, 255, 0.6) 50%,
    rgba(0, 212, 255, 0.3) 100%
  );
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.route-line::before,
.route-line::after {
  content: '';
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgba(0, 212, 255, 0.5);
  top: 50%;
  transform: translateY(-50%);
}
.route-line::before { left: -2px; }
.route-line::after { right: -2px; }

.route-plane {
  color: #00d4ff;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(0, 212, 255, 0.08);
  border: 1px solid rgba(0, 212, 255, 0.15);
  box-shadow: 0 0 12px rgba(0, 212, 255, 0.1);
  transform: rotate(0deg);
  transition: transform 0.3s ease;
}
.flight-item:hover .route-plane {
  transform: rotate(-5deg) scale(1.1);
}

/* 底部行 */
.flight-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
}

.est-group {
  display: flex;
  align-items: center;
  gap: 6px;
}
.est-label {
  font-size: 10px;
  color: #475569;
  font-weight: 500;
}
.est-time {
  font-size: 11px;
  color: #94a3b8;
  font-family: 'IBM Plex Mono', monospace;
}

.status-tag {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 10px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 8px;
  transition: all 0.2s ease;
}
.status-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  box-shadow: 0 0 6px currentColor;
}

.countdown {
  font-size: 11px;
  font-family: 'IBM Plex Mono', monospace;
  color: #64748b;
  padding: 2px 8px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 20px;
  gap: 10px;
  opacity: 0;
  animation: item-enter 0.5s ease forwards;
}
.empty-icon {
  color: #334155;
  margin-bottom: 4px;
}
.empty-text {
  font-size: 13px;
  font-weight: 600;
  color: #475569;
}
.empty-hint {
  font-size: 11px;
  color: #334155;
}
</style>
