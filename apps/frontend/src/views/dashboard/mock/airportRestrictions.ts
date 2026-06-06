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

// ---- 告警时间轴（32条，06:00 ~ 次日 02:00） ----
export const MOCK_TIMELINE: TimelineAlert[] = [
  { id:'t01', time:'06:15', icao:'ZLLL', severity:'info', summary:'跑道检查' },
  { id:'t02', time:'06:50', icao:'ZBTJ', severity:'warning', summary:'低能见度' },
  { id:'t03', time:'07:20', icao:'ZBAA', severity:'critical', summary:'跑道关闭' },
  { id:'t04', time:'07:45', icao:'ZSSS', severity:'info', summary:'导航台维护' },
  { id:'t05', time:'08:10', icao:'ZGGG', severity:'warning', summary:'跑道不可起飞' },
  { id:'t06', time:'08:35', icao:'ZSAM', severity:'info', summary:'PAPI 测试' },
  { id:'t07', time:'09:00', icao:'ZUCK', severity:'warning', summary:'滑行道关闭' },
  { id:'t08', time:'09:30', icao:'ZHCC', severity:'critical', summary:'机场不可着陆' },
  { id:'t09', time:'10:05', icao:'ZSPD', severity:'warning', summary:'流控限制' },
  { id:'t10', time:'10:40', icao:'ZLXY', severity:'info', summary:'频率维护' },
  { id:'t11', time:'11:15', icao:'ZSNJ', severity:'warning', summary:'跑道不可着陆' },
  { id:'t12', time:'11:50', icao:'ZUGY', severity:'info', summary:'GPS 干扰报告' },
  { id:'t13', time:'12:30', icao:'ZUUU', severity:'critical', summary:'机场关闭' },
  { id:'t14', time:'13:00', icao:'ZBAA', severity:'critical', summary:'18R 跑道关闭' },
  { id:'t15', time:'13:25', icao:'ZSJN', severity:'critical', summary:'机场关闭' },
  { id:'t16', time:'14:00', icao:'ZSSS', severity:'warning', summary:'跑道不可起飞' },
  { id:'t17', time:'14:35', icao:'ZGSZ', severity:'info', summary:'停机位调整' },
  { id:'t18', time:'15:10', icao:'ZPPP', severity:'critical', summary:'机场关闭演练' },
  { id:'t19', time:'15:45', icao:'ZUCK', severity:'warning', summary:'TWY C 关闭' },
  { id:'t20', time:'16:20', icao:'ZSHC', severity:'warning', summary:'跑道不可起飞' },
  { id:'t21', time:'16:55', icao:'ZHCC', severity:'critical', summary:'机场不可备降' },
  { id:'t22', time:'17:30', icao:'ZYTX', severity:'warning', summary:'机场不可起飞' },
  { id:'t23', time:'18:10', icao:'ZSPD', severity:'critical', summary:'机场不可着陆' },
  { id:'t24', time:'18:50', icao:'ZGGG', severity:'warning', summary:'02R 不可着陆' },
  { id:'t25', time:'19:30', icao:'ZBNY', severity:'info', summary:'无人机活动' },
  { id:'t26', time:'20:15', icao:'ZJHK', severity:'critical', summary:'台风关闭' },
  { id:'t27', time:'21:00', icao:'ZLXY', severity:'warning', summary:'05 不可着陆' },
  { id:'t28', time:'21:45', icao:'ZSSS', severity:'info', summary:'RNAV 程序更新' },
  { id:'t29', time:'22:30', icao:'ZSAM', severity:'warning', summary:'消防演练' },
  { id:'t30', time:'23:15', icao:'ZBTJ', severity:'info', summary:'除冰检查' },
  { id:'t31', time:'23:50', icao:'ZUUU', severity:'warning', summary:'02L 不可起飞' },
  { id:'t32', time:'00:40', icao:'ZHHH', severity:'info', summary:'新停机位启用' },
]

// ---- 机场限制表格（15 个机场，全天分布） ----
export const MOCK_AIRPORT_RESTRICTIONS: AirportRestriction[] = [
  { icao:'ZBAA', airportName:'北京首都', restrictions:[
    { id:'r1', type:'runway_closed', startHour:7, endHour:10.5, label:'18R/36L 跑道关闭', notamRef:'A2253/26' },
    { id:'r2', type:'taxiway_closed', startHour:14, endHour:18, label:'TWY A 关闭', notamRef:'A2261/26' },
    { id:'r3', type:'runway_no_land', startHour:20, endHour:23.5, label:'18R 不可着陆', notamRef:'A2300/26' },
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
]

// 时间范围：早晨 6 点到次日凌晨 2 点
export const TIME_RANGE = { start: 6, end: 26 }
