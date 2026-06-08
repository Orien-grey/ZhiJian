<template>
  <div class="body">
    <!-- 跑道选择标签 -->
    <div class="rw-tabs">
      <button
        v-for="r in runways"
        :key="r.id"
        :class="activeRw === r.id ? 'rwt sel' : 'rwt'"
        @click="activeRw = r.id"
      >
        RWY {{ r.id }}
      </button>
    </div>

    <!-- 跑道实物规格 -->
    <div class="section">
      <p class="sec-title">跑道规格 · RWY {{ activeRw }}</p>
      <div class="spec-grid">
        <div class="spec-item">
          <span class="spec-label">长度</span>
          <span class="spec-val mono">{{ activeRwSpec?.length }}</span>
        </div>
        <div class="spec-item">
          <span class="spec-label">宽度</span>
          <span class="spec-val mono">{{ activeRwSpec?.width }}</span>
        </div>
        <div class="spec-item">
          <span class="spec-label">道面</span>
          <span class="spec-val">{{ activeRwSpec?.surface }}</span>
        </div>
        <div class="spec-item">
          <span class="spec-label">PCN</span>
          <span class="spec-val mono">{{ activeRwSpec?.pcn }}</span>
        </div>
        <div class="spec-item">
          <span class="spec-label">ILS</span>
          <span class="spec-val mono">{{ activeRwSpec?.ils }}</span>
        </div>
        <div class="spec-item">
          <span class="spec-label">灯光系统</span>
          <span class="spec-val mono">{{ activeRwSpec?.lights }}</span>
        </div>
        <div class="spec-item">
          <span class="spec-label">用途</span>
          <span class="spec-val">{{ activeRwSpec?.usage }}</span>
        </div>
      </div>
      <p v-if="activeRwSpec?.remarks" class="spec-remark">{{ activeRwSpec?.remarks }}</p>
    </div>

    <!-- 起飞标准 -->
    <div v-if="activeTakeoff.length" class="section">
      <p class="sec-title">起飞最低标准 · RWY {{ activeRw }}</p>
      <div v-for="tk in activeTakeoff" :key="tk.runway" class="sub-section">
        <p class="sub-title mono">方向 {{ tk.runway }}（{{ tk.aircraftCat }}类）</p>
        <table class="tbl">
          <thead><tr><th>条件</th><th>RVR</th></tr></thead>
          <tbody>
            <tr v-for="lp in tk.lowVisProcs" :key="lp.condition">
              <td>{{ lp.condition }}</td>
              <td class="mono val-highlight">{{ lp.rvr }}</td>
            </tr>
          </tbody>
        </table>
        <div class="std-box">
          <span class="std-lbl">基本起飞标准</span>
          <span class="mono">{{ tk.standard.vis }} / RVR {{ tk.standard.rvr }}</span>
        </div>
        <p v-for="(r, i) in tk.remarks" :key="i" class="remark">{{ r }}</p>
      </div>
    </div>
    <div v-else class="empty-hint">该跑道无起飞标准数据</div>

    <!-- 着陆标准 -->
    <div v-if="activeLanding.length" class="section">
      <p class="sec-title">着陆最低标准 · RWY {{ activeRw }}</p>
      <table class="tbl landing-tbl">
        <thead>
          <tr><th>方向</th><th>进近程序</th><th>机型</th><th>DH</th><th>RVR/VIS</th><th>灯光</th><th>备注</th></tr>
        </thead>
        <tbody>
          <tr v-for="lm in activeLanding" :key="lm.runway + lm.approach">
            <td class="mono">{{ lm.runway }}</td>
            <td class="mono">{{ lm.approach }}</td>
            <td>{{ lm.aircraftCat }}</td>
            <td class="mono" :class="{ 'val-warn': lm.dh.includes('30m') || lm.dh.includes('15m') }">{{ lm.dh }}</td>
            <td class="mono val-highlight">{{ lm.rvrVis }}</td>
            <td class="mono">{{ lm.als }}</td>
            <td class="remark-cell">{{ lm.remarks }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="empty-hint">该跑道无着陆标准数据</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { RunwaySpec, TakeoffMinima, LandingMinima } from '@/views/dashboard/mock/airportDetail'

const props = defineProps<{
  runways: RunwaySpec[]
  takeoffMinima: TakeoffMinima[]
  landingMinima: LandingMinima[]
}>()

const activeRw = ref(props.runways[0]?.id || '')

const activeRwSpec = computed(() => props.runways.find(r => r.id === activeRw.value))

// 提取选中跑道ID中的两个方向
const activeDirs = computed(() => activeRw.value.split('/'))

const activeTakeoff = computed(() =>
  props.takeoffMinima.filter(t => activeDirs.value.includes(t.runway))
)
const activeLanding = computed(() =>
  props.landingMinima.filter(l => activeDirs.value.includes(l.runway))
)
</script>

<style scoped>
.body { flex:1; overflow-y:auto; padding:20px 22px; scrollbar-width:thin; scrollbar-color:rgba(0,180,240,0.1) transparent; }
.body::-webkit-scrollbar { width:4px; }
.body::-webkit-scrollbar-thumb { background:rgba(0,180,240,0.1); border-radius:4px; }

.rw-tabs { display:flex; gap:8px; margin-bottom:16px; flex-wrap:wrap; }
.rwt { padding:5px 16px; border-radius:5px; font-size:11px; cursor:pointer; background:rgba(255,255,255,0.01); color:#475569; border:1px solid rgba(255,255,255,0.05); font-family:'IBM Plex Mono',monospace; }
.rwt.sel { background:rgba(0,180,240,0.07); color:#00b8e6; border-color:rgba(0,180,240,0.2); }

.section { margin-bottom:18px; }
.sec-title { font-size:11px; font-weight:600; color:#64748b; margin:0 0 10px; letter-spacing:0.06em; text-transform:uppercase; }
.sub-section { margin-bottom:12px; padding:10px 12px; background:rgba(255,255,255,0.01); border-radius:6px; border:1px solid rgba(255,255,255,0.03); }
.sub-title { font-size:10px; color:#94a3b8; margin:0 0 8px; }

/* 跑道规格网格 */
.spec-grid { display:grid; grid-template-columns:1fr 1fr; gap:6px 16px; margin-bottom:8px; }
.spec-item { display:flex; justify-content:space-between; align-items:center; padding:6px 10px; background:rgba(255,255,255,0.015); border-radius:5px; border:1px solid rgba(255,255,255,0.03); }
.spec-label { font-size:10px; color:#475569; }
.spec-val { font-size:11px; color:#cbd5e1; text-align:right; }
.spec-remark { font-size:10px; color:#64748b; margin:4px 0 0; line-height:1.6; padding:8px 10px; background:rgba(0,180,240,0.02); border-radius:5px; border-left:2px solid rgba(0,180,240,0.2); }

.tbl { width:100%; border-collapse:collapse; font-size:10.5px; }
.tbl th { padding:7px 10px; text-align:left; color:#475569; font-weight:500; background:rgba(255,255,255,0.015); border-bottom:1px solid rgba(255,255,255,0.05); white-space:nowrap; }
.tbl td { padding:7px 10px; color:#cbd5e1; border-bottom:1px solid rgba(255,255,255,0.01); }
.tbl tr:hover td { background:rgba(0,180,240,0.02); }
.landing-tbl { font-size:10px; }
.mono { font-family:'IBM Plex Mono',monospace; font-size:10px; }
.val-highlight { color:#00b8e6; font-weight:600; }
.val-warn { color:#ef4444; font-weight:700; }
.remark { font-size:10px; color:#64748b; margin:4px 0; }
.remark-cell { font-size:9.5px; color:#64748b; max-width:180px; }
.std-box { display:flex; align-items:center; gap:10px; margin:10px 0; padding:8px 12px; border-radius:6px; background:rgba(0,180,240,0.04); border:1px solid rgba(0,180,240,0.07); font-size:11px; }
.std-lbl { color:#64748b; }

.empty-hint { font-size:10px; color:#334155; text-align:center; padding:12px 0; }
</style>
