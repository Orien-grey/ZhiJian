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
            <span class="coord">N43°54′26″ E87°28′27″</span>
            <span class="elev">ELEV 648m (2126ft)</span>
            <button class="close-btn" @click="close">✕</button>
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
            {{ t.label }}
          </button>
        </div>

        <!-- === 机场信息 === -->
        <AirportInfoTab v-if="activeTab === 'info'" :airport="airport!" :runways="runways" />

        <!-- === 滑行信息 === -->
        <TaxiInfoTab v-if="activeTab === 'taxi'" :taxiways="taxiways" />

        <!-- === 跑道信息 === -->
        <RunwayInfoTab
          v-if="activeTab === 'runway'"
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
.overlay { position:fixed; inset:0; z-index:1000; background:rgba(0,0,0,0.7); backdrop-filter:blur(6px); display:flex; align-items:center; justify-content:center; padding:20px; }
.modal { width:920px; max-width:96vw; max-height:88vh; background:#0b1221; border:1px solid rgba(0,180,240,0.12); border-radius:14px; display:flex; flex-direction:column; overflow:hidden; box-shadow:0 30px 100px rgba(0,0,0,0.7); }

/* 头部 */
.head { display:flex; justify-content:space-between; align-items:center; padding:15px 22px; background:rgba(0,180,240,0.04); border-bottom:1px solid rgba(0,180,240,0.07); flex-shrink:0; }
.head-l { display:flex; align-items:center; gap:14px; }
.icao-badge { font-size:22px; font-weight:900; font-family:'IBM Plex Mono',monospace; color:#00b8e6; letter-spacing:0.04em; }
.head-info { display:flex; flex-direction:column; }
.name-cn { font-size:15px; font-weight:700; color:#e2e8f0; }
.name-en { font-size:10px; color:#64748b; letter-spacing:0.03em; }
.head-r { display:flex; align-items:center; gap:16px; }
.coord { font-size:10px; color:#64748b; font-family:'IBM Plex Mono',monospace; }
.elev { font-size:10px; color:#94a3b8; font-family:'IBM Plex Mono',monospace; }
.close-btn { width:30px; height:30px; border-radius:6px; border:1px solid rgba(255,255,255,0.06); background:none; color:#64748b; cursor:pointer; font-size:14px; }
.close-btn:hover { background:rgba(255,255,255,0.05); color:#fff; }

/* 标签页 */
.tabs { display:flex; padding:0 22px; border-bottom:1px solid rgba(0,180,240,0.06); flex-shrink:0; }
.tab { padding:10px 22px; font-size:12px; cursor:pointer; background:none; color:#475569; border:none; border-bottom:2px solid transparent; font-weight:500; transition:all 0.2s; }
.tab:hover { color:#94a3b8; }
.tab.sel { color:#00b8e6; border-bottom-color:#00b8e6; }
</style>
