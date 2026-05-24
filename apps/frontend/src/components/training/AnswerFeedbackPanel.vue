<template>
  <div class="card feedback-panel">
    <div class="panel-header">
      <div>
        <h3>{{ mode === "practice" ? "批改反馈" : "错题详情" }}</h3>
        <p class="panel-sub">{{ emptyHint }}</p>
      </div>
      <n-tag v-if="result" :type="scoreTagType" size="small">
        {{ result.total_score }} 分
      </n-tag>
    </div>

    <div v-if="!result" class="empty-state">
      {{ emptyHint }}
    </div>

    <template v-else>
      <section class="summary-grid">
        <div class="summary-card">
          <span>总分</span>
          <strong>{{ result.total_score }}</strong>
        </div>
        <div class="summary-card">
          <span>等级</span>
          <strong>{{ result.summary?.level || "--" }}</strong>
        </div>
        <div class="summary-card">
          <span>错误数</span>
          <strong>{{ result.summary?.error_count ?? 0 }}</strong>
        </div>
        <div class="summary-card">
          <span>涉及能力</span>
          <strong>{{ relatedAbilitiesText }}</strong>
        </div>
      </section>

      <section class="section-block">
        <div class="section-title">字段匹配</div>
        <div class="table-wrap">
          <table class="result-table">
            <thead>
              <tr>
                <th>字段</th>
                <th>学生答案</th>
                <th>标准答案</th>
                <th>得分</th>
                <th>问题</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="unit in fieldMatchRows" :key="unit.unit_id">
                <tr v-for="fieldResult in unit.field_results" :key="`${unit.unit_id}-${fieldResult.field}`">
                  <td>{{ fieldResult.field }}</td>
                  <td>{{ formatCell(fieldResult.student_value) }}</td>
                  <td>{{ formatCell(fieldResult.gold_value) }}</td>
                  <td>{{ fieldResult.score }}</td>
                  <td>{{ formatFieldIssue(fieldResult) }}</td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </section>

      <section class="section-block">
        <div class="section-title">错误诊断</div>
        <template v-if="diagnosisResult">
          <div class="diagnosis-summary">{{ diagnosisResult.summary }}</div>

          <div v-if="!diagnosisItems.length" class="success-box">本题没有识别到独立错因。</div>
          <div v-else class="error-list">
            <div
              v-for="(item, index) in diagnosisItems"
              :key="`${item.field}-${item.diagnosis_type}-${index}`"
              class="error-card"
            >
              <div class="error-top">
                <strong>{{ item.diagnosis_type }}</strong>
                <span>{{ item.field }}</span>
              </div>
              <p>{{ item.message }}</p>
              <n-tag v-if="item.ability" size="small" type="warning">{{ item.ability }}</n-tag>
            </div>
          </div>

          <div class="diagnosis-meta">
            <div class="advice-card">
              <span class="advice-label">薄弱能力</span>
              <div v-if="weakAbilities.length" class="tag-list">
                <n-tag v-for="ability in weakAbilities" :key="ability" size="small" type="warning">
                  {{ ability }}
                </n-tag>
              </div>
              <p v-else>暂无明显薄弱能力。</p>
            </div>

            <div class="advice-card">
              <span class="advice-label">学习建议</span>
              <ul v-if="diagnosisSuggestions.length">
                <li v-for="item in diagnosisSuggestions" :key="item">{{ item }}</li>
              </ul>
              <p v-else>暂无额外建议。</p>
            </div>
          </div>

          <div v-if="showGradingAdvice" class="advice-grid">
            <div class="advice-card">
              <span class="advice-label">字段匹配反馈</span>
              <ul>
                <li v-for="item in result.feedback" :key="item">{{ item }}</li>
              </ul>
            </div>
            <div class="advice-card">
              <span class="advice-label">字段匹配建议</span>
              <ul>
                <li v-for="item in result.suggestions" :key="item">{{ item }}</li>
              </ul>
            </div>
          </div>
        </template>

        <p v-else class="empty-tip">暂无独立错误诊断结果，请重新提交本题生成 diagnosis_result。</p>
      </section>

      <section v-if="showGoldAnswer && goldAnswer" class="section-block">
        <div class="section-title">标准答案</div>
        <pre class="gold-preview">{{ goldAnswerText }}</pre>
      </section>

      <div v-if="showActions" class="action-row">
        <n-button v-if="mode === 'practice'" type="primary" @click="$emit('next')">下一题</n-button>
        <n-button v-if="mode === 'practice'" @click="$emit('retry')">重新作答</n-button>
        <n-button quaternary @click="$emit('revealGold')">
          {{ showGoldAnswer ? "隐藏标准答案" : "查看标准答案" }}
        </n-button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { NButton, NTag } from "naive-ui";
import type { DiagnosisResult, GoldAnswer, GradingResult, TrainingCase } from "@/services/training";

const props = withDefaults(
  defineProps<{
    mode: "practice" | "mistake";
    result: GradingResult | null;
    diagnosisResult?: DiagnosisResult | null;
    caseItem?: TrainingCase | null;
    showActions?: boolean;
    goldAnswer?: GoldAnswer | null;
    showGoldAnswer?: boolean;
  }>(),
  {
    diagnosisResult: null,
    caseItem: null,
    showActions: false,
    goldAnswer: null,
    showGoldAnswer: false,
  },
);

