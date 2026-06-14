<template>
  <div class="section">
    <!-- 延误影响分解 -->
    <div class="sec-header">
      <div class="sec-title-wrap">
        <div class="sec-icon">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="1" y="1" width="12" height="12" rx="2" stroke="rgba(239,68,68,0.5)" stroke-width="1.2" fill="none"/>
            <line x1="4" y1="7" x2="10" y2="7" stroke="rgba(239,68,68,0.5)" stroke-width="1.2"/>
            <line x1="7" y1="4" x2="7" y2="10" stroke="rgba(239,68,68,0.5)" stroke-width="1.2"/>
          </svg>
        </div>
        <p class="sec-title">延误影响分解</p>
      </div>
      <div class="sec-badge">
        <span class="sec-badge-dot" />
        <span class="sec-badge-text">实时计算</span>
      </div>
    </div>

    <!-- 四宫格指标卡片 -->
    <div class="grid-4">
      <div class="metric-card" v-for="(m, i) in metrics" :key="i">
        <div class="metric-glow" :class="m.glowClass" />
        <span class="clbl">{{ m.label }}</span>
        <span class="cval mono" :class="m.valClass">{{ m.value }}</span>
        <div class="metric-bar" v-if="m.bar">
          <div class="metric-bar-fill" :class="m.barClass" :style="{ width: m.bar }" />
        </div>
      </div>
    </div>

    <!-- 影响因子表格 -->
    <div class="table-wrap">
      <table class="tbl">
        <thead>
          <tr>
            <th>影响因子</th>
            <th>延误贡献</th>
            <th>详情</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="f in factors" :key="f.name">
            <td>
              <div class="factor-name">
                <span class="factor-dot" :class="'dot-'+f.severity" />
                <span class="mono">{{ f.name }}</span>
              </div>
            </td>
            <td>
              <div class="tag-wrap">
                <span class="tag" :class="'tag-'+f.severity">{{ f.contribution }} min</span>
                <div class="tag-bar" :class="'bar-'+f.severity" :style="{ width: Math.min(f.contribution / delayMinutes * 100, 100) + '%' }" />
              </div>
            </td>
            <td class="detail-cell">{{ f.detail }}</td>
          </tr>
          <tr class="total-row">
            <td>
              <div class="factor-name">
                <span class="factor-dot dot-total" />
                <span class="mono" style="font-weight:800">合计</span>
              </div>
            </td>
            <td class="mono" style="color:#ef4444;font-weight:800;font-size:12px">{{ delayMinutes }} min</td>
            <td style="color:#475569">—</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 燃油计算 -->
    <div class="fuel-section">
      <div class="sec-header" style="margin-top:20px">
        <div class="sec-title-wrap">
          <div class="sec-icon" style="background:rgba(245,158,11,0.08);border-color:rgba(245,158,11,0.15)">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1v10M4 4h6M4 8h6" stroke="rgba(245,158,11,0.6)" stroke-width="1.2" stroke-linecap="round"/>
            </svg>
          </div>
          <p class="sec-title">燃油计算（备选航线对比）</p>
        </div>
      </div>

      <div class="table-wrap">
        <table class="tbl">
          <thead>
            <tr>
              <th>航线</th>
              <th>距离 (NM)</th>
              <th>飞行时间</th>
              <th>燃油量 (kg)</th>
              <th>vs 原计划</th>
            </tr>
          </thead>
          <tbody>
            <tr class="base-row">
              <td>
                <div class="factor-name">
                  <span class="factor-dot" style="background:#38bdf8" />
                  <span class="mono">原计划</span>
                </div>
              </td>
              <td class="mono">{{ originalDist }}</td>
              <td class="mono">{{ flightMinutes }} min</td>
              <td class="mono">{{ baseFuel }} kg</td>
              <td class="mono" style="color:#64748b">基准</td>
            </tr>
            <tr v-for="r in routeFuels" :key="r.name">
              <td>
                <div class="factor-name">
                  <span class="factor-dot" style="background:rgba(100,116,139,0.5)" />
                  <span class="mono" style="color:#38bdf8">{{ r.name }}</span>
                </div>
              </td>
              <td class="mono">{{ r.distance }}</td>
              <td class="mono">{{ r.flightTime }} min</td>
              <td class="mono">{{ r.fuel }} kg</td>
              <td class="mono" :class="r.delta > 0 ? 'warn' : ''">{{ r.delta > 0 ? '+' : '' }}{{ r.delta }} kg</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 机组提示 -->
    <div class="crew-section">
      <div class="sec-header">
        <div class="sec-title-wrap">
          <div class="sec-icon" style="background:rgba(56,189,248,0.08);border-color:rgba(56,189,248,0.15)">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1l1.5 3.5h3.5L9.5 7l1 3.5L7 8.5 3.5 10.5l1-3.5L2 4.5h3.5L7 1z" stroke="rgba(56,189,248,0.6)" stroke-width="1.2" fill="none" stroke-linejoin="round"/>
            </svg>
          </div>
          <p class="sec-title">机组提示</p>
        </div>
      </div>

      <div class="notes-grid">
        <div class="note-card">
          <div class="note-accent" style="background:rgba(56,189,248,0.3)" />
          <div class="note-content">
            <div class="note-header">
              <div class="note-icon-wrap" style="background:rgba(56,189,248,0.08);border-color:rgba(56,189,248,0.15)">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect x="2" y="2" width="10" height="10" rx="1" stroke="rgba(56,189,248,0.7)" stroke-width="1.2" fill="none"/>
                  <line x1="4" y1="5" x2="10" y2="5" stroke="rgba(56,189,248,0.5)" stroke-width="1"/>
                  <line x1="4" y1="7.5" x2="8" y2="7.5" stroke="rgba(56,189,248,0.5)" stroke-width="1"/>
                  <line x1="4" y1="10" x2="6" y2="10" stroke="rgba(56,189,248,0.5)" stroke-width="1"/>
                </svg>
              </div>
              <p class="note-title">签派放行建议</p>
            </div>
            <p class="note-text">预计延误 {{ delayMinutes }} 分钟，建议机长在起飞前确认最新 NOTAM。备选航线 {{ routeFuels.length > 0 ? routeFuels[0].name : 'N/A' }} 额外燃油 {{ routeFuels.length > 0 ? routeFuels[0].delta : 0 }} kg，空中等待能力增加 {{ Math.round(delayMinutes * 0.8) }} 分钟。</p>
          </div>
        </div>

        <div class="note-card">
          <div class="note-accent" style="background:rgba(239,68,68,0.3)" />
          <div class="note-content">
            <div class="note-header">
              <div class="note-icon-wrap" style="background:rgba(239,68,68,0.08);border-color:rgba(239,68,68,0.15)">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1l6 11H1L7 1z" stroke="rgba(239,68,68,0.7)" stroke-width="1.2" fill="none" stroke-linejoin="round"/>
                  <line x1="7" y1="5" x2="7" y2="8" stroke="rgba(239,68,68,0.7)" stroke-width="1.5" stroke-linecap="round"/>
                  <circle cx="7" cy="10.5" r="0.8" fill="rgba(239,68,68,0.7)"/>
                </svg>
              </div>
              <p class="note-title">风险提示</p>
            </div>
            <p class="note-text">航路存在 {{ restrictionCount }} 个活跃限制区，影响高度层 FL{{ minRestrictionAlt }}-FL{{ maxRestrictionAlt }}。建议选择无限制航路点的备选航线，或申请高度偏离许可。</p>
          </div>
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

