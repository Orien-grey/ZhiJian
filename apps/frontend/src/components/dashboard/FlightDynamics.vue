<template>
  <div :class="wrapperCls">
    <!-- 搜索筛选区 -->
    <div :class="sectionCls">
      <div :class="css({ display: 'flex', gap: '2', mb: '2' })">
        <input :class="inputCls" type="text" placeholder="搜索航班/机号..." />
        <select :class="selectCls">
          <option>全部状态</option>
          <option>计划</option>
          <option>签派计划</option>
          <option>在飞</option>
          <option>即将降落</option>
          <option>实际</option>
        </select>
      </div>
      <div :class="css({ display: 'flex', gap: '2' })">
        <input :class="inputCls" type="text" placeholder="点检查..." style="flex: 1;" />
        <button :class="btnCls">重置</button>
      </div>
      <div :class="css({ display: 'flex', gap: '0', mt: '2' })">
        <button
          v-for="t in typeTabs"
          :key="t.key"
          :class="t.key === activeType ? tabActiveCls : tabCls"
          @click="activeType = t.key"
        >{{ t.label }}</button>
      </div>
    </div>

    <!-- 航班列表占位 -->
    <div :class="css({ flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'slate.600', fontSize: 'sm' })">
      航班列表将在第五优先级实现
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { css } from '@/styled-system/css'

const activeType = ref<'all' | 'affected'>('all')
const typeTabs = [
  { key: 'all' as const, label: '全部航班' },
  { key: 'affected' as const, label: '影响航班' },
]

// Panda CSS
const wrapperCls = css({ display: 'flex', flexDirection: 'column', h: '100%' })
const sectionCls = css({ px: '4', py: '3', borderBottom: '1px solid rgba(0,212,255,0.06)' })

const inputCls = css({ flex: '1', px: '2.5', py: '1.5', borderRadius: 'md', fontSize: 'xs', bg: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: 'slate.300', outline: 'none', _focus: { borderColor: 'rgba(0,212,255,0.3)' }, '&::placeholder': { color: 'slate.600' } })
const selectCls = css({ w: '100px', px: '2', py: '1.5', borderRadius: 'md', fontSize: 'xs', bg: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: 'slate.300', outline: 'none', cursor: 'pointer' })

const btnCls = css({ px: '3', py: '1.5', borderRadius: 'md', fontSize: 'xs', cursor: 'pointer', bg: 'rgba(255,255,255,0.03)', color: 'slate.400', border: '1px solid rgba(255,255,255,0.06)', _hover: { color: 'cyan.300', borderColor: 'rgba(0,212,255,0.2)' } })

const tabCls = css({ flex: '1', py: '1.5', fontSize: 'sm', cursor: 'pointer', bg: 'transparent', color: 'slate.400', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', transition: 'all 0.2s', _hover: { color: 'cyan.300' }, '&:first-child': { borderLeftRadius: 'md' }, '&:last-child': { borderRightRadius: 'md' } })
const tabActiveCls = css({ flex: '1', py: '1.5', fontSize: 'sm', cursor: 'pointer', bg: 'rgba(0,212,255,0.1)', color: '#00d4ff', fontWeight: '600', border: '1px solid rgba(0,212,255,0.25)', textAlign: 'center', '&:first-child': { borderLeftRadius: 'md' }, '&:last-child': { borderRightRadius: 'md' } })
</script>
