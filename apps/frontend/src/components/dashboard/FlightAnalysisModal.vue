<template>
  <Teleport to="body">
    <div v-if="visible" class="overlay" @click.self="close">
      <div class="modal">
        <!-- 头部：航班信息 -->
        <div class="head">
          <div class="head-l">
            <span class="flight-no">{{ analysis?.flightNo }}</span>
            <span class="ac-type mono">{{ analysis?.aircraftType }}</span>
            <span class="reg mono">{{ analysis?.registration }}</span>
          </div>
          <div class="head-m">
            <span class="route-text mono">{{ analysis?.originalRoute }}</span>
          </div>
          <div class="head-r">
            <span class="dep-arr mono">{{ analysis?.depIcao }}</span>
            <span class="arrow">→</span>
            <span class="dep-arr mono">{{ analysis?.arrIcao }}</span>
            <button class="close-btn" @click="close">✕</button>
          </div>
        </div>

        <!-- 无数据回退 -->
        <template v-if="!analysis || !analysis.timeline.length">
          <div class="no-analysis">
            <span class="no-icon">✓</span>
            <p class="no-title">该航班未受影响</p>
            <p class="no-desc">当前航路无限制区影响，航班按计划执行。如有NOTAM更新，系统将自动标记受影响航班。</p>
          </div>
        </template>

        <!-- 受影响分析内容 -->
        <template v-else>
          <!-- 红色预警横幅 -->
          <FlightAlertBanner
            :delay-minutes="analysis.delayMinutes"
            :scheduled-departure="analysis.scheduledDeparture"
            :estimated-departure="analysis.estimatedDeparture"
          />

          <!-- 可滚动内容区 -->
          <div class="body">
            <!-- 一、飞行时间轴 -->
            <FlightTimeline
              :timeline="analysis.timeline"
              :scheduled-departure="analysis.scheduledDeparture"
              :estimated-departure="analysis.estimatedDeparture"
              :delay-minutes="analysis.delayMinutes"
              @waypoint-click="onWaypointClick"
            />

            <!-- 二、高度剖面图 -->
            <AltitudeProfile
              :altitude-profile="analysis.altitudeProfile"
              :restriction-zones="analysis.restrictionZones"
              :flight-no="analysis.flightNo"
            />

            <!-- 三、备选航线 -->
            <AlternateRouteList
              :routes="analysis.alternateRoutes"
              @toggle="onRouteToggle"
              @preview="onRoutePreview"
            />
          </div>
        </template>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { MOCK_ANALYSIS, type FlightAnalysisData } from '@/views/dashboard/mock/flightAnalysis'
import FlightAlertBanner from './FlightAlertBanner.vue'
import FlightTimeline from './FlightTimeline.vue'
import AltitudeProfile from './AltitudeProfile.vue'
import AlternateRouteList from './AlternateRouteList.vue'

const props = defineProps<{ visible: boolean; flightNo: string }>()
const emit = defineEmits<{ (e: 'close'): void; (e: 'preview-route', routeId: string, flightNo: string): void }>()

const analysis = computed<FlightAnalysisData | null>(() => MOCK_ANALYSIS[props.flightNo] || null)

const close = () => emit('close')

const onWaypointClick = (wp: any) => {
  // 点击航路点：可扩展为地图定位
}

const onRouteToggle = (id: string) => {
  // 勾选备选航线
}

const onRoutePreview = (id: string) => {
  emit('preview-route', id, props.flightNo)
}
</script>

<style scoped>
.overlay { position:fixed; inset:0; z-index:1001; background:rgba(0,0,0,0.7); backdrop-filter:blur(6px); display:flex; align-items:center; justify-content:center; padding:20px; }
.modal { width:780px; max-width:96vw; max-height:88vh; background:#0b1221; border:1px solid rgba(0,180,240,0.12); border-radius:14px; display:flex; flex-direction:column; overflow:hidden; box-shadow:0 30px 100px rgba(0,0,0,0.7); }

/* 头部 */
.head { display:flex; align-items:center; justify-content:space-between; padding:14px 20px; background:rgba(0,180,240,0.03); border-bottom:1px solid rgba(0,180,240,0.08); flex-shrink:0; gap:16px; }
.head-l { display:flex; align-items:center; gap:10px; flex-shrink:0; }
.flight-no { font-size:18px; font-weight:900; font-family:'IBM Plex Mono',monospace; color:#e2e8f0; letter-spacing:0.04em; }
.ac-type { font-size:10px; color:#64748b; }
.reg { font-size:10px; color:#475569; }
.head-m { flex:1; min-width:0; text-align:center; }
.route-text { font-size:9px; color:#475569; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.head-r { display:flex; align-items:center; gap:8px; flex-shrink:0; }
.dep-arr { font-size:12px; font-weight:700; color:#cbd5e1; }
.arrow { color:#475569; font-size:12px; }
.close-btn { width:28px; height:28px; border-radius:6px; border:1px solid rgba(255,255,255,0.06); background:none; color:#64748b; cursor:pointer; font-size:13px; }
.close-btn:hover { background:rgba(255,255,255,0.05); color:#fff; }

/* 无数据 */
.no-analysis { display:flex; flex-direction:column; align-items:center; justify-content:center; padding:60px 40px; text-align:center; }
.no-icon { width:48px; height:48px; border-radius:50%; background:rgba(74,222,128,0.1); border:2px solid rgba(74,222,128,0.25); color:#4ade80; font-size:20px; display:flex; align-items:center; justify-content:center; margin-bottom:16px; }
.no-title { font-size:15px; font-weight:700; color:#e2e8f0; margin:0 0 8px; }
.no-desc { font-size:11px; color:#475569; margin:0; max-width:400px; line-height:1.6; }

/* 内容 */
.body { flex:1; overflow-y:auto; scrollbar-width:thin; scrollbar-color:rgba(0,180,240,0.1) transparent; }
.body::-webkit-scrollbar { width:4px; }
.body::-webkit-scrollbar-thumb { background:rgba(0,180,240,0.1); border-radius:4px; }

.mono { font-family:'IBM Plex Mono',monospace; }
</style>
