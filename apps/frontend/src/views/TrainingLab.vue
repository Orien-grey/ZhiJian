<template>
  <div class="page-shell">
    <aside class="side-panel">
      <h1>ZhiJian-AeroNLP</h1>
      <p>航行情报作战舱</p>
      <nav class="nav-list">
        <router-link class="nav-item" to="/">总览</router-link>
        <router-link class="nav-item" to="/notam">NOTAM 中心</router-link>
        <router-link class="nav-item" to="/maps">地理情报</router-link>
        <router-link class="nav-item" to="/routes">航路规划</router-link>
        <router-link class="nav-item router-link-active" to="/training">训练实验室</router-link>
        <router-link class="nav-item" to="/api-keys">API 密钥库</router-link>
      </nav>
      <div class="side-footer">
        <n-button tertiary block @click="handleLogout">退出登录</n-button>
      </div>
      <div class="brand">
        <img class="brand-logo" :src="logoUrl" alt="ZhiJian-AeroNLP logo" />
      </div>
    </aside>

    <main class="main-panel fade-in">
      <header class="page-header">
        <div>
          <h2>智见航语 · NOTAM 智能训练室</h2>
          <p>基于 NOTAM 深层解析的结构化训练与反馈</p>
        </div>
      </header>

      <div class="mode-switch">
        <n-button :type="activeTab === 'practice' ? 'primary' : 'default'" @click="activeTab = 'practice'">
          刷题页
        </n-button>
        <n-button :type="activeTab === 'mistakes' ? 'primary' : 'default'" @click="activeTab = 'mistakes'">
          错题集页
        </n-button>
        <n-button :type="activeTab === 'profile' ? 'primary' : 'default'" @click="activeTab = 'profile'">
          个人主页
        </n-button>
      </div>

      <section v-if="activeTab === 'practice'" class="practice-layout">
        <div class="practice-main">
          <div class="card selector-card">
            <div class="card-header">
              <div>
                <h3>题目选择</h3>
                <p class="card-sub">按题型从未答题池随机获取 NOTAM 训练题</p>
              </div>
              <n-tag size="small" type="info">当前题型剩余 {{ remainingCount }} 道</n-tag>
            </div>

            <div class="selector-row">
              <n-select
                :value="selectedCategory"
                :options="categoryOptions"
                placeholder="选择题目类型"
                :loading="casesLoading"
                @update:value="handleCategoryChange"
              />
              <n-button :loading="casesLoading" @click="loadNextCase">随机下一题</n-button>
            </div>
          </div>

          <QuestionPracticePanel
            v-if="currentCase && currentGoldAnswer"
            :key="practicePanelKey"
            :case-item="currentCase"
            :gold-answer="currentGoldAnswer"
            :submitting="submitting"
            @submit="handleSubmit"
            @next-case="goNextCase"
          />

          <div v-else class="card empty-card">
            {{ emptyPracticeMessage }}
          </div>

          <AnswerFeedbackPanel
            mode="practice"
            :result="gradingResult"
            :case-item="currentCase"
            :show-actions="Boolean(gradingResult)"
            :gold-answer="currentGoldAnswer"
            :show-gold-answer="showPracticeGoldAnswer"
            @next="goNextCase"
            @retry="retryPractice"
            @reveal-gold="showPracticeGoldAnswer = !showPracticeGoldAnswer"
          />
        </div>

        <div class="practice-side">
          <TrainingProgressPanel :progress="progress" />
        </div>
      </section>

      <section v-else-if="activeTab === 'mistakes'" class="mistake-layout">
        <MistakeBookPanel
          :records="mistakes"
          :selected-record-id="selectedMistake?.record_id"
          @select="handleSelectMistake"
        />

        <div class="mistake-side">
          <AnswerFeedbackPanel
            mode="mistake"
            :result="selectedMistake?.grading_result || null"
            :case-item="selectedMistake?.case || mistakeCaseDetail || null"
            :gold-answer="selectedMistakeGoldAnswer"
            :show-gold-answer="showMistakeGoldAnswer"
            :show-actions="Boolean(selectedMistake)"
            @reveal-gold="showMistakeGoldAnswer = !showMistakeGoldAnswer"
          />
        </div>
      </section>

      <section v-else class="profile-layout">
        <div class="profile-main">
          <AbilityProfilePanel :profile="profile" :recommended-cases="recommendedCases" />
        </div>

        <div class="profile-side">
          <TrainingProgressPanel :progress="progress" />
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { NButton, NSelect, NTag, useMessage } from "naive-ui";
import logoUrl from "@/assets/logo.png";
import AnswerFeedbackPanel from "@/components/training/AnswerFeedbackPanel.vue";
import AbilityProfilePanel from "@/components/training/AbilityProfilePanel.vue";
import MistakeBookPanel from "@/components/training/MistakeBookPanel.vue";
import QuestionPracticePanel from "@/components/training/QuestionPracticePanel.vue";
import TrainingProgressPanel from "@/components/training/TrainingProgressPanel.vue";
import {
  trainingAPI,
  type AbilityProfile,
  type AnswerUnit,
  type GoldAnswer,
  type GradingResult,
  type MistakeRecord,
  type TrainingCase,
  type TrainingCategory,
  type TrainingProgress,
} from "@/services/training";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const auth = useAuthStore();
const message = useMessage();

