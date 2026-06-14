// ============================================================
// 航行情报动态信息看板 — 模拟数据
// ============================================================

/** 告警严重级别 */
export type AlertSeverity = 'critical' | 'warning' | 'info'

/** 航行通告告警实体 */
export interface AeroAlert {
  id: string
  timestamp: string // ISO datetime
  severity: AlertSeverity
  notamType: string // NOTAM 类型标签
  title: string
  airportIcao: string // 机场 ICAO 四字码
  airportName: string // 机场中文名
  region: string // 所属地区
  coordinates: [number, number] // [lng, lat]
  summary: string // 简短摘要
  rawNotam: string // 原始 NOTAM 文本
  affectedRoutes: string[] // 受影响航路
  validityStart: string // 生效时间
  validityEnd: string // 失效时间
  isNew: boolean // 是否为新告警（用于高亮动画）
  source: string // 情报来源
}

/** 仪表板核心统计 */
export interface DashboardStats {
  totalAlerts24h: number
  activeNotams: number
  affectedAirports: number
  affectedRoutes: number
  avgRiskLevel: string
  criticalCount: number
  warningCount: number
  infoCount: number
  parseRate: number
  systemUptime: string
  alertsPerHour: number
  avgResponseTime: string
}

/** 地区热力数据 */
export interface RegionHotData {
  name: string
  alertCount: number
  criticalCount: number
  coordinates: [number, number]
}

/** 系统状态指标 */
export interface SystemMetric {
  label: string
  value: string
  status: 'normal' | 'degraded' | 'critical'
  icon: string
  detail: string
}

// ---- 模拟告警数据池 ----

const NOW = new Date()

function ago(minutes: number): string {
  return new Date(NOW.getTime() - minutes * 60_000).toISOString()
}