const metrics = computed(() => [
  { label: '原计划飞行', value: `${props.flightMinutes} min`, valClass: '', glowClass: '', bar: '100%', barClass: 'bar-blue' },
  { label: '预计延误', value: `${props.delayMinutes} min`, valClass: 'critical', glowClass: 'glow-red', bar: `${Math.min(props.delayMinutes / props.flightMinutes * 100, 100)}%`, barClass: 'bar-red' },
  { label: '额外油耗', value: `${extraFuel.value} kg`, valClass: 'warn', glowClass: 'glow-amber', bar: `${Math.min(extraFuel.value / baseFuel.value * 100, 100)}%`, barClass: 'bar-amber' },
  { label: '延误成本', value: `¥${delayCost.value}`, valClass: 'warn', glowClass: 'glow-amber', bar: `${Math.min(props.delayMinutes / 120 * 100, 100)}%`, barClass: 'bar-amber' },
])

const factors = computed(() => [
  { name:'A2253/26', contribution: Math.round(props.delayMinutes * 0.4), severity:'critical', detail:'ZBAA 禁航区占用航路，需绕飞' },
  { name:'流控限制', contribution: Math.round(props.delayMinutes * 0.25), severity:'warning', detail:'ZSPD 终端区流控，起飞间隔增大' },
  { name:'跑道关闭', contribution: Math.round(props.delayMinutes * 0.2), severity:'warning', detail:'18R/36L 仅剩单跑道运行' },
  { name:'天气影响', contribution: Math.round(props.delayMinutes * 0.15), severity:'info', detail:'航路颠簸区域，需减速通过' },
])
</script>

