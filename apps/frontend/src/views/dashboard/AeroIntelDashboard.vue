<template>
  <div class="dashboard-root" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
    <!-- 侧边栏容器 -->
    <aside class="side-panel" v-show="!sidebarCollapsed">
      <h1>ZhiJian-AeroNLP</h1>
      <p>航行情报作战舱</p>
      <nav class="nav-list">
        <router-link class="nav-item" to="/">总览</router-link>
        <router-link class="nav-item router-link-active" to="/dashboard">情报看板</router-link>
        <router-link class="nav-item" to="/notam">NOTAM 中心</router-link>
        <router-link class="nav-item" to="/maps">地理情报</router-link>
        <router-link class="nav-item" to="/routes">航路规划</router-link>
        <router-link class="nav-item" to="/training">训练实验室</router-link>
        <router-link class="nav-item" to="/api-keys">API 密钥库</router-link>
      </nav>
      <div class="side-footer">
        <n-button tertiary block @click="handleLogout">退出登录</n-button>
      </div>
    </aside>

    <!-- 折叠态图标栏 -->
    <aside v-show="sidebarCollapsed" class="side-collapsed-bar">
      <button class="side-expand-btn" @click="sidebarCollapsed = false" title="展开导航">
        <span class="side-expand-icon">▸</span>
      </button>
      <div class="side-mini-icons">
        <router-link to="/" class="mini-icon" title="总览">◆</router-link>
        <router-link to="/dashboard" class="mini-icon active" title="情报看板">◈</router-link>
        <router-link to="/notam" class="mini-icon" title="NOTAM 中心">◉</router-link>
        <router-link to="/maps" class="mini-icon" title="地理情报">◎</router-link>
        <router-link to="/routes" class="mini-icon" title="航路规划">⬡</router-link>
        <router-link to="/training" class="mini-icon" title="训练实验室">◫</router-link>
        <router-link to="/api-keys" class="mini-icon" title="API 密钥库">◈</router-link>
      </div>
    </aside>

    <!-- 主内容区 -->
    <main class="main-panel">
      <!-- 收起侧边栏按钮 -->
      <button v-if="!sidebarCollapsed" class="sidebar-toggle-btn" @click="sidebarCollapsed = true" title="收起侧边栏">
        <span class="sidebar-toggle-icon">◁</span>
      </button>

      <!-- ====== 三栏运控中心布局 ====== -->
      <div class="command-shell">
        <!-- 顶部状态栏 -->
        <TopStatusBar :active-time="activeTime" @update:active-time="activeTime = $event" />

        <!-- 三栏内容区 -->
        <div class="command-body">
          <!-- 左侧面板（absolute 定位，展开时丝滑拉宽覆盖地图） -->
          <div
            class="panel-left"
            :class="{
              collapsed: !leftExpanded,
              wide: expandOverlay,
            }"
          >
            <AirportRestrictions v-if="leftExpanded" :expanded="expandOverlay" @toggle-expand="expandOverlay = !expandOverlay" @filter-change="onFilterChange" @bar-click="onBarClick" />
            <div v-else class="left-icon-only">
              <button class="icon-only-btn" @click="leftExpanded = true" title="展开面板">◫</button>
            </div>
            <button
              class="panel-collapse-btn"
              :class="{ 'collapsed': !leftExpanded }"
              @click="leftExpanded = !leftExpanded"
              :title="leftExpanded ? '收起面板' : '展开面板'"
            >
              <span>{{ leftExpanded ? '◁' : '▷' }}</span>
            </button>
          </div>

          <!-- 中间：核心地图（paddingLeft 给左面板留位，面板拉宽不影响地图） -->
          <div class="panel-center">
            <MapCore :filters="mapFilters" :active-time="activeTime" :key="filterKey" @airport-click="onBarClick" />
          </div>

          <!-- 机场详情覆盖层（渲染在 command-body 级别，z-index 高于左右面板） -->
          <AirportDetailPanel v-if="detailIcao" :icao="detailIcao" @close="detailIcao = null" />

          <!-- 航班分析覆盖层 -->
          <FlightAnalysisPanel v-if="analysisFlightNo" :flight-no="analysisFlightNo" @close="analysisFlightNo = null" />

          <!-- 右侧：航班动态 -->
          <div class="panel-right">
            <FlightDynamics @flight-click="(no:string) => { expandOverlay = false; analysisFlightNo = no }" />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { NButton } from 'naive-ui'
