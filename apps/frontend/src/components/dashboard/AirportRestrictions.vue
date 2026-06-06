<template>
  <div :class="wrapperCls">
    <!-- 告警时间轴 -->
    <div :class="sectionCls">
      <p :class="sectionTitleCls">告警时间轴</p>
      <div :class="timelineCls">
        <div :class="timelineTrackCls">
          <div
            v-for="alert in mockTimeline"
            :key="alert.id"
            :class="css({ display: 'flex', alignItems: 'center', gap: '1', flexShrink: '0', cursor: 'pointer', _hover: { opacity: '0.8' } })"
          >
            <span :class="css({ fontSize: '10px', color: 'slate.500', fontFamily: 'mono' })">{{ alert.time }}</span>
            <span :class="css({ fontSize: '10px', fontWeight: '700', color: alert.severity === 'critical' ? 'red.400' : 'cyan.400', fontFamily: 'mono' })">{{ alert.icao }}</span>
            <span v-if="alert.severity === 'critical'" :class="css({ fontSize: '8px', fontWeight: '800', color: '#fff', bg: 'red.600', px: '1', borderRadius: '2px' })">告</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 多维度筛选 -->
    <div :class="sectionCls">
      <p :class="sectionTitleCls">筛选条件</p>
      <div :class="filterRowCls">
        <input :class="inputCls" type="text" placeholder="四字码搜索..." />
      </div>
      <div :class="filterRowCls">
        <select :class="selectCls">
          <option>全部机场</option>
          <option>ZBAA 北京首都</option>
          <option>ZSSS 上海虹桥</option>
          <option>ZGGG 广州白云</option>
        </select>
      </div>
      <div :class="filterRowCls">
        <select :class="selectCls">
          <option>限制类型</option>
          <option>机场关闭</option>
          <option>机场不可着陆</option>
          <option>机场不可起飞</option>
          <option>机场不可备降</option>
          <option>跑道关闭</option>
          <option>跑道不可着陆</option>
          <option>跑道不可起飞</option>
          <option>滑行道关闭</option>
        </select>
      </div>
    </div>

    <!-- 机场限制表格占位 -->
    <div :class="sectionCls" style="flex: 1; min-h: 0; overflow-y: auto;">
      <p :class="sectionTitleCls">机场限制时间</p>
      <p :class="css({ fontSize: 'xs', color: 'slate.500', textAlign: 'center', mt: '8' })">表格组件将在第二优先级实现</p>
    </div>

    <!-- 地图内容筛选 -->
    <div :class="sectionCls">
      <p :class="sectionTitleCls">地图显示</p>
      <div :class="checkboxGroupCls">
        <label v-for="opt in mapFilters" :key="opt" :class="checkboxLabelCls">
          <input type="checkbox" checked :class="checkboxCls" />
          <span :class="css({ fontSize: 'xs', color: 'slate.400' })">{{ opt }}</span>
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { css } from '@/styled-system/css'

const mockTimeline = [
  { id: '1', time: '13:00', icao: 'ZBAA', severity: 'critical' },
  { id: '2', time: '13:30', icao: 'ZSAM', severity: 'info' },
  { id: '3', time: '14:00', icao: 'ZSJN', severity: 'critical' },
  { id: '4', time: '14:30', icao: 'ZGGG', severity: 'warning' },
  { id: '5', time: '15:00', icao: 'ZSSS', severity: 'info' },
]

const mapFilters = ['禁航通告', '航路点 / 导航台', '航路', '运行机场', '所有机场']

// Panda CSS
const wrapperCls = css({ display: 'flex', flexDirection: 'column', h: '100%', overflow: 'hidden' })
const sectionCls = css({ px: '4', py: '3', borderBottom: '1px solid rgba(0,212,255,0.04)' })
const sectionTitleCls = css({ fontSize: 'xs', fontWeight: '600', color: 'slate.400', mb: '2.5', letterSpacing: '0.05em' })

const timelineCls = css({ overflowX: 'auto', '&::-webkit-scrollbar': { h: '2px' }, '&::-webkit-scrollbar-thumb': { bg: 'rgba(0,212,255,0.1)', borderRadius: '2px' } })
const timelineTrackCls = css({ display: 'flex', gap: '4', py: '1', minW: 'max-content' })

const filterRowCls = css({ mb: '2' })
const inputCls = css({ w: '100%', px: '3', py: '1.5', borderRadius: 'md', fontSize: 'xs', bg: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: 'slate.300', outline: 'none', _focus: { borderColor: 'rgba(0,212,255,0.3)' }, '&::placeholder': { color: 'slate.600' } })
const selectCls = css({ w: '100%', px: '3', py: '1.5', borderRadius: 'md', fontSize: 'xs', bg: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: 'slate.300', outline: 'none', cursor: 'pointer', _focus: { borderColor: 'rgba(0,212,255,0.3)' } })

const checkboxGroupCls = css({ display: 'flex', flexDirection: 'column', gap: '2' })
const checkboxLabelCls = css({ display: 'flex', alignItems: 'center', gap: '2', cursor: 'pointer', _hover: { color: 'slate.300' } })
const checkboxCls = css({ accentColor: '#00d4ff', w: '14px', h: '14px', cursor: 'pointer' })
</script>
