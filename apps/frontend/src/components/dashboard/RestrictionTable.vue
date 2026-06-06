<template>
  <div class="table-section">
    <!-- 表头 -->
    <div class="table-head">
      <div class="th-fixed">机场</div>
      <div class="th-scroll" ref="headerScrollRef">
        <div v-for="h in displayHours" :key="h" class="th-cell">{{ formatHourFull(h) }}</div>
      </div>
    </div>
    <!-- 表体 -->
    <div class="table-body" ref="bodyRef" @scroll="onBodyScroll">
      <div
        v-for="row in restrictions"
        :key="row.icao"
        class="table-row"
        :class="{ 'row-active': activeAirport === row.icao }"
        @click="$emit('update:activeAirport', row.icao)"
      >
        <div class="td-fixed">
          <span class="td-icao">{{ row.icao }}</span>
        </div>
        <div class="td-scroll">
          <!-- 时间网格线 -->
          <div v-for="h in displayHours" :key="h" class="td-slot" />
          <!-- 限制条 -->
          <div
            v-for="bar in row.restrictions"
            :key="bar.id"
            class="bar"
            :class="`bar-${bar.type}`"
            :style="barPosition(bar)"
            @click.stop="handleBarClick(row, bar)"
            :title="`${bar.label}\n${RESTRICTION_LABELS[bar.type]}\nNOTAM: ${bar.notamRef}`"
          >
            <span class="bar-arrow">◂</span>
            <span class="bar-text">{{ bar.label }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { RESTRICTION_LABELS, TIME_RANGE, type AirportRestriction, type RestrictionBar } from '@/views/dashboard/mock/airportRestrictions'

const props = defineProps<{
  restrictions: AirportRestriction[]
  displayHours: number[]
  activeAirport: string
  scrollToIcao: string
}>()

const emit = defineEmits<{
  (e: 'update:activeAirport', val: string): void
  (e: 'bar-click', airport: string, notamRef: string): void
}>()

const formatHourFull = (h: number) => {
  const displayH = h >= 24 ? h - 24 : h
  const hour = Math.floor(displayH)
  const prefix = h >= 24 ? '次日 ' : ''
  return `${prefix}${hour.toString().padStart(2, '0')}:${h % 1 === 0 ? '00' : '30'}`
}

const barPosition = (bar: { startHour: number; endHour: number }) => {
  const total = props.displayHours.length
  const left = `${((bar.startHour - TIME_RANGE.start) / (props.displayHours[total - 1] - TIME_RANGE.start + 0.5)) * 100}%`
  const width = `${((bar.endHour - bar.startHour) / (props.displayHours[total - 1] - TIME_RANGE.start + 0.5)) * 100}%`
  return { left, width }
}

const handleBarClick = (row: AirportRestriction, bar: RestrictionBar) => {
  emit('update:activeAirport', row.icao)
  emit('bar-click', row.icao, bar.notamRef)
}

// 表头/表体横向滚动同步
const headerScrollRef = ref<HTMLElement | null>(null)
const bodyRef = ref<HTMLElement | null>(null)
const onBodyScroll = (e: Event) => {
  const el = e.target as HTMLElement
  if (headerScrollRef.value) headerScrollRef.value.scrollLeft = el.scrollLeft
}

// 响应时间轴点击：滚动到对应机场行
watch(() => props.scrollToIcao, () => {
  if (!props.scrollToIcao || !bodyRef.value) return
  nextTick(() => {
    const activeRow = bodyRef.value?.querySelector('.row-active')
    activeRow?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  })
})
</script>

<style scoped>
.table-section { flex: 1; display: flex; flex-direction: column; overflow: hidden; min-height: 0; }

.table-head {
  display: flex; flex-shrink: 0;
  background: #0a192f; border-bottom: 1px solid rgba(0,212,255,0.1);
}
.th-fixed {
  width: 72px; flex-shrink: 0; padding: 5px 0; text-align: center;
  font-size: 10px; font-weight: 600; color: #64748b; letter-spacing: 0.06em;
  border-right: 1px solid rgba(0,212,255,0.08);
}
.th-scroll { flex: 1; display: flex; overflow-x: hidden; }
.th-cell {
  min-width: 56px; flex-shrink: 0; padding: 5px 0; text-align: center;
  font-size: 9px; font-family: 'IBM Plex Mono', monospace; color: #64748b;
  border-right: 1px solid rgba(0,212,255,0.04);
}

.table-body {
  flex: 1; overflow: auto; min-height: 0;
  scrollbar-width: thin; scrollbar-color: rgba(0,212,255,0.11) transparent;
}
.table-body::-webkit-scrollbar { width: 3px; height: 3px; }
.table-body::-webkit-scrollbar-thumb { background: rgba(0,212,255,0.11); border-radius: 2px; }

.table-row {
  display: flex; min-height: 40px;
  border-bottom: 1px solid rgba(0,212,255,0.02); cursor: pointer; transition: background 0.15s;
}
.table-row:hover { background: rgba(0,212,255,0.04); }
.row-active { background: rgba(0,212,255,0.06) !important; }

.td-fixed {
  width: 72px; flex-shrink: 0; display: flex; align-items: center; justify-content: center;
  background: #0a0f1e; border-right: 1px solid rgba(0,212,255,0.08);
}
.td-icao { font-size: 10px; font-weight: 700; font-family: 'IBM Plex Mono', monospace; color: #e2e8f0; }

.td-scroll { flex: 1; display: flex; position: relative; }
.td-slot {
  min-width: 56px; flex-shrink: 0; border-right: 1px solid rgba(0,212,255,0.016);
}

/* 限制条 —— 极简玻璃透明 */
.bar {
  position: absolute; top: 5px; bottom: 4px; border-radius: 3px;
  display: flex; align-items: center; cursor: pointer; z-index: 2;
  overflow: hidden; transition: all 0.25s ease;
  border: 0.5px solid rgba(255,255,255,0.1);
}
.bar:hover { z-index: 4; transform: scaleY(1.12); }

/* 红色系 — 机场关/不可着陆 */
.bar-airport_closed, .bar-airport_no_land { background: rgba(239,68,68,0.18); border-color: rgba(239,68,68,0.25); }
/* 黄色系 — 跑道关/不可着陆/滑行道关 */
.bar-runway_closed, .bar-runway_no_land, .bar-taxiway_closed { background: rgba(241,196,15,0.18); border-color: rgba(241,196,15,0.25); }
/* 绿色系 — 跑道不可起飞 */
.bar-runway_no_takeoff { background: rgba(46,204,113,0.18); border-color: rgba(46,204,113,0.25); }
/* 红色系 — 机场不可起飞/不可备降 */
.bar-airport_no_takeoff, .bar-airport_no_alternate { background: rgba(239,68,68,0.18); border-color: rgba(239,68,68,0.25); }

.bar:hover.bar-airport_closed, .bar:hover.bar-airport_no_land,
.bar:hover.bar-airport_no_takeoff, .bar:hover.bar-airport_no_alternate { background: rgba(239,68,68,0.32); }
.bar:hover.bar-runway_closed, .bar:hover.bar-runway_no_land,
.bar:hover.bar-taxiway_closed { background: rgba(241,196,15,0.32); }
.bar:hover.bar-runway_no_takeoff { background: rgba(46,204,113,0.32); }

.bar-arrow { font-size: 6px; color: rgba(255,255,255,0.5); margin-left: 2px; flex-shrink: 0; }
.bar-text {
  font-size: 8px; font-weight: 500; color: rgba(255,255,255,0.75); white-space: nowrap; overflow: hidden;
  text-overflow: ellipsis; padding: 0 4px; font-family: 'IBM Plex Mono', monospace; letter-spacing: 0.01em;
}
</style>
