<template>
  <div class="page-shell">
    <SideNav />

    <main :class="mainPanelCls">
      <!-- 背景网格 -->
      <div :class="bgGridCls" />

      <!-- 内容区 -->
      <div :class="contentCls">
        <!-- ===== 顶部栏 ===== -->
        <header :class="topbarCls">
          <div :class="topbarLeftCls">
            <span :class="brandIconCls">◈</span>
            <h1 :class="brandTitleCls">航行情报动态信息看板</h1>
            <span :class="dividerCls" />
            <PulseIndicator pulse-state="live" severity="normal" label="系统运行中" />
            <span :class="timeCls">{{ currentTime }}</span>
          </div>
          <div :class="topbarRightCls">
            <span :class="sysSummaryCls">{{ normalSysCount }}/{{ systemMetrics.length }} 子系统正常</span>
            <button :class="refreshBtnCls" @click="triggerRefresh">
              <span :class="refreshIconCls">↻</span>
            </button>
          </div>
        </header>

        <!-- ===== 统计卡片 ===== -->
        <StatsStrip :stats="stats" />

        <!-- ===== 中部：地图 + 右侧面板 ===== -->
        <div :class="mainGridCls">
          <AlertMapView :alerts="displayAlerts" :alert-count="filteredAlertCount" />
          <div :class="rightPanelCls">
            <ThreatRadar :critical-count="stats.criticalCount" :warning-count="stats.warningCount" :info-count="stats.infoCount" />
            <SeverityRing :critical-count="stats.criticalCount" :warning-count="stats.warningCount" :info-count="stats.infoCount" />
          </div>
        </div>

        <!-- ===== 底部：告警流 + 时间线 ===== -->
        <div :class="bottomGridCls">
          <LiveAlertFeed :alerts="displayAlerts" @select="openDetail" />
          <AlertTimeline />
        </div>

        <!-- ===== 状态栏 ===== -->
        <footer :class="statusbarCls">
          <div :class="statusbarLeftCls">
            <span v-for="m in systemMetrics" :key="m.label" :class="statusMetricItemCls">
              <span :class="statusMetricDot(m.status)" />
              <span :class="statusMetricLabelCls">{{ m.label }}</span>
              <span :class="statusMetricValue(m.status)">{{ m.value }}</span>
            </span>
          </div>
          <div :class="statusbarRightCls">
            <span :class="statusbarInfoCls">数据源: CAAC AIS</span>
            <span :class="statusbarInfoCls">WGS-84 · CST</span>
          </div>
        </footer>
      </div>
    </main>

    <!-- ===== 详情弹窗 ===== -->
    <Teleport to="body">
      <div v-if="selectedAlert" :class="modalOverlayCls" @click.self="selectedAlert = null">
        <div :class="modalCardCls">
          <div :class="modalHeaderCls">
            <div :class="modalHeaderLeftCls">
              <span :class="modalSeverityBadge(selectedAlert.severity)">
                {{ severityLabel[selectedAlert.severity] }}
              </span>
              <span :class="modalTypeCls">{{ selectedAlert.notamType }}</span>
            </div>
            <button :class="modalCloseBtnCls" @click="selectedAlert = null">✕</button>
          </div>
          <h2 :class="modalTitleCls">{{ selectedAlert.title }}</h2>
          <div :class="modalAirportRowCls">
            <span :class="modalIcaoCls">{{ selectedAlert.airportIcao }}</span>
            <span :class="modalAirportNameCls">{{ selectedAlert.airportName }}</span>
            <span :class="modalRegionCls">{{ selectedAlert.region }}</span>
          </div>
          <p :class="modalSummaryCls">{{ selectedAlert.summary }}</p>
          <div :class="modalRawCls">
            <p :class="modalRawHeaderCls">原始 NOTAM 报文</p>
            <pre :class="modalRawTextCls">{{ selectedAlert.rawNotam }}</pre>
          </div>
          <div :class="modalMetaGridCls">
            <div v-for="item in detailMeta" :key="item.label" :class="modalMetaItemCls">
              <span :class="modalMetaLabelCls">{{ item.label }}</span>
              <span :class="modalMetaValueCls">{{ item.value }}</span>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { css, cx } from '@/styled-system/css'
