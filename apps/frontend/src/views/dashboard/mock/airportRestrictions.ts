// ============================================================
// 左侧机场限制信息 — 全天模拟数据
// ============================================================

export interface TimelineAlert {
  id: string; time: string; icao: string; severity: 'critical' | 'warning' | 'info'; summary: string
}

export interface AirportRestriction {
  icao: string; airportName: string; restrictions: RestrictionBar[]
}

export type RestrictionType =
  | 'airport_closed' | 'airport_no_land' | 'airport_no_takeoff'
  | 'airport_no_alternate' | 'runway_closed' | 'runway_no_land'
  | 'runway_no_takeoff' | 'taxiway_closed'

export interface RestrictionBar {
  id: string; type: RestrictionType; startHour: number; endHour: number
  label: string; notamRef: string
}

export const RESTRICTION_LABELS: Record<RestrictionType, string> = {
  airport_closed: '机场关闭', airport_no_land: '机场不可着陆',
  airport_no_takeoff: '机场不可起飞', airport_no_alternate: '机场不可备降',
  runway_closed: '跑道关闭', runway_no_land: '跑道不可着陆',
  runway_no_takeoff: '跑道不可起飞', taxiway_closed: '滑行道关闭',
}


// ---- 机场限制表格（15 个机场，全天分布） ----
export const MOCK_AIRPORT_RESTRICTIONS: AirportRestriction[] = [
  { icao:'ZBAA', airportName:'北京首都', restrictions:[
    { id:'r1', type:'runway_closed', startHour:7, endHour:10.5, label:'18R/36L 跑道关闭', notamRef:'A2253/26' },
    { id:'r2', type:'taxiway_closed', startHour:14, endHour:18, label:'TWY A 关闭', notamRef:'A2261/26' },
    { id:'r3', type:'runway_no_land', startHour:20, endHour:23.5, label:'18R 不可着陆', notamRef:'A2300/26' },
    { id:'r38', type:'runway_no_takeoff', startHour:25, endHour:29, label:'36L 不可起飞', notamRef:'A2601/26' },
  ]},
  { icao:'ZSAM', airportName:'厦门高崎', restrictions:[
    { id:'r4', type:'runway_no_takeoff', startHour:6, endHour:9, label:'05/23 不可起飞', notamRef:'A2263/26' },
    { id:'r5', type:'taxiway_closed', startHour:21, endHour:24, label:'TWY B 关闭', notamRef:'A2301/26' },
  ]},
  { icao:'ZSJN', airportName:'济南遥墙', restrictions:[
    { id:'r6', type:'airport_closed', startHour:12, endHour:18, label:'机场关闭', notamRef:'A2272/26' },
  ]},
  { icao:'ZGGG', airportName:'广州白云', restrictions:[
    { id:'r7', type:'runway_no_takeoff', startHour:8, endHour:11, label:'02R/20L 不可起飞', notamRef:'A2255/26' },
    { id:'r8', type:'runway_no_land', startHour:17, endHour:21, label:'02R/20L 不可着陆', notamRef:'A2255/26' },
  ]},
  { icao:'ZSSS', airportName:'上海虹桥', restrictions:[
    { id:'r9', type:'runway_closed', startHour:13, endHour:17, label:'18L/36R 跑道关闭', notamRef:'A2254/26' },
    { id:'r10', type:'runway_no_takeoff', startHour:22, endHour:25, label:'18L 不可起飞', notamRef:'A2302/26' },
  ]},
  { icao:'ZUCK', airportName:'重庆江北', restrictions:[
    { id:'r11', type:'taxiway_closed', startHour:9, endHour:12, label:'TWY C 关闭', notamRef:'A2258/26' },
    { id:'r12', type:'runway_no_takeoff', startHour:19, endHour:22, label:'02R 不可起飞', notamRef:'A2303/26' },
  ]},
  { icao:'ZUUU', airportName:'成都双流', restrictions:[
    { id:'r13', type:'runway_no_takeoff', startHour:6.5, endHour:10, label:'02L 不可起飞', notamRef:'A2256/26' },
    { id:'r14', type:'taxiway_closed', startHour:15, endHour:18.5, label:'TWY D 关闭', notamRef:'A2256/26' },
    { id:'r15', type:'airport_no_land', startHour:23, endHour:26, label:'机场不可着陆', notamRef:'A2304/26' },
    { id:'r40', type:'runway_closed', startHour:26, endHour:30, label:'02R/20L 跑道关闭', notamRef:'A2603/26' },
  ]},
  { icao:'ZLXY', airportName:'西安咸阳', restrictions:[
    { id:'r16', type:'runway_no_land', startHour:10, endHour:14, label:'05/23 不可着陆', notamRef:'A2259/26' },
    { id:'r17', type:'runway_closed', startHour:20, endHour:23, label:'05 跑道关闭', notamRef:'A2305/26' },
  ]},
  { icao:'ZBTJ', airportName:'天津滨海', restrictions:[
    { id:'r18', type:'runway_closed', startHour:6, endHour:8.5, label:'16R/34L 跑道关闭', notamRef:'A2261/26' },
  ]},
  { icao:'ZSPD', airportName:'上海浦东', restrictions:[
    { id:'r19', type:'airport_no_land', startHour:17, endHour:22, label:'机场不可着陆', notamRef:'A2288/26' },
    { id:'r20', type:'runway_no_takeoff', startHour:8, endHour:12, label:'16L/34R 不可起飞', notamRef:'A2288/26' },
    { id:'r39', type:'airport_no_alternate', startHour:24, endHour:28.5, label:'机场不可备降', notamRef:'A2602/26' },
  ]},
  { icao:'ZSHC', airportName:'杭州萧山', restrictions:[
    { id:'r21', type:'runway_no_takeoff', startHour:14, endHour:18, label:'07/25 不可起飞', notamRef:'A2289/26' },
  ]},
  { icao:'ZHCC', airportName:'郑州新郑', restrictions:[
    { id:'r22', type:'runway_closed', startHour:8, endHour:11, label:'12R/30L 跑道关闭', notamRef:'A2260/26' },
    { id:'r23', type:'airport_no_alternate', startHour:20, endHour:24, label:'机场不可备降', notamRef:'A2306/26' },
  ]},
  { icao:'ZYTX', airportName:'沈阳桃仙', restrictions:[
    { id:'r24', type:'airport_no_takeoff', startHour:16, endHour:20, label:'机场不可起飞', notamRef:'A2290/26' },
  ]},
  { icao:'ZPPP', airportName:'昆明长水', restrictions:[
    { id:'r25', type:'airport_closed', startHour:12, endHour:16.5, label:'机场关闭（演练）', notamRef:'A2268/26' },
    { id:'r26', type:'runway_no_takeoff', startHour:22, endHour:24.5, label:'03/21 不可起飞', notamRef:'A2307/26' },
  ]},
  { icao:'ZJHK', airportName:'海口美兰', restrictions:[
    { id:'r27', type:'airport_closed', startHour:19, endHour:25, label:'台风关闭', notamRef:'A2291/26' },
  ]},
  { icao:'ZWWW', airportName:'乌鲁木齐天山', restrictions:[
    { id:'r28', type:'runway_closed', startHour:8, endHour:20, label:'07/25 跑道改造关闭', notamRef:'A2310/26' },
    { id:'r29', type:'taxiway_closed', startHour:6, endHour:18, label:'A3 联络道关闭', notamRef:'A2311/26' },
  ]},
  // ---- 夜间/次日限制（00:00-08:00，共用机场条） ----
  { icao:'ZGSZ', airportName:'深圳宝安', restrictions:[
    { id:'r30', type:'airport_closed', startHour:24.5, endHour:28, label:'夜间施工关闭', notamRef:'A2501/26' },
  ]},
  { icao:'ZSNJ', airportName:'南京禄口', restrictions:[
    { id:'r31', type:'runway_no_land', startHour:25, endHour:29, label:'06/24 不可着陆', notamRef:'A2502/26' },
    { id:'r32', type:'taxiway_closed', startHour:28, endHour:31.5, label:'TWY A 除冰', notamRef:'A2503/26' },
  ]},
  { icao:'ZHHH', airportName:'武汉天河', restrictions:[
    { id:'r33', type:'runway_closed', startHour:23.5, endHour:27, label:'04L/22R 跑道关闭', notamRef:'A2504/26' },
  ]},
]

