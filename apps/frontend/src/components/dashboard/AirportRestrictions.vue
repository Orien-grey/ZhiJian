<template>
  <div class="panel">
    <!-- ===== 标题栏 ===== -->
    <div class="title-bar">
      <div class="title-left">
        <div class="title-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 12h20"/><path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6"/>
            <path d="m12 2 4 4H8l4-4z"/><path d="M6 12V8h12v4"/>
          </svg>
        </div>
        <span class="title-text">机场限制信息</span>
        <span class="title-badge">LIVE</span>
      </div>
      <div class="title-actions">
        <button class="title-btn" @click="$emit('toggle-expand')" :title="expanded ? '收起' : '展开'">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path v-if="expanded" d="m15 18-6-6 6-6"/>
            <path v-else d="m9 18 6-6-6-6"/>
          </svg>
          <span class="title-btn-label">{{ expanded ? '收起' : '展开' }}</span>
        </button>
      </div>
    </div>

    <!-- ===== 告警时间轴 ===== -->
    <RestrictionTimeline
      :alerts="filteredTimeline"
      :new-alert-ids="newAlertIds"
      @click="handleTimelineClick"
    />

    <!-- ===== 双筛选器 ===== -->
    <RestrictionFilters
      v-model:search-text="searchText"
      v-model:selected-airport="selectedAirport"
      v-model:selected-type="selectedType"
      :all-airports="allAirports"
    />

    <!-- ===== 限制时间表格 ===== -->
    <RestrictionTable
      :restrictions="filteredRestrictions"
      :display-hours="displayHours"
      :active-airport="activeAirport"
      :scroll-to-icao="scrollToIcao"
      @update:active-airport="activeAirport = $event"
      @bar-click="(icao, notamRef) => $emit('bar-click', icao, notamRef)"
    />

    <!-- ===== 地图内容筛选 ===== -->
    <MapLayerCheckboxes
      :selections="mapSelections"
      @toggle="toggleFilter"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import {
  MOCK_TIMELINE, MOCK_AIRPORT_RESTRICTIONS,
  TIME_RANGE, type RestrictionType, type TimelineAlert,
} from '@/views/dashboard/mock/airportRestrictions'
import RestrictionTimeline from './RestrictionTimeline.vue'
import RestrictionFilters from './RestrictionFilters.vue'
import RestrictionTable from './RestrictionTable.vue'
import MapLayerCheckboxes from './MapLayerCheckboxes.vue'

const props = defineProps<{ expanded: boolean }>()
const emit = defineEmits<{
  (e: 'toggle-expand'): void
  (e: 'bar-click', airport: string, notamRef: string): void
  (e: 'filter-change', key: string, val: boolean): void
}>()

const searchText = ref('')
const selectedAirport = ref('')
const selectedType = ref('')
const activeAirport = ref('')
const scrollToIcao = ref('')

// 时间列数：展开显示更多
const displayHours = computed(() => {
  const cols: number[] = []
  const end = props.expanded ? TIME_RANGE.end + 6 : TIME_RANGE.end
  for (let h = TIME_RANGE.start; h < end; h += 0.5) cols.push(h)
  return cols
})

// ---- 筛选逻辑 ----
const filteredTimeline = computed(() => {
  void timelineTick.value // 依赖注入，定时器触发后重新计算
  let list = MOCK_TIMELINE
  if (searchText.value) list = list.filter(a => a.icao.toLowerCase().includes(searchText.value.toLowerCase()))
  if (selectedAirport.value) list = list.filter(a => a.icao === selectedAirport.value)
  return list
})

const allAirports = computed(() => MOCK_AIRPORT_RESTRICTIONS.map(r => ({ icao: r.icao, name: r.airportName })))

const filteredRestrictions = computed(() => {
  let list = MOCK_AIRPORT_RESTRICTIONS
  if (searchText.value) list = list.filter(r => r.icao.toLowerCase().includes(searchText.value.toLowerCase()))
  if (selectedAirport.value) list = list.filter(r => r.icao === selectedAirport.value)
  if (selectedType.value) {
    const type = selectedType.value as RestrictionType
    list = list.filter(r => r.restrictions.some(b => b.type === type))
  }
  return list
})

const handleTimelineClick = (alert: TimelineAlert) => {
  selectedAirport.value = alert.icao
  searchText.value = ''
  activeAirport.value = alert.icao
  scrollToIcao.value = alert.icao + '_' + Date.now()
}

// ---- 地图筛选 ----
const mapSelections = reactive<Record<string, boolean>>({
  '禁航通告': true, '限制区': true, '航路点': true, '航路': true, '运行机场': true,
})

const toggleFilter = (opt: string) => {
  const newVal = !mapSelections[opt]
  mapSelections[opt] = newVal
  emit('filter-change', opt, newVal)
}

// 新告警标记（静态，定时器已移除）
const newAlertIds = ref<Set<string>>(new Set())
const timelineTick = ref(0)
</script>

<style scoped>
.panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  background: linear-gradient(180deg, #0c1220 0%, #0a0e1a 100%);
  color: #c8d4e8;
  position: relative;
}

.panel::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(ellipse 80% 50% at 50% -20%, rgba(0, 212, 255, 0.06) 0%, transparent 70%),
    radial-gradient(ellipse 60% 40% at 80% 100%, rgba(99, 102, 241, 0.04) 0%, transparent 60%);
  z-index: 0;
}

/* ===== 标题栏 ===== */
.title-bar {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 44px;
  padding: 0 16px;
  flex-shrink: 0;
  background: linear-gradient(90deg, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.8) 100%);
  border-bottom: 1px solid rgba(0, 212, 255, 0.08);
  backdrop-filter: blur(12px);
}

.title-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.title-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 7px;
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.15) 0%, rgba(99, 102, 241, 0.1) 100%);
  border: 1px solid rgba(0, 212, 255, 0.12);
  color: #00d4ff;
  box-shadow: 0 0 12px rgba(0, 212, 255, 0.08);
}

.title-text {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: #f0f4f8;
  text-shadow: 0 0 20px rgba(0, 212, 255, 0.15);
}

.title-badge {
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 0.12em;
  color: #10b981;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.2);
  padding: 1px 5px;
  border-radius: 3px;
  animation: pulse-badge 2s ease-in-out infinite;
}

@keyframes pulse-badge {
  0%, 100% { opacity: 1; box-shadow: 0 0 4px rgba(16, 185, 129, 0.2); }
  50% { opacity: 0.7; box-shadow: 0 0 8px rgba(16, 185, 129, 0.4); }
}

.title-actions {
  display: flex;
  gap: 6px;
}

.title-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  border-radius: 6px;
  border: 1px solid rgba(0, 212, 255, 0.1);
  background: rgba(0, 212, 255, 0.04);
  color: #7dd3fc;
  font-size: 10px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.title-btn:hover {
  background: rgba(0, 212, 255, 0.1);
  border-color: rgba(0, 212, 255, 0.25);
  box-shadow: 0 0 16px rgba(0, 212, 255, 0.1);
  transform: translateY(-1px);
}

.title-btn-label {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.04em;
}
</style>
