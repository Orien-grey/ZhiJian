<template>
  <div class="body">
    <!-- 通信导航 -->
    <div class="section" v-if="facility">
      <div class="sec-header">
        <span class="sec-line"></span>
        <p class="sec-title">通信导航设施</p>
        <span class="sec-line" style="flex:1"></span>
      </div>
      <div class="freq-grid">
        <div class="freq-card">
          <div class="freq-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="8" y1="22" x2="16" y2="22"/></svg>
          </div>
          <span class="flbl">ATIS</span>
          <span class="fval mono">{{ facility.atis }}</span>
        </div>
        <div class="freq-card">
          <div class="freq-icon" style="color:#f59e0b">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5z"/><line x1="12" y1="11" x2="12" y2="11"/><line x1="8" y1="11" x2="8" y2="11"/><line x1="16" y1="11" x2="16" y2="11"/></svg>
          </div>
          <span class="flbl">TWR</span>
          <span class="fval mono">{{ facility.tower }}</span>
        </div>
        <div class="freq-card">
          <div class="freq-icon" style="color:#a78bfa">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <span class="flbl">GND</span>
          <span class="fval mono">{{ facility.ground }}</span>
        </div>
        <div class="freq-card">
          <div class="freq-icon" style="color:#4ade80">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
          </div>
          <span class="flbl">APP</span>
          <span class="fval mono">{{ facility.approach }}</span>
        </div>
        <div class="freq-card span-2">
          <div class="freq-icon" style="color:#38bdf8">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <span class="flbl">VOR/DME</span>
          <span class="fval mono">{{ facility.vor }}</span>
        </div>
        <div class="freq-card span-2">
          <div class="freq-icon" style="color:#fb7185">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
          </div>
          <span class="flbl">NDB</span>
          <span class="fval mono">{{ facility.ndb }}</span>
        </div>
      </div>

      <div class="sec-header" style="margin-top:20px">
        <span class="sec-line"></span>
        <p class="sec-title">ILS 配置</p>
        <span class="sec-line" style="flex:1"></span>
      </div>
      <div class="ils-list">
        <span v-for="ils in facility.ilsRunways" :key="ils" class="ils-chip mono">{{ ils }}</span>
      </div>

      <div class="sec-header" style="margin-top:20px">
        <span class="sec-line"></span>
        <p class="sec-title">RVR 传感器</p>
        <span class="sec-line" style="flex:1"></span>
      </div>
      <div class="ils-list">
        <span v-for="s in facility.rvrSensors" :key="s" class="rvr-chip mono">{{ s }}</span>
      </div>

      <div class="stat-grid">
        <div class="stat-item">
          <span class="st-lbl">消防等级</span>
          <span class="st-val">{{ facility.pcategory }}</span>
        </div>
        <div class="stat-item">
          <span class="st-lbl">年运行量</span>
          <span class="st-val mono">{{ facility.annualMovements }}</span>
        </div>
        <div class="stat-item">
          <span class="st-lbl">年吞吐量</span>
          <span class="st-val mono">{{ facility.passengerCapacity }}</span>
        </div>
      </div>
    </div>

    <!-- 气象信息 -->
    <div class="section" v-if="weather">
      <div class="sec-header">
        <span class="sec-line"></span>
        <p class="sec-title">实时气象</p>
        <span class="sec-line" style="flex:1"></span>
      </div>
      <div class="wx-card" :class="'wx-'+weather.trend">
        <div class="wx-row">
          <div class="wx-item">
            <span class="wxl">风向风速</span>
            <span class="wxv mono">{{ weather.wind }}</span>
          </div>
          <div class="wx-item">
            <span class="wxl">能见度</span>
            <span class="wxv mono">{{ weather.visibility }}</span>
          </div>
          <div class="wx-item">
            <span class="wxl">温度</span>
            <span class="wxv mono">{{ weather.temp }}</span>
          </div>
        </div>
        <div class="wx-row">
          <div class="wx-item">
            <span class="wxl">云底高</span>
            <span class="wxv mono">{{ weather.ceiling }}</span>
          </div>
          <div class="wx-item">
            <span class="wxl">QNH</span>
            <span class="wxv mono">{{ weather.qnh }}</span>
          </div>
          <div class="wx-item">
            <span class="wxl">趋势</span>
            <span class="wxv trend" :class="'trend-'+weather.trend">{{ trendLabel(weather.trend) }}</span>
          </div>
        </div>
      </div>

      <div class="metar-section">
        <div class="metar-header">
          <span class="metar-dot"></span>
          <p class="metar-label">METAR</p>
        </div>
        <p class="metar-text mono">{{ weather.metar }}</p>
      </div>
      <div class="metar-section">
        <div class="metar-header">
          <span class="metar-dot" style="background:#a78bfa;box-shadow:0 0 8px rgba(167,139,250,0.4)"></span>
          <p class="metar-label">TAF</p>
        </div>
        <p class="metar-text mono">{{ weather.taf }}</p>
      </div>
    </div>

    <div v-if="!facility && !weather" class="no-data">
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
      该机场暂无设施与气象数据
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { MOCK_AIRPORT_FACILITIES, MOCK_AIRPORT_WEATHER, type AirportFacility, type AirportWeather } from '@/views/dashboard/mock/airportExtra'