export const MOCK_ALERTS: AeroAlert[] = [
  // ── CRITICAL 级别 ──
  {
    id: 'ALT-20260605-001',
    timestamp: ago(3),
    severity: 'critical',
    notamType: '跑道关闭',
    title: 'ZBAA 跑道 36R/18L 因施工关闭',
    airportIcao: 'ZBAA',
    airportName: '北京首都',
    region: '华北',
    coordinates: [116.585, 40.073],
    summary: '北京首都国际机场 36R/18L 跑道因紧急维护施工关闭，预计持续 4 小时，影响进离场航班。',
    rawNotam: 'A2253/26 NOTAMN\nQ) ZBPE/QMRLC/IV/NBO/A/000/999/4004N11636E005\nA) ZBAA B) 2606050800 C) 2606051200\nE) RWY 36R/18L CLSD DUE TO MAINTENANCE.',
    affectedRoutes: ['G212', 'B215', 'A461'],
    validityStart: ago(-60),
    validityEnd: ago(-240),
    isNew: true,
    source: 'CAAC NOTAM Office',
  },
  {
    id: 'ALT-20260605-002',
    timestamp: ago(12),
    severity: 'critical',
    notamType: '导航设施故障',
    title: 'ZSSS ILS 18L 下滑道不可用',
    airportIcao: 'ZSSS',
    airportName: '上海虹桥',
    region: '华东',
    coordinates: [121.336, 31.198],
    summary: '上海虹桥机场 18L 跑道 ILS 仪表着陆系统下滑道故障，已发布 II 类运行限制。',
    rawNotam: 'A2254/26 NOTAMN\nQ) ZSHA/QICAS/IV/BO/A/000/999/3112N12120E005\nA) ZSSS B) 2606050600 C) 2606061800\nE) ILS RWY 18L GP U/S.',
    affectedRoutes: ['A593', 'B221', 'W161'],
    validityStart: ago(-120),
    validityEnd: ago(-1080),
    isNew: true,
    source: 'CAAC NOTAM Office',
  },
  {
    id: 'ALT-20260605-003',
    timestamp: ago(25),
    severity: 'critical',
    notamType: '空域限制',
    title: 'ZGGG 周边空域军事活动限制',
    airportIcao: 'ZGGG',
    airportName: '广州白云',
    region: '华南',
    coordinates: [113.300, 23.393],
    summary: '广州白云机场周边空域因军事演习实施临时限制，20 海里范围内禁止民用航空器进入。',
    rawNotam: 'A2255/26 NOTAMN\nQ) ZGZU/QARLT/IV/NBO/E/000/999/2324N11318E020\nA) ZGGG B) 2606051000 C) 2606051600\nE) AIRSPACE RESTRICTED DUE TO MILITARY EXERCISE WITHIN 20NM RADIUS.',
    affectedRoutes: ['A461', 'G471', 'R473'],
    validityStart: ago(-180),
    validityEnd: ago(-540),
    isNew: true,
    source: 'CAAC NOTAM Office',
  },
  {
    id: 'ALT-20260605-004',
    timestamp: ago(45),
    severity: 'critical',
    notamType: '鸟击预警',
    title: 'ZUUU 机场鸟击风险等级提升至 IV 级',
    airportIcao: 'ZUUU',
    airportName: '成都双流',
    region: '西南',
    coordinates: [103.947, 30.579],
    summary: '成都双流机场及周边区域观测到大型候鸟群活动，鸟击风险等级升至 IV 级（最高级）。',
    rawNotam: 'A2256/26 NOTAMN\nQ) ZUUU/QFALT/IV/NBO/A/000/999/3035N10357E005\nA) ZUUU B) 2606050400 C) 2606060400\nE) BIRD ACTIVITY REPORTED. BIRD STRIKE RISK LEVEL IV.',
    affectedRoutes: ['B330', 'G212', 'W527'],
    validityStart: ago(-300),
    validityEnd: ago(-1740),
    isNew: false,
    source: 'CAAC NOTAM Office',
  },
  // ── WARNING 级别 ──
  {
    id: 'ALT-20260605-005',
    timestamp: ago(18),
    severity: 'warning',
    notamType: '气象预警',
    title: '华东区域大范围雷暴预警',
    airportIcao: 'ZSSS',
    airportName: '上海虹桥',
    region: '华东',
    coordinates: [121.336, 31.198],
    summary: '华东区域预计未来 6 小时内有强雷暴天气，可能影响上海、南京、杭州等机场起降。',
    rawNotam: 'A2257/26 NOTAMN\nQ) ZSHA/QWELW/IV/BO/W/000/999/3112N12120E200\nA) ZSSS B) 2606050200 C) 2606050800\nE) SEVERE THUNDERSTORM FORECAST WITHIN 200NM RADIUS.',
    affectedRoutes: ['A593', 'B221', 'W161', 'G327'],
    validityStart: ago(-240),
    validityEnd: ago(-600),
    isNew: true,
    source: 'CAAC NOTAM Office',
  },
  {
    id: 'ALT-20260605-006',
    timestamp: ago(35),
    severity: 'warning',
    notamType: '助航灯光',
    title: 'ZUCK 02L 跑道 PAPI 灯故障',
    airportIcao: 'ZUCK',
    airportName: '重庆江北',
    region: '西南',
    coordinates: [106.642, 29.719],
    summary: '重庆江北机场 02L 跑道精密进近航道指示器（PAPI）故障，夜间运行受限。',
    rawNotam: 'A2258/26 NOTAMN\nQ) ZUCK/QIDAS/IV/NBO/A/000/999/2943N10639E005\nA) ZUCK B) 2606050200 C) 2606070200\nE) PAPI RWY 02L U/S. NIGHT OPS RESTRICTED.',
    affectedRoutes: ['B330', 'G212'],
    validityStart: ago(-240),
    validityEnd: ago(-2880),
    isNew: false,
    source: 'CAAC NOTAM Office',
  },
  {
    id: 'ALT-20260605-007',
    timestamp: ago(55),
    severity: 'warning',
    notamType: '跑道状况',
    title: 'ZLXY 跑道摩擦系数低于标准',
    airportIcao: 'ZLXY',
    airportName: '西安咸阳',
    region: '西北',
    coordinates: [108.754, 34.446],
    summary: '西安咸阳机场跑道因持续降雨导致摩擦系数低于标准值，机组需注意着陆距离评估。',
    rawNotam: 'A2259/26 NOTAMN\nQ) ZLXY/QMRLC/IV/NBO/A/000/999/3426N10845E005\nA) ZLXY B) 2606050300 C) 2606060300\nE) RWY FRICTION COEFFICIENT BELOW STANDARD DUE TO RAIN.',
    affectedRoutes: ['G212', 'B215'],
    validityStart: ago(-180),
    validityEnd: ago(-1620),
    isNew: false,
    source: 'CAAC NOTAM Office',
  },
  {
    id: 'ALT-20260605-008',
    timestamp: ago(65),
    severity: 'warning',
    notamType: '通信设施',
    title: 'ZHCC 塔台备用频率启用',
    airportIcao: 'ZHCC',
    airportName: '郑州新郑',
    region: '华中',
    coordinates: [113.842, 34.521],
    summary: '郑州新郑机场塔台主用 VHF 频率设备维护，启用备用频率 118.75 MHz。',
    rawNotam: 'A2260/26 NOTAMN\nQ) ZHCC/QCOAS/IV/BO/AE/000/999/3431N11350E005\nA) ZHCC B) 2606050400 C) 2606051000\nE) TWR PRIMARY FREQ MAINTENANCE. SECONDARY FREQ 118.75MHZ ACTIVATED.',
    affectedRoutes: ['A461', 'B208'],
    validityStart: ago(-120),
    validityEnd: ago(-480),
    isNew: false,
    source: 'CAAC NOTAM Office',
  },
  {
    id: 'ALT-20260605-009',
    timestamp: ago(90),
    severity: 'warning',
    notamType: '滑行道关闭',
    title: 'ZBTJ 部分滑行道临时关闭',
    airportIcao: 'ZBTJ',
    airportName: '天津滨海',
    region: '华北',
    coordinates: [117.347, 39.127],
    summary: '天津滨海机场滑行道 TWY E 和 TWY F 因除冰液污染暂时关闭清理。',
    rawNotam: 'A2261/26 NOTAMN\nQ) ZBTJ/QMXLC/IV/M/A/000/999/3907N11720E005\nA) ZBTJ B) 2606050500 C) 2606050900\nE) TWY E AND TWY F CLOSED DUE TO DE-ICING FLUID CONTAMINATION.',
    affectedRoutes: ['G212'],
    validityStart: ago(-60),
    validityEnd: ago(-300),
    isNew: false,
    source: 'CAAC NOTAM Office',
  },
  {
    id: 'ALT-20260605-010',
    timestamp: ago(110),
    severity: 'warning',
    notamType: '火山灰预警',
    title: '东北区域火山灰云漂移预警',
    airportIcao: 'ZYTL',
    airportName: '大连周水子',
    region: '东北',
    coordinates: [121.540, 38.965],
    summary: '勘察加半岛火山喷发形成的火山灰云正向西南方向漂移，预计 12 小时内影响东北空域。',
    rawNotam: 'A2262/26 NOTAMN\nQ) ZYTL/QWELW/IV/BO/W/000/999/3858N12132E300\nA) ZYTL B) 2606050300 C) 2606051500\nE) VOLCANIC ASH CLOUD DRIFTING SW. EXPECTED TO AFFECT NE AIRSPACE.',
    affectedRoutes: ['A588', 'G341', 'W206'],
    validityStart: ago(-180),
    validityEnd: ago(-900),
    isNew: false,
    source: 'CAAC NOTAM Office',
  },
  // ── INFO 级别 ──
  {
    id: 'ALT-20260605-011',
    timestamp: ago(8),
    severity: 'info',
    notamType: '导航台维护',
    title: 'ZSAM VOR/DME 定期维护',
    airportIcao: 'ZSAM',
    airportName: '厦门高崎',
    region: '华东',
    coordinates: [118.129, 24.546],
    summary: '厦门高崎机场 VOR/DME 导航台按计划进行定期维护，期间可能降低信号覆盖范围。',
    rawNotam: 'A2263/26 NOTAMN\nQ) ZSAM/QNMAS/IV/BO/AE/000/999/2433N11807E005\nA) ZSAM B) 2606050200 C) 2606050800\nE) VOR/DME SCHEDULED MAINTENANCE. SIGNAL COVERAGE MAY BE REDUCED.',
    affectedRoutes: ['A470', 'G581'],
    validityStart: ago(-240),
    validityEnd: ago(-480),
    isNew: true,
    source: 'CAAC NOTAM Office',
  },
  {
    id: 'ALT-20260605-012',
    timestamp: ago(22),
    severity: 'info',
    notamType: '跑道检查',
    title: 'ZSNJ 跑道例行摩擦测试',
    airportIcao: 'ZSNJ',
    airportName: '南京禄口',
    region: '华东',
    coordinates: [118.860, 31.742],
    summary: '南京禄口机场按计划进行跑道摩擦系数例行测试，跑道 06/24 测试期间短暂封闭。',
    rawNotam: 'A2264/26 NOTAMN\nQ) ZSNJ/QMRLC/IV/BO/A/000/999/3144N11852E005\nA) ZSNJ B) 2606050600 C) 2606050730\nE) RWY 06/24 SCHEDULED FRICTION TEST. SHORT TERM CLOSURE EXPECTED.',
    affectedRoutes: ['A593', 'B221'],
    validityStart: ago(-30),
    validityEnd: ago(-90),
    isNew: true,
    source: 'CAAC NOTAM Office',
  },
  {
    id: 'ALT-20260605-013',
    timestamp: ago(40),
    severity: 'info',
    notamType: '燃油供应',
    title: 'ZSHC 航空燃油供应调整通知',
    airportIcao: 'ZSHC',
    airportName: '杭州萧山',
    region: '华东',
    coordinates: [120.432, 30.229],
    summary: '杭州萧山机场因管道维护，航空燃油 JET A-1 暂时由罐车供应，建议机组提前申请加油。',
    rawNotam: 'A2265/26 NOTAMN\nQ) ZSHC/QFULT/IV/NBO/A/000/999/3014N12026E005\nA) ZSHC B) 2606050000 C) 2606060000\nE) JET A-1 FUEL SUPPLY BY TANKER ONLY DUE TO PIPELINE MAINTENANCE.',
    affectedRoutes: ['A593', 'W554'],
    validityStart: ago(-300),
    validityEnd: ago(-1740),
    isNew: false,
    source: 'CAAC NOTAM Office',
  },
  {
    id: 'ALT-20260605-014',
    timestamp: ago(70),
    severity: 'info',
    notamType: '机位调整',
    title: 'ZGSZ 部分停机位临时调整',
    airportIcao: 'ZGSZ',
    airportName: '深圳宝安',
    region: '华南',
    coordinates: [113.811, 22.640],
    summary: '深圳宝安机场 T3 航站楼 301-308 号停机位因廊桥维修临时关闭，由远机位替代。',
    rawNotam: 'A2266/26 NOTAMN\nQ) ZGSZ/QMPLC/IV/BO/A/000/999/2238N11349E005\nA) ZGSZ B) 2606050100 C) 2606051300\nE) STANDS 301-308 CLOSED DUE TO JETBRIDGE MAINTENANCE. REMOTE STANDS ASSIGNED.',
    affectedRoutes: ['A461', 'R473'],
    validityStart: ago(-240),
    validityEnd: ago(-900),
    isNew: false,
    source: 'CAAC NOTAM Office',
  },
  {
    id: 'ALT-20260605-015',
    timestamp: ago(95),
    severity: 'info',
    notamType: '气象信息',
    title: 'ZUWX 机场能见度趋势通报',
    airportIcao: 'ZUWX',
    airportName: '万州五桥',
    region: '西南',
    coordinates: [108.423, 30.801],
    summary: '万州五桥机场早晨时段可能受辐射雾影响，能见度预计在 800-1500 米之间波动。',
    rawNotam: 'A2267/26 NOTAMN\nQ) ZUWX/QWELW/IV/BO/W/000/999/3048N10825E005\nA) ZUWX B) 2606052200 C) 2606060300\nE) RADIATION FOG EXPECTED. VISIBILITY 800-1500M DURING MORNING HOURS.',
    affectedRoutes: ['G212'],
    validityStart: ago(-480),
    validityEnd: ago(-780),
    isNew: false,
    source: 'CAAC NOTAM Office',
  },
  // ── 更多动态告警 ──
  {
    id: 'ALT-20260605-016',
    timestamp: ago(5),
    severity: 'critical',
    notamType: '紧急通告',
    title: 'ZPPP 机场紧急救援演练',
    airportIcao: 'ZPPP',
    airportName: '昆明长水',
    region: '西南',
    coordinates: [102.919, 25.101],
    summary: '昆明长水机场正在进行大规模紧急救援演练，部分区域限制通行，请注意听从引导。',
    rawNotam: 'A2268/26 NOTAMN\nQ) ZPPP/QFALT/IV/NBO/A/000/999/2506N10255E005\nA) ZPPP B) 2606050700 C) 2606051000\nE) EMERGENCY RESCUE EXERCISE IN PROGRESS. PARTIAL AREA ACCESS RESTRICTED.',
    affectedRoutes: ['A581', 'G471', 'W155'],
    validityStart: ago(-30),
    validityEnd: ago(-180),
    isNew: true,
    source: 'CAAC NOTAM Office',
  },
  {
    id: 'ALT-20260605-017',
    timestamp: ago(15),
    severity: 'info',
    notamType: 'RNAV 程序',
    title: 'ZYTX 新增 RNAV SID 程序',
    airportIcao: 'ZYTX',
    airportName: '沈阳桃仙',
    region: '东北',
    coordinates: [123.493, 41.640],
    summary: '沈阳桃仙机场发布全新 RNAV SID 标准仪表离场程序，旧程序同步作废，请更新导航数据库。',
    rawNotam: 'A2269/26 NOTAMN\nQ) ZYTX/QPDCH/IV/NBO/AE/000/999/4138N12329E005\nA) ZYTX B) 2606050000 C) PERM\nE) NEW RNAV SID PROCEDURES PUBLISHED. OLD PROCEDURES CANCELLED.',
    affectedRoutes: ['A588', 'G341'],
    validityStart: ago(-300),
    validityEnd: 'PERMANENT',
    isNew: true,
    source: 'CAAC NOTAM Office',
  },
  {
    id: 'ALT-20260605-018',
    timestamp: ago(30),
    severity: 'warning',
    notamType: 'GPS 干扰',
    title: 'ZUGY 区域 GNSS 信号异常报告',
    airportIcao: 'ZUGY',
    airportName: '贵阳龙洞堡',
    region: '西南',
    coordinates: [106.802, 26.539],
    summary: '贵阳机场附近区域收到 GNSS/GPS 信号异常报告，建议机组在终端区优先使用地面导航设施。',
    rawNotam: 'A2270/26 NOTAMN\nQ) ZUGY/QGWAS/IV/NBO/W/000/999/2632N10648E030\nA) ZUGY B) 2606050300 C) 2606051500\nE) GNSS SIGNAL ANOMALY REPORTED WITHIN 30NM. USE GROUND-BASED NAVIGATION.',
    affectedRoutes: ['A581', 'W181'],
    validityStart: ago(-150),
    validityEnd: ago(-900),
    isNew: false,
    source: 'CAAC NOTAM Office',
  },
  {
    id: 'ALT-20260605-019',
    timestamp: ago(50),
    severity: 'info',
    notamType: 'NOTAM 汇总',
    title: '华北区域 NOTAM 定期汇总发布',
    airportIcao: 'ZBAA',
    airportName: '北京首都',
    region: '华北',
    coordinates: [116.585, 40.073],
    summary: '华北空管局发布本周例行 NOTAM 信息汇总，包含 12 条持续有效的航行通告，请各单位查阅。',
    rawNotam: 'A2271/26 NOTAMN\nQ) ZBPE/QXXXX/IV/NBO/AE/000/999/4004N11636E300\nA) ZBAA B) 2606050000 C) 2606120000\nE) WEEKLY NOTAM SUMMARY PUBLISHED. 12 ACTIVE NOTAMS INCLUDED.',
    affectedRoutes: ['G212', 'B215', 'A461', 'W77'],
    validityStart: ago(-300),
    validityEnd: ago(-10080),
    isNew: false,
    source: 'CAAC NOTAM Office',
  },
  {
    id: 'ALT-20260605-020',
    timestamp: ago(80),
    severity: 'warning',
    notamType: '无人机活动',
    title: 'ZBNY 周边发现未经授权无人机活动',
    airportIcao: 'ZBNY',
    airportName: '北京南苑',
    region: '华北',
    coordinates: [116.389, 39.784],
    summary: '南苑机场周边 5 公里范围内发现未经授权无人机活动，已通报相关单位进行处置。',
    rawNotam: 'A2272/26 NOTAMN\nQ) ZBNY/QWULW/IV/BO/W/000/999/3947N11623E005\nA) ZBNY B) 2606050500 C) 2606050900\nE) UNAUTHORIZED UAS ACTIVITY REPORTED WITHIN 5KM RADIUS.',
    affectedRoutes: ['G212'],
    validityStart: ago(-60),
    validityEnd: ago(-240),
    isNew: false,
    source: 'CAAC NOTAM Office',
  },
]

