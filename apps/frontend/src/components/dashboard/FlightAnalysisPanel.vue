<template>
  <div class="overlay">
    <!-- 头部 -->
    <div class="head">
      <div class="head-l">
        <div class="flight-badge">
          <span class="flight-no mono">{{ analysis?.flightNo }}</span>
          <div class="flight-meta">
            <span class="ac-type mono">{{ analysis?.aircraftType }}</span>
            <span class="meta-divider" />
            <span class="reg mono">{{ analysis?.registration }}</span>
          </div>
        </div>
      </div>
      <div class="head-c">
        <div class="route-pill">
          <svg class="route-icon" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 7h8M7 4l3 3-3 3" stroke="rgba(0,212,255,0.4)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="route-text mono">{{ analysis?.originalRoute }}</span>
        </div>
      </div>
      <div class="head-r">
        <div class="airport-pair">
          <span class="dep-arr mono">{{ analysis?.depIcao }}</span>
          <div class="arrow-wrap">
            <svg width="20" height="8" viewBox="0 0 20 8">
              <line x1="0" y1="4" x2="16" y2="4" stroke="#475569" stroke-width="1" />
              <polygon points="16,1 20,4 16,7" fill="#475569" />
            </svg>
          </div>
          <span class="dep-arr mono">{{ analysis?.arrIcao }}</span>
        </div>
        <button class="close-btn" @click="$emit('close')" title="关闭">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- 无数据 -->
    <template v-if="!analysis || !analysis.timeline.length">
      <div class="no-data">
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

    <!-- 分析内容 -->
    <template v-else>
      <FlightAlertBanner :delay-minutes="analysis.delayMinutes" :scheduled-departure="analysis.scheduledDeparture" :estimated-departure="analysis.estimatedDeparture" />
      <div class="body">
        <FlightTimeline :timeline="analysis.timeline" :scheduled-departure="analysis.scheduledDeparture" :estimated-departure="analysis.estimatedDeparture" :delay-minutes="analysis.delayMinutes" />
        <AltitudeProfile :altitude-profile="analysis.altitudeProfile" :restriction-zones="analysis.restrictionZones" :flight-no="analysis.flightNo" />
        <AlternateRouteList :routes="analysis.alternateRoutes" />
        <FlightBreakdown
          :flight-no="analysis.flightNo"
          :delay-minutes="analysis.delayMinutes"
          :flight-minutes="flightMinutes"
          :restriction-count="analysis.restrictionZones.length"
          :min-restriction-alt="minRestrictionAlt"
          :max-restriction-alt="maxRestrictionAlt"
          :route-fuels="routeFuels"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { MOCK_ANALYSIS, type FlightAnalysisData } from '@/views/dashboard/mock/flightAnalysis'
import FlightAlertBanner from './FlightAlertBanner.vue'
import FlightTimeline from './FlightTimeline.vue'
import AltitudeProfile from './AltitudeProfile.vue'
import AlternateRouteList from './AlternateRouteList.vue'
import FlightBreakdown from './FlightBreakdown.vue'

const props = defineProps<{ flightNo: string }>()
defineEmits<{ (e: 'close'): void }>()

const analysis = computed<FlightAnalysisData | null>(() => MOCK_ANALYSIS[props.flightNo] || null)

const toMin = (t: string) => { const [h, m] = t.split(':').map(Number); return h * 60 + m }

const flightMinutes = computed(() => {
  const a = analysis.value
  if (!a || a.timeline.length < 2) return 120
  return toMin(a.timeline[a.timeline.length - 1].time) - toMin(a.timeline[0].time)
})

const minRestrictionAlt = computed(() => {
  const zones = analysis.value?.restrictionZones
  return zones?.length ? Math.min(...zones.map(z => z.minAlt)) : 0
})

const maxRestrictionAlt = computed(() => {
  const zones = analysis.value?.restrictionZones
  return zones?.length ? Math.max(...zones.map(z => z.maxAlt)) : 0
})

const routeFuels = computed(() => {
  const a = analysis.value
  if (!a) return []
  const baseDist = 680
  const baseFuelRate = 22 // kg/min
  return a.alternateRoutes.map(r => ({
    name: r.name, distance: r.distance,
    flightTime: Math.round(r.distance / 4.5), // ~450kt cruise
    fuel: Math.round(r.distance / 4.5 * baseFuelRate),
    delta: Math.round(r.distance / 4.5 * baseFuelRate - flightMinutes.value * baseFuelRate),
  }))
})
</script>

<style scoped>
.overlay {
  position: absolute;
  top: 0; bottom: 0;
  left: 320px; right: 360px;
  z-index: 35;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, rgba(6, 10, 24, 0.98) 0%, rgba(8, 14, 32, 0.97) 100%);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 180, 240, 0.1);
  box-shadow:
    0 0 100px rgba(0, 0, 0, 0.9),
    inset 0 0 0 1px rgba(0, 180, 240, 0.05),
    0 0 0 4px rgba(0, 0, 0, 0.3);
  animation: fade-in 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes fade-in {
  from { opacity: 0; transform: scale(0.995); }
  to { opacity: 1; transform: scale(1); }
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
  overflow: hidden;
}

.head::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.15), transparent);
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

.meta-divider {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: rgba(100, 116, 139, 0.4);
}

.reg {
  font-size: 10px;
  color: #475569;
}

.head-c {
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
  position: relative;
  overflow: hidden;
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
.no-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 40px;
  text-align: center;
  flex: 1;
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

/* ===== 内容区 ===== */
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
