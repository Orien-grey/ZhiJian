<template>
  <div class="page-shell">
    <aside class="side-panel">
      <h1>ZhiJian-AeroNLP</h1>
      <p>NOTAM 训练实验室</p>
      <nav class="nav-list">
        <router-link class="nav-item" to="/">总览</router-link>
        <router-link class="nav-item" to="/notam">NOTAM 中心</router-link>
        <router-link class="nav-item" to="/maps">地理情报</router-link>
        <router-link class="nav-item" to="/routes">航路规划</router-link>
        <router-link class="nav-item router-link-active" to="/training">训练实验室</router-link>
        <router-link class="nav-item" to="/api-keys">API 密钥库</router-link>
      </nav>
    </aside>

    <main class="main-panel fade-in">
      <header class="page-header">
        <div>
          <h2>训练实验室</h2>
          <p>按字段抽取 NOTAM 关键信息，获取规则批改、错因诊断、知识卡和下一题推荐。</p>
        </div>
        <router-link to="/" class="badge">返回总览</router-link>
      </header>

      <div class="lab-grid">
        <section class="left-column">
          <div class="card">
            <div class="card-header">
              <div>
                <h3>训练状态</h3>
                <p class="card-sub">Session Stats</p>
              </div>
              <n-tag type="info" size="small">{{ cases.length }} Cases</n-tag>
            </div>

            <div class="stats-grid">
              <div class="stat-item">
                <span class="label">已提交</span>
                <strong class="value">{{ totalAnswered }}</strong>
              </div>
              <div class="stat-item">
                <span class="label">平均分</span>
                <strong class="value">{{ averageScore }}</strong>
              </div>
              <div class="stat-item">
                <span class="label">当前案例</span>
                <strong class="value">{{ currentCase?.airport || "--" }}</strong>
              </div>
            </div>

            <div class="panel-section">
              <div class="section-head">
                <span>案例切换</span>
                <n-button text @click="loadProfile">刷新画像</n-button>
              </div>
              <n-select
                v-model:value="selectedCaseId"
                :options="caseOptions"
                placeholder="选择训练案例"
                @update:value="handleCaseChange"
              />
            </div>

            <div class="panel-section">
              <div class="section-head">
                <span>最近提交</span>
                <n-button text @click="resetSession">清空记录</n-button>
              </div>
              <div v-if="sessionHistory.length === 0" class="empty-tip">当前会话还没有提交记录。</div>
              <div v-else class="history-list">
                <button
                  v-for="item in sessionHistory"
                  :key="item.id"
                  class="history-item"
                  type="button"
                  @click="jumpToHistory(item.caseId)"
                >
                  <span class="history-title">{{ item.title }}</span>
                  <span class="history-meta">{{ item.score }} 分</span>
                </button>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <div>
                <h3>学习画像</h3>
                <p class="card-sub">Backend Profile</p>
              </div>
            </div>

            <div v-if="profileLoading" class="empty-tip">画像加载中...</div>
            <div v-else-if="profile">
              <div class="profile-summary">
                <div class="mini-stat">
                  <span>累计记录</span>
                  <strong>{{ profile.records_count ?? 0 }}</strong>
                </div>
                <div class="mini-stat">
                  <span>总错误数</span>
                  <strong>{{ profile.total_errors ?? 0 }}</strong>
                </div>
              </div>

              <div class="panel-section compact">
                <span class="section-label">薄弱能力</span>
                <div class="tag-list">
                  <n-tag v-for="ability in profile.weak_abilities || []" :key="ability" type="warning" size="small">
                    {{ ability }}
                  </n-tag>
                  <span v-if="!profile.weak_abilities?.length" class="empty-tip">暂无明显薄弱项</span>
                </div>
              </div>

              <div class="panel-section compact">
                <span class="section-label">能力错误分布</span>
                <div class="ability-list">
                  <div v-for="item in abilityEntries" :key="item.key" class="ability-row">
                    <span>{{ item.key }}</span>
                    <strong>{{ item.value }}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="right-column">
          <div class="card workspace-card" v-if="currentCase">
            <div class="card-header">
              <div>
                <h3>{{ currentCase.case_id }}</h3>
                <p class="card-sub">{{ currentCase.category }} / {{ currentCase.airport }}</p>
              </div>
              <div class="tag-list">
                <n-tag type="success" size="small">{{ currentCase.object_type }}</n-tag>
                <n-tag type="info" size="small">{{ currentCase.status }}</n-tag>
              </div>
            </div>

            <div class="notam-panel">
              <div class="section-head">
                <span>NOTAM 原文</span>
                <n-button text @click="fillDemoAnswer">填入参考答案</n-button>
              </div>
              <pre class="notam-text">{{ currentCase.raw_text }}</pre>
            </div>

            <div class="form-grid">
              <label class="field-card">
                <span class="field-label">airport</span>
                <n-input v-model:value="answerForm.airport" placeholder="例如 ZBAA" />
              </label>

              <label class="field-card">
                <span class="field-label">object_type</span>
                <n-select v-model:value="answerForm.object_type" :options="objectTypeOptions" placeholder="选择设施类型" />
              </label>

              <label class="field-card">
                <span class="field-label">object_id</span>
                <n-input v-model:value="answerForm.object_id" placeholder="例如 18L/36R 或 ZGR123" />
              </label>

              <label class="field-card">
                <span class="field-label">status</span>
                <n-select v-model:value="answerForm.status" :options="statusOptions" placeholder="选择状态" />
              </label>

              <label class="field-card">
                <span class="field-label">start_time</span>
                <n-input v-model:value="answerForm.start_time" placeholder="YYMMDDHHMM" />
              </label>

              <label class="field-card">
                <span class="field-label">end_time</span>
                <n-input v-model:value="answerForm.end_time" placeholder="YYMMDDHHMM 或 PERM" />
              </label>

              <label class="field-card field-card-wide">
                <span class="field-label">operational_impact</span>
                <n-input
                  v-model:value="answerForm.operational_impact"
                  type="textarea"
                  :autosize="{ minRows: 3, maxRows: 5 }"
                  placeholder="用一句话说明对运行的影响"
                />
              </label>

              <label class="field-card field-card-wide">
                <span class="field-label">evidence</span>
                <n-input
                  v-model:value="evidenceText"
                  type="textarea"
                  :autosize="{ minRows: 4, maxRows: 6 }"
                  placeholder="每行填写一条证据短语，例如：&#10;A) ZBAA&#10;RWY 18L/36R CLSD"
                />
              </label>
            </div>

            <div class="actions">
              <n-button type="primary" size="large" :loading="submitting" @click="submitAnswer">
                提交批改
              </n-button>
              <n-button size="large" @click="resetForm">清空字段</n-button>
              <n-button size="large" quaternary @click="goNextCase">下一案例</n-button>
            </div>
          </div>

          <div class="card" v-if="submissionResult">
            <div class="card-header">
              <div>
                <h3>批改结果</h3>
                <p class="card-sub">Scoring / Diagnosis / Recommendation</p>
              </div>
              <div class="score-pill">{{ submissionResult.grading.total_score }} 分</div>
            </div>

            <div class="result-grid">
              <div class="result-block">
                <span class="section-label">字段得分</span>
                <div class="ability-list">
                  <div v-for="item in fieldScoreEntries" :key="item.key" class="ability-row">
                    <span>{{ item.key }}</span>
                    <strong>{{ item.value }}</strong>
                  </div>
                </div>
              </div>

              <div class="result-block">
                <span class="section-label">错因诊断</span>
                <p class="result-text">{{ submissionResult.diagnosis.summary }}</p>
                <div class="tag-list">
                  <n-tag v-for="ability in submissionResult.diagnosis.weak_abilities || []" :key="ability" type="warning" size="small">
                    {{ ability }}
                  </n-tag>
                </div>
              </div>
            </div>

            <div class="panel-section">
              <span class="section-label">错误列表</span>
              <div v-if="!submissionResult.grading.errors.length" class="success-box">本题没有识别到字段错误。</div>
              <div v-else class="error-list">
                <div v-for="(error, index) in submissionResult.grading.errors" :key="`${error.field}-${index}`" class="error-item">
                  <div class="error-top">
                    <strong>{{ error.error_type }}</strong>
                    <span>{{ error.field }}</span>
                  </div>
                  <p>{{ error.message }}</p>
                </div>
              </div>
            </div>

            <div class="panel-section">
              <span class="section-label">知识卡</span>
              <div v-if="!submissionResult.knowledge_cards.length" class="empty-tip">本次没有触发知识卡。</div>
              <div v-else class="knowledge-list">
                <div v-for="card in submissionResult.knowledge_cards" :key="card.card_id" class="knowledge-card">
                  <div class="knowledge-title">{{ card.title }}</div>
                  <p>{{ card.content }}</p>
                </div>
              </div>
            </div>

            <div class="panel-section" v-if="submissionResult.next_case?.case_id">
              <span class="section-label">下一题推荐</span>
              <div class="recommend-box">
                <div>
                  <strong>{{ submissionResult.next_case.case_id }}</strong>
                  <p>{{ submissionResult.next_case.category }} / {{ submissionResult.next_case.airport }}</p>
                </div>
                <n-button @click="openRecommendedCase">切换到该题</n-button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { NButton, NInput, NSelect, NTag, useMessage } from "naive-ui";
