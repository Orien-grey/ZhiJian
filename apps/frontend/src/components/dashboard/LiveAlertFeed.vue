<template>
  <div :class="wrapperCls">
    <div :class="headerCls">
      <div :class="headerLeftCls">
        <PulseIndicator pulse-state="live" severity="critical" label="实时告警流" />
        <span :class="countCls">{{ alerts.length }} 条</span>
      </div>
      <div :class="filterRowCls">
        <button
          v-for="f in filters"
          :key="f.key"
          :class="f.key === activeFilter ? filterActiveCls : filterBtnCls"
          @click="activeFilter = f.key"
        >{{ f.label }}</button>
      </div>
    </div>

    <div :class="feedListCls">
      <div
        v-for="alert in filteredAlerts"
        :key="alert.id"
        :class="feedItemCls(alert)"
        @click="emit('select', alert)"
      >
        <div :class="timeColCls">
          <span :class="timeTextCls">{{ formatTime(alert.timestamp) }}</span>
          <span v-if="alert.isNew" :class="newTagCls">NEW</span>
        </div>
        <div :class="severityBarCls(alert.severity)" />
        <div :class="bodyCls">
          <div :class="topLineCls">
            <span :class="severityTagCls(alert.severity)">{{ severityLabel[alert.severity] }}</span>
            <span :class="notamTypeCls">{{ alert.notamType }}</span>
          </div>
          <p :class="alertTitleCls">{{ alert.title }}</p>
          <div :class="metaRowCls">
            <span :class="icaoCls">{{ alert.airportIcao }}</span>
            <span :class="airportNameCls">{{ alert.airportName }}</span>
            <span :class="regionTagCls">{{ alert.region }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { css } from '@/styled-system/css'
import PulseIndicator from './PulseIndicator.vue'
import type { AeroAlert, AlertSeverity } from '@/views/dashboard/mock/dashboardData'

const props = defineProps<{ alerts: AeroAlert[] }>()
const emit = defineEmits<{ (e: 'select', alert: AeroAlert): void }>()

const activeFilter = ref<AlertSeverity | 'all'>('all')
const filters: { key: AlertSeverity | 'all'; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'critical', label: '紧急' },
  { key: 'warning', label: '预警' },
  { key: 'info', label: '信息' },
]

const filteredAlerts = computed(() =>
  activeFilter.value === 'all' ? props.alerts : props.alerts.filter(a => a.severity === activeFilter.value),
)

const formatTime = (iso: string) => new Date(iso).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })

const severityLabel: Record<AlertSeverity, string> = { critical: '紧急', warning: '预警', info: '信息' }

const severityColors: Record<AlertSeverity, string> = { critical: '#ef4444', warning: '#f59e0b', info: '#3b82f6' }
const severityBgs: Record<AlertSeverity, string> = { critical: 'rgba(239,68,68,0.1)', warning: 'rgba(245,158,11,0.1)', info: 'rgba(59,130,246,0.1)' }
const severityHoverBgs: Record<AlertSeverity, string> = { critical: 'rgba(239,68,68,0.06)', warning: 'rgba(245,158,11,0.06)', info: 'rgba(59,130,246,0.06)' }

// ---- Panda CSS ----
const wrapperCls = css({ borderRadius: 'xl', bg: 'rgba(10,18,40,0.75)', border: '1px solid rgba(0,212,255,0.08)', backdropFilter: 'blur(12px)', overflow: 'hidden', display: 'flex', flexDirection: 'column' })
const headerCls = css({ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: '5', py: '3.5', borderBottom: '1px solid rgba(0,212,255,0.06)' })
const headerLeftCls = css({ display: 'flex', alignItems: 'center', gap: '3' })
const countCls = css({ fontSize: 'xs', color: 'slate.500', bg: 'rgba(0,212,255,0.06)', px: '2', py: '0.5', borderRadius: 'sm' })
const filterRowCls = css({ display: 'flex', gap: '1.5' })
const filterBtnCls = css({ fontSize: 'xs', px: '2.5', py: '1', borderRadius: 'md', color: 'slate.400', bg: 'transparent', border: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer', transition: 'all 0.2s', _hover: { borderColor: 'rgba(0,212,255,0.25)', color: 'cyan.300' } })
const filterActiveCls = css({ fontSize: 'xs', px: '2.5', py: '1', borderRadius: 'md', color: 'cyan.300', bg: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.4)', cursor: 'pointer' })
const feedListCls = css({ flex: '1', overflowY: 'auto', maxH: '380px', '&::-webkit-scrollbar': { w: '4px' }, '&::-webkit-scrollbar-track': { bg: 'transparent' }, '&::-webkit-scrollbar-thumb': { bg: 'rgba(0,212,255,0.12)', borderRadius: '4px' } })

const feedItemCls = (a: AeroAlert) =>
  css({ display: 'flex', gap: '3', px: '5', py: '3.5', borderBottom: '1px solid rgba(0,212,255,0.04)', cursor: 'pointer', transition: 'all 0.3s', animation: a.isNew ? 'feed-fade-in 0.5s ease-out' : undefined, _hover: { bg: severityHoverBgs[a.severity] } })

const severityBarCls = (s: AlertSeverity) =>
  css({ w: '3px', borderRadius: 'full', flexShrink: '0', alignSelf: 'stretch', bg: severityColors[s], boxShadow: `0 0 8px ${severityColors[s]}` })

const severityTagCls = (s: AlertSeverity) =>
  css({ fontSize: '10px', fontWeight: '700', px: '2', py: '0.5', borderRadius: 'sm', letterSpacing: '0.04em', color: severityColors[s], bg: severityBgs[s] })

const timeColCls = css({ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1', minW: '52px', pt: '1' })
const timeTextCls = css({ fontSize: 'xs', color: 'slate.500', fontFamily: 'mono' })
const newTagCls = css({ fontSize: '9px', fontWeight: '700', color: 'cyan.400', bg: 'rgba(0,212,255,0.12)', px: '1.5', py: '0.5', borderRadius: 'sm', letterSpacing: '0.08em' })
const bodyCls = css({ flex: '1', minW: '0' })
const topLineCls = css({ display: 'flex', alignItems: 'center', gap: '2', mb: '1.5' })
const notamTypeCls = css({ fontSize: 'xs', color: 'slate.500' })
const alertTitleCls = css({ fontSize: 'sm', fontWeight: '600', mb: '2', lineHeight: '1.4' })
const metaRowCls = css({ display: 'flex', alignItems: 'center', gap: '2', flexWrap: 'wrap' })
const icaoCls = css({ fontSize: 'xs', fontWeight: '700', color: 'cyan.400', fontFamily: 'mono' })
const airportNameCls = css({ fontSize: 'xs', color: 'slate.400' })
const regionTagCls = css({ fontSize: '10px', color: 'slate.500', bg: 'rgba(255,255,255,0.04)', px: '1.5', py: '0.5', borderRadius: 'sm' })
</script>

<style scoped>
@keyframes feed-fade-in { from { background: rgba(0,212,255,0.12); } to { background: transparent; } }
</style>
