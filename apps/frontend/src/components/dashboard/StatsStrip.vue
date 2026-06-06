<template>
  <div :class="stripCls">
    <div
      v-for="card in cards"
      :key="card.key"
      :class="cardBaseCls"
      :style="cardBgStyle(card.accent)"
      @mouseenter="hovered = card.key"
      @mouseleave="hovered = null"
    >
      <!-- 动态扫描线 -->
      <div :class="scanLineCls" :style="scanLineStyle(card.accent, hovered === card.key)" />

      <!-- 角标装饰 -->
      <div :class="cornerTLCls" :style="cornerStyle(card.accent)" />
      <div :class="cornerTRCls" :style="cornerStyle(card.accent)" />
      <div :class="cornerBLCls" :style="cornerStyle(card.accent)" />
      <div :class="cornerBRCls" :style="cornerStyle(card.accent)" />

      <!-- 背景网格 -->
      <div :class="gridBgCls" />

      <!-- 顶部光条 -->
      <div :class="topBarCls" :style="topBarStyle(card.accent)" />

      <!-- 图标区域 -->
      <div :class="iconWrapCls" :style="iconWrapStyle(card.accent)">
        <span :class="iconTextCls" :style="iconTextStyle(card.accent)">{{ card.icon }}</span>
        <div :class="iconRingCls" :style="iconRingStyle(card.accent)" />
      </div>

      <!-- 内容 -->
      <div :class="bodyCls">
        <div :class="labelRowCls">
          <p :class="labelCls">{{ card.label }}</p>
          <div v-if="card.change !== undefined" :class="changeBadgeCls" :style="changeBadgeStyle(card.change)">
            <span :class="changeArrowCls">{{ card.change > 0 ? '▲' : '▼' }}</span>
            <span>{{ Math.abs(card.change) }}%</span>
          </div>
        </div>
        <div :class="valueRowCls">
          <span :class="valueCls" :style="valueStyle(card.accent)">{{ card.value }}</span>
        </div>
        <p :class="subCls">{{ card.sub }}</p>
      </div>

      <!-- 底部数据条 -->
      <div :class="dataBarCls">
        <div
          v-for="i in 7"
          :key="i"
          :class="dataBarItemCls"
          :style="dataBarItemStyle(card.accent, i, hovered === card.key)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { css } from '@/styled-system/css'
import type { DashboardStats } from '@/views/dashboard/mock/dashboardData'

const props = defineProps<{ stats: DashboardStats }>()
const hovered = ref<string | null>(null)

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

const accentGlows: Record<Accent, string> = {
  critical: 'rgba(239,68,68,0.35)', warning: 'rgba(245,158,11,0.35)', info: 'rgba(0,212,255,0.35)', success: 'rgba(16,185,129,0.35)', none: 'rgba(100,116,139,0.2)',
}

// ---- 动态 style ----
const cardBgStyle = (a: Accent) => {
  const c = accentColors[a]
  const glow = accentGlows[a]
  return {
    background: `linear-gradient(165deg, rgba(10,18,40,0.95) 0%, rgba(14,24,52,0.9) 40%, rgba(8,16,36,0.95) 100%)`,
    border: a === 'none' ? '1px solid rgba(255,255,255,0.06)' : `1px solid ${c}30`,
    boxShadow: `inset 0 1px 0 rgba(255,255,255,0.03), 0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(0,0,0,0.2)`,
    '--card-accent': c,
    '--card-glow': glow,
  } as any
}

const scanLineStyle = (a: Accent, isHovered: boolean) => {
  const c = accentColors[a]
  return {
    background: `linear-gradient(90deg, transparent, ${c}40, transparent)`,
    opacity: isHovered ? 1 : 0,
    animation: isHovered ? 'scan-move 2s linear infinite' : 'none',
  }
}

const cornerStyle = (a: Accent) => {
  const c = accentColors[a]
  return { borderColor: a === 'none' ? 'rgba(255,255,255,0.08)' : `${c}50` }
}

const topBarStyle = (a: Accent) => {
  const c = accentColors[a]
  return {
    background: `linear-gradient(90deg, transparent, ${c}, transparent)`,
    boxShadow: `0 0 12px ${c}60`,
  }
}

const iconWrapStyle = (a: Accent) => {
  if (a === 'none') return {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
  }
  const c = accentColors[a]
  return {
    background: `${c}12`,
    border: `1px solid ${c}30`,
    boxShadow: `0 0 20px ${c}15, inset 0 1px 0 ${c}20`,
  }
}

const iconTextStyle = (a: Accent) => {
  if (a === 'none') return { color: '#94a3b8' }
  const c = accentColors[a]
  return { color: c, filter: `drop-shadow(0 0 10px ${c}80)` }
}

const iconRingStyle = (a: Accent) => {
  if (a === 'none') return { borderColor: 'rgba(255,255,255,0.05)' }
  const c = accentColors[a]
  return { borderColor: `${c}25` }
}

const valueStyle = (a: Accent) => {
  if (a === 'none') return { color: '#e2e8f0' }
  const c = accentColors[a]
  return {
    color: '#ffffff',
    textShadow: `0 0 40px ${c}50, 0 0 12px ${c}30`,
  }
}

