// ============================================================
// 左侧机场限制信息 — 模拟数据
// ============================================================

/** 告警时间轴节点 */
export interface TimelineAlert {
  id: string
  time: string // HH:MM
  icao: string
  severity: 'critical' | 'warning' | 'info'
  summary: string
}

/** 机场限制条目（表格行） */
export interface AirportRestriction {
  icao: string
  airportName: string
  restrictions: RestrictionBar[]
}

export type RestrictionType =
  | 'airport_closed'
  | 'airport_no_land'
  | 'airport_no_takeoff'
  | 'airport_no_alternate'
  | 'runway_closed'
  | 'runway_no_land'
  | 'runway_no_takeoff'
  | 'taxiway_closed'

export interface RestrictionBar {
  id: string
  type: RestrictionType
  startHour: number // 起始小时（13 = 13:00）
  endHour: number // 结束小时
  label: string // 显示文字，如 "02/20 跑道关闭"
  notamRef: string // 关联 NOTAM 编号
}

/** 限制类型中文映射 */
export const RESTRICTION_LABELS: Record<RestrictionType, string> = {
  airport_closed: '机场关闭',
  airport_no_land: '机场不可着陆',
  airport_no_takeoff: '机场不可起飞',
  airport_no_alternate: '机场不可备降',
  runway_closed: '跑道关闭',
  runway_no_land: '跑道不可着陆',
  runway_no_takeoff: '跑道不可起飞',
  taxiway_closed: '滑行道关闭',
}

/** 限制条颜色映射 */
export const RESTRICTION_COLORS: Record<RestrictionType, string> = {
  airport_closed: '#ef4444',
  airport_no_land: '#ef4444',
  airport_no_takeoff: '#10b981',
  airport_no_alternate: '#f59e0b',
  runway_closed: '#f59e0b',
  runway_no_land: '#f59e0b',
  runway_no_takeoff: '#10b981',
  taxiway_closed: '#eab308',
}

// ---- 告警时间轴（24 条） ----
export const MOCK_TIMELINE: TimelineAlert[] = [
  { id: 't1', time: '13:00', icao: 'ZBAA', severity: 'critical', summary: '跑道关闭' },
  { id: 't2', time: '13:10', icao: 'ZSAM', severity: 'info', summary: '滑行道维护' },
  { id: 't3', time: '13:20', icao: 'ZSJN', severity: 'critical', summary: '机场关闭' },
  { id: 't4', time: '13:35', icao: 'ZGGG', severity: 'warning', summary: '跑道不可起飞' },
  { id: 't5', time: '13:50', icao: 'ZSSS', severity: 'info', summary: '导航台维护' },
  { id: 't6', time: '14:05', icao: 'ZUCK', severity: 'warning', summary: '滑行道关闭' },
  { id: 't7', time: '14:20', icao: 'ZBAA', severity: 'warning', summary: '跑道不可着陆' },
  { id: 't8', time: '14:35', icao: 'ZLXY', severity: 'critical', summary: '机场不可备降' },
  { id: 't9', time: '14:50', icao: 'ZUUU', severity: 'info', summary: 'PAPI 故障' },
  { id: 't10', time: '15:05', icao: 'ZHCC', severity: 'warning', summary: '跑道关闭' },
  { id: 't11', time: '15:20', icao: 'ZSNJ', severity: 'info', summary: '频率维护' },
  { id: 't12', time: '15:35', icao: 'ZGSZ', severity: 'warning', summary: '停机位调整' },
  { id: 't13', time: '15:50', icao: 'ZBTJ', severity: 'warning', summary: '滑行道关闭' },
  { id: 't14', time: '16:05', icao: 'ZSPD', severity: 'critical', summary: '机场不可着陆' },
  { id: 't15', time: '16:20', icao: 'ZSHC', severity: 'info', summary: 'RNAV 程序更新' },
  { id: 't16', time: '16:35', icao: 'ZYTX', severity: 'warning', summary: '跑道不可起飞' },
  { id: 't17', time: '16:50', icao: 'ZPPP', severity: 'critical', summary: '机场关闭' },
  { id: 't18', time: '17:05', icao: 'ZUGY', severity: 'warning', summary: 'GPS 干扰' },
  { id: 't19', time: '17:20', icao: 'ZBNY', severity: 'info', summary: '无人机活动' },
  { id: 't20', time: '17:35', icao: 'ZJHK', severity: 'critical', summary: '台风关闭' },
  { id: 't21', time: '17:50', icao: 'ZHHH', severity: 'warning', summary: '跑道不可着陆' },
  { id: 't22', time: '18:05', icao: 'ZLLL', severity: 'info', summary: '定期维护' },
  { id: 't23', time: '18:20', icao: 'ZSAM', severity: 'warning', summary: '消防演练' },
  { id: 't24', time: '18:35', icao: 'ZSSS', severity: 'info', summary: '新停机位启用' },
]

