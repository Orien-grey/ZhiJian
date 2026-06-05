<template>
  <div :class="wrapperCls">
    <div :class="headerCls">
      <span :class="dotCls" />
      <span :class="titleCls">威胁态势雷达</span>
    </div>
    <div :class="stageCls">
      <svg viewBox="0 0 300 300" :class="svgCls">
        <circle cx="150" cy="150" r="140" fill="none" stroke="rgba(0,212,255,0.06)" stroke-width="1" />
        <circle cx="150" cy="150" r="105" fill="none" stroke="rgba(0,212,255,0.08)" stroke-width="1" />
        <circle cx="150" cy="150" r="70" fill="none" stroke="rgba(0,212,255,0.1)" stroke-width="1" />
        <circle cx="150" cy="150" r="35" fill="none" stroke="rgba(0,212,255,0.12)" stroke-width="1" />
        <line x1="10" y1="150" x2="290" y2="150" stroke="rgba(0,212,255,0.06)" stroke-width="1" />
        <line x1="150" y1="10" x2="150" y2="290" stroke="rgba(0,212,255,0.06)" stroke-width="1" />
        <line x1="45" y1="45" x2="255" y2="255" stroke="rgba(0,212,255,0.04)" stroke-width="0.5" />
        <line x1="255" y1="45" x2="45" y2="255" stroke="rgba(0,212,255,0.04)" stroke-width="0.5" />
        <path d="M150,150 L150,10 A140,140 0 0,1 290,150 Z" fill="rgba(0,212,255,0.06)" :class="scanCls" />
        <circle
          v-for="(b, i) in blips"
          :key="i"
          :cx="b.x" :cy="b.y" :r="b.r"
          :fill="b.fill"
          :opacity="b.opacity"
          :class="blipCls"
          :style="{ animationDelay: `${i * 0.3}s` }"
        />
      </svg>
      <div :class="metricsCls">
        <div v-for="m in metrics" :key="m.label" :class="metricItemCls">
          <span :class="metricDotCls(m.dotColor)" />
          <div>
            <p :class="metricLabelCls">{{ m.label }}</p>
            <p :class="metricValueCls">{{ m.value }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { css } from '@/styled-system/css'

const props = defineProps<{ criticalCount: number; warningCount: number; infoCount: number }>()

interface Blip { x: number; y: number; r: number; fill: string; opacity: number }
const blips = computed<Blip[]>(() => {
  const result: Blip[] = []
  const cx = 150, cy = 150
  const add = (count: number, fill: string, r: number, range: [number, number]) => {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / Math.max(count, 1) + (Math.random() - 0.5) * 0.5
      const radius = range[0] + Math.random() * (range[1] - range[0])
      result.push({ x: cx + Math.cos(angle) * radius, y: cy + Math.sin(angle) * radius, r, fill, opacity: 0.7 + Math.random() * 0.3 })
    }
  }
  add(props.criticalCount, '#ef4444', 4, [20, 80])
  add(props.warningCount, '#f59e0b', 3, [50, 115])
  add(props.infoCount, '#3b82f6', 2.5, [70, 135])
  return result
})

const metrics = computed(() => [
  { label: '紧急威胁', value: props.criticalCount, dotColor: '#ef4444' },
  { label: '预警威胁', value: props.warningCount, dotColor: '#f59e0b' },
  { label: '情报信息', value: props.infoCount, dotColor: '#3b82f6' },
  { label: '威胁指数', value: `${Math.min(99, props.criticalCount * 15 + props.warningCount * 5 + props.infoCount)}%`, dotColor: '#ef4444' },
])

// ---- Panda CSS ----
const wrapperCls = css({ borderRadius: 'xl', bg: 'rgba(10,18,40,0.75)', border: '1px solid rgba(0,212,255,0.08)', backdropFilter: 'blur(12px)', overflow: 'hidden', display: 'flex', flexDirection: 'column' })
const headerCls = css({ display: 'flex', alignItems: 'center', gap: '3', px: '5', py: '3.5', borderBottom: '1px solid rgba(0,212,255,0.06)' })
const dotCls = css({ w: '8px', h: '8px', borderRadius: 'full', bg: 'cyan.400', boxShadow: '0 0 8px token(colors.cyan.400)' })
const titleCls = css({ fontSize: 'sm', fontWeight: '600', letterSpacing: '0.02em' })
const stageCls = css({ display: 'flex', flexDirection: 'column', flex: '1', p: '2' })
const svgCls = css({ w: '100%', h: '100%', maxW: '220px', maxH: '220px', mx: 'auto' })
const scanCls = css({ animation: 'radar-spin 4s linear infinite', transformOrigin: '150px 150px' })
const blipCls = css({ animation: 'blip-glow 2s ease-in-out infinite' })
const metricsCls = css({ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1', px: '3', pb: '3' })
const metricItemCls = css({ display: 'flex', alignItems: 'center', gap: '2', px: '1.5', py: '1' })
const metricLabelCls = css({ fontSize: '10px', color: 'slate.500', mb: '0.5' })
const metricValueCls = css({ fontSize: 'sm', fontWeight: '700', fontFamily: 'mono' })

const metricDotCls = (color: string) => css({ w: '6px', h: '6px', borderRadius: 'full', flexShrink: '0', bg: color, boxShadow: `0 0 4px ${color}` })
</script>

<style scoped>
@keyframes radar-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes blip-glow { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
</style>