defineEmits<{
  next: [];
  retry: [];
  revealGold: [];
}>();

const emptyHint = computed(() => {
  if (props.result) {
    return props.caseItem ? `${props.caseItem.category} · ${props.caseItem.source}` : "字段级评分与诊断";
  }
  return props.mode === "practice"
    ? "提交答案后，这里会展示字段级批改、错误诊断和改进建议。"
    : "点击左侧错题，查看当时的答案、标准答案和诊断反馈。";
});

const relatedAbilitiesText = computed(() => {
  const abilities = props.result?.summary?.related_abilities || [];
  return abilities.length ? abilities.join("、") : "无";
});

/**
 * 字段匹配区：
 * 只使用 grading_result。
 * 这里展示字段级得分、匹配状态、标准值、学生值。
 * 不在这里做错因解释。
 */
const fieldMatchRows = computed(() => {
  return props.result?.unit_results ?? [];
});

/**
 * 错因分析区：
 * 只使用 diagnosis_result。
 * 这里展示 diagnosis_service.py 输出的诊断摘要、错因标签、薄弱能力和建议。
 * 不读取 grading_result 内的旧错误字段，避免把“字段匹配”和“错因分析”混在一起。
 */
const diagnosisItems = computed(() => {
  return props.diagnosisResult?.diagnosis_items ?? [];
});

const weakAbilities = computed(() => props.diagnosisResult?.weak_abilities ?? []);
const diagnosisSuggestions = computed(() => props.diagnosisResult?.suggestions ?? []);
const showGradingAdvice = computed(() => Boolean(props.result?.feedback.length || props.result?.suggestions.length));

const scoreTagType = computed(() => {
  const score = props.result?.total_score || 0;
  if (score >= 95) return "success";
  if (score >= 80) return "info";
  if (score >= 60) return "warning";
  return "error";
});

const formatCell = (value: unknown) => {
  if (value === null || value === undefined || value === "") {
    return "--";
  }
  if (typeof value === "object") {
    return JSON.stringify(value);
  }
  return String(value);
};

const formatFieldIssue = (fieldResult: GradingResult["unit_results"][number]["field_results"][number]) => {
  if (fieldResult.is_correct) {
    return "正确";
  }
  if (fieldResult.error_type && fieldResult.message) {
    return `${fieldResult.error_type} · ${fieldResult.message}`;
  }
  return fieldResult.message || fieldResult.error_type || "待修正";
};

const goldAnswerText = computed(() => JSON.stringify(props.goldAnswer?.gold_answer_original ?? {}, null, 2));
</script>

<style scoped>
.feedback-panel,
.section-block,
.advice-grid {
  display: grid;
  gap: 16px;
}

.panel-header,
.action-row,
.error-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.panel-sub,
.section-title,
.advice-label {
  color: #6b7a94;
  font-size: 13px;
}

.empty-state,
.empty-tip {
  border: 1px dashed #c6d6eb;
  border-radius: 16px;
  padding: 24px;
  color: #6b7a94;
  background: #f8fbff;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.summary-card {
  padding: 14px;
  border-radius: 14px;
  border: 1px solid #e6ecf5;
  background: #fbfdff;
}

.summary-card span {
  display: block;
  color: #6b7a94;
  font-size: 12px;
  margin-bottom: 8px;
}

.summary-card strong {
  font-size: 18px;
}

.table-wrap {
  overflow-x: auto;
}

.result-table {
  width: 100%;
  border-collapse: collapse;
}

.result-table th,
.result-table td {
  padding: 10px 12px;
  border-bottom: 1px solid #edf2f7;
  text-align: left;
  vertical-align: top;
  font-size: 13px;
}

.result-table th {
  color: #58708e;
  font-weight: 600;
}

.error-list {
  display: grid;
  gap: 12px;
}

.error-card,
.advice-card {
  border: 1px solid #e6ecf5;
  border-radius: 16px;
  padding: 14px 16px;
  background: #fff;
}

.error-card p,
.advice-card ul,
.advice-card p,
.diagnosis-summary {
  margin: 8px 0 0;
  color: #42526b;
  line-height: 1.6;
}

.diagnosis-summary {
  margin: 0;
  padding: 14px 16px;
  border-radius: 14px;
  border: 1px solid #e6ecf5;
  background: #fbfdff;
}

.advice-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.diagnosis-meta {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.advice-card ul {
  padding-left: 18px;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.success-box {
  padding: 14px 16px;
  border-radius: 14px;
  background: rgba(46, 160, 67, 0.12);
  color: #1a7f37;
}

.gold-preview {
  margin: 0;
  padding: 16px;
  border-radius: 16px;
  background: #0f1727;
  color: #e4edff;
  font-family: "IBM Plex Mono", monospace;
  white-space: pre-wrap;
}

.action-row {
  justify-content: flex-start;
  flex-wrap: wrap;
}

@media (max-width: 960px) {
  .summary-grid,
  .diagnosis-meta,
  .advice-grid {
    grid-template-columns: 1fr;
  }
}
</style>
