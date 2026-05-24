<template>
  <div class="card practice-panel">
    <div class="panel-header">
      <div>
        <h3>{{ caseItem.case_id }}</h3>
        <p class="panel-sub">{{ caseItem.category }} / {{ caseItem.source }} / {{ caseItem.answer_shape }}</p>
      </div>
      <n-tag size="small" type="info">
        {{ caseItem.original_id || "无原始编号" }}
      </n-tag>
    </div>

    <section class="notam-box">
      <div class="section-head">
        <span>NOTAM 原文</span>
        <n-button text @click="showJsonPreview = !showJsonPreview">
          {{ showJsonPreview ? "收起 JSON 预览" : "展开 JSON 预览" }}
        </n-button>
      </div>
      <pre class="notam-text">{{ caseItem.raw_text }}</pre>
    </section>

    <section class="unit-section">
      <div class="section-head">
        <span>结构化作答</span>
        <div class="unit-actions">
          <n-button quaternary size="small" @click="addUnit">添加答案单元</n-button>
          <n-button quaternary size="small" @click="resetAnswerUnits">重置</n-button>
        </div>
      </div>

      <div class="unit-list">
        <article v-for="(unit, unitIndex) in answerUnits" :key="unit.unit_id" class="unit-card">
          <div class="unit-card-head">
            <strong>{{ unit.unit_id }}</strong>
            <n-button
              text
              type="error"
              :disabled="answerUnits.length <= 1"
              @click="removeUnit(unitIndex)"
            >
              删除
            </n-button>
          </div>

          <div class="field-grid">
            <label
              v-for="fieldName in resolveFieldNames(unitIndex)"
              :key="`${unit.unit_id}-${fieldName}`"
              class="field-item"
            >
              <span class="field-label">{{ fieldName }}</span>
              <n-input
                :value="stringifyValue(unit.fields[fieldName])"
                :placeholder="fieldPlaceholder(unitIndex, fieldName)"
                @update:value="(value) => updateField(unitIndex, fieldName, value)"
              />
            </label>
          </div>
        </article>
      </div>
    </section>

    <section v-if="showJsonPreview" class="json-box">
      <span class="section-title">提交 JSON 预览</span>
      <pre>{{ jsonPreview }}</pre>
    </section>

    <div class="action-row">
      <n-button type="primary" :loading="submitting" @click="emitSubmit">提交批改</n-button>
      <n-button @click="$emit('next-case')">下一题</n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { NButton, NInput, NTag } from "naive-ui";
import type { AnswerUnit, GoldAnswer, TrainingCase } from "@/services/training";

const props = defineProps<{
  caseItem: TrainingCase;
  goldAnswer: GoldAnswer;
  submitting?: boolean;
}>();

const emit = defineEmits<{
  submit: [studentAnswerUnits: AnswerUnit[]];
  "next-case": [];
}>();

const showJsonPreview = ref(false);
const answerUnits = ref<AnswerUnit[]>([]);

const baseSchemas = computed(() =>
  props.goldAnswer.gold_answer_units.length
    ? props.goldAnswer.gold_answer_units
    : [{ unit_id: "unit_0", fields: {} as Record<string, string | number | boolean | null> }],
);

const buildUnitFromSchema = (schema: AnswerUnit, index: number): AnswerUnit => ({
  unit_id: schema.unit_id || `unit_${index}`,
  source_path: schema.source_path,
  fields: Object.keys(schema.fields || {}).reduce<Record<string, string | number | boolean | null>>((acc, key) => {
    acc[key] = null;
    return acc;
  }, {}),
});

const resetAnswerUnits = () => {
  answerUnits.value = baseSchemas.value.map((schema, index) => buildUnitFromSchema(schema, index));
};

watch(
  () => [props.caseItem.case_id, props.goldAnswer],
  () => {
    showJsonPreview.value = false;
    resetAnswerUnits();
  },
  { immediate: true },
);

