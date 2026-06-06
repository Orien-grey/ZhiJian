// ============================================================
// 核心地图模块 — 模拟数据
// ============================================================

/** 航路点 */
export interface Waypoint {
  code: string
  name: string
  lng: number
  lat: number
}

/** 航路 */
export interface AirRoute {
  id: string
  name: string
  waypoints: string[] // 航路点 code 序列
}

/** 多边形限制区 */
export interface PolygonZone {
  id: string
  name: string
  type: 'prohibited' | 'restricted' | 'danger'
  coords: [number, number][]
  notams: ZoneNotam[]
}

/** 圆形限制区 */
export interface CircleZone {
  id: string
  name: string
  type: 'restricted' | 'danger'
  center: [number, number]
  radius: number // km
  notams: ZoneNotam[]
}

/** 限制区关联 NOTAM */
export interface ZoneNotam {
  notamId: string
  effectiveStart: string
  effectiveEnd: string
  altitudeLow: string
  altitudeHigh: string
  content: string
  affectedRoutes: string[]
}

/** FIR 边界 */
export interface FIRBoundary {
  name: string
  coords: [number, number][]
}

/** 悬浮统计卡 */
export interface MapStats {
  region: { name: string; count: number; change: number }[]
  notam24h: number
  activeProhibited: number
  international: { name: string; count: number }[]
}

// ==================== 航路点（50+ 覆盖全国，已去重） ====================
export const MOCK_WAYPOINTS: Waypoint[] = [
  { code: 'JTG', name: 'JTG', lng: 116.5, lat: 40.0 },
  { code: 'P249', name: 'P249', lng: 111.0, lat: 34.8 },
  { code: 'CKA', name: 'CKA', lng: 113.5, lat: 34.5 },
  { code: 'P406', name: 'P406', lng: 107.5, lat: 35.5 },
  { code: 'P142', name: 'P142', lng: 100.0, lat: 38.5 },
  { code: 'P407', name: 'P407', lng: 106.8, lat: 33.2 },
  { code: 'P303', name: 'P303', lng: 108.2, lat: 31.5 },
  { code: 'P250', name: 'P250', lng: 118.3, lat: 32.5 },
  { code: 'P60', name: 'P60', lng: 114.0, lat: 30.5 },
  { code: 'WHA', name: 'WHA', lng: 120.1, lat: 30.2 },
  { code: 'P17', name: 'P17', lng: 121.5, lat: 31.2 },
  { code: 'P53', name: 'P53', lng: 117.8, lat: 30.8 },
  { code: 'P54', name: 'P54', lng: 117.0, lat: 29.5 },
  { code: 'P270', name: 'P270', lng: 119.5, lat: 26.5 },
  { code: 'SHZ', name: 'SHZ', lng: 121.8, lat: 31.1 },
  { code: 'P44', name: 'P44', lng: 119.0, lat: 33.5 },
  { code: 'PIMOL', name: 'PIMOL', lng: 122.5, lat: 30.5 },
  { code: 'P84', name: 'P84', lng: 102.5, lat: 31.0 },
  { code: 'P472', name: 'P472', lng: 111.5, lat: 30.0 },
  { code: 'ENH', name: 'ENH', lng: 109.5, lat: 30.3 },
  { code: 'P49', name: 'P49', lng: 110.8, lat: 28.2 },
  { code: 'P470', name: 'P470', lng: 112.5, lat: 27.8 },
  { code: 'P120', name: 'P120', lng: 104.5, lat: 30.0 },
  { code: 'P126', name: 'P126', lng: 103.2, lat: 29.0 },
  { code: 'P122', name: 'P122', lng: 105.8, lat: 28.5 },
  { code: 'DS', name: 'DS', lng: 112.3, lat: 29.8 },
  { code: 'WXI', name: 'WXI', lng: 114.5, lat: 28.0 },
  { code: 'QF', name: 'QF', lng: 113.8, lat: 23.2 },
  { code: 'P454', name: 'P454', lng: 115.0, lat: 25.5 },
  { code: 'P508', name: 'P508', lng: 112.0, lat: 22.8 },
  { code: 'P268', name: 'P268', lng: 110.5, lat: 21.0 },
  { code: 'SAREX', name: 'SAREX', lng: 116.8, lat: 24.5 },
  { code: 'P321', name: 'P321', lng: 114.2, lat: 22.5 },
  { code: 'P293', name: 'P293', lng: 101.8, lat: 27.5 },
  { code: 'P73', name: 'P73', lng: 100.5, lat: 25.8 },
  { code: 'LJG', name: 'LJG', lng: 100.2, lat: 26.8 },
  { code: 'P140', name: 'P140', lng: 98.5, lat: 24.0 },
  { code: 'YBL', name: 'YBL', lng: 99.0, lat: 40.0 },
  { code: 'HMI', name: 'HMI', lng: 94.5, lat: 42.5 },
  { code: 'P169', name: 'P169', lng: 96.0, lat: 37.0 },
  { code: 'P87', name: 'P87', lng: 88.0, lat: 44.0 },
  { code: 'KCA', name: 'KCA', lng: 84.5, lat: 41.5 },
  { code: 'P206', name: 'P206', lng: 90.0, lat: 38.5 },
  { code: 'P23', name: 'P23', lng: 125.5, lat: 43.5 },
  { code: 'P10', name: 'P10', lng: 122.5, lat: 42.0 },
  { code: 'BM', name: 'BM', lng: 124.0, lat: 45.5 },
  { code: 'P432', name: 'P432', lng: 120.5, lat: 41.5 },
]

