<template>
  <div class="overlay">
    <!-- 头部 -->
    <div class="head">
      <div class="head-l">
        <span class="flight-no mono">{{ analysis?.flightNo }}</span>
        <span class="ac-type mono">{{ analysis?.aircraftType }}</span>
        <span class="reg mono">{{ analysis?.registration }}</span>
      </div>
      <div class="head-c mono">{{ analysis?.originalRoute }}</div>
      <div class="head-r">
        <span class="dep-arr mono">{{ analysis?.depIcao }}</span>
        <span class="arrow">→</span>
        <span class="dep-arr mono">{{ analysis?.arrIcao }}</span>
        <button class="close-btn" @click="$emit('close')" title="关闭">✕</button>
      </div>
    </div>

    <!-- 无数据 -->
    <template v-if="!analysis || !analysis.timeline.length">
      <div class="no-data">
        <span class="no-icon">✓</span>
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
  position: absolute; inset: 0; z-index: 35;
  display: flex; flex-direction: column;
  background: rgba(8,14,32,0.97); backdrop-filter: blur(16px);
  border: 1px solid rgba(0,180,240,0.15);
  box-shadow: 0 0 80px rgba(0,0,0,0.85), inset 0 0 0 1px rgba(0,180,240,0.06), 0 0 0 4px rgba(0,0,0,0.3);
  animation: fade-in 0.2s ease;
}
@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }

.head { display:flex; align-items:center; justify-content:space-between; padding:14px 20px; background:rgba(0,180,240,0.03); border-bottom:1px solid rgba(0,180,240,0.08); flex-shrink:0; gap:14px; border-radius:8px 8px 0 0; }
.head-l { display:flex; align-items:baseline; gap:10px; flex-shrink:0; }
.flight-no { font-size:18px; font-weight:900; color:#e2e8f0; letter-spacing:0.04em; }
.ac-type { font-size:10px; color:#64748b; }
.reg { font-size:10px; color:#475569; }
.head-c { flex:1; min-width:0; text-align:center; font-size:9px; color:#475569; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.head-r { display:flex; align-items:center; gap:8px; flex-shrink:0; }
.dep-arr { font-size:12px; font-weight:700; color:#cbd5e1; }
.arrow { color:#475569; font-size:12px; }
.mono { font-family:'IBM Plex Mono',monospace; }
.close-btn { width:30px; height:30px; border-radius:6px; border:1px solid rgba(255,255,255,0.08); background:rgba(255,255,255,0.03); color:#64748b; cursor:pointer; font-size:14px; transition:all 0.15s; margin-left:4px; }
.close-btn:hover { background:rgba(239,68,68,0.1); color:#ef4444; border-color:rgba(239,68,68,0.2); }

.no-data { display:flex; flex-direction:column; align-items:center; justify-content:center; padding:60px 40px; text-align:center; flex:1; }
.no-icon { width:42px; height:42px; border-radius:50%; background:rgba(74,222,128,0.08); border:2px solid rgba(74,222,128,0.2); color:#4ade80; font-size:18px; display:flex; align-items:center; justify-content:center; margin-bottom:14px; }
.no-title { font-size:13px; font-weight:700; color:#e2e8f0; margin:0 0 6px; }
.no-desc { font-size:10px; color:#475569; margin:0; max-width:380px; line-height:1.6; }

.body { flex:1; overflow-y:auto; scrollbar-width:thin; scrollbar-color:rgba(0,180,240,0.08) transparent; }
.body::-webkit-scrollbar { width:3px; }
.body::-webkit-scrollbar-thumb { background:rgba(0,180,240,0.08); border-radius:3px; }
</style>