import SideNav from '@/components/layout/SideNav.vue'
import StatsStrip from '@/components/dashboard/StatsStrip.vue'
import AlertMapView from '@/components/dashboard/AlertMapView.vue'
import ThreatRadar from '@/components/dashboard/ThreatRadar.vue'
import SeverityRing from '@/components/dashboard/SeverityRing.vue'
import LiveAlertFeed from '@/components/dashboard/LiveAlertFeed.vue'
import AlertTimeline from '@/components/dashboard/AlertTimeline.vue'
import PulseIndicator from '@/components/dashboard/PulseIndicator.vue'
import { MOCK_ALERTS, MOCK_STATS, SYSTEM_METRICS, alertStreamGenerator, type AeroAlert, type AlertSeverity, type SystemMetric } from './mock/dashboardData'

// ---- 响应式数据 ----
const stats = ref({ ...MOCK_STATS })
const alerts = ref<AeroAlert[]>([...MOCK_ALERTS])
const systemMetrics = ref<SystemMetric[]>([...SYSTEM_METRICS])
const selectedAlert = ref<AeroAlert | null>(null)
const isRefreshing = ref(false)
const currentTime = ref('')

let timeTimer: ReturnType<typeof setInterval> | null = null
let streamTimer: ReturnType<typeof setInterval> | null = null
const streamGen = alertStreamGenerator()

// ---- 计算属性 ----
const displayAlerts = computed(() =>
  [...alerts.value].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
)
const filteredAlertCount = computed(() => displayAlerts.value.length)
const normalSysCount = computed(() => systemMetrics.value.filter(s => s.status === 'normal').length)

const severityLabel: Record<AlertSeverity, string> = { critical: '紧急', warning: '预警', info: '信息' }

const detailMeta = computed(() => {
  if (!selectedAlert.value) return []
  const a = selectedAlert.value
  return [
    { label: '生效时间', value: formatFullTime(a.validityStart) },
    { label: '失效时间', value: a.validityEnd === 'PERMANENT' ? '永久有效' : formatFullTime(a.validityEnd) },
    { label: '影响航路', value: a.affectedRoutes.join(' / ') || '无' },
    { label: '情报来源', value: a.source },
  ]
})

// ---- 方法 ----
const updateTime = () => {
  currentTime.value = new Date().toLocaleString('zh-CN', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
  })
}

const formatFullTime = (iso: string) => {
  if (iso === 'PERMANENT') return '永久有效'
  return new Date(iso).toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false })
}

const triggerRefresh = () => {
  isRefreshing.value = true
  stats.value = { ...MOCK_STATS, totalAlerts24h: MOCK_STATS.totalAlerts24h + Math.floor(Math.random() * 5), criticalCount: MOCK_STATS.criticalCount + (Math.random() > 0.7 ? 1 : 0), alertsPerHour: +(MOCK_STATS.alertsPerHour + (Math.random() - 0.5)).toFixed(1) }
  setTimeout(() => { isRefreshing.value = false }, 1200)
}

const openDetail = (alert: AeroAlert) => { selectedAlert.value = alert }

// ---- Panda CSS 样式（预计算，模板直接引用） ----

// main 面板
const mainPanelCls = css({ minH: '100vh', bg: '#060b1a', color: 'slate.200', position: 'relative' })
const bgGridCls = css({ position: 'fixed', inset: '0', pointerEvents: 'none', zIndex: '0', backgroundImage: 'linear-gradient(rgba(0,212,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.025) 1px, transparent 1px)', backgroundSize: '48px 48px', maskImage: 'radial-gradient(ellipse 70% 70% at 50% 40%, black 30%, transparent 70%)', WebkitMaskImage: 'radial-gradient(ellipse 70% 70% at 50% 40%, black 30%, transparent 70%)' })
const contentCls = css({ position: 'relative', zIndex: '1', px: '5', py: '4', display: 'flex', flexDirection: 'column', gap: '4' })

