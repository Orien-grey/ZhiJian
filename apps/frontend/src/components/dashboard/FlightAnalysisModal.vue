<template>
  <Teleport to="body">
    <div v-if="visible" class="overlay" @click.self="close">
      <div class="modal">
        <!-- 头部：航班信息 -->
        <div class="head">
          <div class="head-l">
            <div class="flight-badge">
              <span class="flight-no">{{ analysis?.flightNo }}</span>
              <div class="flight-meta">
                <span class="ac-type mono">{{ analysis?.aircraftType }}</span>
                <span class="meta-dot" />
                <span class="reg mono">{{ analysis?.registration }}</span>
              </div>
            </div>
          </div>
          <div class="head-m">
            <div class="route-pill">
              <svg class="route-icon" width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1 6h6M5 3.5L8 6 5 8.5" stroke="rgba(0,212,255,0.35)" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span class="route-text mono">{{ analysis?.originalRoute }}</span>
            </div>
          </div>
          <div class="head-r">
            <div class="airport-pair">
              <span class="dep-arr mono">{{ analysis?.depIcao }}</span>
              <div class="arrow-wrap">
                <svg width="18" height="7" viewBox="0 0 18 7">
                  <line x1="0" y1="3.5" x2="14" y2="3.5" stroke="#475569" stroke-width="1" />
                  <polygon points="14,1 18,3.5 14,6" fill="#475569" />
                </svg>
              </div>
              <span class="dep-arr mono">{{ analysis?.arrIcao }}</span>
            </div>
            <button class="close-btn" @click="close">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- 无数据回退 -->
        <template v-if="!analysis || !analysis.timeline.length">
          <div class="no-analysis">
            <div class="no-icon-wrap">
              <div class="no-icon-ring">
                <span class="no-icon">✓</span>
              </div>
              <div class="no-ring-glow" />
            </div>
            <p class="no-title">该航班未受影响</p>
            <p class="no-desc">当前航路无限制区影响，航班按计划执行。如有NOTAM更新，系统将自动标记受影响航班。</p>
          </div>
        </template>

        <!-- 受影响分析内容 -->
        <template v-else>
          <!-- 红色预警横幅 -->
          <FlightAlertBanner
            :delay-minutes="analysis.delayMinutes"
            :scheduled-departure="analysis.scheduledDeparture"
            :estimated-departure="analysis.estimatedDeparture"
          />

          <!-- 可滚动内容区 -->
          <div class="body">
            <!-- 一、飞行时间轴 -->
            <FlightTimeline
              :timeline="analysis.timeline"
              :scheduled-departure="analysis.scheduledDeparture"
              :estimated-departure="analysis.estimatedDeparture"
              :delay-minutes="analysis.delayMinutes"
              @waypoint-click="onWaypointClick"
            />

            <!-- 二、高度剖面图 -->
            <AltitudeProfile
              :altitude-profile="analysis.altitudeProfile"
              :restriction-zones="analysis.restrictionZones"
              :flight-no="analysis.flightNo"
            />

            <!-- 三、备选航线 -->
            <AlternateRouteList
              :routes="analysis.alternateRoutes"
              @toggle="onRouteToggle"
              @preview="onRoutePreview"
            />
          </div>
        </template>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { MOCK_ANALYSIS, type FlightAnalysisData } from '@/views/dashboard/mock/flightAnalysis'
import FlightAlertBanner from './FlightAlertBanner.vue'
import FlightTimeline from './FlightTimeline.vue'
import AltitudeProfile from './AltitudeProfile.vue'
import AlternateRouteList from './AlternateRouteList.vue'

const props = defineProps<{ visible: boolean; flightNo: string }>()
const emit = defineEmits<{ (e: 'close'): void; (e: 'preview-route', routeId: string, flightNo: string): void }>()

const analysis = computed<FlightAnalysisData | null>(() => MOCK_ANALYSIS[props.flightNo] || null)

const close = () => emit('close')

const onWaypointClick = (wp: any) => {
  // 点击航路点：可扩展为地图定位
}

const onRouteToggle = (id: string) => {
  // 勾选备选航线
}

