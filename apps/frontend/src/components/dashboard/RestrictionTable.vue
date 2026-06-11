<template>
  <div class="table-section">
    <!-- 表头 -->
    <div class="table-head">
      <div class="th-fixed">
        <span class="th-label">机场</span>
      </div>
      <div class="th-scroll" ref="headerScrollRef">
        <div v-for="h in displayHours" :key="h" class="th-cell" :class="{ 'th-hour': h % 1 === 0 }">
          <span class="th-time">{{ formatHourFull(h) }}</span>
          <div v-if="h % 1 === 0" class="th-tick" />
        </div>
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
          <div class="td-airport">
            <span class="td-icao">{{ row.icao }}</span>
            <span class="td-name">{{ row.airportName }}</span>
          </div>
        </div>
        <div class="td-scroll">
          <!-- 时间网格线 -->
          <div v-for="h in displayHours" :key="h" class="td-slot" :class="{ 'td-hour': h % 1 === 0 }" />
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
            <div class="bar-glow" />
            <div class="bar-inner">
              <span class="bar-arrow">◂</span>
              <span class="bar-text">{{ bar.label }}</span>
            </div>
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
.table-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;
  position: relative;
  z-index: 1;
}

/* ===== 表头 ===== */
.table-head {
  display: flex;
  flex-shrink: 0;
  background: linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.85) 100%);
  border-bottom: 1px solid rgba(0, 212, 255, 0.08);
  backdrop-filter: blur(8px);
}

.th-fixed {
  width: 100px;
  flex-shrink: 0;
  padding: 7px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid rgba(0, 212, 255, 0.06);
}

.th-label {
  font-size: 8px;
  font-weight: 700;
  color: #64748b;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.th-scroll {
  flex: 1;
  display: flex;
  overflow-x: hidden;
}

.th-cell {
  min-width: 44px;
  flex-shrink: 0;
  padding: 4px 0 3px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 2px;
  border-right: 1px solid rgba(0, 212, 255, 0.025);
  position: relative;
}

.th-hour {
  background: rgba(0, 212, 255, 0.015);
}

.th-time {
  font-size: 7px;
  font-family: 'IBM Plex Mono', 'SF Mono', monospace;
  color: #475569;
  letter-spacing: 0.01em;
  transition: color 0.2s;
}

.th-cell:hover .th-time {
  color: #7dd3fc;
}

.th-tick {
  width: 1px;
  height: 4px;
  background: rgba(0, 212, 255, 0.12);
}

/* ===== 表体 ===== */
.table-body {
  flex: 1;
  overflow: auto;
  min-height: 0;
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 212, 255, 0.1) transparent;
}

.table-body::-webkit-scrollbar { width: 4px; height: 4px; }
.table-body::-webkit-scrollbar-track { background: transparent; }
.table-body::-webkit-scrollbar-thumb { background: rgba(0, 212, 255, 0.1); border-radius: 4px; }
.table-body::-webkit-scrollbar-thumb:hover { background: rgba(0, 212, 255, 0.22); }

.table-row {
  display: flex;
  min-height: 44px;
  border-bottom: 1px solid rgba(0, 212, 255, 0.025);
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.table-row::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background: transparent;
  transition: background 0.25s;
}

.table-row:hover {
  background: rgba(0, 212, 255, 0.025);
}

.table-row:hover::before {
  background: rgba(0, 212, 255, 0.2);
}

.row-active {
  background: rgba(0, 212, 255, 0.04) !important;
}

.row-active::before {
  background: #00d4ff !important;
  box-shadow: 0 0 8px rgba(0, 212, 255, 0.3);
}

/* ===== 固定列 ===== */
.td-fixed {
  width: 100px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, rgba(10, 14, 26, 0.95) 0%, rgba(10, 14, 26, 0.9) 100%);
  border-right: 1px solid rgba(0, 212, 255, 0.06);
}

.td-airport {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0px;
  line-height: 1.2;
}

.td-icao {
  font-size: 11px;
  font-weight: 800;
  font-family: 'IBM Plex Mono', 'SF Mono', monospace;
  color: #e2e8f0;
  letter-spacing: 0.02em;
}

.td-name {
  font-size: 8px;
  color: #64748b;
  letter-spacing: 0.01em;
  white-space: nowrap;
}

/* ===== 滚动区域 ===== */
.td-scroll {
  flex: 1;
  display: flex;
  position: relative;
}

.td-slot {
  min-width: 44px;
  flex-shrink: 0;
  border-right: 1px solid rgba(0, 212, 255, 0.012);
}