<style scoped>
.section {
  padding: 22px 24px;
  border-bottom: 1px solid rgba(0, 212, 255, 0.04);
}

.mono {
  font-family: 'IBM Plex Mono', monospace;
}

/* ===== 区块头部 ===== */
.sec-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.sec-title-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sec-icon {
  width: 26px;
  height: 26px;
  border-radius: 6px;
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
}

.sec-title {
  font-size: 11px;
  font-weight: 700;
  color: #94a3b8;
  margin: 0;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.sec-badge {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 3px 8px;
  border-radius: 10px;
  background: rgba(74, 222, 128, 0.05);
  border: 1px solid rgba(74, 222, 128, 0.1);
}

.sec-badge-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #4ade80;
  animation: pulse-dot 2s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%, 100% { box-shadow: 0 0 4px rgba(74, 222, 128, 0.3); }
  50% { box-shadow: 0 0 8px rgba(74, 222, 128, 0.6); }
}

.sec-badge-text {
  font-size: 8px;
  font-weight: 700;
  color: #4ade80;
  letter-spacing: 0.06em;
  font-family: 'IBM Plex Mono', monospace;
}

/* ===== 四宫格指标 ===== */
.grid-4 {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.metric-card {
  position: relative;
  padding: 14px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.012);
  border: 1px solid rgba(255, 255, 255, 0.04);
  text-align: center;
  overflow: hidden;
  transition: all 0.3s ease;
}

.metric-card:hover {
  border-color: rgba(255, 255, 255, 0.08);
  transform: translateY(-1px);
}

.metric-glow {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.metric-card:hover .metric-glow {
  opacity: 1;
}

.metric-glow.glow-red {
  background: radial-gradient(ellipse at top, rgba(239, 68, 68, 0.06) 0%, transparent 70%);
}

.metric-glow.glow-amber {
  background: radial-gradient(ellipse at top, rgba(245, 158, 11, 0.06) 0%, transparent 70%);
}

.clbl {
  font-size: 9px;
  color: #475569;
  display: block;
  margin-bottom: 6px;
  letter-spacing: 0.03em;
}

.cval {
  font-size: 20px;
  font-weight: 900;
  display: block;
  margin-bottom: 8px;
  letter-spacing: -0.02em;
}

.cval.critical {
  color: #ef4444;
  text-shadow: 0 0 16px rgba(239, 68, 68, 0.15);
}

.cval.warn {
  color: #f59e0b;
  text-shadow: 0 0 16px rgba(245, 158, 11, 0.12);
}

.metric-bar {
  height: 3px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.03);
  overflow: hidden;
}