const changeBadgeStyle = (change: number) => ({
  background: change > 0 ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
  color: change > 0 ? '#10b981' : '#ef4444',
  border: `1px solid ${change > 0 ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`,
})

const dataBarItemStyle = (a: Accent, i: number, isHovered: boolean) => {
  const heights = [40, 65, 45, 80, 55, 70, 50]
  const c = accentColors[a]
  const baseOpacity = a === 'none' ? 0.15 : 0.35
  const hoverOpacity = a === 'none' ? 0.4 : 0.8
  return {
    height: `${heights[i - 1]}%`,
    background: a === 'none' ? 'rgba(255,255,255,0.5)' : c,
    opacity: isHovered ? hoverOpacity : baseOpacity,
    transitionDelay: `${i * 40}ms`,
  }
}

// ---- Panda CSS ----
const stripCls = css({
  display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '4', mb: '5', flexShrink: '0',
  '@media (max-width: 1400px)': { gridTemplateColumns: 'repeat(3, 1fr)' },
  '@media (max-width: 900px)': { gridTemplateColumns: 'repeat(2, 1fr)' },
})

const cardBaseCls = css({
  position: 'relative', overflow: 'hidden', p: '5', borderRadius: 'xl', cursor: 'default',
  display: 'flex', flexDirection: 'column', gap: '3.5',
  backdropFilter: 'blur(20px)',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  _hover: {
    transform: 'translateY(-6px) scale(1.02)',
    boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,0,0,0.3) !important',
    borderColor: 'var(--card-accent) !important',
  },
})

const scanLineCls = css({
  position: 'absolute', top: '0', left: '-100%', width: '60%', height: '100%',
  pointerEvents: 'none', zIndex: '2', transition: 'opacity 0.3s',
})

const cornerTLCls = css({ position: 'absolute', top: '0', left: '0', width: '12px', height: '12px', borderTop: '2px solid', borderLeft: '2px solid', borderTopLeftRadius: '10px', pointerEvents: 'none', zIndex: '3', transition: 'all 0.3s' })
const cornerTRCls = css({ position: 'absolute', top: '0', right: '0', width: '12px', height: '12px', borderTop: '2px solid', borderRight: '2px solid', borderTopRightRadius: '10px', pointerEvents: 'none', zIndex: '3', transition: 'all 0.3s' })
const cornerBLCls = css({ position: 'absolute', bottom: '0', left: '0', width: '12px', height: '12px', borderBottom: '2px solid', borderLeft: '2px solid', borderBottomLeftRadius: '10px', pointerEvents: 'none', zIndex: '3', transition: 'all 0.3s' })
const cornerBRCls = css({ position: 'absolute', bottom: '0', right: '0', width: '12px', height: '12px', borderBottom: '2px solid', borderRight: '2px solid', borderBottomRightRadius: '10px', pointerEvents: 'none', zIndex: '3', transition: 'all 0.3s' })

const gridBgCls = css({
  position: 'absolute', inset: '0', pointerEvents: 'none', zIndex: '0',
  backgroundImage: 'linear-gradient(rgba(0,212,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.02) 1px, transparent 1px)',
  backgroundSize: '20px 20px',
  maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 70%)',
  WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 70%)',
})

const topBarCls = css({ position: 'absolute', top: '0', left: '10%', right: '10%', height: '1.5px', borderRadius: 'full', pointerEvents: 'none', zIndex: '3' })

const iconWrapCls = css({
  w: '48px', h: '48px', borderRadius: 'xl', flexShrink: '0',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  position: 'relative', zIndex: '1', transition: 'all 0.4s',
})

const iconTextCls = css({ fontSize: '22px', transition: 'all 0.4s', position: 'relative', zIndex: '2' })

const iconRingCls = css({
  position: 'absolute', inset: '-4px', borderRadius: 'xl', border: '1px solid',
  animation: 'icon-pulse 3s ease-in-out infinite',
})

const bodyCls = css({ flex: '1', minW: '0', position: 'relative', zIndex: '1' })
const labelRowCls = css({ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: '1.5' })
const labelCls = css({ fontSize: '11px', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'slate.400' })
const valueRowCls = css({ display: 'flex', alignItems: 'baseline', gap: '2', mb: '1.5' })
const valueCls = css({ fontSize: '32px', fontWeight: '800', fontFamily: 'mono', letterSpacing: '-0.04em', lineHeight: '1.1', transition: 'all 0.3s' })
const subCls = css({ fontSize: '11px', color: 'slate.500', letterSpacing: '0.02em' })
const changeBadgeCls = css({ display: 'inline-flex', alignItems: 'center', gap: '1', fontSize: '11px', fontWeight: '700', fontFamily: 'mono', px: '2', py: '0.5', borderRadius: 'md', transition: 'all 0.3s' })
const changeArrowCls = css({ fontSize: '9px' })

const dataBarCls = css({
  display: 'flex', alignItems: 'flex-end', gap: '3px', height: '24px',
  position: 'relative', zIndex: '1', mt: '1',
})

const dataBarItemCls = css({
  flex: '1', borderRadius: '1px', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
})
</script>

<style scoped>
@keyframes scan-move {
  0% { left: -60%; }
  100% { left: 100%; }
}
@keyframes icon-pulse {
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.08); opacity: 1; }
}
</style>