import { trainingAPI, type TrainingCase } from "@/services/training";

interface HistoryItem {
  id: string;
  caseId: string;
  title: string;
  score: number;
}

interface TrainingResult {
  grading: {
    total_score: number;
    field_scores: Record<string, number>;
    errors: Array<{ error_type: string; field: string; message: string }>;
  };
  diagnosis: {
    summary: string;
    weak_abilities: string[];
  };
  knowledge_cards: Array<{ card_id: string; title: string; content: string }>;
  next_case: Partial<TrainingCase>;
  profile: Record<string, any>;
}

const message = useMessage();

const cases = ref<TrainingCase[]>([]);
const selectedCaseId = ref<string | null>(null);
const currentCase = ref<TrainingCase | null>(null);
const profile = ref<Record<string, any> | null>(null);
const submissionResult = ref<TrainingResult | null>(null);
const sessionHistory = ref<HistoryItem[]>([]);
const loadingCase = ref(false);
const profileLoading = ref(false);
const submitting = ref(false);
const evidenceText = ref("");

const answerForm = reactive({
  airport: "",
  object_type: null as string | null,
  object_id: "",
  start_time: "",
  end_time: "",
  status: null as string | null,
  operational_impact: "",
});

const objectTypeOptions = [
  { label: "RWY", value: "RWY" },
  { label: "TWY", value: "TWY" },
  { label: "ILS", value: "ILS" },
  { label: "PAPI", value: "PAPI" },
  { label: "RESTRICTED_AREA", value: "RESTRICTED_AREA" },
  { label: "APRON", value: "APRON" },
];

