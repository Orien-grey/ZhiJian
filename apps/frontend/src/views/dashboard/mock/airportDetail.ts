// ============================================================
// 机场详情 — 基于 Wikipedia / CAAC AIP 公开数据
// 数据来源：Wikipedia, metar-taf.com, fltplan.com, airmate.aero
// ============================================================

export interface AirportInfo {
  icao: string; iata: string; name: string; nameEn: string
  lat: number; lng: number; elevation: string
  magneticVar: string; timezone: string; opsHours: string
  fireCat: string; fuelTypes: string; dataSource: string
}

export interface RunwaySpec {
  id: string; length: string; width: string; surface: string
  pcn: string; ils: string; lights: string; usage: string; remarks: string
}

export interface TaxiwaySegment {
  id: string; name: string; path: string
  width: string; status: 'open' | 'closed' | 'restricted'
  notamRef?: string; notamText?: string
}

export interface TakeoffMinima {
  runway: string; aircraftCat: string
  lowVisProcs: { condition: string; rvr: string }[]
  standard: { vis: string; rvr: string }
  remarks: string[]
}

export interface LandingMinima {
  runway: string; approach: string; aircraftCat: string
  dh: string; rvrVis: string; als: string; remarks: string
}

/** NOTAM 历史记录 */
export interface AirportNotam {
  id: string; ref: string; type: 'new' | 'replace' | 'cancel'
  startDate: string; endDate: string; summary: string
  affectedFacility: string; priority: 'A' | 'B' | 'M'
}

/** 通信/导航设施 */
export interface AirportFacility {
  icao: string
  atis: string; tower: string; ground: string; approach: string
  vor: string; ndb: string; ilsRunways: string[]
  weatherRadar: boolean; rvrSensors: string[]
  pcategory: string // 消防类别描述
  annualMovements: string; passengerCapacity: string
}

