<template>
  <div class="section">
    <p class="sec-title">备选航线 · 共 {{ routes.length }} 条</p>

    <div v-if="routes.length === 0" class="no-data">该航班暂无备选航线</div>

    <div v-for="r in routes" :key="r.id" class="route-card" :class="{ selected: r.selected }">
      <div class="card-left">
        <!-- 勾选框 -->
        <div class="cb" :class="{ checked: r.selected }" @click="toggleRoute(r)">
          <span v-if="r.selected" class="cb-check">✓</span>
        </div>
      </div>

      <div class="card-body" @click="toggleRoute(r)">
        <div class="card-top">
          <span class="route-name">{{ r.name }}</span>
          <span class="route-dist">{{ r.distance }} NM</span>
          <span class="route-fuel" :class="parseInt(r.fuelDelta) > 20 ? 'warn' : ''">{{ r.fuelDelta }}</span>
        </div>
        <div class="route-text mono">{{ r.route }}</div>
        <div class="waypoint-chips">
          <span
            v-for="wp in r.waypoints"
            :key="wp"
            class="wp-chip"
            :class="{ affected: r.affectedWaypoints.includes(wp) }"
          >{{ wp }}</span>
        </div>
      </div>

      <div class="card-right">
        <button class="preview-btn" @click.stop="$emit('preview', r.id)" :title="r.selected ? '取消预览' : '预览航线'">
          {{ r.selected ? '●' : '○' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AlternateRoute } from '@/views/dashboard/mock/flightAnalysis'

const props = defineProps<{ routes: AlternateRoute[] }>()
const emit = defineEmits<{
  (e: 'toggle', id: string): void
  (e: 'preview', id: string): void
}>()

const toggleRoute = (r: AlternateRoute) => {
  r.selected = !r.selected
  emit('toggle', r.id)
}
</script>

<style scoped>
.section { padding: 18px 19px; }
.sec-title { font-size: 11px; font-weight: 600; color: #64748b; margin: 0 0 12px; letter-spacing: 0.06em; text-transform: uppercase; }
.no-data { font-size: 11px; color: #334155; text-align: center; padding: 32px 0; }

.route-card {
  display: flex; gap: 12px; padding: 14px; margin-bottom: 8px;
  border-radius: 8px; border: 1px solid rgba(255,255,255,0.04);
  background: rgba(255,255,255,0.01); transition: all 0.2s; cursor: pointer;
}
.route-card:hover { border-color: rgba(0,212,255,0.09); background: rgba(0,212,255,0.02); }
.route-card.selected { border-color: rgba(0,212,255,0.2); background: rgba(0,212,255,0.03); }

.card-left { display: flex; align-items: flex-start; padding-top: 2px; }
.cb {
  width: 16px; height: 16px; border-radius: 3px; border: 1px solid rgba(255,255,255,0.12);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  background: rgba(255,255,255,0.02); transition: all 0.15s;
}
.cb.checked { background: rgba(0,212,255,0.15); border-color: #00d4ff; }
.cb-check { font-size: 9px; color: #00d4ff; font-weight: 700; }

.card-body { flex: 1; min-width: 0; }
.card-top { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
.route-name { font-size: 12px; font-weight: 700; color: #e2e8f0; font-family: 'IBM Plex Mono', monospace; }
.route-dist { font-size: 10px; color: #64748b; font-family: 'IBM Plex Mono', monospace; }
.route-fuel { font-size: 9px; color: #4ade80; font-family: 'IBM Plex Mono', monospace; padding: 1px 5px; border-radius: 3px; background: rgba(74,222,128,0.08); }
.route-fuel.warn { color: #f59e0b; background: rgba(245,158,11,0.08); }
.route-text { font-size: 10px; color: #64748b; margin-bottom: 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.mono { font-family: 'IBM Plex Mono', monospace; }

.waypoint-chips { display: flex; gap: 4px; flex-wrap: wrap; }
.wp-chip {
  font-size: 8px; font-family: 'IBM Plex Mono', monospace; color: #64748b;
  padding: 1px 6px; border-radius: 3px; background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.04);
}
.wp-chip.affected { color: #ef4444; border-color: rgba(239,68,68,0.25); background: rgba(239,68,68,0.06); }

.card-right { display: flex; align-items: flex-start; padding-top: 2px; }
.preview-btn {
  width: 24px; height: 24px; border-radius: 4px; font-size: 12px;
  border: 1px solid rgba(255,255,255,0.06); background: rgba(255,255,255,0.02);
  color: #475569; cursor: pointer; transition: all 0.15s;
}
.preview-btn:hover { color: #00d4ff; border-color: rgba(0,212,255,0.2); }
</style>