const statusOptions = [
  { label: "CLSD", value: "CLSD" },
  { label: "U/S", value: "U/S" },
  { label: "ACT", value: "ACT" },
  { label: "WIP", value: "WIP" },
  { label: "CLOSED", value: "CLOSED" },
  { label: "UNSERVICEABLE", value: "UNSERVICEABLE" },
];

const caseOptions = computed(() =>
  cases.value.map((item) => ({
    label: `${item.airport} / ${item.object_type} / ${item.case_id}`,
    value: item.case_id,
  })),
);

const totalAnswered = computed(() => sessionHistory.value.length);
const averageScore = computed(() => {
  if (!sessionHistory.value.length) return 0;
  const total = sessionHistory.value.reduce((sum, item) => sum + item.score, 0);
  return Math.round(total / sessionHistory.value.length);
});

const abilityEntries = computed(() =>
  Object.entries(profile.value?.ability_error_counts || {}).map(([key, value]) => ({ key, value })),
);

const fieldScoreEntries = computed(() =>
  Object.entries(submissionResult.value?.grading.field_scores || {}).map(([key, value]) => ({ key, value })),
);

const historyStorageKey = "training_lab_field_history";

function loadHistory() {
  const saved = localStorage.getItem(historyStorageKey);
  if (saved) {
    sessionHistory.value = JSON.parse(saved);
  }
}

function saveHistory() {
  localStorage.setItem(historyStorageKey, JSON.stringify(sessionHistory.value));
}

