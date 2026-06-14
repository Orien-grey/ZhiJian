<template>
  <div class="checkbox-section">
    <span class="cb-label">图层</span>
    <div class="cb-row">
      <button
        v-for="opt in options"
        :key="opt"
        class="cb-chip"
        :class="{ on: selections[opt] }"
        @click="$emit('toggle', opt)"
      >{{ opt }}</button>
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

const options = ['禁航通告', '限制区', '航路点', '航路', '运行机场']
</script>

<style scoped>
.checkbox-section {
  padding: 6px 12px; flex-shrink: 0;
  border-top: 1px solid rgba(0,212,255,0.06);
  display: flex; align-items: center; gap: 8px;
}
.cb-label {
  font-size: 9px; font-weight: 700; color: #475569;
  letter-spacing: 0.08em; text-transform: uppercase; flex-shrink: 0;
}
.cb-row { display: flex; gap: 4px; flex-wrap: wrap; }
.cb-chip {
  padding: 2px 8px; border-radius: 4px; font-size: 10px;
  border: 1px solid rgba(255,255,255,0.06); background: rgba(255,255,255,0.02);
  color: #64748b; cursor: pointer; transition: all 0.2s;
  font-family: inherit; line-height: 1.4;
}
.cb-chip:hover { border-color: rgba(0,212,255,0.2); color: #94a3b8; }
.cb-chip.on {
  background: rgba(0,212,255,0.1); border-color: rgba(0,212,255,0.3);
  color: #00d4ff;
}
</style>
