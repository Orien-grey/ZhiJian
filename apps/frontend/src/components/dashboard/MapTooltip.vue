<template>
  <Teleport to="body">
    <div
      v-if="visible"
      class="tip"
      :style="{ left: x+'px', top: y+'px' }"
      @mouseenter="stayOpen"
      @mouseleave="$emit('close')"
    >
      <!-- 航路点 -->
      <template v-if="type==='waypoint' && wp">
        <div class="tip-head">
          <span class="tip-badge wp">航路点</span>
          <span class="tip-code">{{ wp.code }}</span>
          <span class="tip-type">{{ wp.type }}{{ wp.freq ? ' · '+wp.freq : '' }}</span>
        </div>
        <div class="tip-row"><span class="tl">坐标</span><span class="tv mono">{{ wp.lat.toFixed(2) }}°N {{ wp.lng.toFixed(2) }}°E</span></div>
        <div class="tip-row"><span class="tl">标高</span><span class="tv mono">{{ wp.elevation }}</span></div>
        <div class="tip-row"><span class="tl">所属航路</span><span class="tv mono">{{ wp.routes.join(' / ') }}</span></div>
      </template>

      <!-- 航路 -->
      <template v-if="type==='route' && rt">
        <div class="tip-head">
          <span class="tip-badge route">航路</span>
          <span class="tip-code">{{ rt.name }}</span>
          <span class="tip-type">{{ rt.direction }} · {{ rt.length }}NM</span>
        </div>
        <div class="tip-row"><span class="tl">航段</span><span class="tv mono">{{ rt.waypoints.join(' → ') }}</span></div>
        <div class="tip-row"><span class="tl">高度范围</span><span class="tv mono">{{ rt.minAlt }} ~ {{ rt.maxAlt }}</span></div>
        <div class="tip-row"><span class="tl">RNAV能力</span><span class="tv" :class="rt.rnavCapable?'ok':'warn'">{{ rt.rnavCapable?'支持':'不支持' }}</span></div>
      </template>

      <!-- 圆形限制区 -->
      <template v-if="type==='circle' && cz">
        <div class="tip-head">
          <span class="tip-badge danger">限制区</span>
          <span class="tip-code">{{ cz.name }}</span>
          <span class="tip-type">半径 {{ cz.radius }}km</span>
        </div>
        <div class="tip-row"><span class="tl">NOTAM</span><span class="tv mono warn">{{ cz.notamRef }}</span></div>
        <div class="tip-row"><span class="tl">生效</span><span class="tv mono">{{ cz.effective }}</span></div>
        <div class="tip-row"><span class="tl">高度</span><span class="tv mono">{{ cz.altitude }}</span></div>
        <div class="tip-row"><span class="tl">管制单位</span><span class="tv mono">{{ cz.controllingUnit }}</span></div>
        <div class="tip-row"><span class="tl">频率</span><span class="tv mono">{{ cz.contactFreq }}</span></div>
        <p class="tip-detail">{{ cz.detail }}</p>
      </template>

      <!-- 多边形禁航区 -->
      <template v-if="type==='polygon' && pz">
        <div class="tip-head">
          <span class="tip-badge prohibit">禁航区</span>
          <span class="tip-code">{{ pz.name }}</span>
        </div>
        <div class="tip-row"><span class="tl">NOTAM</span><span class="tv mono warn">{{ pz.notamRef }}</span></div>
        <div class="tip-row"><span class="tl">生效</span><span class="tv mono">{{ pz.effective }}</span></div>
        <div class="tip-row"><span class="tl">高度</span><span class="tv mono">{{ pz.altitude }}</span></div>
        <div class="tip-row"><span class="tl">管制</span><span class="tv mono">{{ pz.controllingUnit }} · {{ pz.contactFreq }}</span></div>
        <div class="tip-row"><span class="tl">影响航路</span><span class="tv mono warn">{{ pz.affectedRoutes.join(' / ') }}</span></div>
        <p class="tip-detail">{{ pz.detail }}</p>
      </template>

      <!-- 机场 -->
      <template v-if="type==='airport' && ap">
        <div class="tip-head">
          <span class="tip-badge apt">机场</span>
          <span class="tip-code">{{ ap.icao }}</span>
          <span class="tip-type">{{ ap.iata }}</span>
        </div>
        <div class="tip-row"><span class="tl">名称</span><span class="tv">{{ ap.name }}</span></div>
        <div class="tip-row"><span class="tl">跑道</span><span class="tv mono">{{ ap.runways }}条 · 最长{{ ap.longestRwy }}</span></div>
        <div class="tip-row"><span class="tl">标高</span><span class="tv mono">{{ ap.elevation }}</span></div>
        <div class="tip-row"><span class="tl">METAR</span><span class="tv mono" style="font-size:9px">{{ ap.metar }}</span></div>
        <div class="tip-row"><span class="tl">NOTAM</span><span class="tv mono">{{ ap.notams }}条有效 · </span><span class="tv" :class="ap.status==='restricted'?'warn':'ok'">{{ ap.status==='restricted'?'有限制':'正常' }}</span></div>
      </template>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { WaypointDetail, RouteDetail, ZoneDetail, AirportDetail } from '@/views/dashboard/mock/mapTooltip'