const onRoutePreview = (id: string) => {
  emit('preview-route', id, props.flightNo)
}
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  z-index: 1001;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  animation: overlay-in 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes overlay-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal {
  width: 800px;
  max-width: 96vw;
  max-height: 90vh;
  background: linear-gradient(180deg, rgba(8, 14, 32, 0.98) 0%, rgba(6, 10, 24, 0.97) 100%);
  border: 1px solid rgba(0, 180, 240, 0.1);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow:
    0 40px 120px rgba(0, 0, 0, 0.8),
    0 0 0 1px rgba(0, 180, 240, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.03);
  animation: modal-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes modal-in {
  from { opacity: 0; transform: scale(0.96) translateY(12px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

/* ===== 头部 ===== */
.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 22px;
  background: linear-gradient(180deg, rgba(0, 180, 240, 0.04) 0%, rgba(0, 180, 240, 0.01) 100%);
  border-bottom: 1px solid rgba(0, 180, 240, 0.06);
  flex-shrink: 0;
  gap: 16px;
  position: relative;
}

.head::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.12), transparent);
}

.head-l {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.flight-badge {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.flight-no {
  font-size: 20px;
  font-weight: 900;
  font-family: 'IBM Plex Mono', monospace;
  color: #f1f5f9;
  letter-spacing: 0.04em;
  text-shadow: 0 0 16px rgba(0, 212, 255, 0.2);
}

.flight-meta {
  display: flex;
  align-items: center;
  gap: 6px;
}

.ac-type {
  font-size: 10px;
  color: #64748b;
  font-weight: 600;
}

.meta-dot {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: rgba(100, 116, 139, 0.4);
}

.reg {
  font-size: 10px;
  color: #475569;
}

.head-m {
  flex: 1;
  min-width: 0;
  display: flex;
  justify-content: center;
}

.route-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 14px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.015);
  border: 1px solid rgba(255, 255, 255, 0.04);
  transition: all 0.3s ease;
}

.route-pill:hover {
  border-color: rgba(0, 212, 255, 0.1);
  background: rgba(0, 212, 255, 0.02);
}

.route-icon {
  flex-shrink: 0;
  opacity: 0.7;
}

.route-text {
  font-size: 9px;
  color: #475569;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.head-r {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-shrink: 0;
}

.airport-pair {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 12px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.015);
  border: 1px solid rgba(255, 255, 255, 0.04);
}

.dep-arr {
  font-size: 13px;
  font-weight: 800;
  color: #e2e8f0;
  letter-spacing: 0.02em;
}

.arrow-wrap {
  display: flex;
  align-items: center;
  opacity: 0.6;
}

.close-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(255, 255, 255, 0.02);
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border-color: rgba(239, 68, 68, 0.2);
  transform: rotate(90deg);
}

.close-btn:active {
  transform: rotate(90deg) scale(0.92);
}

/* ===== 无数据 ===== */
.no-analysis {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 40px;
  text-align: center;
}

.no-icon-wrap {
  position: relative;
  width: 56px;
  height: 56px;
  margin-bottom: 20px;
}

.no-icon-ring {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(74, 222, 128, 0.06);
  border: 2px solid rgba(74, 222, 128, 0.2);
  color: #4ade80;
  font-size: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
}

.no-ring-glow {
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(74, 222, 128, 0.15) 0%, transparent 70%);
  z-index: 1;
  animation: breathe-green 3s ease-in-out infinite;
}

@keyframes breathe-green {
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.08); }
}

.no-title {
  font-size: 15px;
  font-weight: 700;
  color: #e2e8f0;
  margin: 0 0 8px;
}

.no-desc {
  font-size: 11px;
  color: #475569;
  margin: 0;
  max-width: 400px;
  line-height: 1.7;
}

/* ===== 内容 ===== */
.body {
  flex: 1;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 180, 240, 0.08) transparent;
}

.body::-webkit-scrollbar {
  width: 4px;
}

.body::-webkit-scrollbar-track {
  background: transparent;
}

.body::-webkit-scrollbar-thumb {
  background: rgba(0, 180, 240, 0.08);
  border-radius: 4px;
}

.body::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 180, 240, 0.15);
}

.mono {
  font-family: 'IBM Plex Mono', monospace;
}
</style>