// ==================== 航路（20+ 条） ====================
export const MOCK_ROUTES: AirRoute[] = [
  { id: 'G212', name: 'G212', waypoints: ['JTG', 'P249', 'CKA', 'P250', 'P17'] },
  { id: 'B330', name: 'B330', waypoints: ['P406', 'P407', 'ENH', 'P49', 'P470', 'P454'] },
  { id: 'A593', name: 'A593', waypoints: ['P250', 'P53', 'WHA', 'P54', 'PIMOL'] },
  { id: 'A461', name: 'A461', waypoints: ['JTG', 'CKA', 'P60', 'QF', 'P454'] },
  { id: 'B215', name: 'B215', waypoints: ['P142', 'P406', 'P249'] },
  { id: 'R473', name: 'R473', waypoints: ['P60', 'QF', 'P270'] },
  { id: 'W77', name: 'W77', waypoints: ['P303', 'P126', 'P122'] },
  { id: 'G471', name: 'G471', waypoints: ['P126', 'P84', 'P472', 'P49'] },
  { id: 'W161', name: 'W161', waypoints: ['P53', 'P54', 'P270'] },
  { id: 'A588', name: 'A588', waypoints: ['BM', 'P23', 'P10', 'P432', 'P17'] },
  { id: 'G341', name: 'G341', waypoints: ['JTG', 'P432', 'P10', 'P23', 'BM'] },
  { id: 'B208', name: 'B208', waypoints: ['P249', 'CKA', 'DS', 'P470'] },
  { id: 'A581', name: 'A581', waypoints: ['P122', 'P49', 'WXI', 'P470', 'P454'] },
  { id: 'W527', name: 'W527', waypoints: ['ENH', 'P472', 'DS', 'P60'] },
  { id: 'G327', name: 'G327', waypoints: ['P44', 'P250', 'P53', 'WHA'] },
  { id: 'W554', name: 'W554', waypoints: ['WHA', 'P54', 'P270', 'SAREX'] },
  { id: 'A470', name: 'A470', waypoints: ['P250', 'P44', 'P17', 'SHZ', 'PIMOL'] },
  { id: 'B451', name: 'B451', waypoints: ['KCA', 'P87', 'HMI', 'P169', 'P142'] },
  { id: 'W187', name: 'W187', waypoints: ['YBL', 'HMI', 'P206', 'P169'] },
  { id: 'R339', name: 'R339', waypoints: ['P293', 'LJG', 'P73', 'P140'] },
  { id: 'W206', name: 'W206', waypoints: ['BM', 'P23', 'P10'] },
]