import { useAuthStore } from '@/stores/auth'
import TopStatusBar from '@/components/dashboard/TopStatusBar.vue'
import AirportRestrictions from '@/components/dashboard/AirportRestrictions.vue'
import MapCore from '@/components/dashboard/MapCore.vue'
import FlightDynamics from '@/components/dashboard/FlightDynamics.vue'
import AirportDetailPanel from '@/components/dashboard/AirportDetailPanel.vue'
import FlightAnalysisPanel from '@/components/dashboard/FlightAnalysisPanel.vue'

const router = useRouter()
const auth = useAuthStore()

const activeTime = ref<'today' | 'tomorrow' | 'both'>('today')
const leftExpanded = ref(true)
const expandOverlay = ref(false)
const sidebarCollapsed = ref(true)

const onBarClick = (icao: string) => {
  expandOverlay.value = false  // 收起展开抽屉
  detailIcao.value = icao      // 打开机场详情
}

// 地图内容过滤（共享状态 — 用 ref 包装整个对象确保引用变化）
const filterKey = ref(0)
const mapFilters = ref({
  prohibited: true, restricted: true, waypoints: true, routes: true, airports: true, allAirports: false,
})
const detailIcao = ref<string | null>(null)
const analysisFlightNo = ref<string | null>(null)

const onFilterChange = (key: string, val: boolean) => {
  const map: Record<string, string> = {
    '禁航通告': 'prohibited', '限制区': 'restricted', '航路点 / 导航台': 'waypoints', '航路': 'routes', '运行机场': 'airports',
  }
  const k = map[key]
  if (k) {
    // 替换整个对象确保引用变化，触发 MapCore 重渲染
    mapFilters.value = { ...mapFilters.value, [k]: val }
    filterKey.value++
  }
}

const handleLogout = async () => {
  await auth.logout()
  router.push({ name: 'login' })
}
</script>

<style scoped>
/* ============================================================ */
/* 根容器 —— 替代 page-shell，支持侧边栏动画 */
/* ============================================================ */
.dashboard-root {
  display: grid;
  min-height: 100vh;
  grid-template-columns: 280px 1fr;
  transition: grid-template-columns 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.dashboard-root.sidebar-collapsed {
  grid-template-columns: 48px 1fr;
}

/* ============================================================ */
/* 侧边栏（展开态） —— 复用原有样式 */
/* ============================================================ */
.side-panel {
  background: linear-gradient(160deg, #0b1020 0%, #111b33 50%, #0b1430 100%);
  color: #dfe7ff;
  padding: 32px 24px;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
}

.side-panel h1 {
  font-size: 22px;
  margin: 0 0 10px;
}

.side-panel p {
  font-size: 14px;
  color: rgba(223, 231, 255, 0.72);
  line-height: 1.6;
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
  text-decoration: none;
  transition: background 0.2s ease;
}

.nav-item:hover {
  background: rgba(26, 116, 255, 0.12);
}

.nav-item.router-link-active {
  background: rgba(26, 116, 255, 0.22);
  color: #ffffff;
  box-shadow: inset 0 0 0 1px rgba(26, 116, 255, 0.25);
}

.side-footer {
  margin-top: 32px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.04);
}

/* ============================================================ */
/* 侧边栏（折叠态） */
/* ============================================================ */
.side-collapsed-bar {
  background: linear-gradient(160deg, #0b1020 0%, #111b33 50%, #0b1430 100%);
  color: #dfe7ff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 0;
  height: 100vh;
  position: sticky;
  top: 0;
  gap: 16px;
  overflow: hidden;
}

.side-expand-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid rgba(0, 212, 255, 0.15);
  background: rgba(0, 212, 255, 0.06);
  color: #00d4ff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: all 0.2s;
}

.side-expand-btn:hover {
  background: rgba(0, 212, 255, 0.15);
  border-color: rgba(0, 212, 255, 0.3);
}

.side-mini-icons {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 8px;
}

.mini-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: rgba(223, 231, 255, 0.5);
  text-decoration: none;
  transition: all 0.2s;
}

