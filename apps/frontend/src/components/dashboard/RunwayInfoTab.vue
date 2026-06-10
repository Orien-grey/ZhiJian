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
        <span class="rwt-id">RWY {{ r.id }}</span>
        <span class="rwt-glow" v-if="activeRw === r.id"></span>
      </button>
    </div>

    <!-- 跑道实物规格 -->
    <div class="section">
      <div class="sec-header">
        <span class="sec-line"></span>
        <p class="sec-title">跑道规格 · RWY {{ activeRw }}</p>
        <span class="sec-line" style="flex:1"></span>
      </div>
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
      <p v-if="activeRwSpec?.remarks" class="spec-remark">
        <span class="remark-icon">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
        </span>
        {{ activeRwSpec?.remarks }}
      </p>
    </div>

    <!-- 起飞标准 -->
    <div v-if="activeTakeoff.length" class="section">
      <div class="sec-header">
        <span class="sec-line"></span>
        <p class="sec-title">起飞最低标准 · RWY {{ activeRw }}</p>
        <span class="sec-line" style="flex:1"></span>
      </div>
      <div v-for="tk in activeTakeoff" :key="tk.runway" class="sub-section">
        <p class="sub-title mono">
          <span class="dir-badge">{{ tk.runway }}</span>
          <span>（{{ tk.aircraftCat }}类）</span>
        </p>
        <div class="table-wrap">
          <table class="tbl">
            <thead><tr><th>条件</th><th>RVR</th></tr></thead>
            <tbody>
              <tr v-for="lp in tk.lowVisProcs" :key="lp.condition">
                <td>{{ lp.condition }}</td>
                <td class="mono val-highlight">{{ lp.rvr }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="std-box">
          <span class="std-lbl">基本起飞标准</span>
          <span class="mono std-val">{{ tk.standard.vis }} / RVR {{ tk.standard.rvr }}</span>
        </div>
        <div class="remark-list">
          <p v-for="(r, i) in tk.remarks" :key="i" class="remark">{{ r }}</p>
        </div>
      </div>
    </div>
    <div v-else class="empty-hint">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
      该跑道无起飞标准数据
    </div>

    <!-- 着陆标准 -->
    <div v-if="activeLanding.length" class="section">
      <div class="sec-header">
        <span class="sec-line"></span>
        <p class="sec-title">着陆最低标准 · RWY {{ activeRw }}</p>
        <span class="sec-line" style="flex:1"></span>
      </div>
      <div class="table-wrap">
        <table class="tbl landing-tbl">
          <thead>
            <tr><th>方向</th><th>进近程序</th><th>机型</th><th>DH</th><th>RVR/VIS</th><th>灯光</th><th>备注</th></tr>
          </thead>
          <tbody>
            <tr v-for="lm in activeLanding" :key="lm.runway + lm.approach">
              <td class="mono">
                <span class="dir-badge">{{ lm.runway }}</span>
              </td>
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
    <div v-else class="empty-hint">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
      该跑道无着陆标准数据
    </div>
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
.body { flex:1; overflow-y:auto; padding:24px 26px; scrollbar-width:thin; scrollbar-color:rgba(0,180,240,0.1) transparent; }
.body::-webkit-scrollbar { width:4px; }
.body::-webkit-scrollbar-thumb { background:rgba(0,180,240,0.1); border-radius:4px; }

/* ── Runway Tabs ── */
.rw-tabs { display:flex; gap:10px; margin-bottom:22px; flex-wrap:wrap; }
.rwt {
  position: relative;
  padding: 8px 20px;
  border-radius: 10px;
  font-size: 12px;
  cursor: pointer;
  background: rgba(255,255,255,0.015);
  color: #475569;
  border: 1px solid rgba(255,255,255,0.05);
  font-family: 'IBM Plex Mono', monospace;
  font-weight: 600;
  overflow: hidden;
  transition: all 0.25s;
}
.rwt:hover {
  background: rgba(255,255,255,0.03);
  color: #94a3b8;
}
.rwt.sel {
  background: rgba(0, 212, 255, 0.06);
  color: #00d4ff;
  border-color: rgba(0, 212, 255, 0.15);
}
.rwt-glow {
  position: absolute;
  bottom: 0; left: 15%; right: 15%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #00d4ff, transparent);
  border-radius: 2px;
  box-shadow: 0 -2px 10px rgba(0, 212, 255, 0.3);
}

/* ── Section ── */
.section { margin-bottom: 24px; }

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

.sub-section {
  margin-bottom: 16px;
  padding: 14px 16px;
  background: rgba(255,255,255,0.01);
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.03);
}
.sub-title {
  font-size: 11px;
  color: #94a3b8;
  margin: 0 0 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* ── Spec Grid ── */
.spec-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px 16px; margin-bottom:10px; }
.spec-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  background: rgba(255,255,255,0.015);
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.03);
  transition: all 0.15s;
}
.spec-item:hover {
  background: rgba(0, 212, 255, 0.02);
  border-color: rgba(0, 212, 255, 0.06);
}
.spec-label { font-size: 10px; color: #475569; font-weight: 500; letter-spacing: 0.03em; }
.spec-val { font-size: 12px; color: #e2e8f0; text-align: right; font-weight: 600; }
.spec-remark {
  font-size: 10.5px;
  color: #5a6a82;
  margin: 10px 0 0;
  line-height: 1.6;
  padding: 12px 14px;
  background: rgba(0, 212, 255, 0.02);
  border-radius: 10px;
  border-left: 2px solid rgba(0, 212, 255, 0.2);
  display: flex;
  align-items: flex-start;
  gap: 8px;
}
.remark-icon {
  color: #00d4ff;
  flex-shrink: 0;
  margin-top: 1px;
}

/* ── Table ── */
.table-wrap {
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.03);
  overflow: hidden;
  background: rgba(255, 255, 255, 0.01);
}
.tbl { width:100%; border-collapse:collapse; font-size: 11px; }
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
  border-bottom: 1px solid rgba(255,255,255,0.01);
  transition: background 0.15s;
}
.tbl tbody tr:last-child td { border-bottom: none; }
.tbl tbody tr:hover td { background: rgba(0, 212, 255, 0.02); }

.landing-tbl { font-size: 10px; }

.dir-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 5px;
  background: rgba(0, 212, 255, 0.06);
  border: 1px solid rgba(0, 212, 255, 0.1);
  color: #00d4ff;
  font-weight: 700;
  font-size: 9px;
}

.mono { font-family: 'IBM Plex Mono', monospace; font-size: 10px; }
.val-highlight { color: #00d4ff; font-weight: 700; }
.val-warn { color: #ef4444; font-weight: 700; }

.remark-list { margin-top: 8px; display: flex; flex-direction: column; gap: 4px; }
.remark { font-size: 10px; color: #64748b; margin: 0; padding-left: 12px; position: relative; }
.remark::before { content: '·'; position: absolute; left: 2px; color: #475569; }

.remark-cell { font-size: 9.5px; color: #64748b; max-width: 180px; }

/* ── Standard Box ── */
.std-box {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 12px 0;
  padding: 10px 14px;
  border-radius: 10px;
  background: rgba(0, 212, 255, 0.04);
  border: 1px solid rgba(0, 212, 255, 0.07);
  font-size: 11px;
}
.std-lbl { color: #64748b; font-weight: 500; }
.std-val { color: #e2e8f0; font-weight: 600; }

/* ── Empty Hint ── */
.empty-hint {
  font-size: 11px;
  color: #334155;
  text-align: center;
  padding: 32px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
.empty-hint svg { color: #1e293b; }
</style>
