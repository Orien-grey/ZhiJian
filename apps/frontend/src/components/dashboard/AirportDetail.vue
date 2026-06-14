<template>
  <Teleport to="body">
    <div v-if="visible" class="overlay" @click.self="close">
      <div class="modal">
        <!-- 头部 -->
        <div class="head">
          <div class="head-l">
            <span class="icao-badge">{{ airport?.icao }}</span>
            <div class="head-info">
              <span class="name-cn">{{ airport?.name }}</span>
              <span class="name-en">Ürümqi Diwopu International Airport</span>
            </div>
          </div>
          <div class="head-r">
            <div class="meta-pill">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              <span class="coord">N43°54′26″ E87°28′27″</span>
            </div>
            <div class="meta-pill">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
              <span class="elev">ELEV 648m (2126ft)</span>
            </div>
            <button class="close-btn" @click="close" title="关闭">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
        </div>

        <!-- 标签页 -->
        <div class="tabs">
          <button
            v-for="t in tabs"
            :key="t.key"
            :class="activeTab === t.key ? 'tab sel' : 'tab'"
            @click="activeTab = t.key"
          >
            <span class="tab-text">{{ t.label }}</span>
            <span class="tab-glow" v-if="activeTab === t.key"></span>
          </button>
        </div>

        <!-- === 机场信息 === -->
        <AirportInfoTab v-if="activeTab === 'info'" :airport="airport!" :runways="runways" />

        <!-- === 滑行信息 === -->
        <TaxiInfoTab v-if="activeTab === 'taxi'" :taxiways="taxiways" />

        <!-- === 跑道信息 === -->
        <RunwayInfoTab
          v-if="activeTab === 'runway'"
          :runways="runways"
          :takeoff-minima="takeoffMinima"
          :landing-minima="landingMinima"
        />
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  MOCK_AIRPORT, MOCK_RUNWAYS, MOCK_TAXIWAYS,
  MOCK_TAKEOFF_MINIMA, MOCK_LANDING_MINIMA,
} from '@/views/dashboard/mock/airportDetail'
import AirportInfoTab from './AirportInfoTab.vue'
import TaxiInfoTab from './TaxiInfoTab.vue'
import RunwayInfoTab from './RunwayInfoTab.vue'

const props = defineProps<{ visible: boolean; icao: string }>()
const emit = defineEmits<{ (e: 'close'): void }>()

const tabs = [
  { key: 'info' as const, label: '机场信息' },
  { key: 'taxi' as const, label: '滑行信息' },
  { key: 'runway' as const, label: '跑道信息' },
]
const activeTab = ref<'info' | 'taxi' | 'runway'>('info')

const airport = computed(() => {
  if (MOCK_AIRPORT[props.icao]) return MOCK_AIRPORT[props.icao]
  return {
    icao: props.icao, iata: '—', name: props.icao, nameEn: '—',
    lat: 0, lng: 0, elevation: '—', magneticVar: '—', timezone: 'UTC+8',
    opsHours: '—', fireCat: '—', fuelTypes: '—', dataSource: '暂无数据',
  }
})
const runways = computed(() => MOCK_RUNWAYS[props.icao] || [])
const taxiways = computed(() => MOCK_TAXIWAYS[props.icao] || [])
const takeoffMinima = computed(() => MOCK_TAKEOFF_MINIMA[props.icao] || [])
const landingMinima = computed(() => MOCK_LANDING_MINIMA[props.icao] || [])

const close = () => emit('close')
</script>

<style scoped>
/* ── Overlay ── */
.overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(2, 6, 16, 0.78);
  backdrop-filter: blur(20px) saturate(1.2);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  animation: overlayIn 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}
@keyframes overlayIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* ── Modal ── */
.modal {
  width: 960px;
  max-width: 96vw;
  max-height: 88vh;
  background:
    radial-gradient(ellipse 600px 400px at 20% 0%, rgba(0, 168, 255, 0.06), transparent 70%),
    radial-gradient(ellipse 500px 350px at 80% 100%, rgba(0, 212, 255, 0.04), transparent 70%),
    linear-gradient(180deg, #0a0f1e 0%, #070b14 100%);
  border: 1px solid rgba(0, 180, 240, 0.12);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow:
    0 50px 140px rgba(0, 0, 0, 0.75),
    0 0 0 1px rgba(0, 180, 240, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);
  animation: modalIn 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}
@keyframes modalIn {
  from { opacity: 0; transform: translateY(30px) scale(0.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

/* ── Header ── */
.head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 26px;
  background: rgba(0, 180, 240, 0.025);
  border-bottom: 1px solid rgba(0, 180, 240, 0.06);
  flex-shrink: 0;
  position: relative;
}
.head::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 26px;
  right: 26px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(0, 180, 240, 0.15), transparent);
}

.head-l {
  display: flex;
  align-items: center;
  gap: 16px;
}

.icao-badge {
  font-size: 24px;
  font-weight: 900;
  font-family: 'IBM Plex Mono', monospace;
  color: #00d4ff;
  letter-spacing: 0.06em;
  text-shadow: 0 0 20px rgba(0, 212, 255, 0.25);
  background: rgba(0, 212, 255, 0.06);
  border: 1px solid rgba(0, 212, 255, 0.12);
  padding: 6px 14px;
  border-radius: 10px;
}

.head-info {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.name-cn {
  font-size: 16px;
  font-weight: 700;
  color: #f1f5f9;
  letter-spacing: 0.01em;
}
.name-en {
  font-size: 10px;
  color: #5a6a82;
  letter-spacing: 0.04em;
  font-weight: 500;
}

.head-r {
  display: flex;
  align-items: center;
  gap: 12px;
}

.meta-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  color: #64748b;
  transition: all 0.2s;
}
.meta-pill:hover {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.08);
}
.meta-pill svg {
  color: #00b8e6;
  opacity: 0.7;
}

.close-btn {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(255, 255, 255, 0.02);
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s cubic-bezier(0.22, 1, 0.36, 1);
}
.close-btn:hover {
  background: rgba(239, 68, 68, 0.12);
  color: #ef4444;
  border-color: rgba(239, 68, 68, 0.2);
  transform: rotate(90deg);
}

/* ── Tabs ── */
.tabs {
  display: flex;
  padding: 0 26px;
  border-bottom: 1px solid rgba(0, 180, 240, 0.05);
  flex-shrink: 0;
  gap: 4px;
  position: relative;
}

.tab {
  position: relative;
  padding: 14px 24px;
  font-size: 12px;
  cursor: pointer;
  background: none;
  color: #475569;
  border: none;
  font-weight: 600;
  letter-spacing: 0.04em;
  transition: color 0.25s;
  overflow: hidden;
}
.tab:hover {
  color: #94a3b8;
}
.tab.sel {
  color: #00d4ff;
}

.tab-glow {
  position: absolute;
  bottom: 0;
  left: 20%;
  right: 20%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #00d4ff, transparent);
  border-radius: 2px;
  box-shadow: 0 -2px 12px rgba(0, 212, 255, 0.35);
  animation: glowPulse 2.5s ease-in-out infinite;
}
@keyframes glowPulse {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
}
</style>
