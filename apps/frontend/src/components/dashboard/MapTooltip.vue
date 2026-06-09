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
        <div class="tip-row"><span class="tl">管制扇区</span><span class="tv mono">{{ wp.region }}</span></div>
        <div class="tip-row"><span class="tl">所属航路</span><span class="tv mono">{{ wp.routes.join(' / ') || '无' }}</span></div>
        <p class="tip-detail" v-if="wp.note">{{ wp.note }}</p>
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
        <div class="tip-row"><span class="tl">管制单位</span><span class="tv mono">{{ rt.controller }}</span></div>
        <div class="tip-row"><span class="tl">日均流量</span><span class="tv mono">{{ rt.dailyTraffic }}</span></div>
        <div class="tip-row"><span class="tl">RNAV</span><span class="tv" :class="rt.rnavCapable?'ok':'warn'">{{ rt.rnavCapable?'支持':'不支持' }}</span></div>
        <p class="tip-detail" v-if="rt.note">{{ rt.note }}</p>
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
        <div class="tip-row"><span class="tl">活动类型</span><span class="tv mono">{{ cz.purpose }}</span></div>
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
        <div class="tip-row"><span class="tl">活动类型</span><span class="tv mono">{{ pz.purpose }}</span></div>
        <div class="tip-row"><span class="tl">管制</span><span class="tv mono">{{ pz.controllingUnit }} · {{ pz.contactFreq }}</span></div>
        <div class="tip-row"><span class="tl">影响航路</span><span class="tv mono warn">{{ pz.affectedRoutes.join(' / ') || '无' }}</span></div>
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
        <div class="tip-row"><span class="tl">运行时间</span><span class="tv mono">{{ ap.opsHours }}</span></div>
        <div class="tip-row"><span class="tl">消防等级</span><span class="tv mono">{{ ap.fireCat }}</span></div>
        <div class="tip-row"><span class="tl">METAR</span><span class="tv mono" style="font-size:9px">{{ ap.metar }}</span></div>
        <div class="tip-row"><span class="tl">NOTAM</span><span class="tv mono">{{ ap.notams }}条有效 · </span><span class="tv" :class="ap.status==='restricted'?'warn':'ok'">{{ ap.status==='restricted'?'有限制':'正常' }}</span></div>
      </template>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import type { WaypointDetail, RouteDetail, ZoneDetail, AirportDetail } from '@/views/dashboard/mock/mapTooltip'

defineProps<{ visible:boolean; x:number; y:number; type:string; wp?:WaypointDetail|null; rt?:RouteDetail|null; cz?:ZoneDetail|null; pz?:ZoneDetail|null; ap?:AirportDetail|null }>()
defineEmits<{ (e:'close'):void }>()

const stayOpen = () => {} // hover 到 tooltip 时保持显示
</script>

<style scoped>
.tip {
  position:fixed; z-index:2000; pointer-events:auto;
  min-width:240px; max-width:360px;
  background: linear-gradient(165deg, rgba(10,18,42,0.97) 0%, rgba(14,26,54,0.95) 50%, rgba(8,16,38,0.97) 100%);
  backdrop-filter:blur(24px) saturate(1.3);
  border:1px solid rgba(0,212,255,0.18);
  border-radius:16px;
  padding:18px 20px;
  box-shadow: 0 12px 50px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,0,0,0.3), 0 0 40px rgba(0,212,255,0.06), inset 0 1px 0 rgba(255,255,255,0.05);
  animation: tip-in 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  transform:translate(-12px, 12px);
  overflow: hidden;
}
.tip::before {
  content: '';
  position: absolute; top: 0; left: 12%; right: 12%; height: 1.5px;
  background: linear-gradient(90deg, transparent, rgba(0,212,255,0.5), transparent);
  border-radius: 1px;
}
.tip::after {
  content: '';
  position: absolute; inset: 0;
  background: radial-gradient(ellipse 60% 40% at 50% 0%, rgba(0,212,255,0.04) 0%, transparent 60%);
  pointer-events: none;
}
@keyframes tip-in {
  from { opacity:0; transform:translate(-12px, 20px) scale(0.96); }
  to   { opacity:1; transform:translate(-12px, 12px) scale(1); }
}

.tip-head {
  display:flex; align-items:center; gap:10px;
  margin-bottom:12px; padding-bottom:10px;
  border-bottom:1px solid rgba(255,255,255,0.06);
  position: relative; z-index: 1;
}
.tip-badge {
  font-size:8px; font-weight:900;
  padding:3px 8px; border-radius:6px;
  letter-spacing:0.08em; text-transform:uppercase;
  flex-shrink:0;
  border: 1px solid;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}
.tip-badge.wp { color:#38bdf8; background:rgba(56,189,248,0.12); border-color: rgba(56,189,248,0.2); }
.tip-badge.route { color:#a78bfa; background:rgba(167,139,250,0.12); border-color: rgba(167,139,250,0.2); }
.tip-badge.danger { color:#f59e0b; background:rgba(245,158,11,0.12); border-color: rgba(245,158,11,0.2); }
.tip-badge.prohibit { color:#ef4444; background:rgba(239,68,68,0.12); border-color: rgba(239,68,68,0.2); }
.tip-badge.apt { color:#4ade80; background:rgba(74,222,128,0.12); border-color: rgba(74,222,128,0.2); }
.tip-code { font-size:14px; font-weight:800; color:#f1f5f9; font-family:'IBM Plex Mono',monospace; letter-spacing: -0.01em; }
.tip-type { font-size:9px; color:#64748b; margin-left:auto; font-family:'IBM Plex Mono',monospace; background: rgba(100,116,139,0.1); padding: 2px 8px; border-radius: 4px; }

.tip-row {
  display:flex; justify-content:space-between; align-items:center;
  padding:4px 0; gap:14px;
  position: relative; z-index: 1;
  transition: all 0.2s;
}
.tip-row:hover { background: rgba(255,255,255,0.02); margin: 0 -6px; padding-left: 6px; padding-right: 6px; border-radius: 6px; }
.tl { font-size:9px; color:#475569; white-space:nowrap; font-weight: 600; letter-spacing: 0.04em; }
.tv { font-size:11px; color:#cbd5e1; text-align:right; font-weight: 500; }
.tv.warn { color:#fca5a5; text-shadow: 0 0 8px rgba(239,68,68,0.15); }
.tv.ok { color:#4ade80; text-shadow: 0 0 8px rgba(74,222,128,0.15); }
.mono { font-family:'IBM Plex Mono',monospace; }
.tip-detail {
  font-size:10px; color:#94a3b8;
  margin:10px 0 0; line-height:1.7;
  padding-top:8px;
  border-top:1px solid rgba(255,255,255,0.04);
  position: relative; z-index: 1;
}
</style>
