<template>
  <div class="checkbox-section">
    <div v-for="opt in options" :key="opt" class="cb-label" @click="$emit('toggle', opt)">
      <span class="cb-box" :class="{ checked: selections[opt] }">
        <span v-if="selections[opt]" class="cb-check">✓</span>
      </span>
      <span class="cb-text">{{ opt }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  selections: Record<string, boolean>
}>()

defineEmits<{
  (e: 'toggle', key: string): void
}>()

const options = ['禁航通告', '限制区', '航路点 / 导航台', '航路', '运行机场']
</script>

<style scoped>
.checkbox-section {
  padding: 9px 14px; flex-shrink: 0;
  border-top: 1px solid rgba(0,212,255,0.05); display: flex; flex-direction: column; gap: 5px;
}
.cb-label { display: flex; align-items: center; gap: 7px; cursor: pointer; user-select: none; padding: 1px 0; }
.cb-box {
  width: 14px; height: 14px; border-radius: 2px; border: 1px solid rgba(255,255,255,0.14);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  background: rgba(255,255,255,0.03); transition: all 0.15s;
}
.cb-box.checked { background: rgba(0,212,255,0.14); border-color: #00d4ff; }
.cb-check { font-size: 9px; color: #00d4ff; font-weight: 700; }
.cb-text { font-size: 10px; color: #94a3b8; }
</style>
