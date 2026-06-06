<template>
  <div :class="wrapperCls">
    <!-- 地图画布占位 -->
    <div :class="mapPlaceholderCls">
      <div :class="mapHintCls">
        <span :class="css({ fontSize: '48px', mb: '4', opacity: '0.3' })">◈</span>
        <p :class="css({ fontSize: 'sm', color: 'slate.500', mb: '1' })">核心地图区</p>
        <p :class="css({ fontSize: 'xs', color: 'slate.600' })">ECharts 中国地图 + 空域情报区 + 限制区将在第三优先级实现</p>
      </div>
    </div>

    <!-- 底部内容筛选复选框 -->
    <div :class="bottomBarCls">
      <label v-for="opt in bottomFilters" :key="opt" :class="css({ display: 'flex', alignItems: 'center', gap: '1.5', cursor: 'pointer', fontSize: 'xs', color: 'slate.400', _hover: { color: 'slate.300' } })">
        <input type="checkbox" checked :class="css({ accentColor: '#00d4ff', w: '14px', h: '14px', cursor: 'pointer' })" />
        {{ opt }}
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { css } from '@/styled-system/css'

const bottomFilters = ['禁航通告', '航路点 / 导航台', '航路', '运行机场', '所有机场']

const wrapperCls = css({ display: 'flex', flexDirection: 'column', h: '100%', position: 'relative' })
const mapPlaceholderCls = css({ flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center' })
const mapHintCls = css({ display: 'flex', flexDirection: 'column', alignItems: 'center' })
const bottomBarCls = css({ display: 'flex', gap: '4', px: '4', py: '2.5', bg: 'rgba(8,14,32,0.9)', borderTop: '1px solid rgba(0,212,255,0.06)', flexWrap: 'wrap' })
</script>
