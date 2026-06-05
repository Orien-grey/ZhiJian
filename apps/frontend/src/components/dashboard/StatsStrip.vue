<template>
  <div :class="stripCls">
    <div
      v-for="card in cards"
      :key="card.key"
      :class="cardBaseCls"
      :style="cardStyle(card.accent)"
    >
      <!-- 背景光斑 -->
      <div :class="glowOrbCls" :style="glowOrbStyle(card.accent)" />
      <!-- 图标 -->
      <div :class="iconWrapCls" :style="iconWrapStyle(card.accent)">
        <span :class="iconTextCls" :style="iconTextStyle(card.accent)">{{ card.icon }}</span>
      </div>
      <!-- 内容 -->
      <div :class="bodyCls">
        <p :class="labelCls">{{ card.label }}</p>
        <div :class="valueRowCls">
          <span :class="valueCls" :style="valueStyle(card.accent)">{{ card.value }}</span>
          <span v-if="card.change !== undefined" :class="changeBadgeCls" :style="changeBadgeStyle(card.change)">
            <span :class="changeArrowCls">{{ card.change > 0 ? '↑' : '↓' }}</span>{{ Math.abs(card.change) }}%
          </span>
        </div>
        <p :class="subCls">{{ card.sub }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { css } from '@/styled-system/css'
import type { DashboardStats } from '@/views/dashboard/mock/dashboardData'

const props = defineProps<{ stats: DashboardStats }>()

type Accent = 'critical' | 'warning' | 'info' | 'success' | 'none'

interface StatCardDef {
  key: string; icon: string; label: string; value: string | number
  sub: string; accent: Accent; change?: number
}

const cards = computed<StatCardDef[]>(() => [
  { key: 'total', icon: '◉', label: '24H 总告警', value: props.stats.totalAlerts24h, sub: `小时均量 ${props.stats.alertsPerHour} 条`, accent: 'info', change: 12 },
  { key: 'active', icon: '⬡', label: '活跃 NOTAM', value: props.stats.activeNotams, sub: `涉及 ${props.stats.affectedRoutes} 条航路`, accent: 'warning', change: -5 },
  { key: 'airports', icon: '◈', label: '受影响机场', value: props.stats.affectedAirports, sub: '7 个地区情报区', accent: 'none' },
  { key: 'risk', icon: '◆', label: '风险等级', value: props.stats.avgRiskLevel, sub: `注意 · 紧急 ${props.stats.criticalCount} · 预警 ${props.stats.warningCount}`, accent: 'critical' },
  { key: 'parse', icon: '◫', label: '解析成功率', value: `${props.stats.parseRate}%`, sub: `平均响应 ${props.stats.avgResponseTime}`, accent: 'success', change: 2.1 },
  { key: 'uptime', icon: '◎', label: '系统可用率', value: props.stats.systemUptime, sub: '7×24 持续运行', accent: 'success' },
])

const accentColors: Record<Accent, string> = {
  critical: '#ef4444', warning: '#f59e0b', info: '#00d4ff', success: '#10b981', none: '#64748b',
}

// ---- 动态 style（内联，绕过 Panda 构建时限制） ----
const cardStyle = (a: Accent) => {
  const c = accentColors[a]
  if (a === 'none') return {
    background: 'linear-gradient(135deg, rgba(10,18,40,0.9) 0%, rgba(14,24,52,0.85) 100%)',
    border: '1px solid rgba(255,255,255,0.05)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03), 0 4px 24px rgba(0,0,0,0.3)',
  }
  return {
    background: 'linear-gradient(135deg, rgba(10,18,40,0.9) 0%, rgba(14,24,52,0.85) 100%)',
    border: '1px solid rgba(255,255,255,0.05)',
    boxShadow: `inset 0 1px 0 rgba(255,255,255,0.03), 0 4px 24px rgba(0,0,0,0.3), 0 0 0 1px ${c}20`,
  }
}

const glowOrbStyle = (a: Accent) => {
  if (a === 'none') return { display: 'none' }
  return { background: `radial-gradient(circle, ${accentColors[a]}18 0%, transparent 70%)` }
}

const iconWrapStyle = (a: Accent) => {
  if (a === 'none') return { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }
  const c = accentColors[a]
  return { background: `${c}18`, border: `1px solid ${c}25`, boxShadow: `0 0 16px ${c}10` }
}

const iconTextStyle = (a: Accent) => {
  if (a === 'none') return { color: '#94a3b8' }
  return { color: accentColors[a], filter: `drop-shadow(0 0 8px ${accentColors[a]}50)` }
}

const valueStyle = (a: Accent) => {
  if (a === 'none') return { color: '#e2e8f0' }
  const c = accentColors[a]
  return { color: '#ffffff', textShadow: `0 0 32px ${c}40, 0 0 8px ${c}20` }
}

const changeBadgeStyle = (change: number) => ({
  background: change > 0 ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
  color: change > 0 ? '#10b981' : '#ef4444',
})

// ---- Panda CSS 静态样式（构建时提取） ----
const stripCls = css({
  display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '4', mb: '5', flexShrink: '0',
  '@media (max-width: 1400px)': { gridTemplateColumns: 'repeat(3, 1fr)' },
  '@media (max-width: 900px)': { gridTemplateColumns: 'repeat(2, 1fr)' },
})

const cardBaseCls = css({
  position: 'relative', overflow: 'hidden', p: '4', borderRadius: 'xl', cursor: 'default',
  display: 'flex', alignItems: 'flex-start', gap: '3.5',
  backdropFilter: 'blur(16px)',
  transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
  _hover: {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 40px rgba(0,0,0,0.5) !important',
    border: '1px solid rgba(255,255,255,0.12) !important',
    background: 'linear-gradient(135deg, rgba(14,24,54,0.95) 0%, rgba(18,30,60,0.9) 100%) !important',
  },
})

const glowOrbCls = css({ position: 'absolute', top: '-40px', right: '-30px', width: '100px', height: '100px', borderRadius: 'full', pointerEvents: 'none', zIndex: '0' })

const iconWrapCls = css({ w: '44px', h: '44px', borderRadius: 'xl', flexShrink: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: '1', transition: 'all 0.35s' })

const iconTextCls = css({ fontSize: '20px', transition: 'all 0.35s' })

const bodyCls = css({ flex: '1', minW: '0', position: 'relative', zIndex: '1' })
const labelCls = css({ fontSize: '11px', fontWeight: '600', letterSpacing: '0.07em', textTransform: 'uppercase', color: 'slate.400', mb: '1' })
const valueRowCls = css({ display: 'flex', alignItems: 'baseline', gap: '2', mb: '1' })
const valueCls = css({ fontSize: '28px', fontWeight: '700', fontFamily: 'mono', letterSpacing: '-0.03em', lineHeight: '1.15' })
const subCls = css({ fontSize: '11px', color: 'slate.500' })
const changeBadgeCls = css({ display: 'inline-flex', alignItems: 'center', gap: '1', fontSize: '12px', fontWeight: '600', fontFamily: 'mono', px: '2', py: '0.5', borderRadius: 'md' })
const changeArrowCls = css({ fontSize: '10px' })
</script>
