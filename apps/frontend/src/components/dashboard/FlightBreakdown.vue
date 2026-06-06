<template>
  <div class="section">
    <p class="sec-title">延误影响分解</p>

    <div class="grid-4">
      <div class="card"><span class="clbl">原计划飞行</span><span class="cval mono">{{ flightMinutes }} min</span></div>
      <div class="card"><span class="clbl">预计延误</span><span class="cval mono critical">{{ delayMinutes }} min</span></div>
      <div class="card"><span class="clbl">额外油耗</span><span class="cval mono warn">{{ extraFuel }} kg</span></div>
      <div class="card"><span class="clbl">延误成本</span><span class="cval mono warn">¥{{ delayCost }}</span></div>
    </div>

    <table class="tbl">
      <thead><tr><th>影响因子</th><th>延误贡献</th><th>详情</th></tr></thead>
      <tbody>
        <tr v-for="f in factors" :key="f.name">
          <td class="mono">{{ f.name }}</td>
          <td><span class="tag" :class="'tag-'+f.severity">{{ f.contribution }} min</span></td>
          <td class="detail-cell">{{ f.detail }}</td>
        </tr>
        <tr class="total-row"><td class="mono" style="font-weight:700">合计</td><td class="mono" style="color:#ef4444;font-weight:700">{{ delayMinutes }} min</td><td>—</td></tr>
      </tbody>
    </table>

    <div class="fuel-section">
      <p class="sec-title" style="margin-top:14px">燃油计算（备选航线对比）</p>
      <table class="tbl">
        <thead><tr><th>航线</th><th>距离 (NM)</th><th>飞行时间</th><th>燃油量 (kg)</th><th>vs 原计划</th></tr></thead>
        <tbody>
          <tr>
            <td class="mono">原计划</td><td class="mono">{{ originalDist }}</td><td class="mono">{{ flightMinutes }} min</td><td class="mono">{{ baseFuel }} kg</td><td class="mono" style="color:#64748b">基准</td>
          </tr>
          <tr v-for="r in routeFuels" :key="r.name">
            <td class="mono" style="color:#38bdf8">{{ r.name }}</td><td class="mono">{{ r.distance }}</td><td class="mono">{{ r.flightTime }} min</td><td class="mono">{{ r.fuel }} kg</td>
            <td class="mono" :class="r.delta > 0 ? 'warn' : ''">{{ r.delta > 0 ? '+' : '' }}{{ r.delta }} kg</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="crew-notes">
      <p class="sec-title">机组提示</p>
      <div class="note">
        <span class="note-icon">📋</span>
        <div class="note-body">
          <p class="note-title">签派放行建议</p>
          <p class="note-text">预计延误 {{ delayMinutes }} 分钟，建议机长在起飞前确认最新 NOTAM。备选航线 {{ routeFuels.length > 0 ? routeFuels[0].name : 'N/A' }} 额外燃油 {{ routeFuels.length > 0 ? routeFuels[0].delta : 0 }} kg，空中等待能力增加 {{ Math.round(delayMinutes * 0.8) }} 分钟。</p>
        </div>
      </div>
      <div class="note">
        <span class="note-icon">⚠️</span>
        <div class="note-body">
          <p class="note-title">风险提示</p>
          <p class="note-text">航路存在 {{ restrictionCount }} 个活跃限制区，影响高度层 FL{{ minRestrictionAlt }}-FL{{ maxRestrictionAlt }}。建议选择无限制航路点的备选航线，或申请高度偏离许可。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  flightNo: string; delayMinutes: number; flightMinutes: number
  restrictionCount: number; minRestrictionAlt: number; maxRestrictionAlt: number
  routeFuels: { name: string; distance: number; flightTime: number; fuel: number; delta: number }[]
}>()

const originalDist = computed(() => props.routeFuels.length > 0 ? props.routeFuels[0].distance - 40 : 680)
const baseFuel = computed(() => Math.round(props.flightMinutes * 22))
const extraFuel = computed(() => Math.round(props.delayMinutes * 18))
const delayCost = computed(() => (props.delayMinutes * 280).toLocaleString())

const factors = computed(() => [
  { name:'A2253/26', contribution: Math.round(props.delayMinutes * 0.4), severity:'critical', detail:'ZBAA 禁航区占用航路，需绕飞' },
  { name:'流控限制', contribution: Math.round(props.delayMinutes * 0.25), severity:'warning', detail:'ZSPD 终端区流控，起飞间隔增大' },
  { name:'跑道关闭', contribution: Math.round(props.delayMinutes * 0.2), severity:'warning', detail:'18R/36L 仅剩单跑道运行' },
  { name:'天气影响', contribution: Math.round(props.delayMinutes * 0.15), severity:'info', detail:'航路颠簸区域，需减速通过' },
])
</script>

<style scoped>
.section { padding:18px 20px; border-bottom:1px solid rgba(0,212,255,0.05); }
.sec-title { font-size:11px; font-weight:600; color:#64748b; margin:0 0 10px; letter-spacing:0.06em; text-transform:uppercase; }
.mono { font-family:'IBM Plex Mono',monospace; }

.grid-4 { display:grid; grid-template-columns:repeat(4,1fr); gap:10px; margin-bottom:16px; }
.card { padding:12px; border-radius:6px; background:rgba(255,255,255,0.015); border:1px solid rgba(255,255,255,0.04); text-align:center; }
.clbl { font-size:9px; color:#475569; display:block; margin-bottom:4px; }
.cval { font-size:18px; font-weight:900; }
.cval.critical { color:#ef4444; }
.cval.warn { color:#f59e0b; }

.tbl { width:100%; border-collapse:collapse; font-size:10px; margin-bottom:8px; }
.tbl th { padding:5px 8px; text-align:left; color:#475569; font-weight:500; background:rgba(255,255,255,0.015); border-bottom:1px solid rgba(255,255,255,0.04); white-space:nowrap; }
.tbl td { padding:5px 8px; color:#cbd5e1; border-bottom:1px solid rgba(255,255,255,0.02); }
.tbl tr:hover td { background:rgba(0,180,240,0.02); }
.total-row td { border-top:1px solid rgba(255,255,255,0.06); }
.detail-cell { font-size:9px; color:#64748b; }
.warn { color:#f59e0b !important; }

.tag { font-size:8px; font-weight:700; padding:1px 5px; border-radius:3px; }
.tag-critical { background:rgba(239,68,68,0.08); color:#ef4444; }
.tag-warning { background:rgba(245,158,11,0.08); color:#f59e0b; }
.tag-info { background:rgba(100,116,139,0.08); color:#94a3b8; }

.fuel-section { margin-top:4px; }

.crew-notes { display:flex; flex-direction:column; gap:10px; margin-top:14px; }
.note { display:flex; gap:10px; padding:12px; border-radius:6px; background:rgba(255,255,255,0.01); border:1px solid rgba(255,255,255,0.03); }
.note-icon { font-size:14px; flex-shrink:0; margin-top:1px; }
.note-body { min-width:0; }
.note-title { font-size:10px; font-weight:700; color:#e2e8f0; margin:0 0 3px; }
.note-text { font-size:9.5px; color:#94a3b8; margin:0; line-height:1.6; }
</style>
