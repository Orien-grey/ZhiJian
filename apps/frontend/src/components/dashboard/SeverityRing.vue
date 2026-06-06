<template>
  <div :class="wrapperCls">
    <div :class="headerCls">
      <div :class="headerLeftCls">
        <span :class="dotCls" />
        <span :class="titleCls">告警等级分布</span>
      </div>
      <div :class="legendCls">
        <span v-for="l in legends" :key="l.name" :class="legendItemCls">
          <span :class="legendDotCls" :style="{ background: l.color, boxShadow: `0 0 6px ${l.color}` }" />
          {{ l.name }}
        </span>
      </div>
    </div>

    <div :class="bodyCls">
      <!-- 左侧：环形图 -->
      <div :class="chartWrapCls">
        <div ref="chartRef" :class="chartCls" />

        <!-- 中心装饰 -->
        <div :class="centerDecoCls">
          <div :class="centerRingCls" />
          <div :class="centerRingInnerCls" />
          <div :class="centerTextCls">
            <span :class="centerLabelCls">总计</span>
            <span :class="centerValueCls">{{ total }}</span>
            <span :class="centerUnitCls">条告警</span>
          </div>
        </div>
      </div>

      <!-- 右侧：详细数据 -->
      <div :class="detailCls">
        <div
          v-for="(item, i) in detailItems"
          :key="item.name"
          :class="detailItemCls"
          :style="{ animationDelay: `${i * 0.12}s` }"
          @mouseenter="hoveredItem = item.name"
          @mouseleave="hoveredItem = null"
        >
          <div :class="detailTopCls">
            <div :class="detailLeftCls">
              <span :class="detailNumCls" :style="{ color: item.color, textShadow: `0 0 12px ${item.color}40` }">{{ item.value }}</span>
              <span :class="detailNameCls">{{ item.name }}</span>
            </div>
            <span :class="detailPercentCls" :style="{ color: item.color }">{{ item.percent }}%</span>
          </div>

          <!-- 进度条 -->
          <div :class="progressTrackCls">
            <div
              :class="progressFillCls"
              :style="{
                width: hoveredItem === item.name ? `${item.percent}%` : '0%',
                background: `linear-gradient(90deg, ${item.color}30, ${item.color})`,
                transitionDelay: hoveredItem === item.name ? '0.1s' : '0s',
              }"
            />
            <div
              :class="progressGlowCls"
              :style="{
                left: hoveredItem === item.name ? `${item.percent}%` : '0%',
                background: item.color,
                transitionDelay: hoveredItem === item.name ? '0.1s' : '0s',
              }"
            />
          </div>

          <!-- 装饰线 -->
          <div :class="detailLineCls" :style="{ background: `linear-gradient(90deg, ${item.color}40, transparent)` }" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { css } from '@/styled-system/css'

const props = defineProps<{ criticalCount: number; warningCount: number; infoCount: number }>()

const chartRef = ref<HTMLDivElement | null>(null)
let instance: echarts.ECharts | null = null
const hoveredItem = ref<string | null>(null)

const total = computed(() => props.criticalCount + props.warningCount + props.infoCount)

const legends = [
  { name: '紧急', color: '#ef4444' },
  { name: '预警', color: '#f59e0b' },
  { name: '信息', color: '#3b82f6' },
]

const detailItems = computed(() => {
  const t = total.value || 1
  return [
    { name: '紧急', value: props.criticalCount, color: '#ef4444', percent: Math.round((props.criticalCount / t) * 100) },
    { name: '预警', value: props.warningCount, color: '#f59e0b', percent: Math.round((props.warningCount / t) * 100) },
    { name: '信息', value: props.infoCount, color: '#3b82f6', percent: Math.round((props.infoCount / t) * 100) },
  ]
})

function render() {
  if (!chartRef.value) return
  if (!instance) instance = echarts.init(chartRef.value)
  const t = total.value || 1

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
        name: '告警等级',
        type: 'pie',
        radius: ['52%', '78%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        padAngle: 3,
        itemStyle: {
          borderRadius: 6,
          borderColor: 'rgba(10,18,40,0.9)',
          borderWidth: 4,
        },
        label: { show: false },
        emphasis: {
          scale: true,
          scaleSize: 8,
          itemStyle: {
            shadowBlur: 30,
            shadowColor: 'rgba(0,0,0,0.5)',
          },
        },
        data: [
          {
            value: props.criticalCount,
            name: '紧急',
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                { offset: 0, color: '#ef4444' },
                { offset: 1, color: '#991b1b' },
              ]),
              shadowBlur: 20,
              shadowColor: 'rgba(239,68,68,0.5)',
            },
          },
          {
            value: props.warningCount,
            name: '预警',
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                { offset: 0, color: '#f59e0b' },
                { offset: 1, color: '#92400e' },
              ]),
              shadowBlur: 16,
              shadowColor: 'rgba(245,158,11,0.4)',
            },
          },
          {
            value: props.infoCount,
            name: '信息',
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                { offset: 0, color: '#3b82f6' },
                { offset: 1, color: '#1e3a5f' },
              ]),
              shadowBlur: 12,
              shadowColor: 'rgba(59,130,246,0.3)',
            },
          },
        ],
      },
      // 外圈装饰环
      {
        name: '外环',
        type: 'pie',
        radius: ['82%', '84%'],
        center: ['50%', '50%'],
        silent: true,
        label: { show: false },
        data: [
          {
            value: props.criticalCount,
            name: '紧急环',
            itemStyle: { color: 'rgba(239,68,68,0.15)', borderRadius: 4 },
          },
          {
            value: props.warningCount,
            name: '预警环',
            itemStyle: { color: 'rgba(245,158,11,0.12)', borderRadius: 4 },
          },
          {
            value: props.infoCount,
            name: '信息环',
            itemStyle: { color: 'rgba(59,130,246,0.1)', borderRadius: 4 },
          },
        ],
      },
      // 内圈装饰环
      {
        name: '内环',
        type: 'pie',
        radius: ['46%', '48%'],
        center: ['50%', '50%'],
        silent: true,
        label: { show: false },
        data: [{ value: 1, itemStyle: { color: 'rgba(0,212,255,0.04)' } }],
      },
    ],
  }, true)
}

