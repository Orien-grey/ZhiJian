<template>
  <div class="body">
    <!-- 跑道选择标签 -->
    <div class="rw-tabs">
      <button
        v-for="r in takeoffMinima"
        :key="r.runway"
        :class="activeRw === r.runway ? 'rwt sel' : 'rwt'"
        @click="activeRw = r.runway"
      >
        RWY {{ r.runway }}
      </button>
    </div>

    <!-- 起飞标准 -->
    <div class="section">
      <p class="sec-title">起飞最低标准 · RWY {{ activeRw }}</p>
      <table class="tbl">
        <thead><tr><th>条件</th><th>RVR</th></tr></thead>
        <tbody>
          <tr v-for="lp in activeTakeoff?.lowVisProcs" :key="lp.condition">
            <td>{{ lp.condition }}</td>
            <td class="mono val-highlight">{{ lp.rvr }}</td>
          </tr>
        </tbody>
      </table>
      <div class="std-box">
        <span class="std-lbl">基本起飞标准</span>
        <span class="mono">{{ activeTakeoff?.standard.vis }} / RVR {{ activeTakeoff?.standard.rvr }}</span>
      </div>
      <p v-for="(r, i) in activeTakeoff?.remarks" :key="i" class="remark">{{ r }}</p>
    </div>

    <!-- 着陆标准 -->
    <div class="section">
      <p class="sec-title">着陆最低标准 · RWY {{ activeRw }}</p>
      <table class="tbl">
        <thead>
          <tr><th>进近程序</th><th>机型</th><th>DH</th><th>RVR/VIS</th><th>灯光</th><th>备注</th></tr>
        </thead>
        <tbody>
          <tr v-for="lm in activeLanding" :key="lm.approach">
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { TakeoffMinima, LandingMinima } from '@/views/dashboard/mock/airportDetail'

const props = defineProps<{
  takeoffMinima: TakeoffMinima[]
  landingMinima: LandingMinima[]
}>()

const activeRw = ref(props.takeoffMinima[0]?.runway || '07')

const activeTakeoff = computed(() => props.takeoffMinima.find(t => t.runway === activeRw.value))
const activeLanding = computed(() => props.landingMinima.filter(l => l.runway === activeRw.value))
</script>

<style scoped>
.body { flex:1; overflow-y:auto; padding:20px 22px; scrollbar-width:thin; scrollbar-color:rgba(0,180,240,0.1) transparent; }
.body::-webkit-scrollbar { width:4px; }
.body::-webkit-scrollbar-thumb { background:rgba(0,180,240,0.1); border-radius:4px; }

.rw-tabs { display:flex; gap:8px; margin-bottom:16px; }
.rwt { padding:5px 16px; border-radius:5px; font-size:11px; cursor:pointer; background:rgba(255,255,255,0.01); color:#475569; border:1px solid rgba(255,255,255,0.05); font-family:'IBM Plex Mono',monospace; }
.rwt.sel { background:rgba(0,180,240,0.07); color:#00b8e6; border-color:rgba(0,180,240,0.2); }

.section { margin-bottom:18px; }
.sec-title { font-size:11px; font-weight:600; color:#64748b; margin:0 0 10px; letter-spacing:0.06em; text-transform:uppercase; }
.tbl { width:100%; border-collapse:collapse; font-size:10.5px; }
.tbl th { padding:7px 10px; text-align:left; color:#475569; font-weight:500; background:rgba(255,255,255,0.015); border-bottom:1px solid rgba(255,255,255,0.05); white-space:nowrap; }
.tbl td { padding:7px 10px; color:#cbd5e1; border-bottom:1px solid rgba(255,255,255,0.01); }
.tbl tr:hover td { background:rgba(0,180,240,0.02); }
.mono { font-family:'IBM Plex Mono',monospace; font-size:10px; }
.val-highlight { color:#00b8e6; font-weight:600; }
.val-warn { color:#ef4444; font-weight:700; }
.remark { font-size:10px; color:#64748b; margin:4px 0; }
.remark-cell { font-size:9.5px; color:#64748b; }
.std-box { display:flex; align-items:center; gap:10px; margin:10px 0; padding:8px 12px; border-radius:6px; background:rgba(0,180,240,0.04); border:1px solid rgba(0,180,240,0.07); font-size:11px; }
.std-lbl { color:#64748b; }
</style>