function resetForm() {
  answerForm.airport = "";
  answerForm.object_type = null;
  answerForm.object_id = "";
  answerForm.start_time = "";
  answerForm.end_time = "";
  answerForm.status = null;
  answerForm.operational_impact = "";
  evidenceText.value = "";
}

function fillDemoAnswer() {
  if (!currentCase.value) return;
  answerForm.airport = currentCase.value.airport;
  answerForm.object_type = currentCase.value.object_type;
  answerForm.object_id = currentCase.value.object_id;
  answerForm.start_time = currentCase.value.start_time;
  answerForm.end_time = currentCase.value.end_time;
  answerForm.status = currentCase.value.status;
  answerForm.operational_impact = currentCase.value.operational_impact;
  evidenceText.value = currentCase.value.evidence.join("\n");
}

async function loadCase(caseId: string) {
  loadingCase.value = true;
  try {
    const response = await trainingAPI.getCase(caseId);
    currentCase.value = response.data.data;
    selectedCaseId.value = caseId;
    submissionResult.value = null;
    resetForm();
  } catch (error) {
    console.error("training case load failed", error);
    message.error("加载训练案例失败");
  } finally {
    loadingCase.value = false;
  }
}

async function loadCases() {
  try {
    const response = await trainingAPI.listCases();
    cases.value = response.data.data || [];
    if (cases.value.length && !selectedCaseId.value) {
      await loadCase(cases.value[0].case_id);
    }
  } catch (error) {
    console.error("training cases load failed", error);
    message.error("加载案例列表失败");
  }
}

async function loadProfile() {
  profileLoading.value = true;
  try {
    const response = await trainingAPI.getProfile();
    profile.value = response.data.data;
  } catch (error) {
    console.error("training profile load failed", error);
  } finally {
    profileLoading.value = false;
  }
}

async function handleCaseChange(value: string) {
  await loadCase(value);
}

async function submitAnswer() {
  if (!currentCase.value) return;

  submitting.value = true;
  try {
    const response = await trainingAPI.submit({
      case_id: currentCase.value.case_id,
      student_answer: {
        airport: answerForm.airport,
        object_type: answerForm.object_type,
        object_id: answerForm.object_id,
        start_time: answerForm.start_time,
        end_time: answerForm.end_time,
        status: answerForm.status,
        operational_impact: answerForm.operational_impact,
        evidence: evidenceText.value
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),
      },
    });

    submissionResult.value = response.data.data;
    profile.value = response.data.data.profile;
    sessionHistory.value.unshift({
      id: `${currentCase.value.case_id}-${Date.now()}`,
      caseId: currentCase.value.case_id,
      title: `${currentCase.value.airport} / ${currentCase.value.object_type}`,
      score: response.data.data.grading.total_score,
    });
    sessionHistory.value = sessionHistory.value.slice(0, 10);
    saveHistory();

    console.log("training grading", response.data.data.grading);
    console.log("training knowledge cards", response.data.data.knowledge_cards);
    message.success(`提交完成，得分 ${response.data.data.grading.total_score}`);
  } catch (error) {
    console.error("training submit failed", error);
    message.error("提交失败");
  } finally {
    submitting.value = false;
  }
}

async function goNextCase() {
  if (!cases.value.length) return;
  if (submissionResult.value?.next_case?.case_id) {
    await loadCase(submissionResult.value.next_case.case_id);
    return;
  }

  const currentIndex = cases.value.findIndex((item) => item.case_id === selectedCaseId.value);
  const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % cases.value.length : 0;
  await loadCase(cases.value[nextIndex].case_id);
}

async function openRecommendedCase() {
  const caseId = submissionResult.value?.next_case?.case_id;
  if (caseId) {
    await loadCase(caseId);
  }
}

async function jumpToHistory(caseId: string) {
  await loadCase(caseId);
}

function resetSession() {
  sessionHistory.value = [];
  saveHistory();
}

onMounted(async () => {
  loadHistory();
  await Promise.all([loadCases(), loadProfile()]);
});
</script>

<style scoped>
.nav-list {
  display: grid;
  gap: 10px;
  margin-top: 24px;
}

