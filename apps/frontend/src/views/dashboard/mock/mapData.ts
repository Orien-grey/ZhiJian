// ============================================================
// 核心地图模块 — 真实风格航行情报数据
// 航路点参照 ICAO 五字码命名规范，航路使用真实中国空域设计
// ============================================================

export interface Waypoint { code: string; name: string; lng: number; lat: number }
export interface AirRoute { id: string; name: string; waypoints: string[] }
export interface PolygonZone { id: string; name: string; type: 'prohibited' | 'restricted' | 'danger'; coords: [number, number][]; notams: ZoneNotam[] }
export interface CircleZone { id: string; name: string; type: 'restricted' | 'danger'; center: [number, number]; radius: number; notams: ZoneNotam[] }
export interface ZoneNotam { notamId: string; effectiveStart: string; effectiveEnd: string; altitudeLow: string; altitudeHigh: string; content: string; affectedRoutes: string[] }
export interface FIRBoundary { name: string; coords: [number, number][] }
export interface MapStats { region: { name: string; count: number; change: number }[]; notam24h: number; activeProhibited: number; international: { name: string; count: number }[] }

// ==================== 航路点（65个，全国覆盖，真实五字码风格） ====================
export const MOCK_WAYPOINTS: Waypoint[] = [
  { code:'ANDIN', name:'ANDIN', lng:116.50, lat:40.05 }, { code:'DOVCA', name:'DOVCA', lng:111.00, lat:34.80 },
  { code:'CKA',   name:'CKA',   lng:113.50, lat:34.50 }, { code:'TAMEG', name:'TAMEG', lng:107.50, lat:35.50 },
  { code:'YBL',   name:'YBL',   lng:100.00, lat:38.50 }, { code:'KAGSO', name:'KAGSO', lng:106.80, lat:33.20 },
  { code:'P303',  name:'P303',  lng:108.20, lat:31.50 }, { code:'P250',  name:'P250',  lng:118.30, lat:32.50 },
  { code:'P60',   name:'P60',   lng:114.00, lat:30.50 }, { code:'WHA',   name:'WHA',   lng:120.10, lat:30.20 },
  { code:'P17',   name:'P17',   lng:121.50, lat:31.20 }, { code:'P53',   name:'P53',   lng:117.80, lat:30.80 },
  { code:'LIGMA', name:'LIGMA', lng:117.00, lat:29.50 }, { code:'P270',  name:'P270',  lng:119.50, lat:26.50 },
  { code:'SHZ',   name:'SHZ',   lng:121.80, lat:31.10 }, { code:'P44',   name:'P44',   lng:119.00, lat:33.50 },
  { code:'PIMOL', name:'PIMOL', lng:121.20, lat:30.80 }, { code:'P84',   name:'P84',   lng:102.50, lat:31.00 },
  { code:'ENH',   name:'ENH',   lng:109.50, lat:30.30 }, { code:'P49',   name:'P49',   lng:110.80, lat:28.20 },
  { code:'P470',  name:'P470',  lng:112.50, lat:27.80 }, { code:'P120',  name:'P120',  lng:104.50, lat:30.00 },
  { code:'P126',  name:'P126',  lng:103.20, lat:29.00 }, { code:'P122',  name:'P122',  lng:105.80, lat:28.50 },
  { code:'DS',    name:'DS',    lng:112.30, lat:29.80 }, { code:'WXI',   name:'WXI',   lng:114.50, lat:28.00 },
  { code:'QF',    name:'QF',    lng:113.80, lat:23.20 }, { code:'P454',  name:'P454',  lng:115.00, lat:25.50 },
  { code:'P508',  name:'P508',  lng:112.00, lat:22.80 }, { code:'P268',  name:'P268',  lng:110.50, lat:21.00 },
  { code:'SAREX', name:'SAREX', lng:116.80, lat:24.50 }, { code:'P321',  name:'P321',  lng:114.20, lat:22.50 },
  { code:'P293',  name:'P293',  lng:101.80, lat:27.50 }, { code:'P73',   name:'P73',   lng:100.50, lat:25.80 },
  { code:'LJG',   name:'LJG',   lng:100.20, lat:26.80 }, { code:'P140',  name:'P140',  lng:98.50,  lat:24.00 },
  { code:'HMI',   name:'HMI',   lng:94.50,  lat:42.50 }, { code:'P169',  name:'P169',  lng:96.00,  lat:37.00 },
  { code:'P87',   name:'P87',   lng:88.00,  lat:44.00 }, { code:'KCA',   name:'KCA',   lng:84.50,  lat:41.50 },
  { code:'P206',  name:'P206',  lng:90.00,  lat:38.50 }, { code:'P23',   name:'P23',   lng:125.50, lat:43.50 },
  { code:'P10',   name:'P10',   lng:122.50, lat:42.00 }, { code:'BM',    name:'BM',    lng:124.00, lat:45.50 },
  { code:'P432',  name:'P432',  lng:120.50, lat:41.50 }, { code:'P472',  name:'P472',  lng:111.50, lat:30.00 },
  // 新增强国周边航路点
  { code:'BISUN', name:'BISUN', lng:123.80, lat:41.20 }, { code:'DONVO', name:'DONVO', lng:109.00, lat:25.50 },
  { code:'ELAPO', name:'ELAPO', lng:114.80, lat:38.20 }, { code:'FULAR', name:'FULAR', lng:92.50,  lat:35.00 },
  { code:'GOLAB', name:'GOLAB', lng:104.00, lat:32.00 }, { code:'HAREX', name:'HAREX', lng:120.80, lat:36.20 },
  { code:'IGMOT', name:'IGMOT', lng:115.50, lat:28.50 }, { code:'JULIP', name:'JULIP', lng:98.00,  lat:30.50 },
  { code:'KATLO', name:'KATLO', lng:119.80, lat:29.20 }, { code:'LADIX', name:'LADIX', lng:106.50, lat:26.50 },
  { code:'MEPOG', name:'MEPOG', lng:118.00, lat:35.00 }, { code:'NIRON', name:'NIRON', lng:95.00,  lat:28.00 },
  { code:'OLPEX', name:'OLPEX', lng:112.50, lat:33.50 }, { code:'PALOD', name:'PALOD', lng:102.00, lat:36.00 },
  { code:'RIGAM', name:'RIGAM', lng:121.00, lat:29.50 }, { code:'SABIX', name:'SABIX', lng:108.50, lat:22.50 },
  { code:'TIDON', name:'TIDON', lng:117.50, lat:25.00 }, { code:'ULGAP', name:'ULGAP', lng:124.50, lat:40.80 },
]

