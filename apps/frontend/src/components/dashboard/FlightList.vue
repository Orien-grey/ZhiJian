<template>
  <div class="flight-list">
    <div
      v-for="f in flights"
      :key="f.id"
      class="flight-item"
      :class="{ affected: f.isAffected }"
      @click="$emit('select', f)"
    >
      <div class="flight-top">
        <span class="star" :class="{ starred: f.star }" @click.stop="$emit('toggle-star', f)">
          {{ f.star ? '★' : '☆' }}
        </span>
        <span class="flight-no">{{ f.flightNo }}</span>
        <span class="sch-time">{{ f.scheduledTime }}</span>
        <span v-if="f.isCompanyRoute" class="tag-company">公司航线</span>
      </div>
      <div class="flight-route">
        <span class="dep">{{ f.depName }}</span>
        <span class="arrow">→</span>
        <span class="arr">{{ f.arrName }}</span>
      </div>
      <div class="flight-bottom">
        <span class="est-label">预计</span>
        <span class="est-time">{{ f.estimatedTime }}</span>
        <span
          class="status-tag"
          :style="{
            color: FLIGHT_STATUS_MAP[f.status].color,
            background: FLIGHT_STATUS_MAP[f.status].color + '15',
            border: '1px solid ' + FLIGHT_STATUS_MAP[f.status].color + '25',
          }"
        >{{ f.statusLabel }}</span>
        <span class="countdown">{{ f.countdown }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FLIGHT_STATUS_MAP, type FlightItem } from '@/views/dashboard/mock/flightData'

defineProps<{
  flights: FlightItem[]
}>()

defineEmits<{
  (e: 'toggle-star', flight: FlightItem): void
  (e: 'select', flight: FlightItem): void
}>()
</script>

<style scoped>
.flight-list { flex: 1; overflow-y: auto; scrollbar-width: thin; scrollbar-color: rgba(0,212,255,0.1) transparent; }
.flight-list::-webkit-scrollbar { width: 3px; }
.flight-list::-webkit-scrollbar-thumb { background: rgba(0,212,255,0.1); border-radius: 2px; }

.flight-item { padding: 10px 13px; border-bottom: 1px solid rgba(0,212,255,0.04); cursor: pointer; transition: background 0.15s; }
.flight-item:hover { background: rgba(0,212,255,0.04); }
.flight-item.affected { background: rgba(245,158,11,0.05); }
.flight-item.affected:hover { background: rgba(245,158,11,0.09); }

.flight-top { display: flex; align-items: center; gap: 6px; margin-bottom: 4px; }
.star { font-size: 10px; cursor: pointer; transition: all 0.2s; }
.star:not(.starred) { color: #475569; }
.star.starred { color: #f59e0b; text-shadow: 0 0 6px rgba(245,158,11,0.4); }
.star:hover { transform: scale(1.3); }
.flight-no { font-size: 12px; font-weight: 700; font-family: 'IBM Plex Mono', monospace; color: #e2e8f0; }
.sch-time { font-size: 10px; color: #64748b; font-family: 'IBM Plex Mono', monospace; margin-left: auto; }
.tag-company { font-size: 8px; font-weight: 700; color: #ef4444; padding: 1px 4px; border-radius: 2px; border: 1px solid rgba(239,68,68,0.3); background: rgba(239,68,68,0.08); }

.flight-route { display: flex; align-items: center; gap: 4px; font-size: 10px; color: #94a3b8; margin-bottom: 4px; }
.arrow { color: #475569; margin: 0 2px; }

.flight-bottom { display: flex; align-items: center; gap: 6px; }
.est-label { font-size: 9px; color: #475569; }
.est-time { font-size: 10px; color: #94a3b8; font-family: 'IBM Plex Mono', monospace; }
.status-tag { font-size: 9px; font-weight: 600; padding: 1px 5px; border-radius: 3px; }
.countdown { font-size: 10px; font-family: 'IBM Plex Mono', monospace; color: #64748b; margin-left: auto; }
</style>
