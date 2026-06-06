<template>
  <div class="wrapper">
    <!-- 搜索筛选 -->
    <FlightFilters
      v-model:search-text="searchText"
      v-model:status-filter="statusFilter"
      v-model:spot-check="spotCheck"
      v-model:active-type="activeType"
      @reset="resetFilters"
    />

    <!-- 航班列表 -->
    <FlightList
      :flights="filteredFlights"
      @toggle-star="toggleStar"
      @select="$emit('flight-click', $event.flightNo)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { MOCK_FLIGHTS, type FlightItem } from '@/views/dashboard/mock/flightData'
import FlightFilters from './FlightFilters.vue'
import FlightList from './FlightList.vue'

const emit = defineEmits<{ (e: 'flight-click', flightNo: string): void }>()

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
    list = list.filter(f =>
      f.flightNo.toLowerCase().includes(q) ||
      f.depIcao.toLowerCase().includes(q) ||
      f.arrIcao.toLowerCase().includes(q) ||
      f.depName.includes(searchText.value) ||
      f.arrName.includes(searchText.value)
    )
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

const toggleStar = (f: FlightItem) => {
  f.star = !f.star
}

// 倒计时实时刷新
const now = ref(new Date())
setInterval(() => { now.value = new Date() }, 60000)
</script>

<style scoped>
.wrapper { display: flex; flex-direction: column; height: 100%; overflow: hidden; color: #e2e8f0; }
</style>