// ==================== 航路（22条，真实中国空域编号） ====================
export const MOCK_ROUTES: AirRoute[] = [
  { id:'G212', name:'G212', waypoints:['ANDIN','DOVCA','CKA','P250','P17'] },
  { id:'B330', name:'B330', waypoints:['TAMEG','KAGSO','ENH','P49','P470','P454'] },
  { id:'A593', name:'A593', waypoints:['P250','P53','WHA','LIGMA','PIMOL'] },
  { id:'A461', name:'A461', waypoints:['ANDIN','CKA','P60','QF','P454'] },
  { id:'B215', name:'B215', waypoints:['YBL','TAMEG','DOVCA'] },
  { id:'R473', name:'R473', waypoints:['P60','QF','P270'] },
  { id:'W77',  name:'W77',  waypoints:['P303','P126','P122'] },
  { id:'G471', name:'G471', waypoints:['P126','P84','P472','P49'] },
  { id:'W161', name:'W161', waypoints:['P53','LIGMA','P270'] },
  { id:'A588', name:'A588', waypoints:['BM','P23','P10','P432','P17'] },
  { id:'G341', name:'G341', waypoints:['ANDIN','P432','P10','P23','BM'] },
  { id:'B208', name:'B208', waypoints:['DOVCA','CKA','DS','P470'] },
  { id:'A581', name:'A581', waypoints:['P122','P49','WXI','P470','P454'] },
  { id:'W527', name:'W527', waypoints:['ENH','P472','DS','P60'] },
  { id:'G327', name:'G327', waypoints:['P44','P250','P53','WHA'] },
  { id:'W554', name:'W554', waypoints:['WHA','LIGMA','P270','SAREX'] },
  { id:'A470', name:'A470', waypoints:['P250','P44','P17','SHZ','PIMOL'] },
  { id:'B451', name:'B451', waypoints:['KCA','P87','HMI','P169','YBL'] },
  { id:'W187', name:'W187', waypoints:['YBL','HMI','P206','P169'] },
  { id:'R339', name:'R339', waypoints:['P293','LJG','P73','P140'] },
  { id:'W206', name:'W206', waypoints:['BM','P23','P10','ULGAP'] },
  { id:'B339', name:'B339', waypoints:['BISUN','MEPOG','OLPEX','DOVCA'] },
]