.nav-item {
  padding: 10px 14px;
  border-radius: 10px;
  color: rgba(223, 231, 255, 0.85);
  font-weight: 500;
  transition: background 0.2s ease;
}

.nav-item.router-link-active {
  background: rgba(26, 116, 255, 0.2);
  color: #ffffff;
}

.nav-item:not(.router-link-active):hover {
  background: rgba(255, 255, 255, 0.05);
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.lab-grid {
  display: grid;
  grid-template-columns: 320px minmax(0, 1fr);
  gap: 24px;
  align-items: start;
}

.left-column,
.right-column {
  display: grid;
  gap: 24px;
}

.workspace-card {
  min-height: 640px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;
}

.card-sub {
  color: #6b7a94;
  font-size: 13px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.stat-item,
.mini-stat {
  padding: 12px;
  border-radius: 12px;
  background: linear-gradient(180deg, #f7fbff 0%, #eef5ff 100%);
  border: 1px solid #dce9ff;
}

.stat-item .label,
.mini-stat span,
.section-label {
  display: block;
  font-size: 12px;
  color: #6b7a94;
  margin-bottom: 6px;
}

.stat-item .value,
.mini-stat strong {
  font-size: 18px;
  color: #0a1220;
}

.panel-section {
  margin-top: 18px;
}

.panel-section.compact {
  margin-top: 14px;
}

.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
  font-size: 13px;
  color: #42526b;
}

.empty-tip {
  color: #7b8798;
  font-size: 13px;
}

.history-list {
  display: grid;
  gap: 8px;
}

.history-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  border: 1px solid #e6ecf5;
  border-radius: 12px;
  background: #f8fbff;
  padding: 10px 12px;
  text-align: left;
  cursor: pointer;
}

.history-title {
  color: #0a1220;
  font-size: 13px;
}

.history-meta {
  color: #1a74ff;
  font-size: 12px;
  font-weight: 600;
}

.profile-summary {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.ability-list {
  display: grid;
  gap: 8px;
}

.ability-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-size: 13px;
  padding: 8px 0;
  border-bottom: 1px solid #edf2f7;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.notam-panel {
  background: linear-gradient(180deg, #0f1727 0%, #17253d 100%);
  border-radius: 18px;
  padding: 18px;
  color: #e4edff;
  margin-bottom: 20px;
}

.notam-panel .section-head {
  color: #b9caee;
  margin-bottom: 14px;
}

.notam-text {
  margin: 0;
  white-space: pre-wrap;
  font-family: "IBM Plex Mono", monospace;
  font-size: 14px;
  line-height: 1.7;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.field-card {
  display: grid;
  gap: 8px;
  padding: 14px;
  border: 1px solid #e6ecf5;
  border-radius: 16px;
  background: #fbfdff;
}

.field-card-wide {
  grid-column: 1 / -1;
}

.field-label {
  font-size: 12px;
  color: #58708e;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 20px;
}

.score-pill {
  padding: 10px 14px;
  border-radius: 999px;
  background: linear-gradient(135deg, #1a74ff 0%, #42b5ff 100%);
  color: #fff;
  font-weight: 700;
}

.result-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.result-block {
  padding: 16px;
  border-radius: 16px;
  background: #f7fbff;
  border: 1px solid #e1ecfb;
}

.result-text {
  margin: 0 0 10px;
  color: #334155;
  line-height: 1.6;
}

.success-box {
  padding: 14px 16px;
  border-radius: 14px;
  background: rgba(46, 160, 67, 0.12);
  color: #1a7f37;
}

.error-list,
.knowledge-list {
  display: grid;
  gap: 12px;
}

.error-item,
.knowledge-card,
.recommend-box {
  padding: 14px 16px;
  border-radius: 16px;
  border: 1px solid #e6ecf5;
  background: #ffffff;
}

.error-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 6px;
  color: #0a1220;
}

.error-item p,
.knowledge-card p,
.recommend-box p {
  margin: 0;
  color: #4a5568;
  line-height: 1.6;
}

.knowledge-title {
  margin-bottom: 6px;
  font-weight: 700;
  color: #0a1220;
}

.recommend-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

@media (max-width: 1100px) {
  .lab-grid {
    grid-template-columns: 1fr;
  }

  .result-grid,
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
