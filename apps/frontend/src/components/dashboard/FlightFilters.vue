<template>
  <div class="section">
    <!-- 搜索框 -->
    <div class="search-box">
      <svg class="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
      </svg>
      <input
        class="input search-input" type="text" placeholder="搜索航班号、机号、机场..."
        :value="searchText"
        @input="$emit('update:searchText', ($event.target as HTMLInputElement).value)"
      />
      <button v-if="searchText" class="clear-btn" @click="$emit('update:searchText', '')">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
        </svg>
      </button>
    </div>

    <!-- 筛选行 -->
    <div class="filter-row">
      <div class="filter-group">
        <label class="filter-label">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
          </svg>
          状态
        </label>
        <select
          class="select"
          :value="statusFilter"
          @change="$emit('update:statusFilter', ($event.target as HTMLSelectElement).value)"
        >
          <option value="">全部状态</option>
          <option v-for="(v, k) in FLIGHT_STATUS_MAP" :key="k" :value="k">{{ v.label }}</option>
        </select>
      </div>
      <div class="filter-group">
        <label class="filter-label">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
          </svg>
          点检
        </label>
        <input
          class="input spot-input" type="text" placeholder="输入航班号..."
          :value="spotCheck"
          @input="$emit('update:spotCheck', ($event.target as HTMLInputElement).value)"
        />
      </div>
      <button class="btn-reset" @click="$emit('reset')">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>
        </svg>
        重置
      </button>
    </div>

    <!-- 标签切换 -->
    <div class="tab-row">
      <button
        :class="activeType === 'all' ? 'tab-active' : 'tab'"
        @click="$emit('update:activeType', 'all')"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M2 12h20"/><path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6"/><path d="m22 12-5-5"/><path d="m22 12-5 5"/>
        </svg>
        全部航班
      </button>
      <button
        :class="activeType === 'affected' ? 'tab-active' : 'tab'"
        @click="$emit('update:activeType', 'affected')"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>
        </svg>
        影响航班
      </button>
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
.section {
  padding: 14px 18px;
  border-bottom: 1px solid rgba(0, 212, 255, 0.06);
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* 搜索框 */
.search-box {
  position: relative;
  display: flex;
  align-items: center;
}
.search-icon {
  position: absolute;
  left: 12px;
  color: #475569;
  pointer-events: none;
  transition: color 0.2s;
}
.search-input {
  width: 100%;
  padding: 9px 12px 9px 36px;
  border-radius: 10px;
  font-size: 12px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
  border: 1px solid rgba(255, 255, 255, 0.06);
  color: #e2e8f0;
  outline: none;
  transition: all 0.25s ease;
  font-family: 'Noto Sans SC', 'PingFang SC', sans-serif;
}
.search-input:focus {
  border-color: rgba(0, 212, 255, 0.3);
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.06) 0%, rgba(0, 212, 255, 0.02) 100%);
  box-shadow: 0 0 20px rgba(0, 212, 255, 0.08);
}
.search-input:focus + .search-icon,
.search-box:focus-within .search-icon {
  color: #00d4ff;
}
.search-input::placeholder { color: #475569; }

.clear-btn {
  position: absolute;
  right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.06);
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}
.clear-btn:hover {
  background: rgba(239, 68, 68, 0.15);
  color: #f87171;
}

/* 筛选行 */
.filter-row {
  display: flex;
  gap: 8px;
  align-items: flex-end;
}
.filter-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}
.filter-label {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  font-weight: 500;
  color: #475569;
  padding-left: 2px;
}
.filter-label svg { color: #64748b; }

.input,
.select {
  padding: 7px 10px;
  border-radius: 8px;
  font-size: 11px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.01) 100%);
  border: 1px solid rgba(255, 255, 255, 0.06);
  color: #e2e8f0;
  outline: none;
  transition: all 0.2s ease;
  font-family: 'Noto Sans SC', 'PingFang SC', sans-serif;
}
.input:focus,
.select:focus {
  border-color: rgba(0, 212, 255, 0.25);
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.05) 0%, rgba(0, 212, 255, 0.01) 100%);
}
.input::placeholder { color: #475569; }

.spot-input { width: 100%; }
.select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;
  padding-right: 26px;
}
.select option { background: #0f172a; color: #e2e8f0; }

.btn-reset {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 7px 12px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.01) 100%);
  color: #64748b;
  border: 1px solid rgba(255, 255, 255, 0.06);
  transition: all 0.25s ease;
  font-family: 'Noto Sans SC', 'PingFang SC', sans-serif;
  white-space: nowrap;
}
.btn-reset:hover {
  color: #00d4ff;
  border-color: rgba(0, 212, 255, 0.2);
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.08) 0%, rgba(0, 212, 255, 0.02) 100%);
  box-shadow: 0 0 16px rgba(0, 212, 255, 0.06);
}
.btn-reset svg { transition: transform 0.3s ease; }
.btn-reset:hover svg { transform: rotate(-180deg); }

/* 标签切换 */
.tab-row {
  display: flex;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 10px;
  padding: 3px;
  border: 1px solid rgba(255, 255, 255, 0.04);
}
.tab,
.tab-active {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  border-radius: 8px;
  text-align: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: 'Noto Sans SC', 'PingFang SC', sans-serif;
}
.tab {
  background: transparent;
  color: #64748b;
}
.tab:hover {
  color: #94a3b8;
  background: rgba(255, 255, 255, 0.03);
}
.tab-active {
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.12) 0%, rgba(0, 212, 255, 0.05) 100%);
  color: #00d4ff;
  font-weight: 600;
  border: 1px solid rgba(0, 212, 255, 0.18);
  box-shadow: 0 2px 12px rgba(0, 212, 255, 0.08);
}
</style>
