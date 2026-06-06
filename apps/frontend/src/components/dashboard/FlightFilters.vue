<template>
  <div class="section">
    <div class="filter-row">
      <input
        class="input" type="text" placeholder="搜索航班/机号/机场..."
        :value="searchText"
        @input="$emit('update:searchText', ($event.target as HTMLInputElement).value)"
      />
      <select
        class="select"
        :value="statusFilter"
        @change="$emit('update:statusFilter', ($event.target as HTMLSelectElement).value)"
      >
        <option value="">全部状态</option>
        <option v-for="(v, k) in FLIGHT_STATUS_MAP" :key="k" :value="k">{{ v.label }}</option>
      </select>
    </div>
    <div class="filter-row">
      <input
        class="input" type="text" placeholder="点检查..."
        :value="spotCheck"
        @input="$emit('update:spotCheck', ($event.target as HTMLInputElement).value)"
      />
      <button class="btn" @click="$emit('reset')">重置</button>
    </div>
    <div class="tab-row">
      <button
        :class="activeType === 'all' ? 'tab-active' : 'tab'"
        @click="$emit('update:activeType', 'all')"
      >全部航班</button>
      <button
        :class="activeType === 'affected' ? 'tab-active' : 'tab'"
        @click="$emit('update:activeType', 'affected')"
      >影响航班</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FLIGHT_STATUS_MAP } from '@/views/dashboard/mock/flightData'

defineProps<{
  searchText: string
  statusFilter: string
  spotCheck: string
  activeType: 'all' | 'affected'
}>()

defineEmits<{
  (e: 'update:searchText', val: string): void
  (e: 'update:statusFilter', val: string): void
  (e: 'update:spotCheck', val: string): void
  (e: 'update:activeType', val: 'all' | 'affected'): void
  (e: 'reset'): void
}>()
</script>

<style scoped>
.section { padding: 12px 14px; border-bottom: 1px solid rgba(0,212,255,0.06); flex-shrink: 0; }
.filter-row { display: flex; gap: 7px; margin-bottom: 6px; }
.input { flex: 1; padding: 5px 7px; border-radius: 5px; font-size: 10px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); color: #e2e8f0; outline: none; }
.input:focus { border-color: rgba(0,212,255,0.24); }
.input::placeholder { color: #475569; }
.select { width: 90px; padding: 5px 6px; border-radius: 5px; font-size: 10px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); color: #e2e8f0; outline: none; cursor: pointer; }
.select option { background: #0f172a; color: #e2e8f0; }
.btn { padding: 5px 10px; border-radius: 5px; font-size: 10px; cursor: pointer; background: rgba(255,255,255,0.03); color: #94a3b8; border: 1px solid rgba(255,255,255,0.05); }
.btn:hover { color: #00d4ff; border-color: rgba(0,212,255,0.2); }
.tab-row { display: flex; }
.tab { flex: 1; padding: 6px; font-size: 11px; cursor: pointer; background: none; color: #94a3b8; border: 1px solid rgba(255,255,255,0.04); text-align: center; }
.tab:first-child { border-radius: 4px 0 0 4px; }
.tab:last-child { border-radius: 0 4px 4px 0; }
.tab:hover { color: #00d4ff; }
.tab-active { flex: 1; padding: 6px; font-size: 11px; cursor: pointer; background: rgba(0,212,255,0.1); color: #00d4ff; font-weight: 600; border: 1px solid rgba(0,212,255,0.2); text-align: center; }
.tab-active:first-child { border-radius: 4px 0 0 4px; }
.tab-active:last-child { border-radius: 0 4px 4px 0; }
</style>
