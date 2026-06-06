<template>
  <div class="panel">
    <!-- ===== 第一层：标题栏 ===== -->
    <div class="title-bar">
      <span class="title-text">机场限制信息</span>
      <div class="title-actions">
        <button class="title-btn" @click="$emit('toggle-expand')" :title="expanded ? '收起' : '展开'">
          <span>{{ expanded ? '◀' : '▶' }}</span>
          <span class="title-btn-label">{{ expanded ? '收起' : '展开' }}</span>
        </button>
      </div>
    </div>

    <!-- ===== 第二层：告警时间轴 ===== -->
    <RestrictionTimeline
      :alerts="filteredTimeline"
      :new-alert-ids="newAlertIds"
      @click="handleTimelineClick"
    />

    <!-- ===== 第三层：双筛选器 ===== -->
    <RestrictionFilters
      v-model:search-text="searchText"
      v-model:selected-airport="selectedAirport"
      v-model:selected-type="selectedType"
      :all-airports="allAirports"
    />

    <!-- ===== 第四层：限制时间表格 ===== -->
    <RestrictionTable
      :restrictions="filteredRestrictions"
      :display-hours="displayHours"
      :active-airport="activeAirport"
      :scroll-to-icao="scrollToIcao"
      @update:active-airport="activeAirport = $event"
      @bar-click="(icao, notamRef) => $emit('bar-click', icao, notamRef)"
    />

    <!-- ===== 第五层：地图内容筛选 ===== -->
    <MapLayerCheckboxes
      :selections="mapSelections"
      @toggle="toggleFilter"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
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
  '禁航通告': true, '限制区': true, '航路点 / 导航台': true, '航路': true, '运行机场': true,
})

const toggleFilter = (opt: string) => {
  const newVal = !mapSelections[opt]
  mapSelections[opt] = newVal
  emit('filter-change', opt, newVal)
}

// ---- 新告警标记（滑入动画） ----
const newAlertIds = ref<Set<string>>(new Set())
let newAlertTimer: ReturnType<typeof setInterval> | null = null
const EXTRA_ALERTS = [
  { time:'01:30', icao:'ZLLL', severity:'info' as const, summary:'例行检查' },
  { time:'02:15', icao:'ZBTJ', severity:'warning' as const, summary:'除冰作业' },
  { time:'03:00', icao:'ZBAA', severity:'critical' as const, summary:'紧急维护' },
  { time:'03:45', icao:'ZSSS', severity:'info' as const, summary:'灯光测试' },
  { time:'04:20', icao:'ZGGG', severity:'warning' as const, summary:'雷达维护' },
  { time:'05:10', icao:'ZUCK', severity:'info' as const, summary:'跑道检查' },
]

onMounted(() => {
  newAlertTimer = setInterval(() => {
    const tpl = EXTRA_ALERTS[Math.floor(Math.random() * EXTRA_ALERTS.length)]
    const id = `new-${Date.now()}`
    const alert: TimelineAlert = {
      id, time: tpl.time, icao: tpl.icao, severity: tpl.severity, summary: tpl.summary,
    }
    MOCK_TIMELINE.unshift(alert)
    if (MOCK_TIMELINE.length > 50) MOCK_TIMELINE.pop()
    newAlertIds.value = new Set([...newAlertIds.value, id])
    // 触发响应式更新
    const prev = searchText.value
    searchText.value = prev + ' '
    searchText.value = prev
    setTimeout(() => {
      const updated = new Set(newAlertIds.value)
      updated.delete(id)
      newAlertIds.value = updated
    }, 3000)
  }, 10000)
})

onUnmounted(() => {
  if (newAlertTimer) clearInterval(newAlertTimer)
})
</script>

<style scoped>
.panel {
  display: flex; flex-direction: column; height: 100%; overflow: hidden;
  background: #0a0f1e; color: #e2e8f0;
}

.title-bar {
  display: flex; align-items: center; justify-content: space-between;
  height: 40px; padding: 0 14px; flex-shrink: 0;
  background: #0a192f; border-bottom: 1px solid rgba(0,212,255,0.12);
}
.title-text { font-size: 13px; font-weight: 700; letter-spacing: 0.05em; color: #f1f5f9; }
.title-actions { display: flex; gap: 6px; }
.title-btn {
  display: flex; align-items: center; gap: 4px; padding: 3px 8px;
  border-radius: 4px; border: 1px solid rgba(0,212,255,0.12); background: rgba(0,212,255,0.04);
  color: #00d4ff; font-size: 10px; cursor: pointer; transition: all 0.2s;
}
.title-btn:hover { background: rgba(0,212,255,0.1); border-color: rgba(0,212,255,0.25); }
.title-btn-label { font-size: 10px; }
</style>
