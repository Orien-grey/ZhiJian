<template>
  <div class="root">
    <div
      class="viewport"
      @mousedown="onPanStart" @mousemove="onPanMove" @mouseup="onPanEnd" @mouseleave="onPanEnd"
      @wheel.prevent="onWheel" :class="{ grabbing: isPanning }"
    >
      <div class="hint" v-if="!hasPanned">🖱 DRAG TO PAN · SCROLL TO ZOOM</div>
      <div class="hud-zoom">×{{ zoom.toFixed(1) }}</div>

      <svg viewBox="0 0 2400 1600" :style="{ transform: `translate(${panX}px, ${panY}px) scale(${zoom})` }" class="chart">
        <defs>
          <linearGradient id="rw" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#1e2838"/><stop offset="50%" stop-color="#1a2332"/><stop offset="100%" stop-color="#1e2838"/>
          </linearGradient>
          <pattern id="apron" width="32" height="32" patternUnits="userSpaceOnUse">
            <rect width="32" height="32" fill="none"/><circle cx="16" cy="16" r="0.4" fill="rgba(255,255,255,0.01)"/>
          </pattern>
          <pattern id="grass" width="50" height="50" patternUnits="userSpaceOnUse">
            <rect width="50" height="50" fill="none"/>
            <circle cx="8" cy="14" r="0.3" fill="rgba(255,255,255,0.003)"/>
            <circle cx="32" cy="38" r="0.25" fill="rgba(255,255,255,0.002)"/>
          </pattern>
        </defs>

        <!-- Background -->
        <rect width="2400" height="1600" fill="#0d1b2a"/>
        <rect width="2400" height="1600" fill="url(#grass)"/>

        <!-- Perimeter -->
        <rect x="100" y="70" width="2200" height="1460" rx="12" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1" stroke-dasharray="16,10"/>

        <!-- ═══════════ RUNWAY 07/25 ═══════════ -->
        <g>
          <rect x="220" y="230" width="1960" height="36" rx="3" fill="rgba(255,255,255,0.012)"/>
          <rect x="230" y="234" width="1940" height="28" rx="2" fill="url(#rw)" stroke="rgba(255,255,255,0.16)" stroke-width="1.6"/>
          <line x1="240" y1="237" x2="2160" y2="237" stroke="rgba(255,255,255,0.4)" stroke-width="0.8"/>
          <line x1="240" y1="259" x2="2160" y2="259" stroke="rgba(255,255,255,0.4)" stroke-width="0.8"/>
          <g stroke="rgba(255,255,255,0.22)" stroke-width="0.6">
            <line v-for="i in 60" :key="'rc07'+i" :x1="250+i*31" y1="248" :x2="250+i*31+16" y2="248"/>
          </g>
          <!-- Thresholds -->
          <g transform="translate(250,235)">
            <rect v-for="i in 12" :key="'t07'+i" :x="i*6" y="0" width="3" height="26" fill="rgba(255,255,255,0.55)"/>
          </g>
          <g transform="translate(2080,235)">
            <rect v-for="i in 12" :key="'t25'+i" :x="i*6" y="0" width="3" height="26" fill="rgba(255,255,255,0.55)"/>
          </g>
          <!-- Aiming points -->
          <g transform="translate(400,239)">
            <rect x="0" y="0" width="18" height="22" fill="rgba(255,255,255,0.4)"/>
            <rect x="28" y="0" width="18" height="22" fill="rgba(255,255,255,0.4)"/>
          </g>
          <g transform="translate(1880,239)">
            <rect x="0" y="0" width="18" height="22" fill="rgba(255,255,255,0.4)"/>
            <rect x="28" y="0" width="18" height="22" fill="rgba(255,255,255,0.4)"/>
          </g>
          <!-- PAPI -->
          <rect x="340" y="263" width="14" height="4" rx="1" fill="none" stroke="rgba(255,100,100,0.3)" stroke-width="1"/>
          <rect x="356" y="263" width="14" height="4" rx="1" fill="none" stroke="rgba(255,100,100,0.3)" stroke-width="1"/>
          <rect x="372" y="263" width="14" height="4" rx="1" fill="none" stroke="rgba(255,100,100,0.3)" stroke-width="1"/>
          <rect x="388" y="263" width="14" height="4" rx="1" fill="none" stroke="rgba(255,100,100,0.3)" stroke-width="1"/>
          <!-- Numbers -->
          <text x="330" y="226" fill="#fff" font-size="24" font-family="'JetBrains Mono',monospace" font-weight="900">07</text>
          <text x="2070" y="226" fill="#fff" font-size="24" font-family="'JetBrains Mono',monospace" font-weight="900">25</text>
          <text x="1200" y="225" fill="rgba(255,255,255,0.1)" font-size="8" font-family="'JetBrains Mono',monospace" text-anchor="middle">RWY 07/25  3600×45m  ASPHALT  4E  HIRL RCLL RTZL</text>
        </g>

        <!-- ═══════════ RUNWAY 08R/26L ═══════════ -->
        <g>
          <rect x="200" y="640" width="2000" height="40" rx="3" fill="rgba(255,255,255,0.015)"/>
          <rect x="210" y="644" width="1980" height="32" rx="2" fill="url(#rw)" stroke="rgba(255,255,255,0.2)" stroke-width="1.8"/>
          <line x1="220" y1="647" x2="2180" y2="647" stroke="rgba(255,255,255,0.45)" stroke-width="0.8"/>
          <line x1="220" y1="673" x2="2180" y2="673" stroke="rgba(255,255,255,0.45)" stroke-width="0.8"/>
          <g stroke="rgba(255,255,255,0.25)" stroke-width="0.6">
            <line v-for="i in 63" :key="'rc08r'+i" :x1="230+i*31" y1="660" :x2="230+i*31+16" y2="660"/>
          </g>
          <g transform="translate(230,645)">
            <rect v-for="i in 12" :key="'t08r'+i" :x="i*6" y="0" width="3" height="30" fill="rgba(255,255,255,0.6)"/>
          </g>
          <g transform="translate(2100,645)">
            <rect v-for="i in 12" :key="'t26l'+i" :x="i*6" y="0" width="3" height="30" fill="rgba(255,255,255,0.6)"/>
          </g>
          <g transform="translate(380,650)">
            <rect x="0" y="0" width="18" height="24" fill="rgba(255,255,255,0.45)"/>
            <rect x="28" y="0" width="18" height="24" fill="rgba(255,255,255,0.45)"/>
          </g>
          <g transform="translate(1900,650)">
            <rect x="0" y="0" width="18" height="24" fill="rgba(255,255,255,0.45)"/>
            <rect x="28" y="0" width="18" height="24" fill="rgba(255,255,255,0.45)"/>
          </g>
          <rect x="320" y="673" width="14" height="4" rx="1" fill="none" stroke="rgba(255,100,100,0.35)" stroke-width="1"/>
          <rect x="336" y="673" width="14" height="4" rx="1" fill="none" stroke="rgba(255,100,100,0.35)" stroke-width="1"/>
          <rect x="352" y="673" width="14" height="4" rx="1" fill="none" stroke="rgba(255,100,100,0.35)" stroke-width="1"/>
          <rect x="368" y="673" width="14" height="4" rx="1" fill="none" stroke="rgba(255,100,100,0.35)" stroke-width="1"/>
          <text x="310" y="638" fill="#fff" font-size="24" font-family="'JetBrains Mono',monospace" font-weight="900">08R</text>
          <text x="2090" y="638" fill="#fff" font-size="24" font-family="'JetBrains Mono',monospace" font-weight="900">26L</text>
          <text x="1200" y="637" fill="rgba(255,255,255,0.12)" font-size="8" font-family="'JetBrains Mono',monospace" text-anchor="middle">RWY 08R/26L  3600×45m  CONCRETE  4F  HIRL RCLL (DEP)</text>
        </g>

        <!-- ═══════════ RUNWAY 08L/26R ═══════════ -->
        <g>
          <rect x="300" y="1180" width="1800" height="36" rx="3" fill="rgba(100,180,220,0.02)"/>
          <rect x="310" y="1184" width="1780" height="28" rx="2" fill="url(#rw)" stroke="rgba(120,200,240,0.18)" stroke-width="1.6"/>
          <line x1="320" y1="1187" x2="2080" y2="1187" stroke="rgba(140,220,255,0.4)" stroke-width="0.8"/>
          <line x1="320" y1="1209" x2="2080" y2="1209" stroke="rgba(140,220,255,0.4)" stroke-width="0.8"/>
          <g stroke="rgba(140,220,255,0.2)" stroke-width="0.6">
            <line v-for="i in 57" :key="'rc08l'+i" :x1="330+i*31" y1="1198" :x2="330+i*31+16" y2="1198"/>
          </g>
          <g transform="translate(330,1185)">
            <rect v-for="i in 12" :key="'t08l'+i" :x="i*6" y="0" width="3" height="26" fill="rgba(140,220,255,0.45)"/>
          </g>
          <g transform="translate(2010,1185)">
            <rect v-for="i in 12" :key="'t26r'+i" :x="i*6" y="0" width="3" height="26" fill="rgba(140,220,255,0.45)"/>
          </g>
          <g transform="translate(470,1189)">
            <rect x="0" y="0" width="18" height="20" fill="rgba(140,220,255,0.35)"/>
            <rect x="28" y="0" width="18" height="20" fill="rgba(140,220,255,0.35)"/>
          </g>
          <g transform="translate(1820,1189)">
            <rect x="0" y="0" width="18" height="20" fill="rgba(140,220,255,0.35)"/>
            <rect x="28" y="0" width="18" height="20" fill="rgba(140,220,255,0.35)"/>
          </g>
          <rect x="420" y="1210" width="14" height="4" rx="1" fill="none" stroke="rgba(255,100,100,0.3)" stroke-width="1"/>
          <rect x="436" y="1210" width="14" height="4" rx="1" fill="none" stroke="rgba(255,100,100,0.3)" stroke-width="1"/>
          <rect x="452" y="1210" width="14" height="4" rx="1" fill="none" stroke="rgba(255,100,100,0.3)" stroke-width="1"/>
          <rect x="468" y="1210" width="14" height="4" rx="1" fill="none" stroke="rgba(255,100,100,0.3)" stroke-width="1"/>
          <text x="410" y="1177" fill="rgba(140,220,255,0.55)" font-size="24" font-family="'JetBrains Mono',monospace" font-weight="900">08L</text>
          <text x="1990" y="1177" fill="rgba(140,220,255,0.55)" font-size="24" font-family="'JetBrains Mono',monospace" font-weight="900">26R</text>
          <text x="1200" y="1176" fill="rgba(140,220,255,0.12)" font-size="8" font-family="'JetBrains Mono',monospace" text-anchor="middle">RWY 08L/26R  3200×45m  CONCRETE  4F  CAT IIIA  HIRL RCLL RTZL HIALS (ARR)</text>
        </g>

        <!-- ═══════════ TAXIWAY NETWORK ═══════════ -->
        <g fill="none" stroke-linecap="round" stroke-linejoin="round">
          <!-- Parallel taxiways -->
          <line x1="280" y1="200" x2="2120" y2="200" stroke="#7eb8da" stroke-width="3" opacity="0.65"/>
          <line x1="280" y1="305" x2="2120" y2="305" stroke="#7eb8da" stroke-width="3.5" opacity="0.7"/>
          <line x1="260" y1="595" x2="2140" y2="595" stroke="#7eb8da" stroke-width="3" opacity="0.65"/>
          <line x1="280" y1="720" x2="2120" y2="720" stroke="#7eb8da" stroke-width="3.5" opacity="0.7"/>
          <line x1="360" y1="1140" x2="2040" y2="1140" stroke="#7eb8da" stroke-width="3" opacity="0.65"/>
          <line x1="360" y1="1260" x2="2040" y2="1260" stroke="#7eb8da" stroke-width="2.5" opacity="0.6"/>

          <!-- Taxiway centerline dashes -->
          <g stroke="rgba(255,255,200,0.12)" stroke-width="0.5" stroke-dasharray="10,8">
            <line x1="280" y1="200" x2="2120" y2="200"/><line x1="280" y1="305" x2="2120" y2="305"/>
            <line x1="260" y1="595" x2="2140" y2="595"/><line x1="280" y1="720" x2="2120" y2="720"/>
            <line x1="360" y1="1140" x2="2040" y2="1140"/><line x1="360" y1="1260" x2="2040" y2="1260"/>
          </g>

          <!-- Vertical connectors (8 columns) -->
          <g stroke="#8a9bb5" stroke-width="2.5" opacity="0.6">
            <line x1="440" y1="200" x2="440" y2="305"/><line x1="700" y1="200" x2="700" y2="305"/>
            <line x1="960" y1="200" x2="960" y2="305"/><line x1="1220" y1="200" x2="1220" y2="305"/>
            <line x1="1480" y1="200" x2="1480" y2="305"/><line x1="1740" y1="200" x2="1740" y2="305"/>
            <line x1="2000" y1="200" x2="2000" y2="305"/>
            <!-- 07/25 ↔ 08R/26L -->
            <line x1="440" y1="305" x2="440" y2="720"/><line x1="960" y1="305" x2="960" y2="720"/>
            <line x1="1480" y1="305" x2="1480" y2="720"/><line x1="2000" y1="305" x2="2000" y2="720"/>
            <!-- 08R/26L ↔ 08L/26R -->
            <line x1="440" y1="720" x2="440" y2="1260"/><line x1="960" y1="720" x2="960" y2="1260"/>
            <line x1="1480" y1="720" x2="1480" y2="1260"/><line x1="2000" y1="720" x2="2000" y2="1260"/>
            <!-- 08L/26R zone -->
            <line x1="560" y1="1140" x2="560" y2="1260"/><line x1="820" y1="1140" x2="820" y2="1260"/>
            <line x1="1080" y1="1140" x2="1080" y2="1260"/><line x1="1340" y1="1140" x2="1340" y2="1260"/>
            <line x1="1600" y1="1140" x2="1600" y2="1260"/><line x1="1860" y1="1140" x2="1860" y2="1260"/>
          </g>

          <!-- High-speed turnoffs (amber curves, ~3 per runway side) -->
          <g stroke="#c4a35a" stroke-width="3.5" opacity="0.7">
            <!-- 07/25 exits ↓ -->
            <path d="M 560,248 Q 580,280 600,305"/><path d="M 820,248 Q 800,280 780,305"/>
            <path d="M 1100,248 Q 1120,280 1140,305"/><path d="M 1360,248 Q 1340,280 1320,305"/>
            <path d="M 1620,248 Q 1640,280 1660,305"/><path d="M 1880,248 Q 1860,280 1840,305"/>
            <!-- 07/25 exits ↑ -->
            <path d="M 700,248 Q 720,220 740,200"/><path d="M 1220,248 Q 1200,220 1180,200"/>
            <path d="M 1740,248 Q 1760,220 1780,200"/>
            <!-- 08R/26L exits ↓ -->
            <path d="M 560,660 Q 580,695 600,720"/><path d="M 820,660 Q 800,695 780,720"/>
            <path d="M 1100,660 Q 1120,695 1140,720"/><path d="M 1360,660 Q 1340,695 1320,720"/>
            <path d="M 1620,660 Q 1640,695 1660,720"/><path d="M 1880,660 Q 1860,695 1840,720"/>
            <!-- 08R/26L exits ↑ -->
            <path d="M 700,660 Q 720,630 740,595"/><path d="M 1220,660 Q 1200,630 1180,595"/>
            <path d="M 1740,660 Q 1760,630 1780,595"/>
            <!-- 08L/26R exits ↑ -->
            <path d="M 620,1198 Q 600,1170 580,1140"/><path d="M 880,1198 Q 900,1170 920,1140"/>
            <path d="M 1140,1198 Q 1120,1170 1100,1140"/><path d="M 1400,1198 Q 1420,1170 1440,1140"/>
            <path d="M 1660,1198 Q 1640,1170 1620,1140"/><path d="M 1920,1198 Q 1940,1170 1960,1140"/>
            <!-- 08L/26R exits ↓ -->
            <path d="M 760,1198 Q 780,1230 800,1260"/><path d="M 1280,1198 Q 1260,1230 1240,1260"/>
            <path d="M 1800,1198 Q 1820,1230 1840,1260"/>
          </g>

          <!-- Apron lead-ins -->
          <g stroke="#8a9bb5" stroke-width="2.5" opacity="0.55">
            <line x1="1480" y1="720" x2="1480" y2="880"/>
            <line x1="2000" y1="720" x2="2000" y2="880"/>
            <line x1="1480" y1="880" x2="2060" y2="880"/>
            <line x1="1480" y1="930" x2="2060" y2="930"/>
            <line x1="1480" y1="980" x2="2060" y2="980"/>
            <line x1="1480" y1="1030" x2="2060" y2="1030"/>
          </g>
        </g>

        <!-- ═══════════ HOLDING POSITIONS ═══════════ -->
        <g stroke="#d4a843" stroke-width="1.5" opacity="0.6" stroke-dasharray="8,5">
          <line x1="390" y1="203" x2="390" y2="302"/>
          <line x1="2010" y1="203" x2="2010" y2="302"/>
          <line x1="380" y1="598" x2="380" y2="717"/>
          <line x1="2020" y1="598" x2="2020" y2="717"/>
          <line x1="410" y1="1143" x2="410" y2="1257"/>
          <line x1="1990" y1="1143" x2="1990" y2="1257"/>
        </g>

        <!-- ═══════════ ILS CRITICAL AREAS ═══════════ -->
        <g fill="none" stroke="rgba(200,80,80,0.1)" stroke-width="0.7" stroke-dasharray="3,4">
          <rect x="370" y="190" width="70" height="50" rx="3"/>
          <rect x="1960" y="190" width="70" height="50" rx="3"/>
          <rect x="360" y="635" width="70" height="50" rx="3"/>
          <rect x="1970" y="635" width="70" height="50" rx="3"/>
          <rect x="390" y="1130" width="70" height="50" rx="3"/>
          <rect x="1940" y="1130" width="70" height="50" rx="3"/>
        </g>

        <!-- ═══════════ TERMINAL BUILDINGS ═══════════ -->
        <polygon points="1300,800 1750,800 1780,860 1720,920 1320,920 1280,870" fill="#0f1926" stroke="rgba(255,255,255,0.07)" stroke-width="1.2"/>
        <line x1="1400" y1="805" x2="1400" y2="915" stroke="rgba(255,255,255,0.035)" stroke-width="0.6"/>
        <line x1="1500" y1="805" x2="1500" y2="915" stroke="rgba(255,255,255,0.035)" stroke-width="0.6"/>
        <line x1="1600" y1="805" x2="1600" y2="915" stroke="rgba(255,255,255,0.035)" stroke-width="0.6"/>
        <line x1="1300" y1="860" x2="1775" y2="860" stroke="rgba(255,255,255,0.03)" stroke-width="0.4"/>
        <text x="1525" y="870" fill="rgba(255,255,255,0.09)" font-size="11" font-family="'JetBrains Mono',monospace" text-anchor="middle">T1 航站楼</text>

        <!-- Satellite -->
        <polygon points="1340,940 1720,940 1740,1000 1680,1050 1360,1050 1300,1000" fill="#0f1926" stroke="rgba(255,255,255,0.05)" stroke-width="0.8"/>
        <text x="1520" y="1000" fill="rgba(255,255,255,0.06)" font-size="9" font-family="'JetBrains Mono',monospace" text-anchor="middle">卫星厅 SATELLITE</text>

        <!-- Cargo -->
        <polygon points="480,850 680,850 700,940 640,980 500,980 460,940" fill="#0f1926" stroke="rgba(255,255,255,0.04)" stroke-width="0.7"/>
        <text x="580" y="920" fill="rgba(255,255,255,0.05)" font-size="9" font-family="'JetBrains Mono',monospace" text-anchor="middle">货运站 CARGO</text>

        <!-- Hangars -->
        <rect x="720" y="880" width="100" height="55" rx="5" fill="#0f1926" stroke="rgba(255,255,255,0.04)" stroke-width="0.7"/>
        <text x="770" y="912" fill="rgba(255,255,255,0.04)" font-size="8" font-family="'JetBrains Mono',monospace" text-anchor="middle">HGR A</text>
        <rect x="840" y="880" width="90" height="55" rx="5" fill="#0f1926" stroke="rgba(255,255,255,0.04)" stroke-width="0.7"/>
        <text x="885" y="912" fill="rgba(255,255,255,0.04)" font-size="8" font-family="'JetBrains Mono',monospace" text-anchor="middle">HGR B</text>

        <!-- ═══════════ AIRCRAFT STANDS (T-markings) ═══════════ -->
        <g v-for="i in 10" :key="'gs1'+i" opacity="0.5">
          <line :x1="1360+i*36" y1="890" :x2="1360+i*36" y2="905" stroke="rgba(255,255,255,0.3)" stroke-width="1.2"/>
          <line :x1="1360+i*36-6" y1="905" :x2="1360+i*36+6" y2="905" stroke="rgba(255,255,255,0.3)" stroke-width="1.2"/>
          <text :x="1360+i*36" y="916" fill="rgba(255,255,255,0.18)" font-size="6" font-family="'JetBrains Mono',monospace" text-anchor="middle">{{ 101+i }}</text>
        </g>
        <g v-for="i in 10" :key="'gs2'+i" opacity="0.5">
          <line :x1="1360+i*36" y1="1060" :x2="1360+i*36" y2="1075" stroke="rgba(255,255,255,0.3)" stroke-width="1.2"/>
          <line :x1="1360+i*36-6" y1="1075" :x2="1360+i*36+6" y2="1075" stroke="rgba(255,255,255,0.3)" stroke-width="1.2"/>
          <text :x="1360+i*36" y="1086" fill="rgba(255,255,255,0.18)" font-size="6" font-family="'JetBrains Mono',monospace" text-anchor="middle">{{ 201+i }}</text>
        </g>
        <!-- Cargo stands -->
        <g v-for="i in 4" :key="'cs'+i" opacity="0.45">
          <line :x1="520+i*55" y1="960" :x2="520+i*55" y2="972" stroke="rgba(255,255,255,0.28)" stroke-width="1.2"/>
          <line :x1="520+i*55-6" y1="972" :x2="520+i*55+6" y2="972" stroke="rgba(255,255,255,0.28)" stroke-width="1.2"/>
          <text :x="520+i*55" y="982" fill="rgba(255,255,255,0.15)" font-size="6" font-family="'JetBrains Mono',monospace" text-anchor="middle">C{{ i }}</text>
        </g>

        <!-- ═══════════ NAVAIDS ═══════════ -->
        <!-- VOR/DME -->
        <g transform="translate(220,170)">
          <circle cx="0" cy="0" r="16" fill="rgba(0,0,0,0.5)" stroke="rgba(120,180,220,0.12)" stroke-width="0.8"/>
          <circle cx="0" cy="0" r="3.5" fill="rgba(120,180,220,0.2)"/>
          <line v-for="a in 8" :key="'vor07'+a" x1="0" y1="0" :x2="Math.cos(a*Math.PI/4)*16" :y2="Math.sin(a*Math.PI/4)*16" stroke="rgba(120,180,220,0.05)" stroke-width="0.3"/>
          <line v-for="d in 36" :key="'vort'+d" x1="0" y1="-14" x2="0" y2="-16" :transform="`rotate(${d*10})`" stroke="rgba(255,255,255,0.04)" stroke-width="0.3"/>
          <text x="0" y="-22" fill="rgba(120,180,220,0.12)" font-size="8" font-family="'JetBrains Mono',monospace" text-anchor="middle" font-weight="700">VOR/DME</text>
        </g>

        <!-- ILS Localizer 07 -->
        <rect x="225" y="220" width="8" height="42" rx="2" fill="rgba(120,180,220,0.03)" stroke="rgba(120,180,220,0.08)" stroke-width="0.6"/>
        <text x="229" y="212" fill="rgba(120,180,220,0.1)" font-size="6" font-family="'JetBrains Mono',monospace" text-anchor="middle">LLZ</text>

        <!-- ILS Localizer 08L -->
        <rect x="305" y="1170" width="8" height="40" rx="2" fill="rgba(140,220,255,0.03)" stroke="rgba(140,220,255,0.1)" stroke-width="0.6"/>
        <text x="309" y="1162" fill="rgba(140,220,255,0.1)" font-size="6" font-family="'JetBrains Mono',monospace" text-anchor="middle">LLZ</text>

        <!-- NDB -->
        <g transform="translate(2180,1350)">
          <circle cx="0" cy="0" r="12" fill="none" stroke="rgba(180,170,150,0.06)" stroke-width="0.6" stroke-dasharray="3,4"/>
          <circle cx="0" cy="0" r="2.5" fill="rgba(180,170,150,0.12)"/>
          <text x="0" y="-16" fill="rgba(180,170,150,0.08)" font-size="7" font-family="'JetBrains Mono',monospace" text-anchor="middle">NDB CP</text>
        </g>

        <!-- Wind cone -->
        <circle cx="400" cy="800" r="10" fill="rgba(0,0,0,0.4)" stroke="rgba(255,255,255,0.04)" stroke-width="0.5"/>
        <line x1="400" y1="800" x2="408" y2="795" stroke="rgba(220,100,60,0.15)" stroke-width="1.5" stroke-linecap="round"/>
        <line x1="408" y1="795" x2="413" y2="797" stroke="rgba(255,255,255,0.06)" stroke-width="1.5" stroke-linecap="round"/>

        <!-- TWR -->
        <circle cx="1300" cy="790" r="14" fill="rgba(0,0,0,0.3)" stroke="rgba(120,200,240,0.12)" stroke-width="1"/>
        <circle cx="1300" cy="790" r="4.5" fill="rgba(120,200,240,0.18)"/>
        <text x="1300" y="782" fill="rgba(120,200,240,0.2)" font-size="9" font-family="'JetBrains Mono',monospace" text-anchor="middle" font-weight="700">TWR</text>

        <!-- RFFS -->
        <rect x="620" y="780" width="40" height="28" rx="4" fill="#0f1926" stroke="rgba(220,100,100,0.1)" stroke-width="0.8"/>
        <text x="640" y="798" fill="rgba(220,100,100,0.22)" font-size="8" font-family="'JetBrains Mono',monospace" text-anchor="middle" font-weight="700">RFFS</text>

        <!-- ═══════════ COMPASS ROSE ═══════════ -->
        <g transform="translate(2260,130)">
          <circle cx="0" cy="0" r="38" fill="rgba(0,0,0,0.5)" stroke="rgba(255,255,255,0.05)" stroke-width="0.8"/>
          <circle cx="0" cy="0" r="30" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="0.3"/>
          <polygon points="0,30 12,-6 0,-12 -12,-6" fill="none" stroke="rgba(200,200,200,0.12)" stroke-width="1"/>
          <polygon points="12,-6 0,-35 0,-12" fill="rgba(200,200,200,0.06)"/>
          <polygon points="0,-12 0,-35 -12,-6" fill="rgba(200,200,200,0.03)"/>
          <line v-for="d in 36" :key="'cr'+d" x1="0" y1="-32" x2="0" y2="-36" :transform="`rotate(${d*10})`" stroke="rgba(255,255,255,0.04)" stroke-width="0.3"/>
          <line v-for="d in 12" :key="'crh'+d" x1="0" y1="-32" x2="0" y2="-38" :transform="`rotate(${d*30})`" stroke="rgba(255,255,255,0.08)" stroke-width="0.5"/>
          <text x="0" y="52" fill="rgba(200,200,200,0.1)" font-size="13" font-family="'JetBrains Mono',monospace" text-anchor="middle" font-weight="700">N</text>
        </g>

        <!-- ═══════════ SCALE BAR ═══════════ -->
        <g transform="translate(120,1520)">
          <line x1="0" y1="0" x2="300" y2="0" stroke="rgba(255,255,255,0.15)" stroke-width="0.8"/>
          <line x1="0" y1="-4" x2="0" y2="4" stroke="rgba(255,255,255,0.15)" stroke-width="0.8"/>
          <line x1="100" y1="-3" x2="100" y2="3" stroke="rgba(255,255,255,0.15)" stroke-width="0.8"/>
          <line x1="200" y1="-3" x2="200" y2="3" stroke="rgba(255,255,255,0.15)" stroke-width="0.8"/>
          <line x1="300" y1="-4" x2="300" y2="4" stroke="rgba(255,255,255,0.15)" stroke-width="0.8"/>
          <text x="0" y="8" fill="rgba(255,255,255,0.12)" font-size="7" font-family="'JetBrains Mono',monospace" text-anchor="middle">0</text>
          <text x="150" y="8" fill="rgba(255,255,255,0.12)" font-size="7" font-family="'JetBrains Mono',monospace" text-anchor="middle">1000m</text>
          <text x="300" y="8" fill="rgba(255,255,255,0.12)" font-size="7" font-family="'JetBrains Mono',monospace" text-anchor="middle">2000m</text>
        </g>

        <!-- ═══════════ SAMPLE WATERMARK ═══════════ -->
        <g transform="translate(1200,800)" opacity="0.04">
          <text x="0" y="0" fill="#fff" font-size="72" font-family="'JetBrains Mono',monospace" font-weight="900" text-anchor="middle" letter-spacing="0.3em">SAMPLE</text>
          <text x="0" y="28" fill="#fff" font-size="16" font-family="sans-serif" text-anchor="middle" letter-spacing="0.2em">示例航图 · 所有机场共用</text>
        </g>

        <!-- ═══════════ INTERACTIVE OVERLAY ═══════════ -->
        <path v-for="twy in taxiways" :key="twy.id" :d="twy.path"
          :stroke="twyColor(twy.status)" :stroke-width="twyStroke(twy.status)"
          fill="none" stroke-linecap="round" stroke-linejoin="round"
          :class="twy.status!=='open'?'twy-on':''"
          @mouseenter="hoveredTwy=twy" @mouseleave="hoveredTwy=null"/>
      </svg>
    </div>

    <!-- Bottom bar -->
    <div class="bar">
      <div v-if="hoveredTwy?.notamText" class="notam">
        <span class="notam-badge">NOTAM</span>
        <span class="notam-id">{{ hoveredTwy.notamRef }}</span>
        <span class="notam-text">{{ hoveredTwy.notamText }}</span>
      </div>
      <div v-else class="notam empty">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M15 15l-2 5L9 9l11 4-5 2z"/></svg>
        HOVER TAXIWAY FOR NOTAM DETAILS
      </div>
      <div class="bar-right">
        <span class="leg"><span class="ld" style="background:#7eb8da"></span>主滑行道</span>
        <span class="leg"><span class="ld" style="background:#8a9bb5"></span>联络道</span>
        <span class="leg"><span class="ld" style="background:#c4a35a"></span>快速脱离</span>
        <span class="div">|</span>
        <span class="stat">{{ taxiways.length }}条</span>
        <span class="stat" style="color:#d4a0e0">关{{ closedCount }}</span>
        <span class="stat" style="color:#90e0a0">限{{ restrictedCount }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { TaxiwaySegment } from '@/views/dashboard/mock/airportDetail'

const props = defineProps<{ taxiways: TaxiwaySegment[] }>()
const hoveredTwy = ref<TaxiwaySegment|null>(null)
const closedCount = computed(() => props.taxiways.filter(t=>t.status==='closed').length)
const restrictedCount = computed(() => props.taxiways.filter(t=>t.status==='restricted').length)
const twyColor = (s:string) => s==='closed'?'#d4a0e0':s==='restricted'?'#90e0a0':'transparent'
const twyStroke = (s:string) => s==='closed'?7:s==='restricted'?5:0

const panX = ref(-300), panY = ref(-150), zoom = ref(2.2)
const isPanning = ref(false), hasPanned = ref(false)
let sx=0,sy=0,ox=0,oy=0
const onPanStart = (e:MouseEvent) => { isPanning.value=true;hasPanned.value=true;sx=e.clientX;sy=e.clientY;ox=panX.value;oy=panY.value }
const onPanMove = (e:MouseEvent) => { if(!isPanning.value)return;panX.value=ox+(e.clientX-sx);panY.value=oy+(e.clientY-sy) }
const onPanEnd = () => { isPanning.value=false }
const onWheel = (e:WheelEvent) => { zoom.value=Math.max(1.2,Math.min(5,zoom.value+(e.deltaY>0?-0.2:0.2))) }
</script>

<style scoped>
.root { flex:1; display:flex; flex-direction:column; overflow:hidden; }
.viewport { flex:1; min-height:0; overflow:hidden; cursor:grab; position:relative; background:#0d1b2a; }
.viewport.grabbing { cursor:grabbing; }
.hint { position:absolute; bottom:14px; left:50%; transform:translateX(-50%); font-size:10px; color:rgba(255,255,255,0.1); font-family:'JetBrains Mono',monospace; letter-spacing:0.08em; pointer-events:none; z-index:5; }
.hud-zoom { position:absolute; top:10px; right:16px; font-size:10px; color:rgba(180,210,240,0.18); font-family:'JetBrains Mono',monospace; pointer-events:none; z-index:5; }
.chart { width:100%; height:100%; will-change:transform; transition:transform 0.05s linear; }
.viewport.grabbing .chart { transition:none; }
.twy-on { cursor:pointer; transition:opacity 0.15s; }
.twy-on:hover { opacity:0.45; }
.bar { display:flex; align-items:center; justify-content:space-between; padding:7px 22px; flex-shrink:0; gap:14px; background:rgba(13,27,42,0.97); border-top:1px solid rgba(255,255,255,0.03); }
.notam { display:flex; align-items:center; gap:8px; font-size:10px; color:#6a7a8a; min-width:0; flex:1; padding:5px 12px; border-radius:5px; background:rgba(220,100,100,0.03); border:1px solid rgba(220,100,100,0.05); }
.notam.empty { color:#3a4a5a; background:transparent; border:none; }
.notam-badge { font-size:7px; font-weight:700; color:#fff; background:#d44; padding:1px 6px; border-radius:2px; letter-spacing:0.04em; flex-shrink:0; }
.notam-id { font-size:9px; font-weight:700; color:#d44; font-family:'JetBrains Mono',monospace; flex-shrink:0; }
.notam-text { font-size:10px; color:#8a9aaa; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.bar-right { display:flex; align-items:center; gap:10px; flex-shrink:0; }
.leg { display:flex; align-items:center; gap:4px; font-size:8px; color:#5a6a7a; }
.ld { display:inline-block; width:10px; height:3px; border-radius:2px; }
.div { color:rgba(255,255,255,0.06); }
.stat { font-size:9px; color:#5a6a7a; font-family:'JetBrains Mono',monospace; }
</style>