// 顶部栏
const topbarCls = css({ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: '0', p: '4', borderRadius: 'xl', bg: 'rgba(10,18,40,0.75)', border: '1px solid rgba(0,212,255,0.1)', backdropFilter: 'blur(16px)' })
const topbarLeftCls = css({ display: 'flex', alignItems: 'center', gap: '4' })
const brandIconCls = css({ fontSize: '24px', color: 'cyan.400', filter: 'drop-shadow(0 0 12px rgba(0,212,255,0.5))' })
const brandTitleCls = css({ fontSize: 'lg', fontWeight: '700', letterSpacing: '0.04em', m: '0' })
const dividerCls = css({ w: '1px', h: '20px', bg: 'rgba(0,212,255,0.15)' })
const timeCls = css({ fontSize: 'sm', color: 'slate.500', fontFamily: 'mono' })
const topbarRightCls = css({ display: 'flex', alignItems: 'center', gap: '4' })
const sysSummaryCls = css({ fontSize: 'xs', color: 'slate.500' })
const refreshBtnCls = css({ w: '36px', h: '36px', borderRadius: 'lg', cursor: 'pointer', border: '1px solid rgba(0,212,255,0.12)', bg: 'rgba(0,212,255,0.04)', color: 'cyan.400', fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s', _hover: { bg: 'rgba(0,212,255,0.1)', borderColor: 'rgba(0,212,255,0.3)' } })
const refreshIconCls = css({ animation: isRefreshing.value ? 'spin 0.8s linear' : 'none' })

// 中部：地图 + 右侧面板
const mainGridCls = css({ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '4', minH: '520px', '@media (max-width: 1280px)': { gridTemplateColumns: '1fr', minH: 'auto' } })
const rightPanelCls = css({ display: 'flex', flexDirection: 'column', gap: '4', minH: '520px' })

// 底部：告警流 + 时间线
const bottomGridCls = css({ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4', minH: '400px', '@media (max-width: 1280px)': { gridTemplateColumns: '1fr', minH: 'auto' } })

// 状态栏
const statusbarCls = css({ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: '0', px: '4', py: '2.5', borderRadius: 'lg', fontSize: 'xs', bg: 'rgba(10,18,40,0.7)', border: '1px solid rgba(0,212,255,0.06)', color: 'slate.500', flexWrap: 'wrap', gap: '2' })
const statusbarLeftCls = css({ display: 'flex', gap: '4', flexWrap: 'wrap' })
const statusMetricItemCls = css({ display: 'flex', alignItems: 'center', gap: '1.5' })
const statusMetricLabelCls = css({ color: 'slate.500' })
const statusbarRightCls = css({ display: 'flex', gap: '4' })
const statusbarInfoCls = css({ fontFamily: 'mono', fontSize: '10px' })

const statusMetricDot = (status: string) => {
  const isNormal = status === 'normal'
  const isDegraded = status === 'degraded'
  return css({
    w: '6px', h: '6px', borderRadius: 'full',
    bg: isNormal ? 'emerald.400' : isDegraded ? 'amber.400' : 'red.500',
    boxShadow: !isNormal ? `0 0 6px ${isDegraded ? '#f59e0b' : '#ef4444'}` : undefined,
    animation: !isNormal ? 'status-pulse 2s ease-in-out infinite' : undefined,
  })
}

const statusMetricValue = (status: string) => {
  const isNormal = status === 'normal'
  const isDegraded = status === 'degraded'
  return css({ fontFamily: 'mono', fontWeight: '600', color: isNormal ? 'slate.400' : isDegraded ? 'amber.400' : 'red.400' })
}

// 弹窗
const modalOverlayCls = css({ position: 'fixed', inset: '0', zIndex: '1000', bg: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', p: '10' })
const modalCardCls = css({ maxW: '640px', w: '100%', maxH: '80vh', overflowY: 'auto', bg: 'rgba(14,22,50,0.98)', borderRadius: '2xl', p: '8', border: '1px solid rgba(0,212,255,0.15)', boxShadow: '0 24px 80px rgba(0,0,0,0.6)' })
const modalHeaderCls = css({ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '4' })
const modalHeaderLeftCls = css({ display: 'flex', gap: '2.5', alignItems: 'center' })
const modalTypeCls = css({ fontSize: 'sm', color: 'slate.500' })
const modalCloseBtnCls = css({ w: '32px', h: '32px', borderRadius: 'lg', border: '1px solid rgba(255,255,255,0.08)', bg: 'transparent', color: 'slate.400', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', _hover: { bg: 'rgba(255,255,255,0.06)', color: 'slate.200' } })
const modalTitleCls = css({ fontSize: 'xl', fontWeight: '700', mb: '3', lineHeight: '1.4' })
const modalAirportRowCls = css({ display: 'flex', gap: '2.5', alignItems: 'center', mb: '4' })
const modalIcaoCls = css({ fontFamily: 'mono', fontSize: 'md', fontWeight: '700', color: 'cyan.400' })
const modalAirportNameCls = css({ fontSize: 'sm', color: 'slate.400' })
const modalRegionCls = css({ fontSize: 'xs', color: 'slate.500', bg: 'rgba(255,255,255,0.04)', px: '2', py: '0.5', borderRadius: 'sm' })
const modalSummaryCls = css({ fontSize: 'sm', color: 'slate.400', lineHeight: '1.7', mb: '5' })
const modalRawCls = css({ bg: 'rgba(0,0,0,0.3)', border: '1px solid rgba(0,212,255,0.08)', borderRadius: 'lg', p: '4', mb: '5' })
const modalRawHeaderCls = css({ fontSize: 'xs', color: 'slate.500', textTransform: 'uppercase', letterSpacing: '0.06em', mb: '2' })
const modalRawTextCls = css({ fontFamily: 'mono', fontSize: 'xs', color: 'slate.400', lineHeight: '1.6', whiteSpace: 'pre-wrap', wordBreak: 'break-all', m: '0' })
const modalMetaGridCls = css({ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3' })
const modalMetaItemCls = css({ display: 'flex', flexDirection: 'column', gap: '1' })
const modalMetaLabelCls = css({ fontSize: '10px', color: 'slate.500', textTransform: 'uppercase', letterSpacing: '0.04em' })
const modalMetaValueCls = css({ fontSize: 'sm', color: 'slate.400', fontFamily: 'mono' })

const modalSeverityBadge = (s: AlertSeverity) => {
  const colors: Record<AlertSeverity, { color: string; bg: string }> = {
    critical: { color: 'red.400', bg: 'rgba(239,68,68,0.12)' },
    warning: { color: 'amber.400', bg: 'rgba(245,158,11,0.12)' },
    info: { color: 'blue.400', bg: 'rgba(59,130,246,0.12)' },
  }
  return css({ fontSize: 'xs', fontWeight: '700', px: '2.5', py: '1', borderRadius: 'md', letterSpacing: '0.04em', color: colors[s].color, bg: colors[s].bg })
}

// ---- 生命周期 ----
onMounted(() => {
  updateTime()
  timeTimer = setInterval(updateTime, 1000)
  streamTimer = setInterval(() => {
    const result = streamGen.next()
    if (!result.done && result.value) {
      const newAlert = { ...result.value, isNew: true }
      alerts.value = [newAlert, ...alerts.value].slice(0, 50)
      stats.value.totalAlerts24h += 1
      if (newAlert.severity === 'critical') stats.value.criticalCount += 1
      else if (newAlert.severity === 'warning') stats.value.warningCount += 1
      else stats.value.infoCount += 1
      setTimeout(() => { const t = alerts.value.find(a => a.id === newAlert.id); if (t) t.isNew = false }, 3000)
    }
  }, 8000 + Math.random() * 7000)
})

onUnmounted(() => {
  if (timeTimer) clearInterval(timeTimer)
  if (streamTimer) clearInterval(streamTimer)
})
</script>

<style scoped>
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes status-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
</style>