defineProps<{ visible:boolean; x:number; y:number; type:string; wp?:WaypointDetail|null; rt?:RouteDetail|null; cz?:ZoneDetail|null; pz?:ZoneDetail|null; ap?:AirportDetail|null }>()
defineEmits<{ (e:'close'):void }>()

const stayOpen = () => {} // hover 到 tooltip 时保持显示
</script>

<style scoped>
.tip {
  position:fixed; z-index:2000; pointer-events:auto;
  min-width:220px; max-width:340px;
  background:rgba(8,14,32,0.96); backdrop-filter:blur(18px);
  border:1px solid rgba(0,212,255,0.2); border-radius:8px;
  padding:14px 16px; box-shadow:0 8px 40px rgba(0,0,0,0.7), 0 0 0 1px rgba(0,212,255,0.06), inset 0 1px 0 rgba(255,255,255,0.03);
  animation: tip-in 0.15s ease;
  transform:translate(-12px, 12px);
}
@keyframes tip-in { from{opacity:0;transform:translate(-12px,16px)} to{opacity:1;transform:translate(-12px,12px)} }

.tip-head { display:flex; align-items:center; gap:8px; margin-bottom:10px; padding-bottom:8px; border-bottom:1px solid rgba(255,255,255,0.05); }
.tip-badge { font-size:8px; font-weight:800; padding:2px 6px; border-radius:3px; letter-spacing:0.06em; text-transform:uppercase; flex-shrink:0; }
.tip-badge.wp { color:#38bdf8; background:rgba(56,189,248,0.12); }
.tip-badge.route { color:#a78bfa; background:rgba(167,139,250,0.12); }
.tip-badge.danger { color:#f59e0b; background:rgba(245,158,11,0.12); }
.tip-badge.prohibit { color:#ef4444; background:rgba(239,68,68,0.12); }
.tip-badge.apt { color:#4ade80; background:rgba(74,222,128,0.12); }
.tip-code { font-size:13px; font-weight:700; color:#e2e8f0; font-family:'IBM Plex Mono',monospace; }
.tip-type { font-size:9px; color:#64748b; margin-left:auto; font-family:'IBM Plex Mono',monospace; }

.tip-row { display:flex; justify-content:space-between; align-items:center; padding:2px 0; gap:12px; }
.tl { font-size:9px; color:#475569; white-space:nowrap; }
.tv { font-size:10px; color:#cbd5e1; text-align:right; }
.tv.warn { color:#fca5a5; }
.tv.ok { color:#4ade80; }
.mono { font-family:'IBM Plex Mono',monospace; }
.tip-detail { font-size:9.5px; color:#94a3b8; margin:8px 0 0; line-height:1.6; padding-top:6px; border-top:1px solid rgba(255,255,255,0.03); }
</style>
