<template>
  <div class="body taxi-body">
    <div class="taxi-grid">
      <!-- SVG 滑行道图 -->
      <div class="taxi-map">
        <div class="example-badge">示例</div>
        <svg viewBox="0 0 800 520" class="airport-svg">
          <rect width="800" height="520" fill="#080e1e" rx="6" />
          <!-- 跑道 -->
          <rect v-for="rw in svgRunways" :key="rw.id" :x="rw.x" :y="rw.y" :width="rw.w" :height="rw.h"
            fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.12)" stroke-width="1.5" rx="2" />
          <!-- 跑道编号 -->
          <text v-for="lbl in svgLabels" :key="lbl.id" :x="lbl.x" :y="lbl.y"
            fill="rgba(255,255,255,0.25)" font-size="11" font-family="IBM Plex Mono" text-anchor="middle">{{ lbl.text }}</text>
          <!-- 滑行道 -->
          <path v-for="twy in taxiways" :key="twy.id" :d="twy.path"
            :stroke="twyColor(twy.status)" :stroke-width="twyStroke(twy.status)"
            fill="none" stroke-linecap="round" stroke-linejoin="round"
            :class="twy.status !== 'open' ? 'twy-interactive' : ''"
            @mouseenter="hoveredTwy = twy" @mouseleave="hoveredTwy = null" />
          <!-- 标签 -->
          <text v-for="lbl in twyLabels" :key="lbl.id" :x="lbl.x" :y="lbl.y"
            :fill="lblFill(lbl.status)" font-size="8.5" font-family="IBM Plex Mono" text-anchor="middle"
            font-weight="600">{{ lbl.text }}</text>
        </svg>
      </div>

      <!-- 右侧信息面板 -->
      <div class="taxi-side">
        <!-- NOTAM 提示 -->
        <div v-if="hoveredTwy?.notamText" class="notam-box">
          <div class="notam-head">
            <span class="notam-badge">NOTAM</span>
            <span class="notam-id">{{ hoveredTwy.notamRef }}</span>
          </div>
          <p class="notam-body">{{ hoveredTwy.notamText }}</p>
        </div>
        <div v-else class="notam-empty">🖱 悬停滑行道查看 NOTAM</div>

        <!-- 图例 -->
        <div class="legend">
          <span><span class="ld open"></span>开放</span>
          <span><span class="ld closed"></span>关闭</span>
          <span><span class="ld restricted"></span>限制</span>
        </div>

        <!-- 统计 -->
        <div class="taxi-stats">
          <div class="stat-row"><span>总滑行道</span><span class="mono">{{ taxiways.length }} 条</span></div>
          <div class="stat-row"><span>关闭</span><span class="mono" style="color:#c084fc">{{ closedCount }} 条</span></div>
          <div class="stat-row"><span>限制</span><span class="mono" style="color:#86efac">{{ restrictedCount }} 条</span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { TaxiwaySegment } from '@/views/dashboard/mock/airportDetail'

const props = defineProps<{
  taxiways: TaxiwaySegment[]
}>()

const hoveredTwy = ref<TaxiwaySegment | null>(null)

const closedCount = computed(() => props.taxiways.filter(t => t.status === 'closed').length)
const restrictedCount = computed(() => props.taxiways.filter(t => t.status === 'restricted').length)

const twyColor = (s: string) => s === 'closed' ? '#c084fc' : s === 'restricted' ? '#4ade80' : 'rgba(100,116,139,0.25)'
const twyStroke = (s: string) => s === 'closed' ? 5 : s === 'restricted' ? 4 : 2.5
const lblFill = (s: string) => s === 'closed' ? '#c084fc' : s === 'restricted' ? '#86efac' : '#475569'

// SVG 跑道布局
const svgRunways = [
  { id: 'rw07', x: 40, y: 55, w: 710, h: 18 },
  { id: 'rw08r', x: 40, y: 370, w: 710, h: 18 },
  { id: 'rw08l', x: 40, y: 445, w: 710, h: 18 },
]
const svgLabels = [
  { id: 'l07', text: 'RWY 07/25 · 3600×45m · 沥青 · 4E', x: 395, y: 48 },
  { id: 'l08r', text: 'RWY 08R/26L · 3600×45m · 混凝土 · 4F (离场)', x: 395, y: 363 },
  { id: 'l08l', text: 'RWY 08L/26R · 3200×45m · 混凝土 · 4F (进场 · CAT IIIA)', x: 395, y: 438 },
]

// 计算滑行道标签位置
const twyLabels = computed(() =>
  props.taxiways.map(t => {
    const nums = t.path.match(/[\d.]+/g)
    const x = nums ? (parseFloat(nums[0]) + parseFloat(nums[nums.length - 2])) / 2 : 0
    const y = nums ? (parseFloat(nums[1]) + parseFloat(nums[nums.length - 1])) / 2 - 5 : 0
    return { id: t.id, text: t.name, x, y, status: t.status }
  }),
)
</script>

<style scoped>
.body { flex:1; overflow-y:auto; scrollbar-width:thin; scrollbar-color:rgba(0,180,240,0.1) transparent; }
.body::-webkit-scrollbar { width:4px; }
.body::-webkit-scrollbar-thumb { background:rgba(0,180,240,0.1); border-radius:4px; }
.taxi-body { padding:15px 22px; }
.taxi-grid { display:flex; gap:16px; height:100%; }
.taxi-map { flex:1; min-width:0; position:relative; }
.example-badge { position:absolute; top:8px; right:10px; font-size:10px; font-weight:700; color:#f59e0b; background:rgba(245,158,11,0.1); border:1px solid rgba(245,158,11,0.25); padding:3px 10px; border-radius:4px; letter-spacing:0.08em; z-index:5; }
.airport-svg { width:100%; height:auto; border-radius:6px; border:1px solid rgba(255,255,255,0.03); }
.twy-interactive { cursor:pointer; transition:opacity 0.15s; }
.twy-interactive:hover { opacity:0.7; }
.taxi-side { width:220px; flex-shrink:0; display:flex; flex-direction:column; gap:12px; }

.notam-box { padding:12px; border-radius:8px; background:rgba(239,68,68,0.04); border:1px solid rgba(239,68,68,0.1); }
.notam-head { display:flex; align-items:center; gap:8px; margin-bottom:8px; }
.notam-badge { font-size:9px; font-weight:800; color:#fff; background:#ef4444; padding:2px 6px; border-radius:3px; letter-spacing:0.06em; }
.notam-id { font-size:10px; font-weight:700; color:#ef4444; font-family:'IBM Plex Mono',monospace; }
.notam-body { font-size:11px; color:#cbd5e1; line-height:1.65; margin:0; }
.notam-empty { font-size:11px; color:#334155; text-align:center; padding:24px 0; }

.legend { display:flex; gap:14px; font-size:10px; color:#475569; }
.ld { display:inline-block; width:10px; height:10px; border-radius:2px; margin-right:4px; }
.ld.open { background:rgba(100,116,139,0.25); }
.ld.closed { background:#c084fc; }
.ld.restricted { background:#4ade80; }

.taxi-stats { padding:10px; border-radius:6px; background:rgba(255,255,255,0.01); }
.stat-row { display:flex; justify-content:space-between; font-size:10px; color:#64748b; padding:3px 0; }
.mono { font-family:'IBM Plex Mono',monospace; font-size:10px; }
</style>