const props = defineProps<{ icao: string }>()

const facility = computed<AirportFacility | null>(() => MOCK_AIRPORT_FACILITIES[props.icao] || null)
const weather = computed<AirportWeather | null>(() => MOCK_AIRPORT_WEATHER[props.icao] || null)

const trendLabel = (t: string) => t === 'improving' ? '转好 ↑' : t === 'deteriorating' ? '恶化 ↓' : '稳定 →'
</script>

<style scoped>
.body { flex:1; overflow-y:auto; padding:24px 26px; scrollbar-width:thin; scrollbar-color:rgba(0,180,240,0.08) transparent; }
.body::-webkit-scrollbar { width:3px; }
.body::-webkit-scrollbar-thumb { background:rgba(0,180,240,0.08); border-radius:3px; }

.section { margin-bottom:24px; }

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
.mono { font-family: 'IBM Plex Mono', monospace; }

/* ── Freq Grid ── */
.freq-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:10px; }
.freq-card {
  padding: 14px;
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.005) 100%);
  border: 1px solid rgba(255, 255, 255, 0.04);
  position: relative;
  overflow: hidden;
  transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);
}
.freq-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.15), transparent);
  opacity: 0;
  transition: opacity 0.25s;
}
.freq-card:hover {
  transform: translateY(-2px);
  border-color: rgba(0, 212, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}
.freq-card:hover::before { opacity: 1; }

.freq-card.span-2 { grid-column:span 2; }

.freq-icon {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #00d4ff;
  margin-bottom: 10px;
}

.flbl {
  font-size: 9px;
  color: #475569;
  display: block;
  margin-bottom: 5px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  font-weight: 600;
}
.fval { font-size: 12px; font-weight: 700; color: #f1f5f9; }

/* ── ILS / RVR Chips ── */
.ils-list { display:flex; flex-wrap:wrap; gap:8px; }
.ils-chip {
  font-size: 10px;
  color: #38bdf8;
  padding: 5px 12px;
  border-radius: 8px;
  background: rgba(56,189,248,0.06);
  border: 1px solid rgba(56,189,248,0.1);
  font-weight: 600;
}
.rvr-chip {
  font-size: 10px;
  color: #a78bfa;
  padding: 5px 12px;
  border-radius: 8px;
  background: rgba(167,139,250,0.06);
  border: 1px solid rgba(167,139,250,0.1);
  font-weight: 600;
}

/* ── Stat Grid ── */
.stat-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; margin-top:18px; }
.stat-item {
  padding: 14px;
  border-radius: 14px;
  background: rgba(255,255,255,0.01);
  border: 1px solid rgba(255,255,255,0.03);
  transition: all 0.2s;
}
.stat-item:hover {
  background: rgba(255,255,255,0.015);
  border-color: rgba(255,255,255,0.05);
}
.st-lbl { font-size: 9px; color: #475569; display: block; margin-bottom: 6px; letter-spacing: 0.03em; }
.st-val { font-size: 13px; font-weight: 700; color: #f1f5f9; line-height: 1.4; }

/* ── Weather ── */
.wx-card {
  padding: 18px;
  border-radius: 14px;
  margin-bottom: 14px;
  position: relative;
  overflow: hidden;
}
.wx-card.wx-stable {
  background: rgba(74,222,128,0.03);
  border: 1px solid rgba(74,222,128,0.06);
}
.wx-card.wx-deteriorating {
  background: rgba(239,68,68,0.03);
  border: 1px solid rgba(239,68,68,0.06);
}
.wx-card.wx-improving {
  background: rgba(56,189,248,0.03);
  border: 1px solid rgba(56,189,248,0.06);
}

.wx-row { display:flex; gap: 24px; margin-bottom: 12px; }
.wx-row:last-child { margin-bottom: 0; }
.wx-item { display: flex; flex-direction: column; gap: 4px; min-width: 80px; }
.wxl { font-size: 9px; color: #475569; font-weight: 600; letter-spacing: 0.03em; text-transform: uppercase; }
.wxv { font-size: 12px; font-weight: 700; color: #f1f5f9; }

.trend-improving { color: #38bdf8 !important; }
.trend-stable { color: #4ade80 !important; }
.trend-deteriorating { color: #ef4444 !important; }

/* ── METAR / TAF ── */
.metar-section { margin-bottom: 14px; }
.metar-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}
.metar-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #4ade80;
  box-shadow: 0 0 8px rgba(74,222,128,0.4);
}
.metar-label { font-size: 9px; color: #475569; margin: 0; letter-spacing: 0.06em; font-weight: 600; text-transform: uppercase; }
.metar-text { font-size: 10px; color: #64748b; line-height: 1.6; word-break: break-all; margin: 0; padding: 12px 14px; border-radius: 10px; background: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.03); }

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
</style>
