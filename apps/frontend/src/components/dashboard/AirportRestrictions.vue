<template>
  <div class="wrapper">
    <!-- ===== 告警时间轴 ===== -->
    <div class="section">
      <p class="section-title">告警时间轴</p>
      <div class="timeline-scroll">
        <div class="timeline-track">
          <div
            v-for="alert in filteredTimeline"
            :key="alert.id"
            class="timeline-item"
            @click="handleTimelineClick(alert)"
          >
            <span class="timeline-time">{{ alert.time }}</span>
            <span class="timeline-icao" :class="`severity-${alert.severity}`">{{ alert.icao }}</span>
            <span v-if="alert.severity === 'critical'" class="tag-alert">告</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== 多维度筛选 ===== -->
    <div class="section">
      <p class="section-title">筛选条件</p>
      <div class="filter-grid">
        <input v-model="searchText" class="input" type="text" placeholder="四字码模糊搜索..." />
        <select v-model="selectedAirport" class="select">
          <option value="">全部机场</option>
          <option v-for="a in allAirports" :key="a.icao" :value="a.icao">{{ a.icao }} {{ a.name }}</option>
        </select>
        <select v-model="selectedType" class="select">
          <option value="">全部限制类型</option>
          <option v-for="(label, key) in RESTRICTION_LABELS" :key="key" :value="key">{{ label }}</option>
        </select>
      </div>
    </div>

    <!-- ===== 机场限制时间表格 ===== -->
    <div class="section table-section">
      <p class="section-title">机场限制时间</p>
      <div class="table-header">
        <div class="th-icao">ICAO</div>
        <div class="th-hours">
          <div v-for="h in hourColumns" :key="h" class="th-hour">{{ formatHour(h) }}</div>
        </div>
      </div>
      <div class="table-body">
        <div v-for="row in filteredRestrictions" :key="row.icao" class="table-row">
          <div class="td-icao"><span class="icao-code">{{ row.icao }}</span></div>
          <div class="td-hours">
            <div v-for="h in hourColumns" :key="h" class="td-slot" />
            <div
              v-for="bar in row.restrictions"
              :key="bar.id"
              class="restriction-bar"
              :style="barStyle(bar)"
              :title="`${bar.label} · ${bar.notamRef}`"
            >
              <span class="bar-label">{{ bar.label }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== 地图显示筛选 ===== -->
    <div class="section">
      <p class="section-title">地图显示内容</p>
      <div class="checkbox-group">
        <label v-for="opt in mapFilters" :key="opt" class="checkbox-label">
          <input type="checkbox" :checked="mapSelections[opt]" @change="mapSelections[opt] = !mapSelections[opt]" />
          <span>{{ opt }}</span>
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import {
  MOCK_TIMELINE,
  MOCK_AIRPORT_RESTRICTIONS,
  RESTRICTION_LABELS,
  RESTRICTION_COLORS,
  TIME_RANGE,
  type RestrictionType,
  type TimelineAlert,
} from '@/views/dashboard/mock/airportRestrictions'

const searchText = ref('')
const selectedAirport = ref('')
const selectedType = ref('')

const mapFilters = ['禁航通告', '航路点 / 导航台', '航路', '运行机场', '所有机场']
const mapSelections = reactive<Record<string, boolean>>({
  '禁航通告': true, '航路点 / 导航台': true, '航路': true, '运行机场': true, '所有机场': false,
})

// 告警时间轴筛选
const filteredTimeline = computed(() => {
  let list = MOCK_TIMELINE
  if (searchText.value) list = list.filter(a => a.icao.toLowerCase().includes(searchText.value.toLowerCase()))
  if (selectedAirport.value) list = list.filter(a => a.icao === selectedAirport.value)
  return list
})

const handleTimelineClick = (alert: TimelineAlert) => {
  selectedAirport.value = alert.icao
  searchText.value = ''
}

const allAirports = computed(() => MOCK_AIRPORT_RESTRICTIONS.map(r => ({ icao: r.icao, name: r.airportName })))

// 限制表格筛选
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

const hourColumns = computed(() => {
  const cols: number[] = []
  for (let h = TIME_RANGE.start; h < TIME_RANGE.end; h += 0.5) cols.push(h)
  return cols
})

const formatHour = (h: number) => {
  const hour = Math.floor(h)
  return `${hour.toString().padStart(2, '0')}:${h % 1 === 0 ? '00' : '30'}`
}

const barStyle = (bar: { type: RestrictionType; startHour: number; endHour: number }) => {
  const total = hourColumns.value.length
  const left = `${((bar.startHour - TIME_RANGE.start) / 0.5 / total) * 100}%`
  const width = `${((bar.endHour - bar.startHour) / 0.5 / total) * 100}%`
  return { left, width, background: RESTRICTION_COLORS[bar.type] }
}
</script>

<style scoped>
.wrapper { display: flex; flex-direction: column; height: 100%; overflow: hidden; color: #e2e8f0; }
.section { padding: 12px 16px; border-bottom: 1px solid rgba(0,212,255,0.05); flex-shrink: 0; }
.table-section { flex: 1; min-height: 0; display: flex; flex-direction: column; overflow: hidden; }
.section-title { font-size: 11px; font-weight: 600; color: #94a3b8; margin: 0 0 10px; letter-spacing: 0.06em; text-transform: uppercase; }

/* 告警时间轴 */
.timeline-scroll { overflow-x: auto; scrollbar-width: thin; scrollbar-color: rgba(0,212,255,0.12) transparent; }
.timeline-scroll::-webkit-scrollbar { height: 2px; }
.timeline-scroll::-webkit-scrollbar-thumb { background: rgba(0,212,255,0.12); border-radius: 2px; }
.timeline-track { display: flex; gap: 12px; min-width: max-content; padding: 2px 0; }
.timeline-item { display: flex; align-items: center; gap: 4px; cursor: pointer; flex-shrink: 0; padding: 2px 4px; border-radius: 4px; transition: background 0.15s; }
.timeline-item:hover { background: rgba(0,212,255,0.06); }
.timeline-time { font-size: 10px; color: #64748b; font-family: 'IBM Plex Mono', monospace; }
.timeline-icao { font-size: 10px; font-weight: 700; font-family: 'IBM Plex Mono', monospace; }
.severity-critical { color: #ef4444; }
.severity-warning { color: #f59e0b; }
.severity-info { color: #00d4ff; }
.tag-alert { font-size: 8px; font-weight: 800; color: #fff; background: #dc2626; padding: 0 2px; border-radius: 2px; line-height: 1.4; }

/* 筛选 */
.filter-grid { display: flex; flex-direction: column; gap: 6px; }
.input, .select { width: 100%; padding: 6px 10px; border-radius: 6px; font-size: 11px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); color: #e2e8f0; outline: none; }
.input:focus, .select:focus { border-color: rgba(0,212,255,0.3); }
.input::placeholder { color: #475569; }
.select { cursor: pointer; }
.select option { background: #0f172a; color: #e2e8f0; }

/* 表格 */
.table-header { display: flex; align-items: stretch; flex-shrink: 0; border-bottom: 1px solid rgba(0,212,255,0.06); margin-bottom: 2px; }
.th-icao { width: 52px; flex-shrink: 0; font-size: 9px; color: #64748b; padding: 4px 0; text-align: center; border-right: 1px solid rgba(0,212,255,0.04); }
.th-hours { flex: 1; display: flex; }
.th-hour { flex: 1; text-align: center; font-size: 9px; color: #64748b; padding: 4px 0; font-family: 'IBM Plex Mono', monospace; border-right: 1px solid rgba(0,212,255,0.03); }
.table-body { flex: 1; overflow-y: auto; min-height: 0; scrollbar-width: thin; scrollbar-color: rgba(0,212,255,0.1) transparent; }
.table-body::-webkit-scrollbar { width: 3px; }
.table-body::-webkit-scrollbar-thumb { background: rgba(0,212,255,0.1); border-radius: 2px; }
.table-row { display: flex; align-items: stretch; border-bottom: 1px solid rgba(0,212,255,0.02); min-height: 32px; }
.table-row:hover { background: rgba(0,212,255,0.02); }
.td-icao { width: 52px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; border-right: 1px solid rgba(0,212,255,0.04); }
.icao-code { font-size: 10px; font-weight: 700; font-family: 'IBM Plex Mono', monospace; color: #00d4ff; }
.td-hours { flex: 1; position: relative; display: flex; }
.td-slot { flex: 1; border-right: 1px solid rgba(0,212,255,0.02); }

/* 限制条 */
.restriction-bar { position: absolute; top: 3px; bottom: 3px; border-radius: 3px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: opacity 0.15s; z-index: 2; opacity: 0.85; }
.restriction-bar:hover { opacity: 1; z-index: 3; }
.bar-label { font-size: 8px; font-weight: 700; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; padding: 0 3px; text-shadow: 0 1px 2px rgba(0,0,0,0.5); }

/* 地图筛选 */
.checkbox-group { display: flex; flex-direction: column; gap: 6px; }
.checkbox-label { display: flex; align-items: center; gap: 6px; cursor: pointer; font-size: 11px; color: #94a3b8; transition: color 0.15s; }
.checkbox-label:hover { color: #e2e8f0; }
.checkbox-label input[type="checkbox"] { accent-color: #00d4ff; width: 13px; height: 13px; cursor: pointer; }
</style>