// ==================== 机场基础信息 ====================
export const MOCK_AIRPORT: Record<string, AirportInfo> = {
  ZWWW: {
    icao:'ZWWW', iata:'URC', name:'乌鲁木齐天山国际机场', nameEn:'Ürümqi Diwopu International Airport',
    lat:43.907, lng:87.474, elevation:'648m (2126ft)',
    magneticVar:'3°E', timezone:'UTC+8', opsHours:'H24',
    fireCat:'9级', fuelTypes:'JET A-1, AVGAS 100LL', dataSource:'Wikipedia / CAAC AIP',
  },
  ZBAA: {
    icao:'ZBAA', iata:'PEK', name:'北京首都国际机场', nameEn:'Beijing Capital International Airport',
    lat:40.073, lng:116.585, elevation:'35m (115ft)',
    magneticVar:'6°W', timezone:'UTC+8', opsHours:'H24',
    fireCat:'10级 (CAT 10)', fuelTypes:'JET A-1, AVGAS 100LL', dataSource:'Wikipedia / fltplan.com',
  },
  ZSSS: {
    icao:'ZSSS', iata:'SHA', name:'上海虹桥国际机场', nameEn:'Shanghai Hongqiao International Airport',
    lat:31.198, lng:121.336, elevation:'3m (10ft)',
    magneticVar:'5°W', timezone:'UTC+8', opsHours:'H24',
    fireCat:'9级', fuelTypes:'JET A-1', dataSource:'Wikipedia / airmate.aero',
  },
  ZSPD: {
    icao:'ZSPD', iata:'PVG', name:'上海浦东国际机场', nameEn:'Shanghai Pudong International Airport',
    lat:31.144, lng:121.806, elevation:'4m (13ft)',
    magneticVar:'5°W', timezone:'UTC+8', opsHours:'H24',
    fireCat:'10级 (CAT 10)', fuelTypes:'JET A-1, AVGAS 100LL', dataSource:'Wikipedia / metar-taf.com',
  },
  ZGGG: {
    icao:'ZGGG', iata:'CAN', name:'广州白云国际机场', nameEn:'Guangzhou Baiyun International Airport',
    lat:23.393, lng:113.300, elevation:'15m (49ft)',
    magneticVar:'2°W', timezone:'UTC+8', opsHours:'H24',
    fireCat:'10级 (CAT 10)', fuelTypes:'JET A-1', dataSource:'Wikipedia',
  },
  ZUUU: {
    icao:'ZUUU', iata:'CTU', name:'成都双流国际机场', nameEn:'Chengdu Shuangliu International Airport',
    lat:30.579, lng:103.947, elevation:'495m (1624ft)',
    magneticVar:'2°W', timezone:'UTC+8', opsHours:'H24',
    fireCat:'9级', fuelTypes:'JET A-1', dataSource:'Wikipedia',
  },
  ZLXY: {
    icao:'ZLXY', iata:'XIY', name:'西安咸阳国际机场', nameEn:'Xi\'an Xianyang International Airport',
    lat:34.446, lng:108.754, elevation:'479m (1572ft)',
    magneticVar:'3°W', timezone:'UTC+8', opsHours:'H24',
    fireCat:'9级', fuelTypes:'JET A-1', dataSource:'Wikipedia',
  },
  ZUCK: {
    icao:'ZUCK', iata:'CKG', name:'重庆江北国际机场', nameEn:'Chongqing Jiangbei International Airport',
    lat:29.719, lng:106.642, elevation:'416m (1365ft)',
    magneticVar:'2°W', timezone:'UTC+8', opsHours:'H24',
    fireCat:'9级', fuelTypes:'JET A-1', dataSource:'Wikipedia',
  },
  ZHCC: {
    icao:'ZHCC', iata:'CGO', name:'郑州新郑国际机场', nameEn:'Zhengzhou Xinzheng International Airport',
    lat:34.521, lng:113.842, elevation:'151m (495ft)',
    magneticVar:'4°W', timezone:'UTC+8', opsHours:'H24',
    fireCat:'8级', fuelTypes:'JET A-1', dataSource:'Wikipedia',
  },
  ZSAM: {
    icao:'ZSAM', iata:'XMN', name:'厦门高崎国际机场', nameEn:'Xiamen Gaoqi International Airport',
    lat:24.546, lng:118.129, elevation:'18m (59ft)',
    magneticVar:'3°W', timezone:'UTC+8', opsHours:'H24',
    fireCat:'9级', fuelTypes:'JET A-1', dataSource:'Wikipedia',
  },
  ZSNJ: {
    icao:'ZSNJ', iata:'NKG', name:'南京禄口国际机场', nameEn:'Nanjing Lukou International Airport',
    lat:31.742, lng:118.860, elevation:'15m (49ft)',
    magneticVar:'5°W', timezone:'UTC+8', opsHours:'H24',
    fireCat:'9级', fuelTypes:'JET A-1', dataSource:'Wikipedia',
  },
  ZBTJ: {
    icao:'ZBTJ', iata:'TSN', name:'天津滨海国际机场', nameEn:'Tianjin Binhai International Airport',
    lat:39.127, lng:117.347, elevation:'3m (10ft)',
    magneticVar:'6°W', timezone:'UTC+8', opsHours:'H24',
    fireCat:'9级', fuelTypes:'JET A-1', dataSource:'Wikipedia',
  },
  ZSHC: {
    icao:'ZSHC', iata:'HGH', name:'杭州萧山国际机场', nameEn:'Hangzhou Xiaoshan International Airport',
    lat:30.229, lng:120.432, elevation:'7m (23ft)',
    magneticVar:'5°W', timezone:'UTC+8', opsHours:'H24',
    fireCat:'9级', fuelTypes:'JET A-1', dataSource:'Wikipedia',
  },
  ZGSZ: {
    icao:'ZGSZ', iata:'SZX', name:'深圳宝安国际机场', nameEn:'Shenzhen Bao\'an International Airport',
    lat:22.640, lng:113.811, elevation:'4m (13ft)',
    magneticVar:'2°W', timezone:'UTC+8', opsHours:'H24',
    fireCat:'9级', fuelTypes:'JET A-1', dataSource:'Wikipedia',
  },
  ZJHK: {
    icao:'ZJHK', iata:'HAK', name:'海口美兰国际机场', nameEn:'Haikou Meilan International Airport',
    lat:19.939, lng:110.462, elevation:'23m (75ft)',
    magneticVar:'1°W', timezone:'UTC+8', opsHours:'H24',
    fireCat:'9级', fuelTypes:'JET A-1', dataSource:'Wikipedia',
  },
  ZYTX: {
    icao:'ZYTX', iata:'SHE', name:'沈阳桃仙国际机场', nameEn:'Shenyang Taoxian International Airport',
    lat:41.640, lng:123.493, elevation:'60m (197ft)',
    magneticVar:'8°W', timezone:'UTC+8', opsHours:'H24',
    fireCat:'9级', fuelTypes:'JET A-1', dataSource:'Wikipedia',
  },
  ZPPP: {
    icao:'ZPPP', iata:'KMG', name:'昆明长水国际机场', nameEn:'Kunming Changshui International Airport',
    lat:25.101, lng:102.919, elevation:'2103m (6899ft)',
    magneticVar:'1°W', timezone:'UTC+8', opsHours:'H24',
    fireCat:'9级', fuelTypes:'JET A-1', dataSource:'Wikipedia',
  },
  ZSJN: {
    icao:'ZSJN', iata:'TNA', name:'济南遥墙国际机场', nameEn:'Jinan Yaoqiang International Airport',
    lat:36.857, lng:116.983, elevation:'23m (75ft)',
    magneticVar:'5°W', timezone:'UTC+8', opsHours:'H24',
    fireCat:'8级', fuelTypes:'JET A-1', dataSource:'Wikipedia',
  },
  ZUGY: {
    icao:'ZUGY', iata:'KWE', name:'贵阳龙洞堡国际机场', nameEn:'Guiyang Longdongbao International Airport',
    lat:26.539, lng:106.802, elevation:'1139m (3737ft)',
    magneticVar:'2°W', timezone:'UTC+8', opsHours:'H24',
    fireCat:'8级', fuelTypes:'JET A-1', dataSource:'Wikipedia',
  },
}

