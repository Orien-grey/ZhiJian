<template>
  <div class="filter-section">
    <div class="filter-row">
      <input
        class="filter-input"
        type="text"
        placeholder="四字码筛选"
        :value="searchText"
        @input="$emit('update:searchText', ($event.target as HTMLInputElement).value)"
      />
      <select
        class="filter-select short"
        :value="selectedAirport"
        @change="$emit('update:selectedAirport', ($event.target as HTMLSelectElement).value)"
      >
        <option value="">全部机场</option>
        <option v-for="a in allAirports" :key="a.icao" :value="a.icao">{{ a.icao }} {{ a.name }}</option>
      </select>
    </div>
    <div class="filter-row">
      <select
        class="filter-select full"
        :value="selectedType"
        @change="$emit('update:selectedType', ($event.target as HTMLSelectElement).value)"
      >
        <option value="">选择类型</option>
        <option v-for="(label, key) in RESTRICTION_LABELS" :key="key" :value="key">{{ label }}</option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RESTRICTION_LABELS } from '@/views/dashboard/mock/airportRestrictions'

defineProps<{
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
</script>

<style scoped>
.filter-section {
  padding: 10px 12px; flex-shrink: 0;
  border-bottom: 1px solid rgba(0,212,255,0.05);
}
.filter-row { display: flex; gap: 6px; margin-bottom: 6px; }
.filter-row:last-child { margin-bottom: 0; }
.filter-input {
  flex: 1; padding: 5px 9px; border-radius: 4px; font-size: 10px;
  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); color: #e2e8f0; outline: none;
  font-family: 'IBM Plex Mono', monospace;
}
.filter-input:focus { border-color: rgba(0,212,255,0.28); }
.filter-input::placeholder { color: #475569; }
.filter-select {
  padding: 5px 9px; border-radius: 4px; font-size: 10px;
  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); color: #e2e8f0; outline: none; cursor: pointer;
}
.filter-select.short { width: 110px; }
.filter-select.full { width: 100%; }
.filter-select option { background: #0f172a; color: #e2e8f0; }
</style>
