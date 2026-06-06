<template>
  <header :class="barCls">
    <!-- 左侧：页面标题 -->
    <div :class="leftCls">
      <h1 :class="titleCls">航行情报动态信息看板</h1>
    </div>

    <!-- 中间：周期生效时间 -->
    <div :class="centerCls">
      <span :class="periodLabelCls">250501周期生效时间：</span>
      <span :class="periodValueCls">05月15日</span>
    </div>

    <!-- 右侧：时间切换按钮组 -->
    <div :class="rightCls">
      <button
        v-for="btn in timeButtons"
        :key="btn.key"
        :class="btn.key === activeTime ? timeBtnActiveCls : timeBtnCls"
        @click="emit('update:activeTime', btn.key)"
      >
        {{ btn.label }}
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { css } from '@/styled-system/css'

defineProps<{ activeTime: 'today' | 'tomorrow' | 'both' }>()
const emit = defineEmits<{ (e: 'update:activeTime', v: 'today' | 'tomorrow' | 'both'): void }>()

const timeButtons: { key: 'today' | 'tomorrow' | 'both'; label: string }[] = [
  { key: 'today', label: '今日' },
  { key: 'tomorrow', label: '明日' },
  { key: 'both', label: '两日' },
]

// ====== Panda CSS ======
const barCls = css({
  display: 'flex', alignItems: 'center', h: '48px', flexShrink: '0', position: 'relative', zIndex: '2',
  bg: 'rgba(8,14,32,0.9)', borderBottom: '1px solid rgba(0,212,255,0.08)',
  px: '5', gap: '4',
})

const leftCls = css({ display: 'flex', alignItems: 'center' })
const titleCls = css({ fontSize: 'md', fontWeight: '700', letterSpacing: '0.04em', m: '0', whiteSpace: 'nowrap' })

const centerCls = css({ flex: '1', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2' })
const periodLabelCls = css({ fontSize: 'sm', color: 'slate.400' })
const periodValueCls = css({ fontSize: 'sm', fontWeight: '600', color: 'cyan.300', fontFamily: 'mono' })

const rightCls = css({ display: 'flex', gap: '0' })

const timeBtnCls = css({
  px: '4', py: '1.5', fontSize: 'sm', cursor: 'pointer',
  bg: 'transparent', color: 'slate.400', border: '1px solid rgba(255,255,255,0.05)',
  transition: 'all 0.2s',
  _hover: { color: 'cyan.300', borderColor: 'rgba(0,212,255,0.2)' },
  '&:first-child': { borderLeftRadius: 'md' },
  '&:last-child': { borderRightRadius: 'md' },
})

const timeBtnActiveCls = css({
  px: '4', py: '1.5', fontSize: 'sm', cursor: 'pointer',
  bg: 'rgba(0,212,255,0.12)', color: '#00d4ff', fontWeight: '600',
  border: '1px solid rgba(0,212,255,0.3)',
  '&:first-child': { borderLeftRadius: 'md' },
  '&:last-child': { borderRightRadius: 'md' },
})
</script>