// ==================== 跑道数据 ====================
export const MOCK_RUNWAYS: Record<string, RunwaySpec[]> = {
  ZBAA: [
    { id:'18L/36R', length:'3810m', width:'60m', surface:'沥青', pcn:'90/R/B/W/T', ils:'CAT II 双向', lights:'HIRL, RCLL, RTZL', usage:'主要起飞', remarks:'4F级跑道，可起降A380' },
    { id:'18R/36L', length:'3445m', width:'50m', surface:'沥青', pcn:'74/F/B/W/T', ils:'CAT I 双向', lights:'HIRL, RCLL', usage:'辅助起降', remarks:'4E级跑道' },
    { id:'01/19', length:'3810m', width:'60m', surface:'混凝土', pcn:'90/R/B/W/T', ils:'CAT II 双向', lights:'HIRL, RCLL, RTZL', usage:'主要降落', remarks:'2008年随T3投用，4F级' },
  ],
  ZSSS: [
    { id:'18L/36R', length:'3400m', width:'45m', surface:'沥青', pcn:'74/F/B/W/T', ils:'CAT I 双向', lights:'HIRL', usage:'主要降落', remarks:'近距离平行跑道，间距仅365m' },
    { id:'18R/36L', length:'3300m', width:'60m', surface:'混凝土', pcn:'80/R/B/W/T', ils:'CAT I 双向', lights:'HIRL, RCLL', usage:'主要起飞', remarks:'较宽跑道，以起飞为主' },
  ],
  ZSPD: [
    { id:'17L/35R', length:'4000m', width:'60m', surface:'混凝土', pcn:'90/R/B/W/T', ils:'CAT II', lights:'HIRL, RCLL, RTZL', usage:'主要起飞', remarks:'1999年投用，4F级' },
    { id:'16R/34L', length:'3800m', width:'60m', surface:'混凝土', pcn:'90/R/B/W/T', ils:'CAT II', lights:'HIRL, RCLL', usage:'主要起飞', remarks:'2005年投用，4F级' },
    { id:'17R/35L', length:'3400m', width:'60m', surface:'混凝土', pcn:'80/R/B/W/T', ils:'CAT I', lights:'HIRL', usage:'主要降落', remarks:'2008年投用，外侧跑道' },
    { id:'16L/34R', length:'3800m', width:'60m', surface:'混凝土', pcn:'90/R/B/W/T', ils:'CAT II', lights:'HIRL, RCLL, RTZL', usage:'主要降落', remarks:'2015年投用，4F级' },
  ],
  ZGGG: [
    { id:'01L/19R', length:'3400m', width:'45m', surface:'混凝土', pcn:'—', ils:'CAT I', lights:'HIRL', usage:'降落', remarks:'2025年1月新投用，外侧跑道' },
    { id:'01R/19L', length:'3600m', width:'45m', surface:'混凝土', pcn:'74/F/B/W/T', ils:'CAT I', lights:'HIRL, RCLL', usage:'起飞', remarks:'原名01/19（西跑道），内侧' },
    { id:'02L/20R', length:'3800m', width:'60m', surface:'混凝土', pcn:'90/R/B/W/T', ils:'CAT II', lights:'HIRL, RCLL, RTZL', usage:'起飞', remarks:'东跑道内侧，可起降A380' },
    { id:'02R/20L', length:'3800m', width:'60m', surface:'混凝土', pcn:'90/R/B/W/T', ils:'CAT II', lights:'HIRL, RCLL, RTZL', usage:'降落', remarks:'2015年投用，外侧跑道' },
  ],
  ZWWW: [
    { id:'07/25', length:'3600m', width:'45m', surface:'沥青', pcn:'74/F/B/W/T', ils:'07: CAT II / 25: CAT I', lights:'HIRL, RCLL, RTZL', usage:'改造中', remarks:'原南跑道，2025年改造，完成后负责进场。07方向净空良好。' },
    { id:'08R/26L', length:'3600m', width:'45m', surface:'混凝土', pcn:'90/R/B/W/T', ils:'CAT I 双向', lights:'HIRL, RCLL', usage:'离场', remarks:'北二跑道(4F)，主要负责离场。' },
    { id:'08L/26R', length:'3200m', width:'45m', surface:'混凝土', pcn:'90/R/B/W/T', ils:'08L: CAT IIIA / 26R: CAT I', lights:'HIRL, RCLL, RTZL, HIALS', usage:'进场', remarks:'北三跑道(4F)，CAT IIIA自动着陆。' },
  ],
  ZUUU: [
    { id:'02L/20R', length:'3600m', width:'45m', surface:'混凝土', pcn:'—', ils:'CAT II', lights:'HIRL, RCLL', usage:'主用', remarks:'暂无数据渠道获取PCN值' },
    { id:'02R/20L', length:'3600m', width:'60m', surface:'混凝土', pcn:'—', ils:'CAT I', lights:'HIRL', usage:'辅助', remarks:'暂无数据渠道获取PCN值' },
  ],
  ZLXY: [
    { id:'05L/23R', length:'3800m', width:'60m', surface:'混凝土', pcn:'—', ils:'CAT II', lights:'HIRL, RCLL', usage:'主用', remarks:'暂无数据渠道获取PCN值' },
    { id:'05R/23L', length:'3800m', width:'45m', surface:'沥青', pcn:'—', ils:'CAT I', lights:'HIRL', usage:'辅助', remarks:'暂无数据渠道获取PCN值' },
  ],
  ZUCK: [
    { id:'02L/20R', length:'3600m', width:'45m', surface:'沥青', pcn:'—', ils:'CAT II', lights:'HIRL', usage:'主用', remarks:'暂无数据渠道获取PCN值和第二跑道数据' },
  ],
  ZHCC: [
    { id:'12R/30L', length:'3600m', width:'60m', surface:'混凝土', pcn:'—', ils:'CAT I', lights:'HIRL', usage:'主用', remarks:'暂无数据渠道获取第二跑道数据' },
  ],
  ZSAM: [
    { id:'05/23', length:'3400m', width:'45m', surface:'沥青', pcn:'—', ils:'CAT I', lights:'HIRL', usage:'唯一跑道', remarks:'单跑道机场，暂无数据渠道获取PCN值' },
  ],
  ZSNJ: [
    { id:'06/24', length:'3600m', width:'45m', surface:'混凝土', pcn:'—', ils:'CAT I', lights:'HIRL', usage:'主用', remarks:'暂无数据渠道获取第二条跑道数据' },
  ],
  ZBTJ: [
    { id:'16R/34L', length:'3600m', width:'60m', surface:'混凝土', pcn:'—', ils:'CAT I', lights:'HIRL', usage:'主用', remarks:'暂无数据渠道获取第二跑道数据' },
  ],
  ZSHC: [
    { id:'07/25', length:'3600m', width:'45m', surface:'混凝土', pcn:'—', ils:'CAT I', lights:'HIRL', usage:'主用', remarks:'暂无数据渠道获取PCN值和第二跑道数据' },
  ],
  ZGSZ: [
    { id:'15/33', length:'3800m', width:'60m', surface:'混凝土', pcn:'—', ils:'CAT II', lights:'HIRL, RCLL', usage:'主用', remarks:'暂无数据渠道获取第二跑道数据' },
  ],
  ZJHK: [
    { id:'09/27', length:'3600m', width:'45m', surface:'混凝土', pcn:'—', ils:'CAT I', lights:'HIRL', usage:'唯一跑道', remarks:'暂无数据渠道获取PCN值' },
  ],
  ZYTX: [
    { id:'06/24', length:'3600m', width:'45m', surface:'混凝土', pcn:'—', ils:'CAT I', lights:'HIRL', usage:'主用', remarks:'暂无数据渠道获取PCN值' },
  ],
  ZPPP: [
    { id:'03/21', length:'4500m', width:'60m', surface:'混凝土', pcn:'—', ils:'CAT II', lights:'HIRL, RCLL', usage:'主用', remarks:'高原机场(2103m)，暂无数据渠道获取第二跑道数据' },
  ],
  ZSJN: [
    { id:'01/19', length:'3600m', width:'45m', surface:'混凝土', pcn:'—', ils:'CAT I', lights:'HIRL', usage:'唯一跑道', remarks:'暂无数据渠道获取PCN值' },
  ],
  ZUGY: [
    { id:'01/19', length:'3200m', width:'45m', surface:'沥青', pcn:'—', ils:'CAT I', lights:'HIRL', usage:'唯一跑道', remarks:'高原机场(1139m)，暂无数据渠道获取PCN值' },
  ],
}

