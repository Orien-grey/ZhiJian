<template>
  <div class="wrapper">
    <!-- 搜索筛选 -->
    <div class="section">
      <div class="filter-row">
        <input v-model="searchText" class="input" type="text" placeholder="搜索航班/机号/机场..." />
        <select v-model="statusFilter" class="select">
          <option value="">全部状态</option>
          <option v-for="(v, k) in FLIGHT_STATUS_MAP" :key="k" :value="k">{{ v.label }}</option>
        </select>
      </div>
      <div class="filter-row">
        <input v-model="spotCheck" class="input" type="text" placeholder="点检查..." />
        <button class="btn" @click="resetFilters">重置</button>
      </div>
      <div class="tab-row">
        <button :class="activeType === 'all' ? 'tab-active' : 'tab'" @click="activeType = 'all'">全部航班</button>
        <button :class="activeType === 'affected' ? 'tab-active' : 'tab'" @click="activeType = 'affected'">影响航班</button>
      </div>
    </div>

    <!-- 航班列表 -->
    <div class="flight-list">
      <div
        v-for="f in filteredFlights"
        :key="f.id"
        class="flight-item"
        :class="{ affected: f.isAffected }"
        @click="selectedFlight = f"
      >
        <div class="flight-top">
          <span class="star">{{ f.star ? '★' : '☆' }}</span>
          <span class="flight-no">{{ f.flightNo }}</span>
          <span class="sch-time">{{ f.scheduledTime }}</span>
          <span v-if="f.isCompanyRoute" class="tag-company">公司航线</span>
        </div>
        <div class="flight-route">
          <span class="dep">{{ f.depName }}</span>
          <span class="arrow">→</span>
          <span class="arr">{{ f.arrName }}</span>
        </div>
        <div class="flight-bottom">
          <span class="est-label">预计</span>
          <span class="est-time">{{ f.estimatedTime }}</span>
          <span class="status-tag" :style="{ color: FLIGHT_STATUS_MAP[f.status].color, background: FLIGHT_STATUS_MAP[f.status].color + '15', border: '1px solid ' + FLIGHT_STATUS_MAP[f.status].color + '25' }">
            {{ f.statusLabel }}
          </span>
          <span class="countdown">{{ f.countdown }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { MOCK_FLIGHTS, FLIGHT_STATUS_MAP, type FlightItem } from '@/views/dashboard/mock/flightData'

const searchText = ref('')
const statusFilter = ref('')
const spotCheck = ref('')
const activeType = ref<'all' | 'affected'>('all')
const selectedFlight = ref<FlightItem | null>(null)

const filteredFlights = computed(() => {
  let list = MOCK_FLIGHTS
  if (activeType.value === 'affected') list = list.filter(f => f.isAffected)
  if (searchText.value) {
    const q = searchText.value.toLowerCase()
    list = list.filter(f => f.flightNo.toLowerCase().includes(q) || f.depIcao.toLowerCase().includes(q) || f.arrIcao.toLowerCase().includes(q) || f.depName.includes(searchText.value) || f.arrName.includes(searchText.value))
  }
  if (statusFilter.value) list = list.filter(f => f.status === statusFilter.value)
  if (spotCheck.value) {
    const q = spotCheck.value.toLowerCase()
    list = list.filter(f => f.flightNo.toLowerCase().includes(q) || f.registration.toLowerCase().includes(q))
  }
  return list
})

const resetFilters = () => {
  searchText.value = ''
  statusFilter.value = ''
  spotCheck.value = ''
  activeType.value = 'all'
}
</script>

<style scoped>
.wrapper { display: flex; flex-direction: column; height: 100%; overflow: hidden; color: #e2e8f0; }
.section { padding: 12px 14px; border-bottom: 1px solid rgba(0,212,255,0.06); flex-shrink: 0; }
.filter-row { display: flex; gap: 6px; margin-bottom: 6px; }
.input { flex: 1; padding: 5px 8px; border-radius: 5px; font-size: 10px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); color: #e2e8f0; outline: none; }
.input:focus { border-color: rgba(0,212,255,0.25); }
.input::placeholder { color: #475569; }
.select { width: 90px; padding: 5px 6px; border-radius: 5px; font-size: 10px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); color: #e2e8f0; outline: none; cursor: pointer; }
.select option { background: #0f172a; color: #e2e8f0; }
.btn { padding: 5px 10px; border-radius: 5px; font-size: 10px; cursor: pointer; background: rgba(255,255,255,0.03); color: #94a3b8; border: 1px solid rgba(255,255,255,0.06); }
.btn:hover { color: #00d4ff; border-color: rgba(0,212,255,0.2); }
.tab-row { display: flex; }
.tab { flex: 1; padding: 6px; font-size: 11px; cursor: pointer; background: none; color: #94a3b8; border: 1px solid rgba(255,255,255,0.04); text-align: center; }
.tab:first-child { border-radius: 4px 0 0 4px; }
.tab:last-child { border-radius: 0 4px 4px 0; }
.tab:hover { color: #00d4ff; }
.tab-active { flex: 1; padding: 6px; font-size: 11px; cursor: pointer; background: rgba(0,212,255,0.1); color: #00d4ff; font-weight: 600; border: 1px solid rgba(0,212,255,0.2); text-align: center; }
.tab-active:first-child { border-radius: 4px 0 0 4px; }
.tab-active:last-child { border-radius: 0 4px 4px 0; }

/* 航班列表 */
.flight-list { flex: 1; overflow-y: auto; scrollbar-width: thin; scrollbar-color: rgba(0,212,255,0.1) transparent; }
.flight-list::-webkit-scrollbar { width: 3px; }
.flight-list::-webkit-scrollbar-thumb { background: rgba(0,212,255,0.1); border-radius: 2px; }
.flight-item { padding: 10px 14px; border-bottom: 1px solid rgba(0,212,255,0.03); cursor: pointer; transition: background 0.15s; }
.flight-item:hover { background: rgba(0,212,255,0.03); }
.flight-item.affected { background: rgba(245,158,11,0.06); }
.flight-item.affected:hover { background: rgba(245,158,11,0.1); }
.flight-top { display: flex; align-items: center; gap: 6px; margin-bottom: 4px; }
.star { font-size: 10px; color: #f59e0b; }
.flight-no { font-size: 12px; font-weight: 700; font-family: 'IBM Plex Mono', monospace; color: #e2e8f0; }
.sch-time { font-size: 10px; color: #64748b; font-family: 'IBM Plex Mono', monospace; margin-left: auto; }
.tag-company { font-size: 8px; font-weight: 700; color: #ef4444; padding: 1px 4px; border-radius: 2px; border: 1px solid rgba(239,68,68,0.3); background: rgba(239,68,68,0.08); }
.flight-route { display: flex; align-items: center; gap: 4px; font-size: 10px; color: #94a3b8; margin-bottom: 4px; }
.arrow { color: #475569; margin: 0 2px; }
.flight-bottom { display: flex; align-items: center; gap: 6px; }
.est-label { font-size: 9px; color: #475569; }
.est-time { font-size: 10px; color: #94a3b8; font-family: 'IBM Plex Mono', monospace; }
.status-tag { font-size: 9px; font-weight: 600; padding: 1px 5px; border-radius: 3px; }
.countdown { font-size: 10px; font-family: 'IBM Plex Mono', monospace; color: #64748b; margin-left: auto; }
</style>