// ---- 仪表板统计 ----

export const MOCK_STATS: DashboardStats = {
  totalAlerts24h: 87,
  activeNotams: 43,
  affectedAirports: 18,
  affectedRoutes: 26,
  avgRiskLevel: 'II 级',
  criticalCount: 4,
  warningCount: 9,
  infoCount: 7,
  parseRate: 97.8,
  systemUptime: '99.97%',
  alertsPerHour: 6.2,
  avgResponseTime: '1.8s',
}

// ---- 地区热度 ----

export const REGION_HOTDATA: RegionHotData[] = [
  { name: '华北', alertCount: 18, criticalCount: 3, coordinates: [116.405, 39.905] },
  { name: '华东', alertCount: 31, criticalCount: 5, coordinates: [121.474, 31.230] },
  { name: '华南', alertCount: 15, criticalCount: 2, coordinates: [113.265, 23.130] },
  { name: '西南', alertCount: 22, criticalCount: 4, coordinates: [104.066, 30.573] },
  { name: '西北', alertCount: 9, criticalCount: 1, coordinates: [108.948, 34.263] },
  { name: '华中', alertCount: 13, criticalCount: 1, coordinates: [113.666, 34.758] },
  { name: '东北', alertCount: 11, criticalCount: 1, coordinates: [123.432, 41.806] },
]

