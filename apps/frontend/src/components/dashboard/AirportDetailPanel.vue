<template>
  <div class="overlay">
    <!-- 头部 -->
    <div class="head">
      <div class="head-l">
        <span class="icao mono">{{ airport?.icao }}</span>
        <div class="head-titles">
          <span class="name-cn">{{ airport?.name }}</span>
          <span class="name-en">{{ airport?.nameEn }}</span>
        </div>
      </div>
      <div class="head-r">
        <span class="coord mono">N{{ airport?.lat?.toFixed(2) }}° E{{ airport?.lng?.toFixed(2) }}°</span>
        <span class="elev mono">ELEV {{ airport?.elevation }}</span>
        <button class="close-btn" @click="$emit('close')" title="关闭">✕</button>
      </div>
    </div>

    <!-- 标签页 -->
    <div class="tabs">
      <button v-for="t in tabs" :key="t.key" :class="activeTab===t.key ? 'tab sel' : 'tab'" @click="activeTab=t.key">
        {{ t.label }}
      </button>
    </div>

    <!-- 内容 -->
    <div class="body">
      <AirportInfoTab v-if="activeTab==='info'" :airport="airport!" :runways="runways" />
      <TaxiInfoTab v-if="activeTab==='taxi'" :taxiways="taxiways" />
      <RunwayInfoTab v-if="activeTab==='runway'" :runways="runways" :takeoff-minima="takeoffMinima" :landing-minima="landingMinima" />
      <AirportNotamTab v-if="activeTab==='notam'" :icao="icao" />
      <AirportFacilitiesTab v-if="activeTab==='facilities'" :icao="icao" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { MOCK_AIRPORT, MOCK_RUNWAYS, MOCK_TAXIWAYS, MOCK_TAKEOFF_MINIMA, MOCK_LANDING_MINIMA } from '@/views/dashboard/mock/airportDetail'
import AirportInfoTab from './AirportInfoTab.vue'
import TaxiInfoTab from './TaxiInfoTab.vue'
import RunwayInfoTab from './RunwayInfoTab.vue'
import AirportNotamTab from './AirportNotamTab.vue'
import AirportFacilitiesTab from './AirportFacilitiesTab.vue'

const props = defineProps<{ icao: string }>()
defineEmits<{ (e: 'close'): void }>()

const tabs = [
  { key: 'info' as const, label: '机场信息' },
  { key: 'taxi' as const, label: '滑行信息' },
  { key: 'runway' as const, label: '跑道信息' },
  { key: 'notam' as const, label: 'NOTAM 记录' },
  { key: 'facilities' as const, label: '设施气象' },
]
const activeTab = ref<'info'|'taxi'|'runway'|'notam'|'facilities'>('info')

const airport = computed(() => {
  if (MOCK_AIRPORT[props.icao]) return MOCK_AIRPORT[props.icao]
  return { icao: props.icao, iata: '—', name: props.icao, nameEn: '—', lat: 0, lng: 0, elevation: '—', magneticVar: '—', timezone: 'UTC+8', opsHours: '—', fireCat: '—', fuelTypes: '—', dataSource: '暂无数据' }
})
const runways = computed(() => MOCK_RUNWAYS[props.icao] || [])
const taxiways = computed(() => MOCK_TAXIWAYS[props.icao] || [])
const takeoffMinima = computed(() => MOCK_TAKEOFF_MINIMA[props.icao] || [])
const landingMinima = computed(() => MOCK_LANDING_MINIMA[props.icao] || [])
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

.head { display:flex; justify-content:space-between; align-items:center; padding:16px 22px; background:rgba(0,180,240,0.03); border-bottom:1px solid rgba(0,180,240,0.08); flex-shrink:0; }
.head-l { display:flex; align-items:center; gap:14px; }
.icao { font-size:20px; font-weight:900; color:#00b8e6; letter-spacing:0.04em; }
.head-titles { display:flex; flex-direction:column; }
.name-cn { font-size:14px; font-weight:700; color:#e2e8f0; }
.name-en { font-size:10px; color:#64748b; }
.mono { font-family:'IBM Plex Mono',monospace; }
.head-r { display:flex; align-items:center; gap:14px; }
.coord, .elev { font-size:10px; color:#475569; }
.close-btn { width:30px; height:30px; border-radius:6px; border:1px solid rgba(255,255,255,0.07); background:rgba(255,255,255,0.03); color:#64748b; cursor:pointer; font-size:14px; transition:all 0.15s; }
.close-btn:hover { background:rgba(239,68,68,0.1); color:#ef4444; border-color:rgba(239,68,68,0.2); }

.tabs { display:flex; padding:0 22px; border-bottom:1px solid rgba(0,180,240,0.04); flex-shrink:0; }
.tab { padding:10px 22px; font-size:11px; cursor:pointer; background:none; color:#475569; border:none; border-bottom:2px solid transparent; font-weight:500; transition:all 0.15s; }
.tab:hover { color:#94a3b8; }
.tab.sel { color:#00b8e6; border-bottom-color:#00b8e6; }

.body { flex:1; overflow-y:auto; scrollbar-width:thin; scrollbar-color:rgba(0,180,240,0.08) transparent; }
.body::-webkit-scrollbar { width:3px; }
.body::-webkit-scrollbar-thumb { background:rgba(0,180,240,0.08); border-radius:3px; }
</style>