// 时间范围：早晨 6 点到次日早晨 8 点
export const TIME_RANGE = { start: 6, end: 32 }

// ---- 告警时间轴（由上方限制数据自动生成，与彩色条一一对齐） ----
function h2t(h: number): string {
  const hh = Math.floor(h), mm = Math.round((h - hh) * 60)
  return String(hh).padStart(2,'0') + ':' + String(mm).padStart(2,'0')
}
function sev(t: RestrictionType): TimelineAlert['severity'] {
  if (t === 'airport_closed' || t === 'airport_no_land' || t === 'airport_no_alternate') return 'critical'
  if (t === 'runway_closed' || t === 'runway_no_land') return 'critical'
  if (t === 'runway_no_takeoff' || t === 'airport_no_takeoff') return 'warning'
  return 'info'
}
const ALL_BARS = MOCK_AIRPORT_RESTRICTIONS.flatMap(a => a.restrictions.map(b => ({ ...b, icao: a.icao })))
ALL_BARS.sort((a,b) => a.startHour - b.startHour)
export const MOCK_TIMELINE: TimelineAlert[] = ALL_BARS.map((b, i) => ({
  id: `t${String(i+1).padStart(2,'0')}`,
  time: h2t(b.startHour),
  icao: b.icao,
  severity: sev(b.type),
  summary: b.label,
}))