onMounted(() => render())
watch(() => [props.criticalCount, props.warningCount, props.infoCount], () => render())
onUnmounted(() => { instance?.dispose(); instance = null })

// ---- Panda CSS ----
const wrapperCls = css({
  borderRadius: 'xl',
  bg: 'rgba(10,18,40,0.75)',
  border: '1px solid rgba(0,212,255,0.08)',
  backdropFilter: 'blur(12px)',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  flex: '1',
})

const headerCls = css({
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  px: '5', py: '3.5', borderBottom: '1px solid rgba(0,212,255,0.06)', flexShrink: '0',
})
const headerLeftCls = css({ display: 'flex', alignItems: 'center', gap: '3' })
const dotCls = css({
  w: '8px', h: '8px', borderRadius: 'full', bg: 'cyan.400',
  boxShadow: '0 0 8px token(colors.cyan.400)',
})
const titleCls = css({ fontSize: 'sm', fontWeight: '600', letterSpacing: '0.02em' })

const legendCls = css({ display: 'flex', gap: '3' })
const legendItemCls = css({
  display: 'inline-flex', alignItems: 'center', gap: '1.5',
  fontSize: '10px', color: 'slate.400', letterSpacing: '0.04em',
})
const legendDotCls = css({ w: '6px', h: '6px', borderRadius: 'full', flexShrink: '0' })

const bodyCls = css({
  display: 'flex', flex: '1', minH: '0', p: '4', gap: '4',
})

const chartWrapCls = css({
  position: 'relative', flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center',
})

const chartCls = css({
  position: 'absolute', inset: '0', zIndex: '1',
})

const centerDecoCls = css({
  position: 'relative', zIndex: '2',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  width: '100px', height: '100px',
  pointerEvents: 'none',
})

const centerRingCls = css({
  position: 'absolute', inset: '0', borderRadius: 'full',
  border: '1px solid rgba(0,212,255,0.08)',
  animation: 'center-rotate 15s linear infinite',
})

const centerRingInnerCls = css({
  position: 'absolute', inset: '8px', borderRadius: 'full',
  border: '1px dashed rgba(0,212,255,0.06)',
  animation: 'center-rotate 10s linear infinite reverse',
})

const centerTextCls = css({
  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0',
})

const centerLabelCls = css({
  fontSize: '10px', color: 'slate.500', letterSpacing: '0.08em',
})

const centerValueCls = css({
  fontSize: '28px', fontWeight: '800', fontFamily: 'mono',
  color: '#e2e8f0', lineHeight: '1.1',
  textShadow: '0 0 20px rgba(0,212,255,0.2)',
})

const centerUnitCls = css({
  fontSize: '9px', color: 'slate.500', letterSpacing: '0.06em',
})

const detailCls = css({
  display: 'flex', flexDirection: 'column', gap: '2',
  width: '140px', flexShrink: '0', justifyContent: 'center',
})

const detailItemCls = css({
  display: 'flex', flexDirection: 'column', gap: '1.5',
  px: '3', py: '2.5', borderRadius: 'lg',
  position: 'relative', overflow: 'hidden',
  animation: 'detail-fade-in 0.4s ease-out both',
  transition: 'all 0.3s',
  cursor: 'default',
  _hover: {
    bg: 'rgba(255,255,255,0.02)',
  },
})

const detailTopCls = css({
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
})

const detailLeftCls = css({
  display: 'flex', alignItems: 'baseline', gap: '2',
})

const detailNumCls = css({
  fontSize: 'xl', fontWeight: '800', fontFamily: 'mono', lineHeight: '1',
})

const detailNameCls = css({
  fontSize: '11px', color: 'slate.400', letterSpacing: '0.04em',
})

const detailPercentCls = css({
  fontSize: 'sm', fontWeight: '700', fontFamily: 'mono',
})

const progressTrackCls = css({
  position: 'relative', h: '3px', bg: 'rgba(255,255,255,0.03)', borderRadius: 'full', overflow: 'hidden',
})

const progressFillCls = css({
  position: 'absolute', inset: '0', borderRadius: 'full',
  transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
})

const progressGlowCls = css({
  position: 'absolute', top: '0', width: '8px', height: '100%',
  borderRadius: 'full', filter: 'blur(3px)',
  opacity: '0.6',
  transform: 'translateX(-50%)',
  transition: 'left 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
})

const detailLineCls = css({
  position: 'absolute', bottom: '0', left: '0', right: '0', h: '1px',
})
</script>

<style scoped>
@keyframes center-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
@keyframes detail-fade-in {
  from { opacity: 0; transform: translateX(10px); }
  to { opacity: 1; transform: translateX(0); }
}
</style>
