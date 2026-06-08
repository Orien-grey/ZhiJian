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
  ZLLL: {
    icao:'ZLLL', iata:'LHW', name:'兰州中川国际机场', nameEn:'Lanzhou Zhongchuan International Airport',
    lat:36.515, lng:103.621, elevation:'1947m (6388ft)',
    magneticVar:'2°W', timezone:'UTC+8', opsHours:'H24',
    fireCat:'8级', fuelTypes:'JET A-1', dataSource:'Wikipedia / CAAC AIP',
  },
  ZBNY: {
    icao:'ZBNY', iata:'NAY', name:'北京南苑机场', nameEn:'Beijing Nanyuan Airport',
    lat:39.783, lng:116.388, elevation:'37m (121ft)',
    magneticVar:'6°W', timezone:'UTC+8', opsHours:'06:00-23:00',
    fireCat:'7级', fuelTypes:'JET A-1', dataSource:'Wikipedia (2019年停运民用航班，转为军用/通航)',
  },
  ZHHH: {
    icao:'ZHHH', iata:'WUH', name:'武汉天河国际机场', nameEn:'Wuhan Tianhe International Airport',
    lat:30.784, lng:114.208, elevation:'34m (112ft)',
    magneticVar:'3°W', timezone:'UTC+8', opsHours:'H24',
    fireCat:'9级', fuelTypes:'JET A-1', dataSource:'Wikipedia / CAAC AIP',
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
    { id:'02L/20R', length:'3600m', width:'45m', surface:'混凝土', pcn:'74/F/B/W/T', ils:'CAT II 双向', lights:'HIRL, RCLL, RTZL', usage:'主用', remarks:'西跑道(4E)，1998年投用。02L方向CAT II精密进近，20R方向CAT I。跑道两端设有标准快速脱离道。' },
    { id:'02R/20L', length:'3600m', width:'60m', surface:'混凝土', pcn:'90/R/B/W/T', ils:'CAT I 双向', lights:'HIRL, RCLL', usage:'辅助', remarks:'东跑道(4F)，2009年随T2投用。以起飞为主，兼作着陆辅助。可起降A380。道面每季度常规巡检。' },
  ],
  ZLXY: [
    { id:'05L/23R', length:'3800m', width:'60m', surface:'混凝土', pcn:'90/R/B/W/T', ils:'05L: CAT II / 23R: CAT I', lights:'HIRL, RCLL, RTZL', usage:'主用', remarks:'南跑道(4F)，2012年随T3投用。05L具备CAT II精密进近能力，23R为CAT I。跑道两端均设900m进近灯光系统。' },
    { id:'05R/23L', length:'3800m', width:'45m', surface:'沥青', pcn:'74/F/B/W/T', ils:'CAT I 双向', lights:'HIRL, RCLL', usage:'辅助', remarks:'北跑道(4E)，1991年随T1投用。2018年完成道面加盖，升级为沥青混凝土复合道面。' },
  ],
  ZUCK: [
    { id:'02L/20R', length:'3600m', width:'45m', surface:'沥青', pcn:'74/F/B/W/T', ils:'CAT II 双向', lights:'HIRL, RCLL, RTZL, HIALS', usage:'主用', remarks:'T3A航站楼对应跑道(4E)，2004年投用。02L具备CAT II进近能力。机场以单跑道高效运行为特色，日均起降约850架次。' },
    { id:'02R/20L', length:'3800m', width:'60m', surface:'混凝土', pcn:'90/R/B/W/T', ils:'CAT II 双向', lights:'HIRL, RCLL, RTZL', usage:'辅助', remarks:'T3B航站楼对应跑道(4F)，2012年投用。主要负责远距起飞和大机型起降，可接收A380备降。' },
    { id:'03/21', length:'3600m', width:'45m', surface:'混凝土', pcn:'80/R/B/W/T', ils:'CAT I 双向', lights:'HIRL', usage:'辅助', remarks:'第三跑道(4E)，2017年投用。缓解高峰时段跑道容量压力，主要分配中短途航班。' },
  ],
  ZHCC: [
    { id:'12R/30L', length:'3600m', width:'60m', surface:'混凝土', pcn:'90/R/B/W/T', ils:'CAT I 双向', lights:'HIRL, RCLL', usage:'主用', remarks:'南跑道(4F)，2015年投用。担负机场主要起降任务。12R进近路径需注意西侧地形净空。' },
    { id:'12L/30R', length:'3600m', width:'45m', surface:'混凝土', pcn:'74/F/B/W/T', ils:'CAT I 双向', lights:'HIRL', usage:'辅助', remarks:'北跑道(4E)，2018年投用。兼作滑行道过渡使用，高密度时段开放起降。' },
  ],
  ZSAM: [
    { id:'05/23', length:'3400m', width:'45m', surface:'沥青', pcn:'74/F/B/W/T', ils:'CAT I 双向', lights:'HIRL, RCLL', usage:'唯一跑道', remarks:'单跑道机场(4E)，1983年投用。跑道东北端毗邻海岸线，冬春季易受海雾影响。2017年完成道面大修。' },
  ],
  ZSNJ: [
    { id:'06/24', length:'3600m', width:'45m', surface:'混凝土', pcn:'80/R/B/W/T', ils:'CAT I 双向', lights:'HIRL, RCLL', usage:'主用', remarks:'单跑道(4E)，1997年投用。06方向进近需注意紫金山地形影响。机场搬迁至T2后已大幅扩建。' },
    { id:'07/25', length:'3600m', width:'60m', surface:'混凝土', pcn:'90/R/B/W/T', ils:'CAT II 双向', lights:'HIRL, RCLL, RTZL', usage:'辅助', remarks:'第二跑道(4F)，2014年投用。分担06/24高峰压力，主要用于远程国际航线。' },
  ],
  ZBTJ: [
    { id:'16R/34L', length:'3600m', width:'60m', surface:'混凝土', pcn:'90/R/B/W/T', ils:'CAT II 双向', lights:'HIRL, RCLL, RTZL', usage:'主用', remarks:'西跑道(4F)，2008年投用。16R具备CAT II精密进近能力。跑道排水系统经2019年升级改造。' },
    { id:'16L/34R', length:'3200m', width:'45m', surface:'沥青', pcn:'74/F/B/W/T', ils:'CAT I 双向', lights:'HIRL', usage:'辅助', remarks:'东跑道(4E)，1995年投用。2015年完成道面翻新，主要用于国内中短途航班。' },
  ],
  ZSHC: [
    { id:'07/25', length:'3600m', width:'45m', surface:'混凝土', pcn:'80/R/B/W/T', ils:'07: CAT II / 25: CAT I', lights:'HIRL, RCLL, RTZL', usage:'主用', remarks:'单跑道(4E)，2000年投用。07方向具备CAT II进近能力。受杭州湾地形影响，冬春多晨雾。' },
  ],
  ZGSZ: [
    { id:'15/33', length:'3800m', width:'60m', surface:'混凝土', pcn:'90/R/B/W/T', ils:'CAT II 双向', lights:'HIRL, RCLL, RTZL', usage:'主用', remarks:'单跑道(4F)，1991年投用。跑道贯穿填海区域，15端近海。2013年完成加长至3800m。可接收A380备降。' },
    { id:'16/34', length:'3800m', width:'60m', surface:'混凝土', pcn:'90/R/B/W/T', ils:'CAT II 双向', lights:'HIRL, RCLL, RTZL, HIALS', usage:'辅助', remarks:'第二跑道(4F)，2021年随卫星厅投用。16方向具备CAT IIIA潜力(规划中)。主要分担国际远程航班起降。' },
  ],
  ZJHK: [
    { id:'09/27', length:'3600m', width:'45m', surface:'混凝土', pcn:'80/R/B/W/T', ils:'CAT I 双向', lights:'HIRL, RCLL', usage:'唯一跑道', remarks:'单跑道(4E)，1999年投用。跑道东西走向，09端临琼州海峡。热带气旋季节需关注侧风限制(最大25kt)。' },
  ],
  ZYTX: [
    { id:'06/24', length:'3600m', width:'45m', surface:'混凝土', pcn:'80/R/B/W/T', ils:'CAT I 双向', lights:'HIRL, RCLL', usage:'唯一跑道', remarks:'单跑道(4E)，1989年投用。冬季需关注除冰保障时效，06方向起飞注意城市净空限制。跑道每季度FOD检查。' },
  ],
  ZPPP: [
    { id:'03/21', length:'4500m', width:'60m', surface:'混凝土', pcn:'90/R/B/W/T', ils:'CAT II 双向', lights:'HIRL, RCLL, RTZL, HIALS', usage:'主用', remarks:'单跑道(4F)，2012年投用。高原机场(标高2103m)，跑道长度4500m为全国最长之一。稀薄空气影响发动机推力，需特别注意起飞性能计算。03/21双向均具备CAT II。' },
    { id:'04/22', length:'4000m', width:'60m', surface:'混凝土', pcn:'90/R/B/W/T', ils:'CAT I 双向', lights:'HIRL, RCLL', usage:'辅助', remarks:'第二跑道(4F)，2018年投用。缓解单一跑道运行压力，兼作备降保障跑道。' },
  ],
  ZSJN: [
    { id:'01/19', length:'3600m', width:'45m', surface:'混凝土', pcn:'80/R/B/W/T', ils:'CAT I 双向', lights:'HIRL, RCLL', usage:'唯一跑道', remarks:'单跑道(4E)，1992年投用。跑道01/19走向与黄河大致平行，春秋季多沙尘天气影响能见度。' },
  ],
  ZUGY: [
    { id:'01/19', length:'3200m', width:'45m', surface:'沥青', pcn:'74/F/B/W/T', ils:'CAT I 双向', lights:'HIRL', usage:'唯一跑道', remarks:'单跑道(4E)，1997年投用。高原机场(标高1139m)，跑道置于山间谷地。01端起飞受北侧山体净空限制，需严格按SID飞行。多云雾天气常影响运行。' },
  ],
  ZLLL: [
    { id:'18/36', length:'4000m', width:'45m', surface:'混凝土', pcn:'74/F/B/W/T', ils:'CAT I 双向', lights:'HIRL, RCLL', usage:'主用', remarks:'单跑道(4E)，2015年新跑道投用(旧跑道已关闭)。高原机场(1947m)，稀薄空气影响着陆距离。' },
  ],
  ZBNY: [
    { id:'18/36', length:'3100m', width:'45m', surface:'沥青', pcn:'—', ils:'无', lights:'MIRL', usage:'军用/通航', remarks:'2019年9月停运民用航班。跑道仍维护良好，作为军方和通用航空备用机场。' },
  ],
  ZHHH: [
    { id:'04L/22R', length:'3600m', width:'60m', surface:'混凝土', pcn:'90/R/B/W/T', ils:'CAT II 双向', lights:'HIRL, RCLL, RTZL', usage:'主用', remarks:'东跑道(4F)，2017年T3投用后成为主降跑道。可起降A380。' },
    { id:'04R/22L', length:'3400m', width:'45m', surface:'混凝土', pcn:'80/R/B/W/T', ils:'CAT I 双向', lights:'HIRL, RCLL', usage:'辅助', remarks:'西跑道(4E)，2008年T2投用时启用。主要负责起飞和国内短途。' },
  ],
}

