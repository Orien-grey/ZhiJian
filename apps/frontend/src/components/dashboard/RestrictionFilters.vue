<template>
  <div class="filter-section">
    <div class="filter-row">
      <div class="filter-input-wrap">
        <svg class="filter-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
        </svg>
        <input
          class="filter-input"
          type="text"
          placeholder="四字码筛选"
          :value="searchText"
          @input="$emit('update:searchText', ($event.target as HTMLInputElement).value)"
        />
        <div v-if="searchText" class="filter-clear" @click="$emit('update:searchText', '')">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
          </svg>
        </div>
      </div>

      <div class="filter-select-wrap">
        <svg class="filter-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 6h18"/><path d="M7 12h10"/><path d="M10 18h4"/>
        </svg>
        <select
          class="filter-select short"
          :value="selectedAirport"
          @change="$emit('update:selectedAirport', ($event.target as HTMLSelectElement).value)"
        >
          <option value="">全部机场</option>
          <option v-for="a in allAirports" :key="a.icao" :value="a.icao">{{ a.icao }} {{ a.name }}</option>
        </select>
      </div>
    </div>

    <div class="filter-row">
      <div class="filter-select-wrap full">
        <svg class="filter-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
        </svg>
        <select
          class="filter-select full"
          :value="selectedType"
          @change="$emit('update:selectedType', ($event.target as HTMLSelectElement).value)"
        >
          <option value="">选择限制类型</option>
          <option v-for="(label, key) in RESTRICTION_LABELS" :key="key" :value="key">{{ label }}</option>
        </select>
      </div>
    </div>

    <!-- 活跃筛选标签 -->
    <div v-if="hasActiveFilters" class="filter-tags">
      <span class="filter-tag-label">已筛选</span>
      <div v-if="searchText" class="filter-tag" @click="$emit('update:searchText', '')">
        <span>搜索: {{ searchText }}</span>
        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
        </svg>
      </div>
      <div v-if="selectedAirport" class="filter-tag" @click="$emit('update:selectedAirport', '')">
        <span>{{ selectedAirport }}</span>
        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
        </svg>
      </div>
      <div v-if="selectedType" class="filter-tag" @click="$emit('update:selectedType', '')">
        <span>{{ RESTRICTION_LABELS[selectedType as RestrictionType] }}</span>
        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RESTRICTION_LABELS, type RestrictionType } from '@/views/dashboard/mock/airportRestrictions'

const props = defineProps<{
  searchText: string
  selectedAirport: string
  selectedType: string
  allAirports: { icao: string; name: string }[]
}>()

defineEmits<{
  (e: 'update:searchText', val: string): void
  (e: 'update:selectedAirport', val: string): void
  (e: 'update:selectedType', val: string): void
}>()

const hasActiveFilters = computed(() =>
  !!props.searchText || !!props.selectedAirport || !!props.selectedType
)
</script>

<style scoped>
.filter-section {
  padding: 12px 14px;
  flex-shrink: 0;
  border-bottom: 1px solid rgba(0, 212, 255, 0.05);
  z-index: 1;
  position: relative;
}

.filter-row {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.filter-row:last-child {
  margin-bottom: 0;
}

/* ===== 输入框 ===== */
.filter-input-wrap,
.filter-select-wrap {
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
}

.filter-select-wrap.short {
  flex: 0 0 130px;
}

.filter-select-wrap.full {
  width: 100%;
}

.filter-icon {
  position: absolute;
  left: 9px;
  color: #475569;
  pointer-events: none;
  transition: color 0.2s;
  z-index: 1;
}

.filter-input-wrap:focus-within .filter-icon,
.filter-select-wrap:focus-within .filter-icon {
  color: #00d4ff;
}

.filter-input {
  width: 100%;
  padding: 6px 24px 6px 28px;
  border-radius: 8px;
  font-size: 11px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  color: #e2e8f0;
  outline: none;
  font-family: 'IBM Plex Mono', 'SF Mono', monospace;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.filter-input:focus {
  background: rgba(0, 212, 255, 0.04);
  border-color: rgba(0, 212, 255, 0.2);
  box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.06), 0 0 16px rgba(0, 212, 255, 0.05);
}

.filter-input::placeholder {
  color: #475569;
}

.filter-clear {
  position: absolute;
  right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 4px;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-clear:hover {
  color: #e2e8f0;
  background: rgba(255, 255, 255, 0.06);
}

/* ===== 下拉框 ===== */
.filter-select {
  width: 100%;
  padding: 6px 24px 6px 28px;
  border-radius: 8px;
  font-size: 11px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  color: #e2e8f0;
  outline: none;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.filter-select:focus {
  background: rgba(0, 212, 255, 0.04);
  border-color: rgba(0, 212, 255, 0.2);
  box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.06), 0 0 16px rgba(0, 212, 255, 0.05);
}

.filter-select option {
  background: #0f172a;
  color: #e2e8f0;
  font-size: 11px;
}

/* 自定义下拉箭头 */
.filter-select-wrap::after {
  content: '';
  position: absolute;
  right: 10px;
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid #475569;
  pointer-events: none;
  transition: border-color 0.2s;
}

.filter-select-wrap:focus-within::after {
  border-top-color: #00d4ff;
}

/* ===== 筛选标签 ===== */
.filter-tags {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid rgba(0, 212, 255, 0.04);
  animation: tags-enter 0.3s ease-out;
}

@keyframes tags-enter {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}

.filter-tag-label {
  font-size: 8px;
  font-weight: 700;
  color: #475569;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.filter-tag {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 7px;
  border-radius: 5px;
  font-size: 9px;
  font-weight: 600;
  color: #7dd3fc;
  background: rgba(0, 212, 255, 0.06);
  border: 1px solid rgba(0, 212, 255, 0.1);
  cursor: pointer;
  transition: all 0.2s;
}

.filter-tag:hover {
  background: rgba(0, 212, 255, 0.1);
  border-color: rgba(0, 212, 255, 0.2);
  color: #00d4ff;
}

.filter-tag svg {
  opacity: 0.6;
  transition: opacity 0.2s;
}

.filter-tag:hover svg {
  opacity: 1;
}
</style>