const resolveFieldNames = (unitIndex: number) => {
  const schema = baseSchemas.value[unitIndex] || baseSchemas.value[baseSchemas.value.length - 1];
  const answerUnit = answerUnits.value[unitIndex];
  return Array.from(
    new Set([...Object.keys(schema?.fields || {}), ...Object.keys(answerUnit?.fields || {})]),
  );
};

const fieldPlaceholder = (unitIndex: number, fieldName: string) => {
  const schema = baseSchemas.value[unitIndex] || baseSchemas.value[0];
  const sample = schema?.fields?.[fieldName];
  if (sample === undefined || sample === null || sample === "") {
    return "请输入字段值";
  }
  return `参考格式: ${String(sample)}`;
};

const stringifyValue = (value: string | number | boolean | null | undefined) =>
  value === null || value === undefined ? "" : String(value);

const coerceValue = (fieldName: string, value: string, unitIndex: number) => {
  const schema = baseSchemas.value[unitIndex] || baseSchemas.value[0];
  const sample = schema?.fields?.[fieldName];
  if (value.trim() === "") {
    return null;
  }
  if (typeof sample === "number") {
    const numericValue = Number(value);
    return Number.isNaN(numericValue) ? value : numericValue;
  }
  if (typeof sample === "boolean") {
    return value.toLowerCase() === "true";
  }
  return value;
};

const updateField = (unitIndex: number, fieldName: string, value: string) => {
  const current = answerUnits.value[unitIndex];
  if (!current) {
    return;
  }
  current.fields[fieldName] = coerceValue(fieldName, value, unitIndex);
};

const addUnit = () => {
  const template = baseSchemas.value[Math.min(answerUnits.value.length, baseSchemas.value.length - 1)] || baseSchemas.value[0];
  const nextIndex = answerUnits.value.length;
  answerUnits.value.push({
    ...buildUnitFromSchema(template, nextIndex),
    unit_id: `unit_${nextIndex}`,
  });
};

const removeUnit = (unitIndex: number) => {
  if (answerUnits.value.length <= 1) {
    return;
  }
  answerUnits.value.splice(unitIndex, 1);
};

const jsonPreview = computed(() => JSON.stringify(answerUnits.value, null, 2));

const emitSubmit = () => {
  emit("submit", answerUnits.value.map((unit) => ({
    unit_id: unit.unit_id,
    source_path: unit.source_path,
    fields: { ...unit.fields },
  })));
};
</script>

<style scoped>
.practice-panel {
  display: grid;
  gap: 20px;
}

.panel-header,
.section-head,
.unit-card-head,
.action-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.panel-sub,
.section-title {
  color: #6b7a94;
  font-size: 13px;
}

.notam-box {
  border-radius: 18px;
  padding: 18px;
  background: linear-gradient(180deg, #0f1727 0%, #17253d 100%);
  color: #e4edff;
}

.notam-text,
.json-box pre {
  margin: 0;
  white-space: pre-wrap;
  font-family: "IBM Plex Mono", monospace;
  line-height: 1.7;
}

.notam-text {
  font-size: 14px;
}

.unit-section,
.json-box {
  display: grid;
  gap: 14px;
}

.unit-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.unit-list {
  display: grid;
  gap: 14px;
}

.unit-card {
  border: 1px solid #e6ecf5;
  border-radius: 16px;
  padding: 16px;
  background: #fbfdff;
}

.field-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin-top: 14px;
}

.field-item {
  display: grid;
  gap: 8px;
}

.field-label {
  font-size: 12px;
  color: #58708e;
  text-transform: uppercase;
}

.json-box {
  border: 1px dashed #c6d6eb;
  border-radius: 16px;
  padding: 16px;
  background: #f8fbff;
}

.action-row {
  justify-content: flex-start;
  flex-wrap: wrap;
}

@media (max-width: 900px) {
  .field-grid {
    grid-template-columns: 1fr;
  }
}
</style>