// ==================== 滑行道（所有机场共用一个示例滑行道平面图） ====================
const SHARED_TAXIWAYS: TaxiwaySegment[] = [
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
]

export const MOCK_TAXIWAYS: Record<string, TaxiwaySegment[]> = {
  ZBAA: SHARED_TAXIWAYS, ZSSS: SHARED_TAXIWAYS, ZSPD: SHARED_TAXIWAYS, ZGGG: SHARED_TAXIWAYS,
  ZUUU: SHARED_TAXIWAYS, ZLXY: SHARED_TAXIWAYS, ZUCK: SHARED_TAXIWAYS, ZHCC: SHARED_TAXIWAYS,
  ZSAM: SHARED_TAXIWAYS, ZSNJ: SHARED_TAXIWAYS, ZBTJ: SHARED_TAXIWAYS, ZSHC: SHARED_TAXIWAYS,
  ZGSZ: SHARED_TAXIWAYS, ZJHK: SHARED_TAXIWAYS, ZYTX: SHARED_TAXIWAYS, ZPPP: SHARED_TAXIWAYS,
  ZSJN: SHARED_TAXIWAYS, ZUGY: SHARED_TAXIWAYS, ZLLL: SHARED_TAXIWAYS,
  ZBNY: SHARED_TAXIWAYS, ZHHH: SHARED_TAXIWAYS, ZWWW: SHARED_TAXIWAYS,
}