// ==================== 滑行道 ====================
export const MOCK_TAXIWAYS: Record<string, TaxiwaySegment[]> = {
  ZWWW: [
    { id:'t07', name:'RWY 07/25', path:'M 50,60 L 750,60', width:'45m', status:'open' },
    { id:'ta', name:'A 平滑', path:'M 50,160 L 750,160', width:'28m', status:'open' },
    { id:'tb', name:'B 平滑', path:'M 50,220 L 750,220', width:'23m', status:'open' },
    { id:'tt', name:'T 站坪滑', path:'M 50,290 L 750,290', width:'28.5m', status:'open' },
    { id:'ta1', name:'A1', path:'M 120,60 L 120,160', width:'28.5m', status:'open' },
    { id:'ta2', name:'A2', path:'M 280,60 L 280,160', width:'28.5m', status:'open' },
    { id:'ta3', name:'A3', path:'M 440,60 L 440,160', width:'28.5m', status:'closed', notamRef:'A2310/26', notamText:'A3联络道因道面维护关闭。航空器请使用A2或A4绕行。预计恢复时间：施工结束后另行通告。' },
    { id:'ta4', name:'A4', path:'M 600,60 L 600,160', width:'28.5m', status:'open' },
    { id:'ta5', name:'A5', path:'M 200,60 Q 210,130 280,160', width:'34m', status:'open' },
    { id:'ta6', name:'A6', path:'M 360,60 Q 370,130 440,160', width:'34m', status:'open' },
    { id:'ta7', name:'A7', path:'M 520,60 Q 530,130 600,160', width:'34m', status:'restricted', notamRef:'A2311/26', notamText:'A7快速出口仅限翼展<52m(C类及以下)航空器使用。D类及以上重型机请使用A4垂直联络道脱离。' },
    { id:'tf1', name:'F', path:'M 320,160 L 320,220', width:'34m', status:'open' },
    { id:'tl1', name:'L', path:'M 500,160 L 500,220', width:'28.5m', status:'open' },
    { id:'tk1', name:'K', path:'M 200,220 L 200,290', width:'34m', status:'open' },
    { id:'tk2', name:'KA', path:'M 400,220 L 400,290', width:'23m', status:'open' },
    { id:'tk3', name:'KB', path:'M 600,220 L 600,290', width:'23m', status:'open' },
    { id:'t08r', name:'RWY 08R/26L', path:'M 50,380 L 750,380', width:'45m', status:'open' },
    { id:'t08l', name:'RWY 08L/26R', path:'M 50,460 L 750,460', width:'45m', status:'open' },
    { id:'tn1', name:'N1 联络道', path:'M 400,290 L 400,380', width:'34m', status:'restricted', notamRef:'A2312/26', notamText:'⚠ 北航站区(T4)与南航站区(T1-T3)目前不互通。N1联络道仅供地面保障车辆通行，航空器禁止穿越。' },
  ],
  // 其他机场暂无滑行道平面图数据
  ZBAA: [], ZSSS: [], ZSPD: [], ZGGG: [], ZUUU: [], ZLXY: [], ZUCK: [], ZHCC: [],
  ZSAM: [], ZSNJ: [], ZBTJ: [], ZSHC: [], ZGSZ: [], ZJHK: [], ZYTX: [], ZPPP: [],
  ZSJN: [], ZUGY: [],
}

