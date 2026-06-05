<template>
  <div :class="wrapperCls">
    <div :class="headerCls">
      <span :class="dotCls" />
      <span :class="titleCls">告警等级分布</span>
    </div>
    <div ref="chartRef" :class="chartCls" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { css } from '@/styled-system/css'

const props = defineProps<{ criticalCount: number; warningCount: number; infoCount: number }>()

const chartRef = ref<HTMLDivElement | null>(null)
let instance: echarts.ECharts | null = null

function render() {
  if (!chartRef.value) return
  if (!instance) instance = echarts.init(chartRef.value)
  const total = props.criticalCount + props.warningCount + props.infoCount

  instance.setOption({
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(10,18,40,0.95)',
      borderColor: 'rgba(0,212,255,0.2)',
      textStyle: { color: '#e2e8f0', fontSize: 12 },
      formatter: (p: any) => `${p.marker} ${p.name}: <b>${p.value}</b> 条 (${p.percent}%)`,
    },
    series: [
      {
        name: '告警等级', type: 'pie', radius: ['55%', '82%'], center: ['50%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 4, borderColor: 'rgba(10,18,40,0.8)', borderWidth: 3 },
        label: { show: false },
        emphasis: { label: { show: true, fontSize: 16, fontWeight: 'bold', color: '#e2e8f0' }, scaleSize: 8 },
        data: [
          { value: props.criticalCount, name: '紧急',
            itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#ef4444' }, { offset: 1, color: '#991b1b' }]), shadowBlur: 16, shadowColor: 'rgba(239,68,68,0.4)' } },
          { value: props.warningCount, name: '预警',
            itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#f59e0b' }, { offset: 1, color: '#92400e' }]), shadowBlur: 12, shadowColor: 'rgba(245,158,11,0.3)' } },
          { value: props.infoCount, name: '信息',
            itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#3b82f6' }, { offset: 1, color: '#1e3a5f' }]), shadowBlur: 8, shadowColor: 'rgba(59,130,246,0.2)' } },
        ],
      },
      {
        name: '中心', type: 'pie', radius: ['0%', '40%'], center: ['50%', '50%'], silent: true,
        label: {
          show: true, position: 'center',
          formatter: `{label|总计}\n{value|${total}}`,
          rich: { label: { fontSize: 11, color: '#64748b', lineHeight: 18 }, value: { fontSize: 28, fontWeight: '700', color: '#e2e8f0', fontFamily: 'IBM Plex Mono', lineHeight: 34 } },
        },
        data: [{ value: 1, itemStyle: { color: 'rgba(0,212,255,0.06)' } }],
      },
    ],
  }, true)
}

onMounted(() => render())
watch(() => [props.criticalCount, props.warningCount, props.infoCount], () => render())
onUnmounted(() => { instance?.dispose(); instance = null })

const wrapperCls = css({ borderRadius: 'xl', bg: 'rgba(10,18,40,0.75)', border: '1px solid rgba(0,212,255,0.08)', backdropFilter: 'blur(12px)', overflow: 'hidden', display: 'flex', flexDirection: 'column' })
const headerCls = css({ display: 'flex', alignItems: 'center', gap: '3', px: '5', py: '3.5', borderBottom: '1px solid rgba(0,212,255,0.06)' })
const dotCls = css({ w: '8px', h: '8px', borderRadius: 'full', bg: 'cyan.400', boxShadow: '0 0 8px token(colors.cyan.400)' })
const titleCls = css({ fontSize: 'sm', fontWeight: '600', letterSpacing: '0.02em' })
const chartCls = css({ flex: '1', minH: '200px', w: '100%' })
</script>