// ==================== 起飞标准（22个机场完整数据） ====================
export const MOCK_TAKEOFF_MINIMA: Record<string, TakeoffMinima[]> = {
  ZBAA: [
    { runway:'18L', aircraftCat:'C/D', lowVisProcs:[
      { condition:'HIRL + RCLL + RTZL (≥300m段)', rvr:'200m' },
      { condition:'HIRL + RCLL + RCLM (间距≤15m)', rvr:'150m' },
      { condition:'HIRL + RCLL + RCLM (间距≤15m) + HUD', rvr:'125m' },
    ], standard:{ vis:'800m', rvr:'550m' }, remarks:['4F跑道，低能见度起飞程序已批准','HUD运行资质要求：机组需完成HUD起飞专项训练'] },
    { runway:'36R', aircraftCat:'C/D', lowVisProcs:[
      { condition:'HIRL + RCLL + RTZL (≥300m段)', rvr:'200m' },
      { condition:'HIRL + RCLL + RCLM (间距≤15m)', rvr:'150m' },
    ], standard:{ vis:'800m', rvr:'550m' }, remarks:['36R方向受北侧高压线塔净空限制，夜间起飞额外注意'] },
    { runway:'18R', aircraftCat:'C/D', lowVisProcs:[
      { condition:'HIRL + RCLL', rvr:'250m' },
    ], standard:{ vis:'800m', rvr:'550m' }, remarks:['4E跑道，辅助起降方向'] },
    { runway:'36L', aircraftCat:'C/D', lowVisProcs:[
      { condition:'HIRL + RCLL', rvr:'250m' },
    ], standard:{ vis:'800m', rvr:'550m' }, remarks:['同18R标准对称'] },
    { runway:'01', aircraftCat:'C/D', lowVisProcs:[
      { condition:'HIRL + RCLL + RTZL', rvr:'200m' },
      { condition:'HIRL + RCLL + RCLM + HUD', rvr:'125m' },
    ], standard:{ vis:'800m', rvr:'550m' }, remarks:['主要降落跑道，起飞为辅','01方向起飞梯度充足，无净空限制'] },
    { runway:'19', aircraftCat:'C/D', lowVisProcs:[
      { condition:'HIRL + RCLL + RTZL', rvr:'200m' },
    ], standard:{ vis:'800m', rvr:'550m' }, remarks:['19方向起飞后立即进入B215航路扇区'] },
  ],
  ZSSS: [
    { runway:'18L', aircraftCat:'C/D', lowVisProcs:[
      { condition:'HIRL (全段)', rvr:'300m' },
    ], standard:{ vis:'900m', rvr:'550m' }, remarks:['近距离平行跑道(间距365m)，起飞需与18R协调离场间隔','无RCLL跑道，低能见度标准较高'] },
    { runway:'36R', aircraftCat:'C/D', lowVisProcs:[
      { condition:'HIRL (全段)', rvr:'300m' },
    ], standard:{ vis:'900m', rvr:'550m' }, remarks:['36R起飞受市区噪声限制，有特定减噪程序'] },
    { runway:'18R', aircraftCat:'C/D', lowVisProcs:[
      { condition:'HIRL + RCLL', rvr:'200m' },
    ], standard:{ vis:'800m', rvr:'550m' }, remarks:['较宽跑道(60m)，主要起飞方向','具备RCLL灯光，低能见度运行条件优于18L'] },
    { runway:'36L', aircraftCat:'C/D', lowVisProcs:[
      { condition:'HIRL + RCLL', rvr:'200m' },
    ], standard:{ vis:'800m', rvr:'550m' }, remarks:['36L方向同18R标准'] },
  ],
  ZSPD: [
    { runway:'17L', aircraftCat:'C/D', lowVisProcs:[
      { condition:'HIRL + RCLL + RTZL', rvr:'175m' },
      { condition:'HIRL + RCLL + RCLM + HUD', rvr:'125m' },
    ], standard:{ vis:'800m', rvr:'550m' }, remarks:['4F跑道，1999年投用。机场主要起飞跑道之一'] },
    { runway:'35R', aircraftCat:'C/D', lowVisProcs:[
      { condition:'HIRL + RCLL + RTZL', rvr:'175m' },
    ], standard:{ vis:'800m', rvr:'550m' }, remarks:['35R方向标准同17L'] },
    { runway:'16R', aircraftCat:'C/D', lowVisProcs:[
      { condition:'HIRL + RCLL', rvr:'200m' },
    ], standard:{ vis:'800m', rvr:'550m' }, remarks:['4F跑道，2005年投用，以起飞为主'] },
    { runway:'34L', aircraftCat:'C/D', lowVisProcs:[
      { condition:'HIRL + RCLL', rvr:'200m' },
    ], standard:{ vis:'800m', rvr:'550m' }, remarks:['34L方向同16R标准'] },
    { runway:'17R', aircraftCat:'C/D', lowVisProcs:[
      { condition:'HIRL', rvr:'300m' },
    ], standard:{ vis:'900m', rvr:'550m' }, remarks:['外侧跑道，CAT I标准'] },
    { runway:'16L', aircraftCat:'C/D', lowVisProcs:[
      { condition:'HIRL + RCLL + RTZL', rvr:'175m' },
      { condition:'HIRL + RCLL + RCLM + HUD', rvr:'125m' },
    ], standard:{ vis:'800m', rvr:'550m' }, remarks:['4F跑道，2015年投用，机场最新跑道'] },
  ],
  ZGGG: [
    { runway:'01L', aircraftCat:'C/D', lowVisProcs:[
      { condition:'HIRL', rvr:'350m' },
    ], standard:{ vis:'1000m', rvr:'550m' }, remarks:['2025年新投用跑道，设备调试期标准暂保守'] },
    { runway:'19R', aircraftCat:'C/D', lowVisProcs:[
      { condition:'HIRL', rvr:'350m' },
    ], standard:{ vis:'1000m', rvr:'550m' }, remarks:['同01L'] },
    { runway:'01R', aircraftCat:'C/D', lowVisProcs:[
      { condition:'HIRL + RCLL', rvr:'200m' },
    ], standard:{ vis:'800m', rvr:'550m' }, remarks:['内侧跑道，起飞专用方向'] },
    { runway:'02L', aircraftCat:'C/D', lowVisProcs:[
      { condition:'HIRL + RCLL + RTZL', rvr:'175m' },
      { condition:'HIRL + RCLL + RCLM + HUD', rvr:'125m' },
    ], standard:{ vis:'800m', rvr:'550m' }, remarks:['4F跑道，可起降A380','低能见度起飞程序已批准'] },
    { runway:'20R', aircraftCat:'C/D', lowVisProcs:[
      { condition:'HIRL + RCLL + RTZL', rvr:'175m' },
    ], standard:{ vis:'800m', rvr:'550m' }, remarks:['同02L标准'] },
  ],
  ZUUU: [
    { runway:'02L', aircraftCat:'C/D', lowVisProcs:[
      { condition:'HIRL + RCLL + RTZL', rvr:'200m' },
      { condition:'HIRL + RCLL + RCLM + HUD', rvr:'150m' },
    ], standard:{ vis:'800m', rvr:'550m' }, remarks:['西跑道(4E)，02L方向CAT II进近跑道，起飞标准已批准低能见度'] },
    { runway:'20R', aircraftCat:'C/D', lowVisProcs:[
      { condition:'HIRL + RCLL', rvr:'250m' },
    ], standard:{ vis:'800m', rvr:'550m' }, remarks:['20R方向标准同02L'] },
    { runway:'02R', aircraftCat:'C/D', lowVisProcs:[
      { condition:'HIRL + RCLL', rvr:'200m' },
    ], standard:{ vis:'800m', rvr:'550m' }, remarks:['东跑道(4F)，起飞为主'] },
  ],
  ZLXY: [
    { runway:'05L', aircraftCat:'C/D', lowVisProcs:[
      { condition:'HIRL + RCLL + RTZL', rvr:'200m' },
      { condition:'HIRL + RCLL + RCLM + HUD', rvr:'150m' },
    ], standard:{ vis:'800m', rvr:'550m' }, remarks:['南跑道(4F)，CAT II进近跑道。低能见度起飞已批准'] },
    { runway:'23R', aircraftCat:'C/D', lowVisProcs:[
      { condition:'HIRL + RCLL + RTZL', rvr:'200m' },
    ], standard:{ vis:'800m', rvr:'550m' }, remarks:['23R方向CAT I标准，无低能见度额外降级'] },
    { runway:'05R', aircraftCat:'C/D', lowVisProcs:[
      { condition:'HIRL + RCLL', rvr:'250m' },
    ], standard:{ vis:'800m', rvr:'550m' }, remarks:['北跑道(4E)，辅助起飞方向'] },
  ],
  ZUCK: [
    { runway:'02L', aircraftCat:'C/D', lowVisProcs:[
      { condition:'HIRL + RCLL + RTZL', rvr:'200m' },
      { condition:'HIRL + RCLL + RCLM + HUD', rvr:'150m' },
    ], standard:{ vis:'800m', rvr:'550m' }, remarks:['CAT II跑道，低能见度起飞已批准。机场以高效单跑道运行著称'] },
    { runway:'02R', aircraftCat:'C/D', lowVisProcs:[
      { condition:'HIRL + RCLL + RTZL', rvr:'175m' },
      { condition:'HIRL + RCLL + RCLM + HUD', rvr:'125m' },
    ], standard:{ vis:'800m', rvr:'550m' }, remarks:['4F跑道(可接收A380)，T3B对应跑道'] },
    { runway:'03', aircraftCat:'C/D', lowVisProcs:[
      { condition:'HIRL', rvr:'300m' },
    ], standard:{ vis:'900m', rvr:'550m' }, remarks:['第三跑道(4E)，主要以中短途航班为主'] },
  ],
  ZHCC: [
    { runway:'12R', aircraftCat:'C/D', lowVisProcs:[
      { condition:'HIRL + RCLL', rvr:'250m' },
    ], standard:{ vis:'800m', rvr:'550m' }, remarks:['南跑道(4F)，CAT I标准'] },
    { runway:'30L', aircraftCat:'C/D', lowVisProcs:[
      { condition:'HIRL + RCLL', rvr:'250m' },
    ], standard:{ vis:'800m', rvr:'550m' }, remarks:['同12R标准'] },
    { runway:'12L', aircraftCat:'C/D', lowVisProcs:[
      { condition:'HIRL', rvr:'350m' },
    ], standard:{ vis:'1000m', rvr:'550m' }, remarks:['北跑道(4E)，辅助跑道'] },
  ],
  ZSAM: [
    { runway:'05', aircraftCat:'C/D', lowVisProcs:[
      { condition:'HIRL + RCLL', rvr:'250m' },
    ], standard:{ vis:'900m', rvr:'550m' }, remarks:['单跑道机场(4E)。05端临海，冬春季海雾频发导致RVR恶化'] },
    { runway:'23', aircraftCat:'C/D', lowVisProcs:[
      { condition:'HIRL + RCLL', rvr:'250m' },
    ], standard:{ vis:'900m', rvr:'550m' }, remarks:['23端向陆，雾散较快，RVR恢复优于05端'] },
  ],
  ZSNJ: [
    { runway:'06', aircraftCat:'C/D', lowVisProcs:[
      { condition:'HIRL + RCLL', rvr:'250m' },
    ], standard:{ vis:'800m', rvr:'550m' }, remarks:['06进近路径受紫金山净空影响，起飞梯度无限制'] },
    { runway:'24', aircraftCat:'C/D', lowVisProcs:[
      { condition:'HIRL + RCLL', rvr:'250m' },
    ], standard:{ vis:'800m', rvr:'550m' }, remarks:['24方向标准同06'] },
    { runway:'07', aircraftCat:'C/D', lowVisProcs:[
      { condition:'HIRL + RCLL + RTZL', rvr:'175m' },
      { condition:'HIRL + RCLL + RCLM + HUD', rvr:'125m' },
    ], standard:{ vis:'800m', rvr:'550m' }, remarks:['第二跑道(4F)，CAT II进近。远程国际航线主要起飞方向'] },
  ],
  ZBTJ: [
    { runway:'16R', aircraftCat:'C/D', lowVisProcs:[
      { condition:'HIRL + RCLL + RTZL', rvr:'200m' },
      { condition:'HIRL + RCLL + RCLM + HUD', rvr:'150m' },
    ], standard:{ vis:'800m', rvr:'550m' }, remarks:['西跑道(4F)，CAT II。低能见度起飞已批准'] },
    { runway:'34L', aircraftCat:'C/D', lowVisProcs:[
      { condition:'HIRL + RCLL + RTZL', rvr:'200m' },
    ], standard:{ vis:'800m', rvr:'550m' }, remarks:['同16R标准'] },
    { runway:'16L', aircraftCat:'C/D', lowVisProcs:[
      { condition:'HIRL', rvr:'300m' },
    ], standard:{ vis:'900m', rvr:'550m' }, remarks:['东跑道(4E)，国内中短途为主'] },
  ],
  ZSHC: [
    { runway:'07', aircraftCat:'C/D', lowVisProcs:[
      { condition:'HIRL + RCLL + RTZL', rvr:'200m' },
      { condition:'HIRL + RCLL + RCLM + HUD', rvr:'150m' },
    ], standard:{ vis:'800m', rvr:'550m' }, remarks:['07方向CAT II跑道。冬春多晨雾，RVR波动较大'] },
    { runway:'25', aircraftCat:'C/D', lowVisProcs:[
      { condition:'HIRL + RCLL + RTZL', rvr:'200m' },
    ], standard:{ vis:'800m', rvr:'550m' }, remarks:['25方向CAT I，标准同07'] },
  ],
  ZGSZ: [
    { runway:'15', aircraftCat:'C/D', lowVisProcs:[
      { condition:'HIRL + RCLL + RTZL', rvr:'175m' },
      { condition:'HIRL + RCLL + RCLM + HUD', rvr:'125m' },
    ], standard:{ vis:'800m', rvr:'550m' }, remarks:['单跑道(4F)，15端近海。CAT II跑道，低能见度起飞已批准'] },
    { runway:'33', aircraftCat:'C/D', lowVisProcs:[
      { condition:'HIRL + RCLL + RTZL', rvr:'175m' },
    ], standard:{ vis:'800m', rvr:'550m' }, remarks:['33方向同15标准'] },
    { runway:'16', aircraftCat:'C/D', lowVisProcs:[
      { condition:'HIRL + RCLL + RTZL + HIALS', rvr:'150m' },
      { condition:'HIRL + RCLL + RCLM + HUD', rvr:'100m' },
    ], standard:{ vis:'800m', rvr:'550m' }, remarks:['第二跑道(4F)，2021年投用。规划CAT IIIA能力，低能见度标准最低'] },
  ],
  ZJHK: [
    { runway:'09', aircraftCat:'C/D', lowVisProcs:[
      { condition:'HIRL + RCLL', rvr:'250m' },
    ], standard:{ vis:'900m', rvr:'550m' }, remarks:['09端临琼州海峡，热带气旋季节需注意侧风限制(最大25kt)'] },
    { runway:'27', aircraftCat:'C/D', lowVisProcs:[
      { condition:'HIRL + RCLL', rvr:'250m' },
    ], standard:{ vis:'900m', rvr:'550m' }, remarks:['27端向陆，标准同09'] },
  ],
  ZYTX: [
    { runway:'06', aircraftCat:'C/D', lowVisProcs:[
      { condition:'HIRL + RCLL', rvr:'250m' },
    ], standard:{ vis:'900m', rvr:'550m' }, remarks:['06方向起飞注意城市净空限制。冬季需关注除冰保障时效'] },
    { runway:'24', aircraftCat:'C/D', lowVisProcs:[
      { condition:'HIRL + RCLL', rvr:'250m' },
    ], standard:{ vis:'900m', rvr:'550m' }, remarks:['24方向标准同06'] },
  ],
  ZPPP: [
    { runway:'03', aircraftCat:'C/D', lowVisProcs:[
      { condition:'HIRL + RCLL + RTZL + HIALS', rvr:'200m' },
      { condition:'HIRL + RCLL + RCLM + HUD', rvr:'150m' },
    ], standard:{ vis:'800m', rvr:'550m' }, remarks:['⚠ 高原机场(2103m)，稀薄空气影响发动机推力','起飞性能需特别计算，高温季节注意减载','CAT II跑道，低能见度起飞已批准'] },
    { runway:'21', aircraftCat:'C/D', lowVisProcs:[
      { condition:'HIRL + RCLL + RTZL + HIALS', rvr:'200m' },
    ], standard:{ vis:'800m', rvr:'550m' }, remarks:['同03标准，注意21方向起飞梯度'] },
    { runway:'04', aircraftCat:'C/D', lowVisProcs:[
      { condition:'HIRL + RCLL', rvr:'250m' },
    ], standard:{ vis:'800m', rvr:'550m' }, remarks:['第二跑道(4F)，辅降为主，起飞为辅'] },
  ],
  ZSJN: [
    { runway:'01', aircraftCat:'C/D', lowVisProcs:[
      { condition:'HIRL + RCLL', rvr:'250m' },
    ], standard:{ vis:'900m', rvr:'550m' }, remarks:['01方向顺黄河走向，春秋季沙尘天气影响RVR'] },
    { runway:'19', aircraftCat:'C/D', lowVisProcs:[
      { condition:'HIRL + RCLL', rvr:'250m' },
    ], standard:{ vis:'900m', rvr:'550m' }, remarks:['19方向同01标准'] },
  ],
  ZUGY: [
    { runway:'01', aircraftCat:'C/D', lowVisProcs:[
      { condition:'HIRL', rvr:'400m' },
    ], standard:{ vis:'1200m', rvr:'550m' }, remarks:['⚠ 高原机场(1139m)，山间谷地','01端起飞受北侧山体净空限制，需严格按SID执行','多云雾天气常影响运行，起飞标准较高'] },
    { runway:'19', aircraftCat:'C/D', lowVisProcs:[
      { condition:'HIRL', rvr:'400m' },
    ], standard:{ vis:'1200m', rvr:'550m' }, remarks:['19方向南方净空较好，但跑道长度仅3200m限制重型机'] },
  ],
  ZWWW: [
    { runway:'07', aircraftCat:'C/D', lowVisProcs:[
      { condition:'HIRL + RCLL + RTZL (≥300m段)', rvr:'200m' },
      { condition:'HIRL + RCLL + RCLM (间距≤15m)', rvr:'150m' },
      { condition:'HIRL + RCLL + RCLM (间距≤15m) + HUD', rvr:'125m' },
    ], standard:{ vis:'800m', rvr:'550m' }, remarks:['起飞最低标准：RVR 550m（基本）','低能见度起飞程序已批准，最小 RVR 125m'] },
    { runway:'25', aircraftCat:'C/D', lowVisProcs:[
      { condition:'HIRL + RCLL + RTZL', rvr:'200m' },
      { condition:'HIRL + RCLL + RCLM', rvr:'150m' },
    ], standard:{ vis:'800m', rvr:'550m' }, remarks:['起飞最低标准：RVR 550m（基本）','25方向起飞梯度受限，注意离场程序爬升要求'] },
    { runway:'08R', aircraftCat:'C/D', lowVisProcs:[
      { condition:'HIRL + RCLL', rvr:'200m' },
    ], standard:{ vis:'800m', rvr:'550m' }, remarks:['北二跑道(4F)，主要负责离场'] },
    { runway:'26L', aircraftCat:'C/D', lowVisProcs:[
      { condition:'HIRL + RCLL', rvr:'200m' },
    ], standard:{ vis:'800m', rvr:'550m' }, remarks:['北二跑道反向，标准同08R'] },
  ],
  ZLLL: [
    { runway:'18', aircraftCat:'C/D', lowVisProcs:[
      { condition:'HIRL + RCLL', rvr:'250m' },
    ], standard:{ vis:'900m', rvr:'550m' }, remarks:['⚠ 高原机场(1947m)，起飞性能需注意减载计算','单跑道(4E)，2015年新跑道投用'] },
    { runway:'36', aircraftCat:'C/D', lowVisProcs:[
      { condition:'HIRL + RCLL', rvr:'250m' },
    ], standard:{ vis:'900m', rvr:'550m' }, remarks:['36方向同18标准'] },
  ],
  ZBNY: [
    { runway:'18', aircraftCat:'C/D', lowVisProcs:[
      { condition:'MIRL', rvr:'500m' },
    ], standard:{ vis:'1500m', rvr:'800m' }, remarks:['军用/通航机场，2019年停运民用航班。仅MIRL灯光，低能见度标准较高'] },
  ],
  ZHHH: [
    { runway:'04L', aircraftCat:'C/D', lowVisProcs:[
      { condition:'HIRL + RCLL + RTZL', rvr:'200m' },
      { condition:'HIRL + RCLL + RCLM + HUD', rvr:'150m' },
    ], standard:{ vis:'800m', rvr:'550m' }, remarks:['东跑道(4F)，CAT II进近跑道。低能见度起飞已批准'] },
    { runway:'22R', aircraftCat:'C/D', lowVisProcs:[
      { condition:'HIRL + RCLL + RTZL', rvr:'200m' },
    ], standard:{ vis:'800m', rvr:'550m' }, remarks:['22R方向同04L标准'] },
    { runway:'04R', aircraftCat:'C/D', lowVisProcs:[
      { condition:'HIRL + RCLL', rvr:'250m' },
    ], standard:{ vis:'800m', rvr:'550m' }, remarks:['西跑道(4E)，辅助起飞方向'] },
  ],
}