const activeTab = ref<"practice" | "mistakes" | "profile">("practice");
const categories = ref<TrainingCategory[]>([]);
const selectedCategory = ref<string>("all");
const remainingCount = ref(0);
const currentCase = ref<TrainingCase | null>(null);
const currentGoldAnswer = ref<GoldAnswer | null>(null);
const progress = ref<TrainingProgress | null>(null);
const profile = ref<AbilityProfile | null>(null);
const mistakes = ref<MistakeRecord[]>([]);
const gradingResult = ref<GradingResult | null>(null);
const recommendedCases = ref<TrainingCase[]>([]);
const selectedCaseId = ref<string | null>(null);
const selectedMistake = ref<MistakeRecord | null>(null);
const selectedMistakeGoldAnswer = ref<GoldAnswer | null>(null);
const mistakeCaseDetail = ref<TrainingCase | null>(null);
const showPracticeGoldAnswer = ref(false);
const showMistakeGoldAnswer = ref(false);
const submitting = ref(false);
const casesLoading = ref(false);
const practiceResetSeed = ref(0);

const categoryOptions = computed(() => [
  { label: "全部题型", value: "all" },
  ...categories.value.map((item) => ({
    label: `${item.category}（剩余 ${item.remaining_count} / 共 ${item.total_count}）`,
    value: item.category,
  })),
]);

const practicePanelKey = computed(
  () => `${selectedCaseId.value || "empty"}-${practiceResetSeed.value}`,
);

const emptyPracticeMessage = computed(() => {
  if (casesLoading.value) {
    return "题库加载中...";
  }
  return selectedCategory.value === "all"
    ? "当前题库已经没有未完成题目。"
    : `当前题型 ${selectedCategory.value} 已经没有未完成题目。`;
});

const handleLogout = async () => {
  await auth.logout();
  router.push({ name: "login" });
};

const resetPracticeCase = () => {
  currentCase.value = null;
  currentGoldAnswer.value = null;
  selectedCaseId.value = null;
  gradingResult.value = null;
  showPracticeGoldAnswer.value = false;
  practiceResetSeed.value += 1;
};

const loadCategories = async () => {
  const response = await trainingAPI.listCategories();
  categories.value = response.data.data.categories || [];
};

const loadNextCase = async () => {
  casesLoading.value = true;
  try {
    const response = await trainingAPI.getNextCase({
      category: selectedCategory.value,
      current_case_id: selectedCaseId.value || undefined,
    });
    const payload = response.data.data;
    remainingCount.value = payload.remaining_count ?? 0;
    if (!payload.case || !payload.gold_answer) {
      resetPracticeCase();
      return;
    }
    currentCase.value = payload.case;
    currentGoldAnswer.value = payload.gold_answer;
    selectedCaseId.value = payload.case.case_id;
    gradingResult.value = null;
    showPracticeGoldAnswer.value = false;
    practiceResetSeed.value += 1;
  } catch (error) {
    console.error("training next case load failed", error);
    message.error("加载下一题失败");
    resetPracticeCase();
  } finally {
    casesLoading.value = false;
  }
};

const loadProgress = async () => {
  const response = await trainingAPI.getProgress();
  progress.value = response.data.data;
};