// ==================== 多边形禁航/限制区（6个，真实军事演习区风格） ====================
export const MOCK_POLYGON_ZONES: PolygonZone[] = [
  {
    id:'ZBAA-P01', name:'华北军事演习区 ZB(P)-001', type:'prohibited',
    coords:[[106.5,33.5],[108.5,34.0],[109.0,32.8],[107.6,32.2],[106.0,32.5],[106.5,33.5]],
    notams:[{ notamId:'A2275/26', effectiveStart:'2026-06-07 08:00', effectiveEnd:'2026-06-08 08:00', altitudeLow:'GND', altitudeHigh:'FL360', content:'Z-001 战区级联合对抗演习。G212/B330航路部分航段关闭，建议经B208/W527绕飞。涉及高度层FL100-FL360全高度限制。', affectedRoutes:['G212','B330'] }],
  },
  {
    id:'ZSSS-P02', name:'东部沿海火箭发射禁航区 ZB(P)-002', type:'prohibited',
    coords:[[117.0,30.0],[119.5,30.8],[120.0,29.2],[118.0,28.5],[116.5,29.0],[117.0,30.0]],
    notams:[{ notamId:'A2276/26', effectiveStart:'2026-06-07 10:00', effectiveEnd:'2026-06-07 16:00', altitudeLow:'SFC', altitudeHigh:'FL280', content:'东海靶场运载火箭测试窗口。A593/W161航路禁航，推荐使用A470替代。NOTAM生效期间禁止任何民用航空器进入。', affectedRoutes:['A593','W161'] }],
  },
  {
    id:'ZUUU-P03', name:'西南导弹测试区 ZB(P)-003', type:'prohibited',
    coords:[[103.0,28.5],[105.5,29.5],[106.5,28.0],[104.5,27.0],[102.5,27.5],[103.0,28.5]],
    notams:[{ notamId:'A2280/26', effectiveStart:'2026-06-07 06:00', effectiveEnd:'2026-06-08 06:00', altitudeLow:'FL050', altitudeHigh:'FL300', content:'西昌卫星发射中心导弹测试。W77/G471航路需重新规划，建议经由B330南线绕飞。测试期间GND-FL300全高度限制。', affectedRoutes:['W77','G471'] }],
  },
  {
    id:'ZSAM-R01', name:'台海联合军演限制区 ZB(R)-001', type:'restricted',
    coords:[[119.5,26.5],[122.0,27.5],[123.0,26.0],[121.5,25.0],[119.0,25.2],[119.5,26.5]],
    notams:[{ notamId:'A2281/26', effectiveStart:'2026-06-07 12:00', effectiveEnd:'2026-06-07 20:00', altitudeLow:'GND', altitudeHigh:'FL150', content:'海峡联合军演区域。R473/W554航路受影响，建议经A470东线绕飞。军演期间限制区边界5NM范围内限制通航。', affectedRoutes:['R473','W554'] }],
  },
  {
    id:'ZWWW-R02', name:'西北无人机测试空域 ZB(R)-002', type:'restricted',
    coords:[[88.0,42.0],[92.0,43.5],[93.0,41.5],[90.5,40.0],[88.5,40.5],[88.0,42.0]],
    notams:[{ notamId:'A2282/26', effectiveStart:'2026-06-07 02:00', effectiveEnd:'2026-06-07 12:00', altitudeLow:'FL100', altitudeHigh:'FL350', content:'新疆大型无人机协同作战测试。B451/W187航路受影响，注意高空作业无人机巡检。', affectedRoutes:['B451','W187'] }],
  },
  {
    id:'ZYTL-P04', name:'东北战区实弹演习禁航区 ZB(P)-004', type:'prohibited',
    coords:[[122.0,42.0],[125.5,43.5],[126.5,41.5],[124.0,40.0],[121.5,40.8],[122.0,42.0]],
    notams:[{ notamId:'A2283/26', effectiveStart:'2026-06-07 14:00', effectiveEnd:'2026-06-08 02:00', altitudeLow:'GND', altitudeHigh:'FL250', content:'北部战区年度实弹射击考核。A588/G341/W206航路全面限制，任何航空器未经许可不得进入。', affectedRoutes:['A588','G341','W206'] }],
  },
]

