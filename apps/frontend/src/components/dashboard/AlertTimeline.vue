<template>
  <div :class="wrapperCls">
    <div :class="headerCls">
      <span :class="dotCls" />
      <span :class="titleCls">24H 告警时间线</span>
      <span :class="subCls">最近 24 小时趋势</span>
    </div>
    <div ref="chartRef" :class="chartCls" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { css } from '@/styled-system/css'
import { generateHourlyTrend } from '@/views/dashboard/mock/dashboardData'

const chartRef = ref<HTMLDivElement | null>(null)
let instance: echarts.ECharts | null = null

function render() {
  if (!chartRef.value) return
  if (!instance) instance = echarts.init(chartRef.value)

  const data = generateHourlyTrend()

  instance.setOption({
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(10,18,40,0.95)',
      borderColor: 'rgba(0,212,255,0.2)',
      textStyle: { color: '#e2e8f0', fontSize: 12 },
      axisPointer: { type: 'line', lineStyle: { color: 'rgba(0,212,255,0.15)', type: 'dashed' } },
    },
    grid: { left: 16, right: 24, top: 20, bottom: 24 },
    xAxis: {
      type: 'category', data: data.map(d => d.hour.replace(':00Z', '')),
      axisLine: { lineStyle: { color: 'rgba(0,212,255,0.12)' } },
      axisTick: { show: false },
      axisLabel: { color: '#64748b', fontSize: 10, interval: 2 },
    },
    yAxis: {
      type: 'value', name: '告警数',
      nameTextStyle: { color: '#64748b', fontSize: 10 },
      axisLine: { show: false }, axisTick: { show: false },
      splitLine: { lineStyle: { color: 'rgba(0,212,255,0.05)' } },
      axisLabel: { color: '#64748b', fontSize: 10 },
    },
    series: [
      {
        name: '告警量', type: 'bar', data: data.map(d => d.count),
        itemStyle: {
          borderRadius: [4, 4, 0, 0],
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(0,212,255,0.7)' }, { offset: 1, color: 'rgba(0,212,255,0.05)' },
          ]),
        },
        emphasis: { itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(0,212,255,0.95)' }, { offset: 1, color: 'rgba(0,180,240,0.3)' }]) } },
        barWidth: 10,
        animationDelay: (idx: number) => idx * 30,
      },
      {
        name: '趋势', type: 'line', data: data.map(d => d.count), smooth: true,
        symbol: 'circle', symbolSize: 4,
        lineStyle: { color: 'rgba(0,212,255,0.5)', width: 2 },
        itemStyle: { color: '#00d4ff' },
        areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(0,212,255,0.15)' }, { offset: 1, color: 'rgba(0,212,255,0)' }]) },
      },
    ],
  }, true)
}

onMounted(() => render())
onUnmounted(() => { instance?.dispose(); instance = null })

const wrapperCls = css({ borderRadius: 'xl', bg: 'rgba(10,18,40,0.75)', border: '1px solid rgba(0,212,255,0.08)', backdropFilter: 'blur(12px)', overflow: 'hidden', display: 'flex', flexDirection: 'column' })
const headerCls = css({ display: 'flex', alignItems: 'center', gap: '3', px: '5', py: '3.5', borderBottom: '1px solid rgba(0,212,255,0.06)' })
const dotCls = css({ w: '8px', h: '8px', borderRadius: 'full', bg: 'cyan.400', boxShadow: '0 0 8px token(colors.cyan.400)' })
const titleCls = css({ fontSize: 'sm', fontWeight: '600', letterSpacing: '0.02em' })
const subCls = css({ fontSize: 'xs', color: 'slate.500', ml: 'auto' })
const chartCls = css({ flex: '1', minH: '180px', w: '100%' })
</script>