.td-hour {
  background: rgba(0, 212, 255, 0.008);
  border-right-color: rgba(0, 212, 255, 0.02);
}

/* ===== 限制条 ===== */
.bar {
  position: absolute;
  top: 8px;
  bottom: 7px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  cursor: pointer;
  z-index: 2;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.bar:hover {
  z-index: 4;
  transform: scaleY(1.15) translateY(-1px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
}

.bar-glow {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
}

.bar:hover .bar-glow {
  opacity: 1;
}

.bar-inner {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 0 4px;
}

/* 红色系 — 机场关/不可着陆 */
.bar-airport_closed,
.bar-airport_no_land {
  background: linear-gradient(180deg, rgba(239, 68, 68, 0.18) 0%, rgba(220, 38, 38, 0.22) 100%);
  border-color: rgba(239, 68, 68, 0.2);
}
.bar-airport_closed .bar-glow,
.bar-airport_no_land .bar-glow {
  background: radial-gradient(ellipse at 50% 0%, rgba(248, 113, 113, 0.2) 0%, transparent 70%);
}
.bar:hover.bar-airport_closed,
.bar:hover.bar-airport_no_land {
  background: linear-gradient(180deg, rgba(239, 68, 68, 0.3) 0%, rgba(220, 38, 38, 0.35) 100%);
  border-color: rgba(248, 113, 113, 0.35);
}

/* 黄色系 — 跑道关/不可着陆/滑行道关 */
.bar-runway_closed,
.bar-runway_no_land,
.bar-taxiway_closed {
  background: linear-gradient(180deg, rgba(245, 158, 11, 0.15) 0%, rgba(217, 119, 6, 0.2) 100%);
  border-color: rgba(245, 158, 11, 0.18);
}
.bar-runway_closed .bar-glow,
.bar-runway_no_land .bar-glow,
.bar-taxiway_closed .bar-glow {
  background: radial-gradient(ellipse at 50% 0%, rgba(251, 191, 36, 0.15) 0%, transparent 70%);
}
.bar:hover.bar-runway_closed,
.bar:hover.bar-runway_no_land,
.bar:hover.bar-taxiway_closed {
  background: linear-gradient(180deg, rgba(245, 158, 11, 0.28) 0%, rgba(217, 119, 6, 0.32) 100%);
  border-color: rgba(251, 191, 36, 0.3);
}

/* 绿色系 — 跑道不可起飞 */
.bar-runway_no_takeoff {
  background: linear-gradient(180deg, rgba(46, 204, 113, 0.14) 0%, rgba(34, 197, 94, 0.2) 100%);
  border-color: rgba(46, 204, 113, 0.16);
}
.bar-runway_no_takeoff .bar-glow {
  background: radial-gradient(ellipse at 50% 0%, rgba(74, 222, 128, 0.12) 0%, transparent 70%);
}
.bar:hover.bar-runway_no_takeoff {
  background: linear-gradient(180deg, rgba(46, 204, 113, 0.26) 0%, rgba(34, 197, 94, 0.3) 100%);
  border-color: rgba(74, 222, 128, 0.28);
}

/* 红色系 — 机场不可起飞/不可备降 */
.bar-airport_no_takeoff,
.bar-airport_no_alternate {
  background: linear-gradient(180deg, rgba(239, 68, 68, 0.16) 0%, rgba(185, 28, 28, 0.22) 100%);
  border-color: rgba(239, 68, 68, 0.18);
}
.bar-airport_no_takeoff .bar-glow,
.bar-airport_no_alternate .bar-glow {
  background: radial-gradient(ellipse at 50% 0%, rgba(248, 113, 113, 0.18) 0%, transparent 70%);
}
.bar:hover.bar-airport_no_takeoff,
.bar:hover.bar-airport_no_alternate {
  background: linear-gradient(180deg, rgba(239, 68, 68, 0.28) 0%, rgba(185, 28, 28, 0.32) 100%);
  border-color: rgba(248, 113, 113, 0.3);
}

.bar-arrow {
  font-size: 5px;
  color: rgba(255, 255, 255, 0.35);
  margin-right: 2px;
  flex-shrink: 0;
  transition: color 0.2s;
}

.bar:hover .bar-arrow {
  color: rgba(255, 255, 255, 0.65);
}

.bar-text {
  font-size: 8px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.75);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: 'IBM Plex Mono', 'SF Mono', monospace;
  letter-spacing: 0.01em;
}
</style>