const loadMistakes = async () => {
  const response = await trainingAPI.listMistakes();
  mistakes.value = response.data.data.records || [];
  if (!mistakes.value.length) {
    selectedMistake.value = null;
    selectedMistakeGoldAnswer.value = null;
    mistakeCaseDetail.value = null;
    return;
  }
  if (!selectedMistake.value) {
    await handleSelectMistake(mistakes.value[0]);
    return;
  }
  const updated = mistakes.value.find((record) => record.case_id === selectedMistake.value?.case_id);
  if (!updated) {
    selectedMistake.value = null;
    selectedMistakeGoldAnswer.value = null;
    mistakeCaseDetail.value = null;
    return;
  }
  selectedMistake.value = updated;
};

const loadProfile = async () => {
  const response = await trainingAPI.getProfile();
  profile.value = response.data.data;
  recommendedCases.value = response.data.data.recommended_cases || [];
};

const handleCategoryChange = async (category: string) => {
  selectedCategory.value = category || "all";
  resetPracticeCase();
  await loadNextCase();
};

const handleSubmit = async (studentAnswerUnits: AnswerUnit[]) => {
  if (!currentCase.value) {
    return;
  }

  submitting.value = true;
  try {
    const response = await trainingAPI.submit({
      case_id: currentCase.value.case_id,
      student_answer_units: studentAnswerUnits,
    });
    gradingResult.value = response.data.data.grading_result;
    progress.value = response.data.data.progress;
    profile.value = response.data.data.profile;
    recommendedCases.value = response.data.data.recommended_cases || [];
    showPracticeGoldAnswer.value = false;
    await Promise.all([loadMistakes(), loadCategories()]);
    const currentCategory = categories.value.find((item) => item.category === selectedCategory.value);
    if (selectedCategory.value === "all") {
      remainingCount.value = Math.max(0, (progress.value?.total_cases ?? 0) - (progress.value?.answered_count ?? 0));
    } else {
      remainingCount.value = currentCategory?.remaining_count ?? 0;
    }
    message.success(`提交完成，得分 ${response.data.data.grading_result.total_score} 分`);
  } catch (error) {
    console.error("training submit failed", error);
    message.error("提交失败");
  } finally {
    submitting.value = false;
  }
};

const goNextCase = async () => {
  await loadNextCase();
};

const retryPractice = () => {
  gradingResult.value = null;
  showPracticeGoldAnswer.value = false;
  practiceResetSeed.value += 1;
};

const handleSelectMistake = async (record: MistakeRecord) => {
  selectedMistake.value = record;
  showMistakeGoldAnswer.value = false;
  try {
    const response = await trainingAPI.getCase(record.case_id);
    mistakeCaseDetail.value = response.data.data.case;
    selectedMistakeGoldAnswer.value = response.data.data.gold_answer;
  } catch (error) {
    console.error("mistake detail load failed", error);
    selectedMistakeGoldAnswer.value = null;
  }
};

onMounted(async () => {
  try {
    await Promise.all([loadProgress(), loadMistakes(), loadProfile(), loadCategories()]);
    await loadNextCase();
  } catch (error) {
    console.error("training lab bootstrap failed", error);
    message.error("训练室初始化失败");
  }
});
</script>

<style scoped>
.brand {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.brand-logo {
  width: 330px;
  height: 330px;
  object-fit: contain;
  border-radius: 20px;
  margin-left: -20px;
}

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

.side-footer {
  margin-top: 32px;
  border-radius: 8px;
  background: rgb(188, 194, 216);
}

.page-header {
  margin-bottom: 24px;
}

.page-header p,
.card-sub {
  color: #6b7a94;
  font-size: 13px;
}

.mode-switch {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.practice-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 24px;
  align-items: start;
}

.mistake-layout,
.profile-layout {
  display: grid;
  grid-template-columns: 360px minmax(0, 1fr);
  gap: 24px;
  align-items: start;
}

.practice-main,
.practice-side,
.mistake-side,
.profile-main,
.profile-side {
  display: grid;
  gap: 24px;
}

.selector-card,
.empty-card {
  display: grid;
  gap: 16px;
}

.selector-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 12px;
  align-items: center;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.empty-card {
  color: #6b7a94;
}

@media (max-width: 1100px) {
  .practice-layout,
  .mistake-layout,
  .profile-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 760px) {
  .brand-logo {
    width: 220px;
    height: 220px;
    margin-left: 0;
  }

  .selector-row {
    grid-template-columns: 1fr;
  }
}
</style>