// ==================== 多边形限制区（6 个） ====================
export const MOCK_POLYGON_ZONES: PolygonZone[] = [
  {
    id: 'OVLAR', name: 'OVLAR 禁航区', type: 'prohibited',
    coords: [[106.5,33.5],[108.5,34.0],[109.0,32.8],[107.6,32.2],[106.0,32.5],[106.5,33.5]],
    notams: [{ notamId:'A2275/26', effectiveStart:'2025-06-05 08:00', effectiveEnd:'2025-06-06 08:00', altitudeLow:'FL100', altitudeHigh:'FL360', content:'军事演习区域，禁止民用航空器进入。涉及 G212/B330 航路部分航段需绕飞。', affectedRoutes:['G212','B330'] }],
  },
  {
    id: 'KAGSO', name: 'KAGSO 禁航区', type: 'prohibited',
    coords: [[117.0,30.0],[119.5,30.8],[120.0,29.2],[118.0,28.5],[116.5,29.0],[117.0,30.0]],
    notams: [{ notamId:'A2276/26', effectiveStart:'2025-06-05 10:00', effectiveEnd:'2025-06-05 16:00', altitudeLow:'FL150', altitudeHigh:'FL280', content:'火箭发射禁航区。A593/W161 航路受影响，建议使用 A470 替代。', affectedRoutes:['A593','W161'] }],
  },
  {
    id: 'POVEL', name: 'POVEL 禁航区', type: 'prohibited',
    coords: [[103.0,28.5],[105.5,29.5],[106.5,28.0],[104.5,27.0],[102.5,27.5],[103.0,28.5]],
    notams: [{ notamId:'A2280/26', effectiveStart:'2025-06-05 06:00', effectiveEnd:'2025-06-06 06:00', altitudeLow:'FL050', altitudeHigh:'FL300', content:'导弹测试区域。W77/G471 航路需重新规划，建议经由 B330 绕飞。', affectedRoutes:['W77','G471'] }],
  },
  {
    id: 'TAMEG', name: 'TAMEG 限制区', type: 'restricted',
    coords: [[119.5,26.5],[122.0,27.5],[123.0,26.0],[121.5,25.0],[119.0,25.2],[119.5,26.5]],
    notams: [{ notamId:'A2281/26', effectiveStart:'2025-06-05 12:00', effectiveEnd:'2025-06-05 20:00', altitudeLow:'GND', altitudeHigh:'FL150', content:'海峡联合军演。R473/W554 航路受影响，建议经 A470 绕飞。', affectedRoutes:['R473','W554'] }],
  },
  {
    id: 'LATUX', name: 'LATUX 限制区', type: 'restricted',
    coords: [[88.0,42.0],[92.0,43.5],[93.0,41.5],[90.5,40.0],[88.5,40.5],[88.0,42.0]],
    notams: [{ notamId:'A2282/26', effectiveStart:'2025-06-05 02:00', effectiveEnd:'2025-06-05 12:00', altitudeLow:'FL100', altitudeHigh:'FL350', content:'西北大型无人机测试空域。B451/W187 航路受影响。', affectedRoutes:['B451','W187'] }],
  },
  {
    id: 'NURDA', name: 'NURDA 禁航区', type: 'prohibited',
    coords: [[122.0,42.0],[125.5,43.5],[126.5,41.5],[124.0,40.0],[121.5,40.8],[122.0,42.0]],
    notams: [{ notamId:'A2283/26', effectiveStart:'2025-06-05 14:00', effectiveEnd:'2025-06-06 02:00', altitudeLow:'GND', altitudeHigh:'FL250', content:'东北军区实弹演习。A588/G341/W206 航路全面限制。', affectedRoutes:['A588','G341','W206'] }],
  },
]