.metric-bar-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.metric-bar-fill.bar-blue {
  background: linear-gradient(90deg, #38bdf8, rgba(56, 189, 248, 0.4));
}

.metric-bar-fill.bar-red {
  background: linear-gradient(90deg, #ef4444, rgba(239, 68, 68, 0.4));
}

.metric-bar-fill.bar-amber {
  background: linear-gradient(90deg, #f59e0b, rgba(245, 158, 11, 0.4));
}

/* ===== 表格 ===== */
.table-wrap {
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.008);
  border: 1px solid rgba(255, 255, 255, 0.03);
  overflow: hidden;
}

.tbl {
  width: 100%;
  border-collapse: collapse;
  font-size: 10px;
}

.tbl th {
  padding: 8px 12px;
  text-align: left;
  color: #475569;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.015);
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  white-space: nowrap;
  letter-spacing: 0.03em;
}

.tbl td {
  padding: 8px 12px;
  color: #cbd5e1;
  border-bottom: 1px solid rgba(255, 255, 255, 0.015);
  transition: background 0.15s ease;
}

.tbl tbody tr:hover td {
  background: rgba(0, 180, 240, 0.02);
}

.tbl tbody tr:last-child td {
  border-bottom: none;
}

.total-row td {
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(255, 255, 255, 0.01);
}

.detail-cell {
  font-size: 9px;
  color: #64748b;
}

/* 因子名称 */
.factor-name {
  display: flex;
  align-items: center;
  gap: 8px;
}

.factor-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.factor-dot.dot-critical {
  background: #ef4444;
  box-shadow: 0 0 6px rgba(239, 68, 68, 0.4);
}

.factor-dot.dot-warning {
  background: #f59e0b;
  box-shadow: 0 0 6px rgba(245, 158, 11, 0.3);
}

.factor-dot.dot-info {
  background: #64748b;
}

.factor-dot.dot-total {
  background: #ef4444;
  box-shadow: 0 0 8px rgba(239, 68, 68, 0.5);
}

/* 标签 + 进度条 */
.tag-wrap {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 80px;
}

.tag {
  font-size: 9px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 4px;
  display: inline-block;
  width: fit-content;
}

.tag-critical {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.tag-warning {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.tag-info {
  background: rgba(100, 116, 139, 0.1);
  color: #94a3b8;
}

.tag-bar {
  height: 2px;
  border-radius: 1px;
  transition: width 0.6s ease;
}

.tag-bar.bar-critical {
  background: rgba(239, 68, 68, 0.4);
}

.tag-bar.bar-warning {
  background: rgba(245, 158, 11, 0.4);
}

.tag-bar.bar-info {
  background: rgba(100, 116, 139, 0.3);
}

.warn {
  color: #f59e0b !important;
}

/* 基准行 */
.base-row {
  background: rgba(56, 189, 248, 0.02);
}

.base-row td {
  border-bottom: 1px solid rgba(56, 189, 248, 0.06);
}

/* ===== 机组提示 ===== */
.crew-section {
  margin-top: 20px;
}

.notes-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.note-card {
  position: relative;
  display: flex;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.008);
  border: 1px solid rgba(255, 255, 255, 0.03);
  overflow: hidden;
  transition: all 0.3s ease;
}

.note-card:hover {
  border-color: rgba(255, 255, 255, 0.06);
  transform: translateY(-1px);
}

.note-accent {
  width: 3px;
  flex-shrink: 0;
}

.note-content {
  padding: 14px;
  flex: 1;
  min-width: 0;
}

.note-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.note-icon-wrap {
  width: 26px;
  height: 26px;
  border-radius: 6px;
  border: 1px solid;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.note-title {
  font-size: 11px;
  font-weight: 700;
  color: #e2e8f0;
  margin: 0;
}

.note-text {
  font-size: 10px;
  color: #94a3b8;
  margin: 0;
  line-height: 1.7;
}
</style>