// ==================== 起飞标准（ZWWW 有详细数据，其他暂无） ====================
export const MOCK_TAKEOFF_MINIMA: Record<string, TakeoffMinima[]> = {
  ZWWW: [
    { runway:'07', aircraftCat:'C/D', lowVisProcs:[
      { condition:'HIRL + RCLL (≥200m段)', rvr:'200m' },
      { condition:'HIRL + RCLL + RCLM (间距≤15m)', rvr:'150m' },
      { condition:'HIRL + RCLL + RCLM (间距≤15m)', rvr:'125m' },
    ], standard:{ vis:'800m', rvr:'550m' }, remarks:['起飞最低标准：RVR 550m（基本）','低能见度起飞程序已批准，最小 RVR 125m'] },
    { runway:'25', aircraftCat:'C/D', lowVisProcs:[
      { condition:'HIRL + RCLL (≥200m段)', rvr:'200m' },
      { condition:'HIRL + RCLL + RCLM (间距≤15m)', rvr:'150m' },
    ], standard:{ vis:'800m', rvr:'550m' }, remarks:['起飞最低标准：RVR 550m（基本）','25方向起飞梯度受限，注意离场程序爬升要求'] },
    { runway:'08R', aircraftCat:'C/D', lowVisProcs:[
      { condition:'HIRL + RCLL', rvr:'200m' },
    ], standard:{ vis:'800m', rvr:'550m' }, remarks:['北二跑道，主要负责离场'] },
    { runway:'26L', aircraftCat:'C/D', lowVisProcs:[
      { condition:'HIRL + RCLL', rvr:'200m' },
    ], standard:{ vis:'800m', rvr:'550m' }, remarks:['北二跑道反向，标准同08R'] },
  ],
  // 其他机场暂无航图数据渠道
  ZBAA: [], ZSSS: [], ZSPD: [], ZGGG: [], ZUUU: [], ZLXY: [], ZUCK: [], ZHCC: [],
  ZSAM: [], ZSNJ: [], ZBTJ: [], ZSHC: [], ZGSZ: [], ZJHK: [], ZYTX: [], ZPPP: [],
  ZSJN: [], ZUGY: [],
}