// ==================== 圆形限制区（6 个） ====================
export const MOCK_CIRCLE_ZONES: CircleZone[] = [
  {
    id: 'ZR002', name: 'ZR002 限制区', type: 'restricted', center: [114.5,34.8], radius: 80,
    notams: [{ notamId:'A2277/26', effectiveStart:'2025-06-05 06:00', effectiveEnd:'2025-06-05 18:00', altitudeLow:'GND', altitudeHigh:'FL200', content:'空军实弹射击训练，半径 80km 范围内限制通行。', affectedRoutes:['A461','B215'] }],
  },
  {
    id: 'ZR008', name: 'ZR008 限制区', type: 'danger', center: [109.0,28.5], radius: 60,
    notams: [{ notamId:'A2278/26', effectiveStart:'2025-06-05 04:00', effectiveEnd:'2025-06-05 14:00', altitudeLow:'FL050', altitudeHigh:'FL250', content:'无人机集群测试区域，半径 60km，注意避让。', affectedRoutes:['B330','G471'] }],
  },
  {
    id: 'ZR015', name: 'ZR015 限制区', type: 'restricted', center: [121.0,31.5], radius: 50,
    notams: [{ notamId:'A2284/26', effectiveStart:'2025-06-05 08:00', effectiveEnd:'2025-06-05 16:00', altitudeLow:'FL100', altitudeHigh:'FL280', content:'上海终端区雷达校准测试。A593/G327/A470 航路注意高度限制。', affectedRoutes:['A593','G327','A470'] }],
  },
  {
    id: 'ZR022', name: 'ZR022 限制区', type: 'danger', center: [112.5,23.5], radius: 45,
    notams: [{ notamId:'A2285/26', effectiveStart:'2025-06-05 10:00', effectiveEnd:'2025-06-05 22:00', altitudeLow:'GND', altitudeHigh:'FL180', content:'珠海航展飞行表演区域。A461/R473 需临时改航。', affectedRoutes:['A461','R473'] }],
  },
  {
    id: 'ZR031', name: 'ZR031 限制区', type: 'restricted', center: [102.8,30.5], radius: 70,
    notams: [{ notamId:'A2286/26', effectiveStart:'2025-06-05 06:00', effectiveEnd:'2025-06-06 06:00', altitudeLow:'FL150', altitudeHigh:'FL350', content:'川西高原电子战演习。W77/B330/G471 航路受影响。', affectedRoutes:['W77','B330','G471'] }],
  },
  {
    id: 'ZR045', name: 'ZR045 限制区', type: 'danger', center: [100.5,38.0], radius: 55,
    notams: [{ notamId:'A2287/26', effectiveStart:'2025-06-05 18:00', effectiveEnd:'2025-06-06 06:00', altitudeLow:'FL200', altitudeHigh:'FL400', content:'夜间高空火箭探测实验。B215 航路需绕飞。', affectedRoutes:['B215'] }],
  },
]

// ==================== FIR 情报区 ====================
export const MOCK_FIR_BOUNDARIES: FIRBoundary[] = [
  {
    name: '北京 FIR',
    coords: [
      [113.5, 41.0], [120.0, 41.0], [125.0, 38.0], [122.0, 35.0], [118.0, 34.5], [114.0, 36.5], [113.5, 41.0],
    ],
  },
  {
    name: '上海 FIR',
    coords: [
      [118.0, 34.5], [122.0, 35.0], [125.0, 32.0], [124.0, 28.0], [120.0, 27.0], [117.0, 29.0], [118.0, 34.5],
    ],
  },
  {
    name: '广州 FIR',
    coords: [
      [117.0, 29.0], [120.0, 27.0], [116.0, 21.0], [110.0, 21.0], [108.0, 26.0], [111.0, 28.0], [117.0, 29.0],
    ],
  },
  {
    name: '昆明 FIR',
    coords: [
      [108.0, 26.0], [110.0, 21.0], [104.0, 21.0], [98.0, 24.0], [100.0, 28.0], [105.0, 28.0], [108.0, 26.0],
    ],
  },
  {
    name: '乌鲁木齐 FIR',
    coords: [
      [98.0, 24.0], [104.0, 21.0], [97.0, 35.0], [82.0, 48.0], [76.0, 48.0], [76.0, 40.0], [86.0, 36.0], [98.0, 24.0],
    ],
  },
]

// ==================== 悬浮统计卡 ====================
export const MOCK_MAP_STATS: MapStats = {
  region: [
    { name: '总局', count: 12, change: 2 },
    { name: '华东', count: 8, change: -3 },
    { name: '新疆', count: 5, change: 1 },
    { name: '西北', count: 4, change: 0 },
  ],
  notam24h: 87,
  activeProhibited: 15,
  international: [
    { name: '俄罗斯', count: 6 },
    { name: '哈萨克', count: 3 },
    { name: '日本', count: 4 },
  ],
}