// ---- 系统指标 ----

export const SYSTEM_METRICS: SystemMetric[] = [
  { label: 'NOTAM 解析引擎', value: '正常', status: 'normal', icon: 'cpu', detail: '多智能体协同解析中 · 平均延迟 1.8s' },
  { label: '数据同步管道', value: '正常', status: 'normal', icon: 'sync', detail: '实时同步 CAAC/AIS 数据源 · 延迟 < 500ms' },
  { label: '地理信息系统', value: '正常', status: 'normal', icon: 'map', detail: 'GIS 图层渲染正常 · WGS-84 坐标系' },
  { label: '告警规则引擎', value: '正常', status: 'normal', icon: 'bell', detail: '42 条规则运行中 · 最近触发: 3 分钟前' },
  { label: 'AI 模型服务', value: '降级', status: 'degraded', icon: 'brain', detail: '备用模型响应中 · 主模型配额已恢复' },
  { label: '消息推送服务', value: '正常', status: 'normal', icon: 'send', detail: '已推送 156 条通知 · 送达率 99.2%' },
]

// ---- 24小时告警趋势 ----

export function generateHourlyTrend(): { hour: string; count: number }[] {
  const hours = Array.from({ length: 24 }, (_, i) => {
    const h = i.toString().padStart(2, '0')
    return { hour: `${h}:00Z`, count: Math.floor(Math.random() * 8) + 1 }
  })
  // 模拟早晚高峰
  hours[2].count += 3
  hours[3].count += 4
  hours[14].count += 5
  hours[15].count += 3
  hours[22].count += 2
  return hours
}