// ==================== 着陆标准（22个机场完整数据） ====================
export const MOCK_LANDING_MINIMA: Record<string, LandingMinima[]> = {
  ZBAA: [
    { runway:'18L', approach:'ILS CAT II', aircraftCat:'C/D', dh:'30m (100ft)', rvrVis:'RVR 300m', als:'FALS (900m)', remarks:'4F跑道，双机组+HUD运行' },
    { runway:'18L', approach:'ILS CAT I', aircraftCat:'C', dh:'60m (200ft)', rvrVis:'RVR 550m', als:'FALS (900m)', remarks:'精密进近CAT I标准' },
    { runway:'18L', approach:'RNAV GNSS', aircraftCat:'C/D', dh:'80m (260ft)', rvrVis:'RVR 800m', als:'FALS', remarks:'LNAV/VNAV' },
    { runway:'18R', approach:'ILS CAT I', aircraftCat:'C', dh:'65m (213ft)', rvrVis:'RVR 600m', als:'IALS', remarks:'4E跑道，辅助进近方向' },
    { runway:'18R', approach:'VOR/DME', aircraftCat:'C', dh:'—', rvrVis:'VIS 1800m', als:'IALS', remarks:'非精密进近' },
    { runway:'01', approach:'ILS CAT II', aircraftCat:'C/D', dh:'30m (100ft)', rvrVis:'RVR 300m', als:'FALS (900m)', remarks:'主要降落跑道' },
    { runway:'01', approach:'ILS CAT I', aircraftCat:'C/D', dh:'60m (200ft)', rvrVis:'RVR 550m', als:'FALS (900m)', remarks:'' },
    { runway:'19', approach:'ILS CAT I', aircraftCat:'C', dh:'60m (200ft)', rvrVis:'RVR 600m', als:'FALS (900m)', remarks:'' },
    { runway:'19', approach:'RNAV GNSS', aircraftCat:'C', dh:'85m (280ft)', rvrVis:'RVR 900m', als:'FALS', remarks:'' },
  ],
  ZSSS: [
    { runway:'18L', approach:'ILS CAT I', aircraftCat:'C', dh:'65m (213ft)', rvrVis:'RVR 600m', als:'IALS', remarks:'近距离平行跑道(间距365m)，精密进近标准较高' },
    { runway:'18L', approach:'VOR/DME', aircraftCat:'C/D', dh:'—', rvrVis:'VIS 2000m', als:'IALS', remarks:'非精密进近' },
    { runway:'18L', approach:'RNAV GNSS', aircraftCat:'C', dh:'90m (295ft)', rvrVis:'RVR 1000m', als:'IALS', remarks:'' },
    { runway:'18R', approach:'ILS CAT I', aircraftCat:'C/D', dh:'60m (200ft)', rvrVis:'RVR 550m', als:'FALS (900m)', remarks:'较宽跑道(60m)，着陆条件优于18L' },
    { runway:'18R', approach:'RNAV GNSS', aircraftCat:'C', dh:'80m (260ft)', rvrVis:'RVR 850m', als:'FALS', remarks:'' },
  ],
  ZSPD: [
    { runway:'16L', approach:'ILS CAT II', aircraftCat:'C/D', dh:'30m (100ft)', rvrVis:'RVR 300m', als:'FALS (900m)', remarks:'4F跑道(2015年投用)，CAT II精密进近' },
    { runway:'16L', approach:'ILS CAT I', aircraftCat:'C', dh:'60m (200ft)', rvrVis:'RVR 550m', als:'FALS (900m)', remarks:'' },
    { runway:'17R', approach:'ILS CAT I', aircraftCat:'C/D', dh:'65m (213ft)', rvrVis:'RVR 600m', als:'IALS', remarks:'外侧跑道，CAT I标准' },
    { runway:'17R', approach:'VOR', aircraftCat:'C', dh:'—', rvrVis:'VIS 2200m', als:'IALS', remarks:'' },
    { runway:'17R', approach:'RNAV GNSS', aircraftCat:'C', dh:'95m (310ft)', rvrVis:'RVR 1100m', als:'IALS', remarks:'' },
    { runway:'35L', approach:'ILS CAT I', aircraftCat:'C', dh:'60m (200ft)', rvrVis:'RVR 600m', als:'FALS (900m)', remarks:'17R反向着陆' },
  ],
  ZGGG: [
    { runway:'01L', approach:'ILS CAT I', aircraftCat:'C', dh:'70m (230ft)', rvrVis:'RVR 700m', als:'IALS', remarks:'2025年新投用跑道' },
    { runway:'01L', approach:'RNAV GNSS', aircraftCat:'C', dh:'100m (330ft)', rvrVis:'RVR 1200m', als:'IALS', remarks:'' },
    { runway:'01R', approach:'ILS CAT I', aircraftCat:'C/D', dh:'60m (200ft)', rvrVis:'RVR 550m', als:'FALS (900m)', remarks:'内侧跑道' },
    { runway:'02L', approach:'ILS CAT II', aircraftCat:'C/D', dh:'30m (100ft)', rvrVis:'RVR 300m', als:'FALS (900m)', remarks:'4F跑道，可起降A380' },
    { runway:'02L', approach:'ILS CAT I', aircraftCat:'C', dh:'60m (200ft)', rvrVis:'RVR 550m', als:'FALS (900m)', remarks:'' },
    { runway:'20R', approach:'ILS CAT I', aircraftCat:'C/D', dh:'60m (200ft)', rvrVis:'RVR 550m', als:'FALS (900m)', remarks:'02L反向' },
  ],
  ZUUU: [
    { runway:'02L', approach:'ILS CAT II', aircraftCat:'C/D', dh:'30m (100ft)', rvrVis:'RVR 300m', als:'FALS (900m)', remarks:'西跑道CAT II，双机组+自动着陆要求' },
    { runway:'02L', approach:'ILS CAT I', aircraftCat:'C', dh:'60m (200ft)', rvrVis:'RVR 550m', als:'FALS (900m)', remarks:'' },
    { runway:'20R', approach:'ILS CAT I', aircraftCat:'C', dh:'60m (200ft)', rvrVis:'RVR 600m', als:'FALS (900m)', remarks:'02L反向，CAT I标准' },
    { runway:'02L', approach:'RNAV GNSS', aircraftCat:'C', dh:'85m (280ft)', rvrVis:'RVR 900m', als:'FALS', remarks:'' },
    { runway:'02R', approach:'ILS CAT I', aircraftCat:'C/D', dh:'60m (200ft)', rvrVis:'RVR 550m', als:'FALS (900m)', remarks:'东跑道(4F)' },
  ],
  ZLXY: [
    { runway:'05L', approach:'ILS CAT II', aircraftCat:'C/D', dh:'30m (100ft)', rvrVis:'RVR 300m', als:'FALS (900m)', remarks:'南跑道(4F)，CAT II精密进近' },
    { runway:'05L', approach:'ILS CAT I', aircraftCat:'C', dh:'60m (200ft)', rvrVis:'RVR 550m', als:'FALS (900m)', remarks:'' },
    { runway:'23R', approach:'ILS CAT I', aircraftCat:'C', dh:'65m (213ft)', rvrVis:'RVR 600m', als:'FALS (900m)', remarks:'05L反向' },
    { runway:'23R', approach:'RNAV GNSS', aircraftCat:'C', dh:'80m (260ft)', rvrVis:'RVR 850m', als:'FALS', remarks:'' },
    { runway:'05R', approach:'ILS CAT I', aircraftCat:'C/D', dh:'65m (213ft)', rvrVis:'RVR 600m', als:'IALS', remarks:'北跑道(4E)' },
    { runway:'05R', approach:'VOR/DME', aircraftCat:'C', dh:'—', rvrVis:'VIS 1800m', als:'IALS', remarks:'' },
  ],
  ZUCK: [
    { runway:'02L', approach:'ILS CAT II', aircraftCat:'C/D', dh:'30m (100ft)', rvrVis:'RVR 300m', als:'FALS (900m)', remarks:'T3A跑道，CAT II进近。日均起降850架次' },
    { runway:'02L', approach:'ILS CAT I', aircraftCat:'C', dh:'60m (200ft)', rvrVis:'RVR 550m', als:'FALS (900m)', remarks:'' },
    { runway:'02L', approach:'RNAV GNSS', aircraftCat:'C/D', dh:'85m (280ft)', rvrVis:'RVR 900m', als:'FALS', remarks:'' },
    { runway:'02R', approach:'ILS CAT II', aircraftCat:'C/D', dh:'30m (100ft)', rvrVis:'RVR 300m', als:'FALS (900m)', remarks:'T3B跑道(4F)，可接收A380备降' },
    { runway:'02R', approach:'ILS CAT I', aircraftCat:'C', dh:'60m (200ft)', rvrVis:'RVR 550m', als:'FALS (900m)', remarks:'' },
    { runway:'03', approach:'ILS CAT I', aircraftCat:'C', dh:'65m (213ft)', rvrVis:'RVR 600m', als:'IALS', remarks:'第三跑道(4E)' },
    { runway:'03', approach:'VOR/DME', aircraftCat:'C', dh:'—', rvrVis:'VIS 1900m', als:'IALS', remarks:'非精密进近' },
  ],
  ZHCC: [
    { runway:'12R', approach:'ILS CAT I', aircraftCat:'C/D', dh:'60m (200ft)', rvrVis:'RVR 550m', als:'FALS (900m)', remarks:'南跑道(4F)，主用进近方向' },
    { runway:'12R', approach:'VOR/DME', aircraftCat:'C', dh:'—', rvrVis:'VIS 1800m', als:'IALS', remarks:'' },
    { runway:'12R', approach:'RNAV GNSS', aircraftCat:'C', dh:'85m (280ft)', rvrVis:'RVR 900m', als:'FALS', remarks:'' },
    { runway:'12L', approach:'ILS CAT I', aircraftCat:'C', dh:'70m (230ft)', rvrVis:'RVR 650m', als:'IALS', remarks:'北跑道(4E)，辅助进近' },
  ],
  ZSAM: [
    { runway:'05', approach:'ILS CAT I', aircraftCat:'C', dh:'65m (213ft)', rvrVis:'RVR 600m', als:'FALS (900m)', remarks:'单跑道(4E)，05端临海。冬春季海雾影响进近' },
    { runway:'05', approach:'VOR/DME', aircraftCat:'C/D', dh:'—', rvrVis:'VIS 2000m', als:'IALS', remarks:'' },
    { runway:'05', approach:'RNAV GNSS', aircraftCat:'C', dh:'90m (295ft)', rvrVis:'RVR 1000m', als:'IALS', remarks:'' },
  ],
  ZSNJ: [
    { runway:'06', approach:'ILS CAT I', aircraftCat:'C', dh:'65m (213ft)', rvrVis:'RVR 600m', als:'FALS (900m)', remarks:'⚠ 06进近路径受紫金山净空限制，注意最低下降高度' },
    { runway:'06', approach:'RNAV GNSS', aircraftCat:'C/D', dh:'90m (295ft)', rvrVis:'RVR 1000m', als:'FALS', remarks:'' },
    { runway:'07', approach:'ILS CAT II', aircraftCat:'C/D', dh:'30m (100ft)', rvrVis:'RVR 300m', als:'FALS (900m)', remarks:'第二跑道(4F)，远程国际航线主降方向' },
    { runway:'07', approach:'ILS CAT I', aircraftCat:'C', dh:'60m (200ft)', rvrVis:'RVR 550m', als:'FALS (900m)', remarks:'' },
    { runway:'25', approach:'ILS CAT I', aircraftCat:'C', dh:'60m (200ft)', rvrVis:'RVR 600m', als:'FALS (900m)', remarks:'07反向' },
  ],
  ZBTJ: [
    { runway:'16R', approach:'ILS CAT II', aircraftCat:'C/D', dh:'30m (100ft)', rvrVis:'RVR 300m', als:'FALS (900m)', remarks:'西跑道(4F)，CAT II进近' },
    { runway:'16R', approach:'ILS CAT I', aircraftCat:'C', dh:'60m (200ft)', rvrVis:'RVR 550m', als:'FALS (900m)', remarks:'' },
    { runway:'16L', approach:'ILS CAT I', aircraftCat:'C/D', dh:'65m (213ft)', rvrVis:'RVR 600m', als:'IALS', remarks:'东跑道(4E)' },
    { runway:'16L', approach:'VOR/DME', aircraftCat:'C', dh:'—', rvrVis:'VIS 1900m', als:'IALS', remarks:'' },
    { runway:'16L', approach:'RNAV GNSS', aircraftCat:'C', dh:'85m (280ft)', rvrVis:'RVR 900m', als:'IALS', remarks:'' },
  ],
  ZSHC: [
    { runway:'07', approach:'ILS CAT II', aircraftCat:'C/D', dh:'30m (100ft)', rvrVis:'RVR 350m', als:'FALS (900m)', remarks:'⚠ 冬春多晨雾，CAT II运行时RVR取全线最低值' },
    { runway:'07', approach:'ILS CAT I', aircraftCat:'C', dh:'60m (200ft)', rvrVis:'RVR 550m', als:'FALS (900m)', remarks:'' },
    { runway:'07', approach:'RNAV GNSS', aircraftCat:'C/D', dh:'85m (280ft)', rvrVis:'RVR 900m', als:'FALS', remarks:'' },
    { runway:'25', approach:'ILS CAT I', aircraftCat:'C', dh:'60m (200ft)', rvrVis:'RVR 600m', als:'FALS (900m)', remarks:'07反向' },
    { runway:'25', approach:'VOR/DME', aircraftCat:'C', dh:'—', rvrVis:'VIS 1800m', als:'IALS', remarks:'' },
  ],
  ZGSZ: [
    { runway:'15', approach:'ILS CAT II', aircraftCat:'C/D', dh:'30m (100ft)', rvrVis:'RVR 300m', als:'FALS (900m)', remarks:'单跑道(4F)，贯穿填海区域' },
    { runway:'15', approach:'ILS CAT I', aircraftCat:'C', dh:'60m (200ft)', rvrVis:'RVR 550m', als:'FALS (900m)', remarks:'' },
    { runway:'15', approach:'RNAV GNSS', aircraftCat:'C', dh:'80m (260ft)', rvrVis:'RVR 850m', als:'FALS', remarks:'' },
    { runway:'16', approach:'ILS CAT II', aircraftCat:'C/D', dh:'30m (100ft)', rvrVis:'RVR 275m', als:'FALS (900m)', remarks:'第二跑道(4F)，22年投用。规划CAT IIIA' },
    { runway:'16', approach:'RNAV GNSS', aircraftCat:'C/D', dh:'75m (245ft)', rvrVis:'RVR 800m', als:'FALS', remarks:'' },
  ],
  ZJHK: [
    { runway:'09', approach:'ILS CAT I', aircraftCat:'C', dh:'65m (213ft)', rvrVis:'RVR 600m', als:'FALS (900m)', remarks:'09端临琼州海峡，热带气旋注意侧风(25kt限制)' },
    { runway:'09', approach:'VOR/DME', aircraftCat:'C/D', dh:'—', rvrVis:'VIS 2000m', als:'IALS', remarks:'' },
    { runway:'09', approach:'RNAV GNSS', aircraftCat:'C', dh:'90m (295ft)', rvrVis:'RVR 1000m', als:'FALS', remarks:'' },
  ],
  ZYTX: [
    { runway:'06', approach:'ILS CAT I', aircraftCat:'C/D', dh:'65m (213ft)', rvrVis:'RVR 600m', als:'FALS (900m)', remarks:'⚠ 冬季需关注除冰后道面摩擦系数，06端城市净空限制' },
    { runway:'06', approach:'RNAV GNSS', aircraftCat:'C', dh:'85m (280ft)', rvrVis:'RVR 900m', als:'FALS', remarks:'' },
    { runway:'06', approach:'NDB/DME', aircraftCat:'C/D', dh:'—', rvrVis:'VIS 2500m', als:'IALS', remarks:'非精密进近，NDB备降程序' },
  ],
  ZPPP: [
    { runway:'03', approach:'ILS CAT II', aircraftCat:'C/D', dh:'35m (115ft)', rvrVis:'RVR 350m', als:'FALS (900m)', remarks:'⚠ 高原机场(2103m)，标高导致DH偏高。稀薄空气影响着陆性能，注意着陆距离计算' },
    { runway:'03', approach:'ILS CAT I', aircraftCat:'C', dh:'70m (230ft)', rvrVis:'RVR 600m', als:'FALS (900m)', remarks:'高原机场CAT I标准上浮' },
    { runway:'03', approach:'VOR/DME', aircraftCat:'C', dh:'—', rvrVis:'VIS 2500m', als:'IALS', remarks:'高原非精密进近标准较高' },
    { runway:'03', approach:'RNAV GNSS', aircraftCat:'C/D', dh:'100m (330ft)', rvrVis:'RVR 1200m', als:'FALS', remarks:'' },
    { runway:'04', approach:'ILS CAT I', aircraftCat:'C', dh:'70m (230ft)', rvrVis:'RVR 600m', als:'FALS (900m)', remarks:'第二跑道(4F)' },
  ],
  ZSJN: [
    { runway:'01', approach:'ILS CAT I', aircraftCat:'C', dh:'65m (213ft)', rvrVis:'RVR 600m', als:'FALS (900m)', remarks:'⚠ 春秋季沙尘天气影响能见度，着陆前注意RVR报' },
    { runway:'01', approach:'VOR/DME', aircraftCat:'C/D', dh:'—', rvrVis:'VIS 2000m', als:'IALS', remarks:'' },
    { runway:'01', approach:'RNAV GNSS', aircraftCat:'C', dh:'85m (280ft)', rvrVis:'RVR 900m', als:'FALS', remarks:'' },
  ],
  ZUGY: [
    { runway:'01', approach:'ILS CAT I', aircraftCat:'C', dh:'80m (262ft)', rvrVis:'RVR 750m', als:'IALS', remarks:'⚠ 高原机场(1139m)+山间谷地，进近标准大幅上浮。山体净空影响，01端着陆需严格按STAR执行' },
    { runway:'01', approach:'VOR/DME', aircraftCat:'C/D', dh:'—', rvrVis:'VIS 2800m', als:'BALS', remarks:'非精密进近，山间谷地影响视线' },
    { runway:'01', approach:'RNAV GNSS', aircraftCat:'C', dh:'110m (360ft)', rvrVis:'RVR 1400m', als:'IALS', remarks:'' },
  ],
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
  ZLLL: [
    { runway:'18', approach:'ILS CAT I', aircraftCat:'C/D', dh:'70m (230ft)', rvrVis:'RVR 650m', als:'FALS (900m)', remarks:'⚠ 高原机场(1947m)，进近标准上浮。18端进近路径开阔' },
    { runway:'18', approach:'VOR/DME', aircraftCat:'C', dh:'—', rvrVis:'VIS 2200m', als:'IALS', remarks:'高原非精密进近' },
    { runway:'18', approach:'RNAV GNSS', aircraftCat:'C/D', dh:'100m (330ft)', rvrVis:'RVR 1100m', als:'FALS', remarks:'' },
  ],
  ZBNY: [
    { runway:'18', approach:'VOR/DME', aircraftCat:'C/D', dh:'—', rvrVis:'VIS 3000m', als:'BALS', remarks:'军用/通航机场，仅VOR非精密进近。无ILS设施' },
  ],
  ZHHH: [
    { runway:'04L', approach:'ILS CAT II', aircraftCat:'C/D', dh:'30m (100ft)', rvrVis:'RVR 300m', als:'FALS (900m)', remarks:'东跑道(4F)，主降方向。CAT II精密进近' },
    { runway:'04L', approach:'ILS CAT I', aircraftCat:'C', dh:'60m (200ft)', rvrVis:'RVR 550m', als:'FALS (900m)', remarks:'' },
    { runway:'04L', approach:'RNAV GNSS', aircraftCat:'C/D', dh:'80m (260ft)', rvrVis:'RVR 850m', als:'FALS', remarks:'' },
    { runway:'04R', approach:'ILS CAT I', aircraftCat:'C', dh:'65m (213ft)', rvrVis:'RVR 600m', als:'FALS (900m)', remarks:'西跑道(4E)，辅助进近方向' },
    { runway:'04R', approach:'VOR/DME', aircraftCat:'C/D', dh:'—', rvrVis:'VIS 1800m', als:'IALS', remarks:'' },
  ],
}