.mini-icon:hover,
.mini-icon.active {
  color: #00d4ff;
  background: rgba(0, 212, 255, 0.12);
}

/* ============================================================ */
/* 主内容区 */
/* ============================================================ */
.main-panel {
  background: #060b1a;
  color: #e2e8f0;
  position: relative;
  overflow: hidden;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 收起侧边栏按钮（顶部区域，避免和面板折叠按钮重叠） */
.sidebar-toggle-btn {
  position: absolute;
  top: 56px;
  left: 0;
  width: 18px;
  height: 40px;
  border-radius: 0 5px 5px 0;
  border: 1px solid rgba(0, 212, 255, 0.1);
  border-left: none;
  background: rgba(10, 18, 40, 0.85);
  color: #00d4ff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  z-index: 10;
  transition: all 0.2s;
  backdrop-filter: blur(6px);
}

.sidebar-toggle-btn:hover {
  background: rgba(0, 212, 255, 0.12);
  border-color: rgba(0, 212, 255, 0.25);
}

/* ============================================================ */
/* 运控中心三栏 */
/* ============================================================ */
.command-shell {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.command-body {
  flex: 1;
  display: flex;
  overflow: hidden;
  min-height: 0;
  position: relative;
}

/* ---- 左侧面板（absolute，展开时丝滑拉宽盖地图） ---- */
.panel-left {
  position: absolute; left: 0; top: 0; bottom: 0; z-index: 25;
  width: 320px;
  display: flex; flex-direction: column;
  border-right: 1px solid rgba(0,212,255,0.11);
  background: rgba(8,14,32,0.91); backdrop-filter: blur(12px);
  transition: width 0.4s cubic-bezier(0.22, 0.61, 0.36, 1);
  overflow: hidden;
}
.panel-left.collapsed { width: 48px; }
.panel-left.wide { width: 72vw; min-width: 680px; box-shadow: 8px 0 60px rgba(0,0,0,0.6); }

.left-icon-only {
  display: flex; flex-direction: column; align-items: center;
  padding-top: 16px; gap: 16px;
}
.icon-only-btn {
  width: 32px; height: 32px; border-radius: 6px;
  border: 1px solid rgba(0,212,255,0.1); background: transparent;
  color: #00d4ff; cursor: pointer; display: flex; align-items: center;
  justify-content: center; font-size: 16px; transition: all 0.2s;
}
.icon-only-btn:hover { background: rgba(0,212,255,0.1); }

.panel-collapse-btn {
  position: absolute; top: 8px; right: 6px; width: 24px; height: 24px;
  border-radius: 5px; border: 1px solid rgba(0,212,255,0.11);
  background: rgba(10,18,40,0.85); color: #00d4ff; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  font-size: 10px; z-index: 20; transition: all 0.2s; backdrop-filter: blur(6px);
}
.panel-collapse-btn.collapsed { right: 4px; top: 50%; transform: translateY(-50%); width: 20px; height: 40px; }
.panel-collapse-btn:hover { background: rgba(0,212,255,0.11); border-color: rgba(0,212,255,0.3); }

/* ---- 中间地图（全宽占满，左右面板浮动覆盖） ---- */
.panel-center {
  flex: 1; min-width: 0;
  display: flex; flex-direction: column;
  position: relative;
}

/* ---- 右侧面板（absolute 覆盖地图右侧） ---- */
.panel-right {
  position: absolute; right: 0; top: 0; bottom: 0; z-index: 25;
  width: 360px;
  border-left: 1px solid rgba(0,212,255,0.11);
  background: rgba(8,14,32,0.91); backdrop-filter: blur(12px);
  display: flex; flex-direction: column;
}
</style>