// ---- 机场限制表格（15 个机场） ----
export const MOCK_AIRPORT_RESTRICTIONS: AirportRestriction[] = [
  { icao: 'ZBAA', airportName: '北京首都', restrictions: [
    { id: 'r1', type: 'runway_closed', startHour: 13, endHour: 15.5, label: '18R/36L 跑道关闭', notamRef: 'A2253/26' },
    { id: 'r2', type: 'taxiway_closed', startHour: 14, endHour: 17, label: 'TWY A 关闭', notamRef: 'A2261/26' },
  ]},
  { icao: 'ZSAM', airportName: '厦门高崎', restrictions: [
    { id: 'r3', type: 'runway_no_takeoff', startHour: 13, endHour: 16, label: '05/23 不可起飞', notamRef: 'A2263/26' },
  ]},
  { icao: 'ZSJN', airportName: '济南遥墙', restrictions: [
    { id: 'r4', type: 'airport_closed', startHour: 13, endHour: 18, label: '机场关闭', notamRef: 'A2272/26' },
  ]},
  { icao: 'ZGGG', airportName: '广州白云', restrictions: [
    { id: 'r5', type: 'runway_no_land', startHour: 15, endHour: 18, label: '02R/20L 不可着陆', notamRef: 'A2255/26' },
    { id: 'r6', type: 'runway_no_takeoff', startHour: 13, endHour: 15, label: '02R/20L 不可起飞', notamRef: 'A2255/26' },
  ]},
  { icao: 'ZSSS', airportName: '上海虹桥', restrictions: [
    { id: 'r7', type: 'runway_closed', startHour: 14, endHour: 17, label: '18L/36R 跑道关闭', notamRef: 'A2254/26' },
  ]},
  { icao: 'ZUCK', airportName: '重庆江北', restrictions: [
    { id: 'r8', type: 'taxiway_closed', startHour: 13, endHour: 15.5, label: 'TWY C 关闭', notamRef: 'A2258/26' },
  ]},
  { icao: 'ZUUU', airportName: '成都双流', restrictions: [
    { id: 'r9', type: 'runway_no_takeoff', startHour: 13.5, endHour: 16, label: '02L 不可起飞', notamRef: 'A2256/26' },
    { id: 'r91', type: 'taxiway_closed', startHour: 15, endHour: 17.5, label: 'TWY D 关闭', notamRef: 'A2256/26' },
  ]},
  { icao: 'ZLXY', airportName: '西安咸阳', restrictions: [
    { id: 'r10', type: 'runway_no_land', startHour: 14, endHour: 17.5, label: '05/23 不可着陆', notamRef: 'A2259/26' },
  ]},
  { icao: 'ZBTJ', airportName: '天津滨海', restrictions: [
    { id: 'r11', type: 'runway_closed', startHour: 13.5, endHour: 16, label: '16R/34L 跑道关闭', notamRef: 'A2261/26' },
  ]},
  { icao: 'ZSPD', airportName: '上海浦东', restrictions: [
    { id: 'r12', type: 'airport_no_land', startHour: 14.5, endHour: 18, label: '机场不可着陆', notamRef: 'A2288/26' },
    { id: 'r13', type: 'runway_no_takeoff', startHour: 13, endHour: 14.5, label: '16L/34R 不可起飞', notamRef: 'A2288/26' },
  ]},
  { icao: 'ZSHC', airportName: '杭州萧山', restrictions: [
    { id: 'r14', type: 'runway_no_takeoff', startHour: 14, endHour: 17, label: '07/25 不可起飞', notamRef: 'A2289/26' },
  ]},
  { icao: 'ZHCC', airportName: '郑州新郑', restrictions: [
    { id: 'r15', type: 'runway_closed', startHour: 13, endHour: 15, label: '12R/30L 跑道关闭', notamRef: 'A2260/26' },
  ]},
  { icao: 'ZYTX', airportName: '沈阳桃仙', restrictions: [
    { id: 'r16', type: 'airport_no_takeoff', startHour: 15, endHour: 18, label: '机场不可起飞', notamRef: 'A2290/26' },
  ]},
  { icao: 'ZPPP', airportName: '昆明长水', restrictions: [
    { id: 'r17', type: 'airport_closed', startHour: 14, endHour: 17.5, label: '机场关闭（演练）', notamRef: 'A2268/26' },
  ]},
  { icao: 'ZJHK', airportName: '海口美兰', restrictions: [
    { id: 'r18', type: 'airport_closed', startHour: 16, endHour: 18, label: '台风关闭', notamRef: 'A2291/26' },
  ]},
]

export const TIME_RANGE = { start: 13, end: 18 }