// ==================== 着陆标准 ====================
export const MOCK_LANDING_MINIMA: Record<string, LandingMinima[]> = {
  ZWWW: [
    { runway:'07', approach:'ILS CAT II', aircraftCat:'C/D', dh:'30m (100ft)', rvrVis:'RVR 300m', als:'FALS (900m)', remarks:'CAT II运行需双机组+自动着陆或HUD' },
    { runway:'07', approach:'ILS CAT I', aircraftCat:'C', dh:'60m (200ft)', rvrVis:'RVR 550m', als:'FALS (900m)', remarks:'精密进近CAT I标准' },
    { runway:'07', approach:'VOR/DME', aircraftCat:'C', dh:'—', rvrVis:'VIS 1600m', als:'IALS', remarks:'非精密进近，使用CDFA技术' },
    { runway:'07', approach:'RNAV GNSS', aircraftCat:'C', dh:'75m (250ft)', rvrVis:'RVR 800m', als:'FALS', remarks:'LNAV/VNAV最低标准' },
    { runway:'25', approach:'ILS CAT I', aircraftCat:'C', dh:'60m (200ft)', rvrVis:'RVR 550m', als:'FALS (900m)', remarks:'' },
    { runway:'25', approach:'VOR', aircraftCat:'D', dh:'—', rvrVis:'VIS 2000m', als:'IALS', remarks:'D类航空器注意进近速度限制' },
    { runway:'25', approach:'NDB/DME', aircraftCat:'C', dh:'—', rvrVis:'VIS 2400m', als:'BALS', remarks:'NDB进近，无下滑引导' },
    { runway:'08L', approach:'ILS CAT IIIA', aircraftCat:'C', dh:'15m (50ft)', rvrVis:'RVR 175m', als:'FALS (900m)', remarks:'北三跑道主降方向，CAT IIIA自动着陆' },
    { runway:'08L', approach:'ILS CAT I', aircraftCat:'C', dh:'60m (200ft)', rvrVis:'RVR 550m', als:'FALS (900m)', remarks:'' },
    { runway:'26R', approach:'ILS CAT I', aircraftCat:'C', dh:'60m (200ft)', rvrVis:'RVR 550m', als:'FALS (900m)', remarks:'次降方向' },
  ],
  // 其他机场暂无航图数据渠道
  ZBAA: [], ZSSS: [], ZSPD: [], ZGGG: [], ZUUU: [], ZLXY: [], ZUCK: [], ZHCC: [],
  ZSAM: [], ZSNJ: [], ZBTJ: [], ZSHC: [], ZGSZ: [], ZJHK: [], ZYTX: [], ZPPP: [],
  ZSJN: [], ZUGY: [],
}
