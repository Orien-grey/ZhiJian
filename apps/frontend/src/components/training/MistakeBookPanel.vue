<template>
  <div class="card mistake-panel">
    <div class="panel-header">
      <div>
        <h3>错题集</h3>
        <p class="panel-sub">自动收集需要复盘的作答记录</p>
      </div>
      <n-tag size="small" type="warning">{{ filteredRecords.length }} 条</n-tag>
    </div>

    <div class="filter-grid">
      <n-select v-model:value="categoryFilter" :options="categoryOptions" />
      <n-select v-model:value="errorTypeFilter" :options="errorTypeOptions" />
    </div>

    <div v-if="!records.length" class="empty-state">
      暂无错题，完成刷题后这里会自动收集需要复习的题目。
    </div>

    <div v-else-if="!filteredRecords.length" class="empty-state">
      当前筛选条件下没有错题。
    </div>

    <div v-else class="record-list">
      <button
        v-for="record in filteredRecords"
        :key="record.record_id"
        type="button"
        :class="['record-card', { active: selectedRecordId === record.record_id }]"
        @click="$emit('select', record)"
      >
        <div class="record-top">
          <strong>{{ record.case?.category || "未分类" }}</strong>
          <span>{{ record.score }} 分</span>
        </div>
        <div class="record-meta">
          <span>{{ record.case?.original_id || record.case_id }}</span>
          <span>{{ formatDate(record.created_at) }}</span>
        </div>
        <div class="tag-row">
          <n-tag
            v-for="errorType in uniqueErrorTypes(record)"
            :key="`${record.record_id}-${errorType}`"
            size="small"
            type="error"
          >
            {{ errorType }}
          </n-tag>
        </div>
        <p class="record-text">{{ record.case?.raw_text || "题干缺失" }}</p>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { NSelect, NTag } from "naive-ui";
import type { MistakeRecord } from "@/services/training";

const props = defineProps<{
  records: MistakeRecord[];
  selectedRecordId?: string;
}>();

defineEmits<{
  select: [record: MistakeRecord];
}>();

const categoryFilter = ref<string>("all");
const errorTypeFilter = ref<string>("all");

const diagnosisItemsOf = (record: MistakeRecord) => record.diagnosis_result?.diagnosis_items ?? [];

const categoryOptions = computed(() => [
  { label: "全部错题", value: "all" },
  ...Array.from(new Set(props.records.map((record) => record.case?.category).filter(Boolean))).map((category) => ({
    label: category as string,
    value: category as string,
  })),
]);

const errorTypeOptions = computed(() => [
  { label: "全部错误类型", value: "all" },
  ...Array.from(
    new Set(
      props.records.flatMap((record) =>
        diagnosisItemsOf(record).map((item) => item.diagnosis_type).filter(Boolean),
      ),
    ),
  ).map((errorType) => ({
    label: errorType,
    value: errorType,
  })),
]);

const filteredRecords = computed(() =>
  props.records.filter((record) => {
    const matchCategory = categoryFilter.value === "all" || record.case?.category === categoryFilter.value;
    const matchErrorType =
      errorTypeFilter.value === "all" ||
      diagnosisItemsOf(record).some((item) => item.diagnosis_type === errorTypeFilter.value);
    return matchCategory && matchErrorType;
  }),
);

const uniqueErrorTypes = (record: MistakeRecord) =>
  Array.from(new Set(diagnosisItemsOf(record).map((item) => item.diagnosis_type))).slice(0, 3);

const formatDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
};
</script>

<style scoped>
.mistake-panel,
.record-list {
  display: grid;
  gap: 16px;
}

.panel-header,
.record-top,
.record-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.panel-sub {
  color: #6b7a94;
  font-size: 13px;
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.empty-state {
  border: 1px dashed #c6d6eb;
  border-radius: 16px;
  padding: 20px;
  color: #6b7a94;
  background: #f8fbff;
}

.record-card {
  width: 100%;
  text-align: left;
  border: 1px solid #e6ecf5;
  border-radius: 16px;
  background: #fff;
  padding: 16px;
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.record-card:hover,
.record-card.active {
  border-color: #1a74ff;
  box-shadow: 0 12px 30px rgba(26, 116, 255, 0.12);
  transform: translateY(-1px);
}

.record-top strong,
.record-meta,
.record-text {
  color: #42526b;
}

.record-text {
  margin: 12px 0 0;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}

.tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

@media (max-width: 760px) {
  .filter-grid {
    grid-template-columns: 1fr;
  }
}
</style>