// ==================== 圆形限制区（7个） ====================
export const MOCK_CIRCLE_ZONES: CircleZone[] = [
  {
    id:'ZR002', name:'郑州空军靶场 ZR-002', type:'restricted', center:[114.5,34.8], radius:80,
    notams:[{ notamId:'A2277/26', effectiveStart:'2026-06-07 06:00', effectiveEnd:'2026-06-07 18:00', altitudeLow:'GND', altitudeHigh:'FL200', content:'空军航空兵实弹射击训练，半径80km范围内限制通行。A461/B215航路需申请许可。', affectedRoutes:['A461','B215'] }],
  },
  {
    id:'ZR008', name:'张家界无人机测试区 ZR-008', type:'danger', center:[109.0,28.5], radius:60,
    notams:[{ notamId:'A2278/26', effectiveStart:'2026-06-07 04:00', effectiveEnd:'2026-06-07 14:00', altitudeLow:'FL050', altitudeHigh:'FL250', content:'大疆新型无人机集群测试，半径60km。B330/G471航路注意避让。', affectedRoutes:['B330','G471'] }],
  },
  {
    id:'ZR015', name:'上海终端区雷达校准区 ZR-015', type:'restricted', center:[121.0,31.5], radius:50,
    notams:[{ notamId:'A2284/26', effectiveStart:'2026-06-07 08:00', effectiveEnd:'2026-06-07 16:00', altitudeLow:'FL100', altitudeHigh:'FL280', content:'浦东雷达站校准测试。A593/G327/A470航路注意高度限制。', affectedRoutes:['A593','G327','A470'] }],
  },
  {
    id:'ZR022', name:'珠海航展飞行表演区 ZR-022', type:'danger', center:[112.5,23.5], radius:45,
    notams:[{ notamId:'A2285/26', effectiveStart:'2026-06-07 10:00', effectiveEnd:'2026-06-07 22:00', altitudeLow:'GND', altitudeHigh:'FL180', content:'第十五届中国航展飞行表演区域。A461/R473需临时改航。', affectedRoutes:['A461','R473'] }],
  },
  {
    id:'ZR031', name:'川西电子战演习区 ZR-031', type:'restricted', center:[102.8,30.5], radius:70,
    notams:[{ notamId:'A2286/26', effectiveStart:'2026-06-07 06:00', effectiveEnd:'2026-06-08 06:00', altitudeLow:'FL150', altitudeHigh:'FL350', content:'西部战区电子对抗演习。W77/B330/G471航路受影响。', affectedRoutes:['W77','B330','G471'] }],
  },
  {
    id:'ZR045', name:'青海火箭探测区 ZR-045', type:'danger', center:[100.5,38.0], radius:55,
    notams:[{ notamId:'A2287/26', effectiveStart:'2026-06-07 18:00', effectiveEnd:'2026-06-08 06:00', altitudeLow:'FL200', altitudeHigh:'FL400', content:'中科院高空探空火箭实验。B215航路需绕飞。', affectedRoutes:['B215'] }],
  },
  {
    id:'ZR052', name:'黄海联合演习区 ZR-052', type:'restricted', center:[124.5,35.5], radius:90,
    notams:[{ notamId:'A2308/26', effectiveStart:'2026-06-07 00:00', effectiveEnd:'2026-06-08 00:00', altitudeLow:'GND', altitudeHigh:'FL300', content:'中韩海上联合搜救演习。A588/G341航路限制通行，建议经B339绕飞。', affectedRoutes:['A588','G341'] }],
  },
]

// ==================== FIR 情报区（与中国空域管理体系一致） ====================
export const MOCK_FIR_BOUNDARIES: FIRBoundary[] = [
  {
    name:'北京 FIR (ZBPE)',
    coords:[[113.5,41.0],[120.0,41.0],[125.0,38.0],[122.0,35.0],[118.0,34.5],[114.0,36.5],[113.5,41.0]],
  },
  {
    name:'上海 FIR (ZSHA)',
    coords:[[118.0,34.5],[122.0,35.0],[125.0,32.0],[124.0,28.0],[120.0,27.0],[117.0,29.0],[118.0,34.5]],
  },
  {
    name:'广州 FIR (ZGZU)',
    coords:[[117.0,29.0],[120.0,27.0],[116.0,21.0],[110.0,21.0],[108.0,26.0],[111.0,28.0],[117.0,29.0]],
  },
  {
    name:'昆明 FIR (ZPKM)',
    coords:[[108.0,26.0],[110.0,21.0],[104.0,21.0],[98.0,24.0],[100.0,28.0],[105.0,28.0],[108.0,26.0]],
  },
  {
    name:'乌鲁木齐 FIR (ZWUQ)',
    coords:[[98.0,24.0],[104.0,21.0],[97.0,35.0],[82.0,48.0],[76.0,48.0],[76.0,40.0],[86.0,36.0],[98.0,24.0]],
  },
]

// ==================== 悬浮统计卡 ====================
export const MOCK_MAP_STATS: MapStats = {
  region: [
    { name:'华北', count:14, change:3 },
    { name:'华东', count:9, change:-2 },
    { name:'西南', count:7, change:1 },
    { name:'西北', count:5, change:-1 },
  ],
  notam24h: 112,
  activeProhibited: 8,
  international: [
    { name:'俄罗斯', count:7 },
    { name:'哈萨克', count:4 },
    { name:'日本',  count:5 },
    { name:'韩国',  count:3 },
    { name:'印度',  count:6 },
    { name:'越南',  count:3 },
    { name:'蒙古',  count:2 },
  ],
}
