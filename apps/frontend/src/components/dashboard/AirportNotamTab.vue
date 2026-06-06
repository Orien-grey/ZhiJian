<template>
  <div class="body">
    <div class="summary-row">
      <div class="sum-item"><span class="sum-val critical">{{ notams.length }}</span><span class="sum-lbl">当前有效</span></div>
      <div class="sum-item"><span class="sum-val warning">{{ aNotams.length }}</span><span class="sum-lbl">A 类（紧急）</span></div>
      <div class="sum-item"><span class="sum-val">{{ bNotams.length }}</span><span class="sum-lbl">B 类</span></div>
      <div class="sum-item"><span class="sum-val">{{ mNotams.length }}</span><span class="sum-lbl">M 类（杂项）</span></div>
    </div>

    <table class="tbl" v-if="notams.length">
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

    <div v-if="!notams.length" class="no-data">该机场暂无 NOTAM 记录</div>

    <!-- 详情列表 -->
    <div class="notam-detail-list" v-if="notams.length">
      <p class="sec-title">NOTAM 详情</p>
      <div v-for="n in notams" :key="'d-'+n.id" class="notam-card">
        <div class="nc-head">
          <span class="nc-ref mono">{{ n.ref }}</span>
          <span class="tag" :class="'tag-'+n.type">{{ typeLabel(n.type) }}</span>
          <span class="nc-date mono">{{ n.startDate }} → {{ n.endDate }}</span>
        </div>
        <p class="nc-summary">{{ n.summary }}</p>
        <span class="nc-facility mono">📍 {{ n.affectedFacility }}</span>
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
.body { flex:1; overflow-y:auto; padding:18px 20px; scrollbar-width:thin; scrollbar-color:rgba(0,180,240,0.08) transparent; }
.body::-webkit-scrollbar { width:3px; }
.body::-webkit-scrollbar-thumb { background:rgba(0,180,240,0.08); border-radius:3px; }

.summary-row { display:grid; grid-template-columns:repeat(4,1fr); gap:10px; margin-bottom:18px; }
.sum-item { padding:12px; border-radius:6px; background:rgba(255,255,255,0.015); border:1px solid rgba(255,255,255,0.04); text-align:center; }
.sum-val { font-size:20px; font-weight:900; font-family:'IBM Plex Mono',monospace; display:block; color:#e2e8f0; }
.sum-val.critical { color:#ef4444; }
.sum-val.warning { color:#f59e0b; }
.sum-lbl { font-size:9px; color:#475569; letter-spacing:0.04em; margin-top:4px; display:block; }

.tbl { width:100%; border-collapse:collapse; font-size:10px; margin-bottom:18px; }
.tbl th { padding:6px 8px; text-align:left; color:#475569; font-weight:500; background:rgba(255,255,255,0.015); border-bottom:1px solid rgba(255,255,255,0.04); white-space:nowrap; }
.tbl td { padding:6px 8px; color:#cbd5e1; border-bottom:1px solid rgba(255,255,255,0.02); }
.tbl tr:hover td { background:rgba(0,180,240,0.02); }
.mono { font-family:'IBM Plex Mono',monospace; font-size:10px; }
.ref { color:#00b8e6; font-weight:600; }

.tag { font-size:8px; font-weight:700; padding:1px 6px; border-radius:3px; letter-spacing:0.04em; }
.tag-new { color:#4ade80; background:rgba(74,222,128,0.08); }
.tag-replace { color:#f59e0b; background:rgba(245,158,11,0.08); }
.tag-cancel { color:#64748b; background:rgba(100,116,139,0.08); text-decoration:line-through; }

.prio { font-size:8px; font-weight:800; padding:1px 5px; border-radius:3px; }
.prio-A { color:#ef4444; background:rgba(239,68,68,0.1); }
.prio-B { color:#f59e0b; background:rgba(245,158,11,0.1); }
.prio-M { color:#64748b; background:rgba(100,116,139,0.08); }

.no-data { text-align:center; padding:40px; font-size:11px; color:#334155; }

.sec-title { font-size:11px; font-weight:600; color:#64748b; margin:0 0 10px; letter-spacing:0.06em; text-transform:uppercase; }
.notam-detail-list { display:flex; flex-direction:column; gap:8px; }
.notam-card { padding:12px; border-radius:6px; background:rgba(255,255,255,0.01); border:1px solid rgba(255,255,255,0.03); }
.nc-head { display:flex; align-items:center; gap:8px; margin-bottom:6px; }
.nc-ref { font-size:11px; font-weight:700; color:#e2e8f0; }
.nc-date { font-size:9px; color:#475569; margin-left:auto; }
.nc-summary { font-size:10.5px; color:#cbd5e1; margin:0 0 4px; line-height:1.5; }
.nc-facility { font-size:9px; color:#64748b; }
</style>
