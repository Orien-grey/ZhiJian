<template>
  <div class="wrapper">
    <!-- 顶部装饰线 -->
    <div class="top-accent" />

    <!-- 面板标题 -->
    <div class="panel-header">
      <div class="header-left">
        <div class="header-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 12h20"/><path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6"/><path d="m22 12-5-5"/><path d="m22 12-5 5"/>
          </svg>
        </div>
        <span class="header-title">航班动态</span>
        <span class="header-count">{{ filteredFlights.length }} 架次</span>
      </div>
      <div class="header-live">
        <span class="live-dot" />
        <span class="live-text">实时</span>
      </div>
    </div>

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
const starVersion = ref(0)

const filteredFlights = computed(() => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  void starVersion.value // 标星触发重排
  let list = [...MOCK_FLIGHTS]
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
  // 标星置顶 + 按计划时间排序
  list.sort((a, b) => {
    if (a.star !== b.star) return a.star ? -1 : 1
    return a.scheduledTime.localeCompare(b.scheduledTime)
  })
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
  starVersion.value++
}

// 倒计时实时刷新
const now = ref(new Date())
setInterval(() => { now.value = new Date() }, 60000)
</script>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  color: #e2e8f0;
  background:
    radial-gradient(ellipse 80% 50% at 50% -10%, rgba(0, 212, 255, 0.06) 0%, transparent 60%),
    radial-gradient(ellipse 60% 40% at 80% 100%, rgba(139, 92, 246, 0.04) 0%, transparent 50%),
    linear-gradient(180deg, #0a0f1c 0%, #0d1321 40%, #0a0f1c 100%);
  position: relative;
}

/* 顶部发光装饰线 */
.top-accent {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg,
    transparent 0%,
    rgba(0, 212, 255, 0.4) 20%,
    rgba(0, 212, 255, 0.8) 50%,
    rgba(0, 212, 255, 0.4) 80%,
    transparent 100%
  );
  box-shadow: 0 0 20px rgba(0, 212, 255, 0.15);
  z-index: 10;
}

/* 面板标题 */
.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px 12px;
  flex-shrink: 0;
  position: relative;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-icon {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.15) 0%, rgba(0, 212, 255, 0.05) 100%);
  border: 1px solid rgba(0, 212, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #00d4ff;
  box-shadow: 0 0 16px rgba(0, 212, 255, 0.1);
}

.header-title {
  font-size: 15px;
  font-weight: 700;
  color: #f1f5f9;
  letter-spacing: 0.02em;
  font-family: 'Noto Sans SC', 'PingFang SC', sans-serif;
}

.header-count {
  font-size: 11px;
  font-weight: 500;
  color: #64748b;
  padding: 2px 8px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  font-family: 'IBM Plex Mono', monospace;
}

.header-live {
  display: flex;
  align-items: center;
  gap: 6px;
}

.live-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 8px rgba(16, 185, 129, 0.6);
  animation: live-pulse 2s ease-in-out infinite;
}

@keyframes live-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.3); }
}

.live-text {
  font-size: 10px;
  font-weight: 600;
  color: #10b981;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-family: 'IBM Plex Mono', monospace;
}
</style>
