<template>
  <div class="body">
    <!-- 统计卡片 -->
    <div class="summary-row">
      <div class="sum-card">
        <div class="sum-icon" style="color:#e2e8f0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        </div>
        <span class="sum-val">{{ notams.length }}</span>
        <span class="sum-lbl">当前有效</span>
      </div>
      <div class="sum-card">
        <div class="sum-icon" style="color:#ef4444">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <span class="sum-val critical">{{ aNotams.length }}</span>
        <span class="sum-lbl">A 类（紧急）</span>
      </div>
      <div class="sum-card">
        <div class="sum-icon" style="color:#f59e0b">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        </div>
        <span class="sum-val warning">{{ bNotams.length }}</span>
        <span class="sum-lbl">B 类</span>
      </div>
      <div class="sum-card">
        <div class="sum-icon" style="color:#64748b">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
        </div>
        <span class="sum-val">{{ mNotams.length }}</span>
        <span class="sum-lbl">M 类（杂项）</span>
      </div>
    </div>

    <!-- 表格 -->
    <div class="section" v-if="notams.length">
      <div class="sec-header">
        <span class="sec-line"></span>
        <p class="sec-title">NOTAM 列表</p>
        <span class="sec-line" style="flex:1"></span>
      </div>
      <div class="table-wrap">
        <table class="tbl">
          <thead><tr><th>NOTAM</th><th>类型</th><th>生效日</th><th>截止日</th><th>影响设施</th><th>优先级</th></tr></thead>
          <tbody>
            <tr v-for="n in notams" :key="n.id">
              <td class="mono ref">{{ n.ref }}</td>
              <td><span class="tag" :class="'tag-'+n.type">{{ typeLabel(n.type) }}</span></td>
              <td class="mono">{{ n.startDate }}</td>
              <td class="mono">{{ n.endDate }}</td>
              <td>{{ n.affectedFacility }}</td>
              <td><span class="prio" :class="'prio-'+n.priority">{{ n.priority }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="!notams.length" class="no-data">
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
      该机场暂无 NOTAM 记录
    </div>

    <!-- 详情列表 -->
    <div class="notam-detail-list" v-if="notams.length">
      <div class="sec-header">
        <span class="sec-line"></span>
        <p class="sec-title">NOTAM 详情</p>
        <span class="sec-line" style="flex:1"></span>
      </div>
      <div v-for="n in notams" :key="'d-'+n.id" class="notam-card">
        <div class="nc-head">
          <span class="nc-ref mono">{{ n.ref }}</span>
          <span class="tag" :class="'tag-'+n.type">{{ typeLabel(n.type) }}</span>
          <span class="nc-date mono">{{ n.startDate }} → {{ n.endDate }}</span>
        </div>
        <p class="nc-summary">{{ n.summary }}</p>
        <div class="nc-facility">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <span class="mono">{{ n.affectedFacility }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { MOCK_AIRPORT_NOTAMS, type AirportNotam } from '@/views/dashboard/mock/airportExtra'

const props = defineProps<{ icao: string }>()

const notams = computed(() => MOCK_AIRPORT_NOTAMS[props.icao] || [])
const aNotams = computed(() => notams.value.filter(n => n.priority === 'A'))
const bNotams = computed(() => notams.value.filter(n => n.priority === 'B'))
const mNotams = computed(() => notams.value.filter(n => n.priority === 'M'))

const typeLabel = (t: string) => t === 'new' ? '新增' : t === 'replace' ? '替代' : '取消'
</script>

<style scoped>
.body { flex:1; overflow-y:auto; padding:24px 26px; scrollbar-width:thin; scrollbar-color:rgba(0,180,240,0.08) transparent; }
.body::-webkit-scrollbar { width:3px; }
.body::-webkit-scrollbar-thumb { background:rgba(0,180,240,0.08); border-radius:3px; }

/* ── Summary Cards ── */
.summary-row { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; margin-bottom:24px; }
.sum-card {
  padding: 18px 16px;
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.005) 100%);
  border: 1px solid rgba(255, 255, 255, 0.04);
  position: relative;
  overflow: hidden;
  transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);
  text-align: center;
}
.sum-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.15), transparent);
  opacity: 0;
  transition: opacity 0.25s;
}
.sum-card:hover {
  transform: translateY(-2px);
  border-color: rgba(0, 212, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}
.sum-card:hover::before { opacity: 1; }

.sum-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 10px;
}
.sum-val {
  font-size: 22px;
  font-weight: 900;
  font-family: 'IBM Plex Mono', monospace;
  display: block;
  color: #e2e8f0;
}
.sum-val.critical { color: #ef4444; text-shadow: 0 0 16px rgba(239,68,68,0.2); }
.sum-val.warning { color: #f59e0b; text-shadow: 0 0 16px rgba(245,158,11,0.2); }
.sum-lbl {
  font-size: 9px;
  color: #475569;
  letter-spacing: 0.05em;
  margin-top: 6px;
  display: block;
  font-weight: 600;
  text-transform: uppercase;
}

/* ── Section ── */
.section { margin-bottom: 22px; }

.sec-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}
.sec-line {
  width: 24px;
  height: 1px;
  background: linear-gradient(90deg, #00d4ff, transparent);
  opacity: 0.5;
}
.sec-title {
  font-size: 11px;
  font-weight: 700;
  color: #64748b;
  margin: 0;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

/* ── Table ── */
.table-wrap {
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.03);
  overflow: hidden;
  background: rgba(255, 255, 255, 0.01);
}
.tbl { width:100%; border-collapse:collapse; font-size: 10px; }
.tbl th {
  padding: 10px 12px;
  text-align: left;
  color: #475569;
  font-weight: 600;
  background: rgba(255,255,255,0.015);
  border-bottom: 1px solid rgba(255,255,255,0.04);
  white-space: nowrap;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  font-size: 9px;
}
.tbl td {
  padding: 10px 12px;
  color: #cbd5e1;
  border-bottom: 1px solid rgba(255,255,255,0.02);
  transition: background 0.15s;
}
.tbl tbody tr:last-child td { border-bottom: none; }
.tbl tbody tr:hover td { background: rgba(0, 212, 255, 0.02); }

.mono { font-family: 'IBM Plex Mono', monospace; font-size: 10px; }
.ref { color: #00d4ff; font-weight: 700; }

/* ── Tags ── */
.tag {
  font-size: 9px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 4px;
  letter-spacing: 0.04em;
}
.tag-new { color: #4ade80; background: rgba(74,222,128,0.08); border: 1px solid rgba(74,222,128,0.1); }
.tag-replace { color: #f59e0b; background: rgba(245,158,11,0.08); border: 1px solid rgba(245,158,11,0.1); }
.tag-cancel { color: #64748b; background: rgba(100,116,139,0.08); border: 1px solid rgba(100,116,139,0.1); text-decoration: line-through; }

.prio { font-size: 9px; font-weight: 800; padding: 2px 6px; border-radius: 4px; }
.prio-A { color: #ef4444; background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.15); }
.prio-B { color: #f59e0b; background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.15); }
.prio-M { color: #64748b; background: rgba(100,116,139,0.08); border: 1px solid rgba(100,116,139,0.1); }

/* ── Empty ── */
.no-data {
  text-align: center;
  padding: 48px;
  font-size: 11px;
  color: #334155;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
.no-data svg { color: #1e293b; }

/* ── Detail Cards ── */
.notam-detail-list { display:flex; flex-direction:column; gap:10px; }
.notam-card {
  padding: 16px;
  border-radius: 14px;
  background: rgba(255,255,255,0.01);
  border: 1px solid rgba(255,255,255,0.03);
  transition: all 0.2s;
  position: relative;
  overflow: hidden;
}
.notam-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0;
  width: 2px;
  height: 100%;
  background: linear-gradient(180deg, #00d4ff, transparent);
  opacity: 0;
  transition: opacity 0.2s;
}
.notam-card:hover {
  background: rgba(255,255,255,0.015);
  border-color: rgba(255,255,255,0.05);
  transform: translateX(2px);
}
.notam-card:hover::before { opacity: 0.5; }

.nc-head { display:flex; align-items:center; gap:10px; margin-bottom:8px; }
.nc-ref { font-size: 12px; font-weight: 700; color: #e2e8f0; }
.nc-date { font-size: 9px; color: #475569; margin-left:auto; }
.nc-summary { font-size: 11px; color: #cbd5e1; margin:0 0 8px; line-height: 1.6; }
.nc-facility {
  font-size: 10px;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 6px;
}
.nc-facility svg { color: #00d4ff; opacity: 0.6; }
</style>
