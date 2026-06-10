<template>
  <div class="body">
    <!-- 信息卡片 -->
    <div class="info-cards">
      <div class="icard">
        <div class="icard-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
        </div>
        <span class="ilbl">消防等级</span>
        <span class="ival">{{ airport?.fireCat }}</span>
      </div>
      <div class="icard">
        <div class="icard-icon" style="color:#f59e0b">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </div>
        <span class="ilbl">运行时间</span>
        <span class="ival">{{ airport?.opsHours }}</span>
      </div>
      <div class="icard">
        <div class="icard-icon" style="color:#a78bfa">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2a10 10 0 0 1 0 20"/><path d="M12 2a10 10 0 0 0 0 20"/><circle cx="12" cy="12" r="10"/></svg>
        </div>
        <span class="ilbl">磁差</span>
        <span class="ival">{{ airport?.magneticVar }}</span>
      </div>
      <div class="icard">
        <div class="icard-icon" style="color:#4ade80">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2L2 22h20L12 2z"/><path d="M12 8v6"/><circle cx="12" cy="17" r="1"/></svg>
        </div>
        <span class="ilbl">燃油</span>
        <span class="ival" style="font-size:10px">{{ airport?.fuelTypes }}</span>
      </div>
    </div>

    <!-- 跑道信息 -->
    <div class="section">
      <div class="sec-header">
        <span class="sec-line"></span>
        <p class="sec-title">跑道信息</p>
        <span class="sec-line" style="flex:1"></span>
      </div>
      <div class="table-wrap">
        <table class="tbl">
          <thead>
            <tr><th>跑道</th><th>尺寸</th><th>道面</th><th>PCN</th><th>进近等级</th><th>灯光</th></tr>
          </thead>
          <tbody>
            <tr v-for="rw in runways" :key="rw.id">
              <td class="mono">
                <span class="rw-badge">{{ rw.id }}</span>
              </td>
              <td>{{ rw.length }}×{{ rw.width }}</td>
              <td>{{ rw.surface }}</td>
              <td class="mono">{{ rw.pcn }}</td>
              <td class="mono">{{ rw.ils }}</td>
              <td class="mono" style="font-size:9px">{{ rw.lights }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="remarks">
        <p v-for="rw in runways" :key="'rm-'+rw.id" class="rw-remark">
          <span class="remark-dot"></span>
          {{ rw.remarks }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AirportInfo, RunwaySpec } from '@/views/dashboard/mock/airportDetail'

defineProps<{
  airport: AirportInfo
  runways: RunwaySpec[]
}>()
</script>

<style scoped>
.body {
  flex: 1;
  overflow-y: auto;
  padding: 24px 26px;
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 180, 240, 0.1) transparent;
}
.body::-webkit-scrollbar { width: 4px; }
.body::-webkit-scrollbar-thumb { background: rgba(0, 180, 240, 0.1); border-radius: 4px; }

/* ── Info Cards ── */
.info-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 28px;
}
.icard {
  padding: 18px 16px;
  border-radius: 14px;
  background:
    linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.005) 100%);
  border: 1px solid rgba(255, 255, 255, 0.04);
  position: relative;
  overflow: hidden;
  transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);
}
.icard::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.15), transparent);
  opacity: 0;
  transition: opacity 0.25s;
}
.icard:hover {
  transform: translateY(-2px);
  border-color: rgba(0, 212, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}
.icard:hover::before { opacity: 1; }

.icard-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(0, 212, 255, 0.05);
  border: 1px solid rgba(0, 212, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #00d4ff;
  margin-bottom: 12px;
}

.ilbl {
  font-size: 10px;
  color: #475569;
  display: block;
  margin-bottom: 6px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  font-weight: 600;
}
.ival {
  font-size: 15px;
  font-weight: 700;
  color: #f1f5f9;
  font-family: 'IBM Plex Mono', monospace;
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

.tbl { width: 100%; border-collapse: collapse; font-size: 11px; }
.tbl th {
  padding: 10px 12px;
  text-align: left;
  color: #475569;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.015);
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  white-space: nowrap;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  font-size: 9px;
}
.tbl td {
  padding: 10px 12px;
  color: #cbd5e1;
  border-bottom: 1px solid rgba(255, 255, 255, 0.02);
  transition: background 0.15s;
}
.tbl tbody tr:last-child td { border-bottom: none; }
.tbl tbody tr:hover td { background: rgba(0, 212, 255, 0.025); }

.rw-badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 6px;
  background: rgba(0, 212, 255, 0.06);
  border: 1px solid rgba(0, 212, 255, 0.1);
  color: #00d4ff;
  font-weight: 700;
  font-size: 10px;
}

.mono { font-family: 'IBM Plex Mono', monospace; font-size: 10px; }

/* ── Remarks ── */
.remarks {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.rw-remark {
  font-size: 10.5px;
  color: #5a6a82;
  margin: 0;
  line-height: 1.6;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.01);
  border: 1px solid rgba(255, 255, 255, 0.03);
}
.remark-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #00d4ff;
  box-shadow: 0 0 8px rgba(0, 212, 255, 0.4);
  flex-shrink: 0;
  margin-top: 5px;
}
</style>
