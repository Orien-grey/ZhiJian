<template>
  <div class="body">
    <!-- 信息卡片 -->
    <div class="info-cards">
      <div class="icard"><span class="ilbl">消防等级</span><span class="ival">{{ airport?.fireCat }}</span></div>
      <div class="icard"><span class="ilbl">运行时间</span><span class="ival">{{ airport?.opsHours }}</span></div>
      <div class="icard"><span class="ilbl">磁差</span><span class="ival">{{ airport?.magneticVar }}</span></div>
      <div class="icard"><span class="ilbl">燃油</span><span class="ival" style="font-size:10px">{{ airport?.fuelTypes }}</span></div>
    </div>

    <!-- 跑道信息 -->
    <div class="section">
      <p class="sec-title">跑道</p>
      <table class="tbl">
        <thead>
          <tr><th>跑道</th><th>尺寸</th><th>道面</th><th>PCN</th><th>进近等级</th><th>灯光</th></tr>
        </thead>
        <tbody>
          <tr v-for="rw in runways" :key="rw.id">
            <td class="mono">{{ rw.id }}</td>
            <td>{{ rw.length }}×{{ rw.width }}</td>
            <td>{{ rw.surface }}</td>
            <td class="mono">{{ rw.pcn }}</td>
            <td class="mono">{{ rw.ils }}</td>
            <td class="mono" style="font-size:9px">{{ rw.lights }}</td>
          </tr>
        </tbody>
      </table>
      <p v-for="rw in runways" :key="'rm-'+rw.id" class="rw-remark">※ {{ rw.remarks }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AirportInfo, RunwaySpec } from '@/views/dashboard/mock/airportDetail'

defineProps<{
  airport: AirportInfo
  runways: RunwaySpec[]
}>()
</script>

<style scoped>
.body { flex:1; overflow-y:auto; padding:20px 22px; scrollbar-width:thin; scrollbar-color:rgba(0,180,240,0.1) transparent; }
.body::-webkit-scrollbar { width:4px; }
.body::-webkit-scrollbar-thumb { background:rgba(0,180,240,0.1); border-radius:4px; }

.info-cards { display:grid; grid-template-columns:repeat(4,1fr); gap:10px; margin-bottom:20px; }
.icard { padding:14px 16px; border-radius:8px; background:rgba(255,255,255,0.015); border:1px solid rgba(255,255,255,0.03); }
.ilbl { font-size:10px; color:#475569; display:block; margin-bottom:6px; letter-spacing:0.05em; }
.ival { font-size:14px; font-weight:700; color:#e2e8f0; font-family:'IBM Plex Mono',monospace; }

.section { margin-bottom:18px; }
.sec-title { font-size:11px; font-weight:600; color:#64748b; margin:0 0 10px; letter-spacing:0.06em; text-transform:uppercase; }
.tbl { width:100%; border-collapse:collapse; font-size:10.5px; }
.tbl th { padding:7px 10px; text-align:left; color:#475569; font-weight:500; background:rgba(255,255,255,0.015); border-bottom:1px solid rgba(255,255,255,0.05); white-space:nowrap; }
.tbl td { padding:7px 10px; color:#cbd5e1; border-bottom:1px solid rgba(255,255,255,0.02); }
.tbl tr:hover td { background:rgba(0,180,240,0.02); }
.mono { font-family:'IBM Plex Mono',monospace; font-size:10px; }
.rw-remark { font-size:10px; color:#64748b; margin:8px 0 0; line-height:1.5; }
</style>