// ---- 模拟实时数据流生成器 ----

export function* alertStreamGenerator(): Generator<AeroAlert> {
  const extraAlerts: Partial<AeroAlert>[] = [
    { severity: 'info', notamType: '例行通报', title: 'ZBYN 定期维护计划更新', airportIcao: 'ZBYN', airportName: '太原武宿', region: '华北', coordinates: [112.635, 37.753], summary: '太原武宿机场更新下周定期维护计划，涉及跑道灯光系统例行检查。' },
    { severity: 'warning', notamType: '低空风切变', title: 'ZBCZ 低空风切变预警', airportIcao: 'ZBCZ', airportName: '长治王村', region: '华北', coordinates: [113.127, 36.247], summary: '长治王村机场终端区探测到低空风切变，建议进近机组注意复飞准备。' },
    { severity: 'info', notamType: '情报更新', title: 'ZSWX 航行资料更新提示', airportIcao: 'ZSWX', airportName: '无锡硕放', region: '华东', coordinates: [120.429, 31.494], summary: '无锡硕放机场航行资料汇编（AIP）已更新至 2026-06 版，包含新的进离场程序。' },
    { severity: 'warning', notamType: '空域容量', title: 'ZSPD 终端区流量管理启动', airportIcao: 'ZSPD', airportName: '上海浦东', region: '华东', coordinates: [121.806, 31.144], summary: '上海浦东机场因天气原因启动终端区流量管理，预计小时容量降低 20%。' },
    { severity: 'info', notamType: '设施信息', title: 'ZHHH 新建停机坪启用', airportIcao: 'ZHHH', airportName: '武汉天河', region: '华中', coordinates: [114.210, 30.784], summary: '武汉天河机场新建 12 个停机位正式投入使用，编号 SP 401-412。' },
    { severity: 'critical', notamType: '紧急关闭', title: 'ZJHK 机场临时关闭', airportIcao: 'ZJHK', airportName: '海口美兰', region: '华南', coordinates: [110.462, 19.939], summary: '海口美兰机场因台风预警临时关闭，预计关闭至明日上午 0800Z。' },
  ]

  let index = 0
  while (true) {
    const tpl = extraAlerts[index % extraAlerts.length]
    yield {
      id: `ALT-STREAM-${Date.now()}-${index}`,
      timestamp: new Date().toISOString(),
      severity: tpl.severity as AlertSeverity,
      notamType: tpl.notamType!,
      title: tpl.title!,
      airportIcao: tpl.airportIcao!,
      airportName: tpl.airportName!,
      region: tpl.region!,
      coordinates: tpl.coordinates as [number, number],
      summary: tpl.summary!,
      rawNotam: `STREAM ${index + 1}`,
      affectedRoutes: [],
      validityStart: new Date().toISOString(),
      validityEnd: new Date(Date.now() + 4 * 3600_000).toISOString(),
      isNew: true,
      source: 'CAAC NOTAM Office',
    }
    index++
  }
}
