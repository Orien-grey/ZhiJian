<template>
  <div class="card progress-panel">
    <div class="panel-header">
      <div>
        <h3>训练进度</h3>
        <p class="panel-sub">整体刷题完成情况</p>
      </div>
      <n-tag size="small" type="info">{{ progress?.answered_count ?? 0 }} 次作答</n-tag>
    </div>

    <div v-if="progress" class="stat-grid">
      <div class="stat-card">
        <span>总题数</span>
        <strong>{{ progress.total_cases }}</strong>
      </div>
      <div class="stat-card">
        <span>已完成</span>
        <strong>{{ progress.answered_count }}</strong>
      </div>
      <div class="stat-card">
        <span>正确数</span>
        <strong>{{ progress.correct_count }}</strong>
      </div>
      <div class="stat-card">
        <span>错题数</span>
        <strong>{{ progress.mistake_count }}</strong>
      </div>
      <div class="stat-card">
        <span>平均分</span>
        <strong>{{ progress.average_score }}</strong>
      </div>
      <div class="stat-card">
        <span>最近得分</span>
        <strong>{{ progress.latest_score ?? "--" }}</strong>
      </div>
    </div>

    <div v-else class="empty-state">暂无训练进度数据。</div>

    <div class="progress-block">
      <div class="progress-meta">
        <span>完成进度</span>
        <strong>{{ completionRate }}%</strong>
      </div>
      <n-progress type="line" :percentage="completionRate" :show-indicator="false" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { NProgress, NTag } from "naive-ui";
import type { TrainingProgress } from "@/services/training";

const props = defineProps<{
  progress: TrainingProgress | null;
}>();

const completionRate = computed(() => {
  const total = props.progress?.total_cases ?? 0;
  const answered = props.progress?.answered_count ?? 0;
  if (!total) {
    return 0;
  }
  return Math.min(100, Math.round((answered / total) * 100));
});
</script>

<style scoped>
.progress-panel,
.progress-block {
  display: grid;
  gap: 16px;
}

.panel-header,
.progress-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.panel-sub {
  color: #6b7a94;
  font-size: 13px;
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.stat-card {
  padding: 14px;
  border-radius: 14px;
  border: 1px solid #e6ecf5;
  background: #fbfdff;
}

.stat-card span {
  display: block;
  color: #6b7a94;
  font-size: 12px;
  margin-bottom: 8px;
}

.stat-card strong {
  font-size: 20px;
}

.progress-meta span {
  color: #6b7a94;
  font-size: 13px;
}

.empty-state {
  border: 1px dashed #c6d6eb;
  border-radius: 14px;
  padding: 18px;
  color: #6b7a94;
}

@media (max-width: 760px) {
  .stat-grid {
    grid-template-columns: 1fr;
  }
}
</style>
