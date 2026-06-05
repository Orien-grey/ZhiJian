<template>
  <span :class="cx(wrapper, pulseState === 'live' && wrapperLive, pulseState === 'idle' && wrapperIdle)">
    <span :class="cx(dot, dotVariant[severity])" />
    <span :class="label">{{ label }}</span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { css, cx } from '@/styled-system/css'

const props = withDefaults(
  defineProps<{
    pulseState?: 'live' | 'idle' | 'off'
    severity?: 'critical' | 'warning' | 'info' | 'normal'
    label?: string
  }>(),
  { pulseState: 'live', severity: 'normal', label: 'LIVE' },
)

const wrapper = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '2',
  fontSize: '11px',
  fontWeight: '700',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: 'slate.400',
})

const wrapperLive = css({ color: 'cyan.400' })
const wrapperIdle = css({ color: 'amber.400' })

const dot = css({
  w: '7px',
  h: '7px',
  borderRadius: 'full',
  position: 'relative',
  flexShrink: '0',
})

const dotVariant: Record<string, ReturnType<typeof css>> = {
  critical: css({
    bg: 'red.500',
    boxShadow: '0 0 6px token(colors.red.500), 0 0 12px token(colors.red.500)',
    animation: 'pulse-critical 1.2s ease-in-out infinite',
  }),
  warning: css({
    bg: 'amber.400',
    boxShadow: '0 0 6px token(colors.amber.400), 0 0 12px token(colors.amber.400)',
    animation: 'pulse-warning 1.8s ease-in-out infinite',
  }),
  info: css({
    bg: 'blue.400',
    boxShadow: '0 0 6px token(colors.blue.400)',
    animation: 'pulse-info 2.2s ease-in-out infinite',
  }),
  normal: css({
    bg: 'emerald.400',
    boxShadow: '0 0 6px token(colors.emerald.400), 0 0 12px token(colors.emerald.400)',
    animation: 'pulse-normal 1.5s ease-in-out infinite',
  }),
}

const label = css({ whiteSpace: 'nowrap' })
</script>

<style scoped>
@keyframes pulse-critical {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(1.6); }
}
@keyframes pulse-warning {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.4); }
}
@keyframes pulse-info {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.2); }
}
@keyframes pulse-normal {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.3; transform: scale(1.5); }
}
</style>
