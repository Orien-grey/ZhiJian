<template>
  <div class="body">
    <!-- 通信导航 -->
    <div class="section" v-if="facility">
      <p class="sec-title">通信导航设施</p>
      <div class="freq-grid">
        <div class="freq-card"><span class="flbl">ATIS</span><span class="fval mono">{{ facility.atis }}</span></div>
        <div class="freq-card"><span class="flbl">TWR</span><span class="fval mono">{{ facility.tower }}</span></div>
        <div class="freq-card"><span class="flbl">GND</span><span class="fval mono">{{ facility.ground }}</span></div>
        <div class="freq-card"><span class="flbl">APP</span><span class="fval mono">{{ facility.approach }}</span></div>
        <div class="freq-card span-2"><span class="flbl">VOR/DME</span><span class="fval mono">{{ facility.vor }}</span></div>
        <div class="freq-card span-2"><span class="flbl">NDB</span><span class="fval mono">{{ facility.ndb }}</span></div>
      </div>

      <p class="sec-title" style="margin-top:16px">ILS 配置</p>
      <div class="ils-list">
        <span v-for="ils in facility.ilsRunways" :key="ils" class="ils-chip mono">{{ ils }}</span>
      </div>

      <p class="sec-title" style="margin-top:16px">RVR 传感器</p>
      <div class="ils-list">
        <span v-for="s in facility.rvrSensors" :key="s" class="rvr-chip mono">{{ s }}</span>
      </div>

      <div class="stat-grid">
        <div class="stat-item">
          <span class="st-lbl">消防等级</span><span class="st-val">{{ facility.pcategory }}</span>
        </div>
        <div class="stat-item">
          <span class="st-lbl">年运行量</span><span class="st-val mono">{{ facility.annualMovements }}</span>
        </div>
        <div class="stat-item">
          <span class="st-lbl">年吞吐量</span><span class="st-val mono">{{ facility.passengerCapacity }}</span>
        </div>
      </div>
    </div>

    <!-- 气象信息 -->
    <div class="section" v-if="weather">
      <p class="sec-title">实时气象</p>
      <div class="wx-card" :class="'wx-'+weather.trend">
        <div class="wx-row">
          <span class="wxl">风向风速</span><span class="wxv mono">{{ weather.wind }}</span>
          <span class="wxl">能见度</span><span class="wxv mono">{{ weather.visibility }}</span>
          <span class="wxl">温度</span><span class="wxv mono">{{ weather.temp }}</span>
        </div>
        <div class="wx-row">
          <span class="wxl">云底高</span><span class="wxv mono">{{ weather.ceiling }}</span>
          <span class="wxl">QNH</span><span class="wxv mono">{{ weather.qnh }}</span>
          <span class="wxl">趋势</span>
          <span class="wxv trend" :class="'trend-'+weather.trend">{{ trendLabel(weather.trend) }}</span>
        </div>
      </div>
      <p class="metar-label">METAR</p>
      <p class="metar-text mono">{{ weather.metar }}</p>
      <p class="metar-label">TAF</p>
      <p class="metar-text mono">{{ weather.taf }}</p>
    </div>

    <div v-if="!facility && !weather" class="no-data">该机场暂无设施与气象数据</div>
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
.body { flex:1; overflow-y:auto; padding:18px 20px; scrollbar-width:thin; scrollbar-color:rgba(0,180,240,0.08) transparent; }
.body::-webkit-scrollbar { width:3px; }
.body::-webkit-scrollbar-thumb { background:rgba(0,180,240,0.08); border-radius:3px; }

.section { margin-bottom:20px; }
.sec-title { font-size:11px; font-weight:600; color:#64748b; margin:0 0 10px; letter-spacing:0.06em; text-transform:uppercase; }
.mono { font-family:'IBM Plex Mono',monospace; }

.freq-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:8px; }
.freq-card { padding:10px 12px; border-radius:6px; background:rgba(255,255,255,0.015); border:1px solid rgba(255,255,255,0.04); }
.freq-card.span-2 { grid-column:span 2; }
.flbl { font-size:8px; color:#475569; display:block; margin-bottom:4px; letter-spacing:0.06em; text-transform:uppercase; }
.fval { font-size:11px; font-weight:600; color:#e2e8f0; }

.ils-list { display:flex; flex-wrap:wrap; gap:6px; }
.ils-chip { font-size:9px; color:#38bdf8; padding:3px 8px; border-radius:3px; background:rgba(56,189,248,0.08); border:1px solid rgba(56,189,248,0.12); }
.rvr-chip { font-size:9px; color:#a78bfa; padding:3px 8px; border-radius:3px; background:rgba(167,139,250,0.06); border:1px solid rgba(167,139,250,0.1); }

.stat-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; margin-top:14px; }
.stat-item { padding:10px; border-radius:6px; background:rgba(255,255,255,0.01); border:1px solid rgba(255,255,255,0.03); }
.st-lbl { font-size:8px; color:#475569; display:block; margin-bottom:4px; }
.st-val { font-size:11px; font-weight:600; color:#e2e8f0; line-height:1.4; }

/* 气象 */
.wx-card { padding:14px; border-radius:8px; margin-bottom:12px; }
.wx-card.wx-stable { background:rgba(74,222,128,0.04); border:1px solid rgba(74,222,128,0.08); }
.wx-card.wx-deteriorating { background:rgba(239,68,68,0.04); border:1px solid rgba(239,68,68,0.08); }
.wx-card.wx-improving { background:rgba(56,189,248,0.04); border:1px solid rgba(56,189,248,0.08); }
.wx-row { display:flex; gap:16px; margin-bottom:8px; }
.wx-row:last-child { margin-bottom:0; }
.wxl { font-size:9px; color:#475569; min-width:44px; }
.wxv { font-size:10px; font-weight:600; color:#e2e8f0; }
.trend-improving { color:#38bdf8 !important; }
.trend-stable { color:#4ade80 !important; }
.trend-deteriorating { color:#ef4444 !important; }

.metar-label { font-size:9px; color:#475569; margin:8px 0 4px; letter-spacing:0.06em; }
.metar-text { font-size:9px; color:#64748b; line-height:1.5; word-break:break-all; }

.no-data { text-align:center; padding:40px; font-size:11px; color:#334155; }
</style>
