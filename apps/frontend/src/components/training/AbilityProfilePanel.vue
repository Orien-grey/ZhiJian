<template>
  <div class="card profile-panel">
    <div class="panel-header">
      <div>
        <h3>能力画像</h3>
        <p class="panel-sub">围绕 8 个固定能力维度给出掌握情况和推荐题目</p>
      </div>
    </div>

    <div v-if="profile" class="ability-list">
      <div v-for="item in profile.abilities" :key="item.ability" class="ability-card">
        <div class="ability-top">
          <strong>{{ item.ability }}</strong>
          <span>{{ item.level }}</span>
        </div>
        <n-progress type="line" :percentage="Math.round(item.mastery * 100)" :show-indicator="false" />
        <div class="ability-bottom">
          <span>掌握度 {{ Math.round(item.mastery * 100) }}%</span>
          <span>错误 {{ item.error_count }}</span>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">暂无能力画像数据。</div>

    <section class="recommend-section">
      <div class="section-title">推荐题目</div>
      <div v-if="recommendedCases.length" class="recommend-list">
        <article v-for="caseItem in recommendedCases" :key="caseItem.case_id" class="recommend-card">
          <div class="recommend-top">
            <strong>{{ caseItem.category }}</strong>
            <span>{{ caseItem.source }}</span>
          </div>
          <p>{{ caseItem.raw_text }}</p>
          <small>{{ caseItem.recommend_reason || "系统根据当前画像自动推荐" }}</small>
        </article>
      </div>
      <div v-else class="empty-state">
        暂无推荐题目。完成更多训练后，系统会根据薄弱能力推荐下一题。
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { NProgress } from "naive-ui";
import type { AbilityProfile, TrainingCase } from "@/services/training";

const props = defineProps<{
  profile: AbilityProfile | null;
  recommendedCases?: TrainingCase[];
}>();

const recommendedCases = computed(() => props.recommendedCases ?? props.profile?.recommended_cases ?? []);
</script>

<style scoped>
.profile-panel,
.ability-list,
.recommend-section,
.recommend-list {
  display: grid;
  gap: 16px;
}

.panel-header,
.ability-top,
.ability-bottom,
.recommend-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.panel-sub,
.section-title,
.ability-bottom,
.recommend-card small {
  color: #6b7a94;
  font-size: 13px;
}

.ability-card,
.recommend-card {
  border: 1px solid #e6ecf5;
  border-radius: 16px;
  background: #fff;
  padding: 14px 16px;
}

.recommend-card p {
  margin: 10px 0 8px;
  color: #42526b;
  line-height: 1.6;
}

.empty-state {
  border: 1px dashed #c6d6eb;
  border-radius: 16px;
  padding: 18px;
  color: #6b7a94;
  background: #f8fbff;
}
</style>
