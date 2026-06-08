// ============================================================
// 航班受影响分析 — 扩展模拟数据
// ============================================================

/** 时间轴节点 */
export interface TimelinePoint {
  time: string       // "14:30"
  label: string      // "PIMOL"
  isAffected: boolean
  isWaypoint: boolean
}

/** 高度剖面数据点 */
export interface AltitudePoint {
  time: string       // "14:30"
  altitude: number   // FL (100 = FL100 = 10000ft)
}

/** 禁航区（投影到高度剖面） */
export interface RestrictionZone {
  notamRef: string
  startTime: string
  endTime: string
  minAlt: number     // FL
  maxAlt: number     // FL
  label: string
}

/** 备选航线 */
export interface AlternateRoute {
  id: string
  name: string
  route: string
  waypoints: string[]
  distance: number           // NM
  affectedWaypoints: string[]
  fuelDelta: string          // "+15min"
  selected?: boolean
}

/** 完整航班分析数据 */
export interface FlightAnalysisData {
  flightNo: string
  delayMinutes: number
  originalRoute: string
  aircraftType: string
  registration: string
  depIcao: string
  arrIcao: string
  scheduledDeparture: string
  estimatedDeparture: string
  timeline: TimelinePoint[]
  altitudeProfile: AltitudePoint[]
  restrictionZones: RestrictionZone[]
  alternateRoutes: AlternateRoute[]
}

// ---- 通用时间轴点模板 ----
const makeTimeline = (
  depTime: string, flightMin: number, waypoints: { label: string; offsetMin: number; affected?: boolean }[],
): TimelinePoint[] => {
  const depDate = new Date(`2026-01-01T${depTime}:00`)
  const points: TimelinePoint[] = []
  // 起飞点
  points.push({ time: depTime, label: 'DEP', isAffected: false, isWaypoint: false })
  for (const wp of waypoints) {
    const wpDate = new Date(depDate.getTime() + wp.offsetMin * 60000)
    const hh = String(wpDate.getHours()).padStart(2, '0')
    const mm = String(wpDate.getMinutes()).padStart(2, '0')
    points.push({
      time: `${hh}:${mm}`,
      label: wp.label,
      isAffected: wp.affected || false,
      isWaypoint: true,
    })
  }
  // 降落点
  const arrDate = new Date(depDate.getTime() + flightMin * 60000)
  const arrHh = String(arrDate.getHours()).padStart(2, '0')
  const arrMm = String(arrDate.getMinutes()).padStart(2, '0')
  points.push({ time: `${arrHh}:${arrMm}`, label: 'ARR', isAffected: false, isWaypoint: false })
  return points
}

// ---- 高度剖面生成（每个航班独立数据，差异化爬升/巡航/下降） ----
const makeAltProfile = (depTime: string, flightMin: number, cruiseAlt: number, variant: number): AltitudePoint[] => {
  const dep = new Date(`2026-01-01T${depTime}:00`)
  const pts: AltitudePoint[] = []
  const toTimeStr = (d: Date) => `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`

  // 起飞
  pts.push({ time: depTime, altitude: 0 })

  // 爬升段（每个航班爬升速率不同：1800-2800 fpm）
  const climbRate = 1800 + variant * 350 // variant 0-4 → 1800-3200 fpm
  const climbMin = Math.round((cruiseAlt * 100) / climbRate)
  const climbSteps = 3 + (variant % 3)
  for (let i = 1; i <= climbSteps; i++) {
    const t = new Date(dep.getTime() + (climbMin * i / climbSteps) * 60000)
    const alt = Math.round(cruiseAlt * 100 * i / climbSteps)
    pts.push({ time: toTimeStr(t), altitude: Math.round(alt / 100) })
  }

  // 巡航段（2-3个采样点，包含阶梯爬升）
  const cruiseStart = new Date(dep.getTime() + climbMin * 60000)
  const cruiseEnd = new Date(dep.getTime() + (flightMin - 28 + variant * 3) * 60000)
  const cruiseMid = new Date((cruiseStart.getTime() + cruiseEnd.getTime()) / 2)
  pts.push({ time: toTimeStr(cruiseStart), altitude: cruiseAlt })
  if (variant % 2 === 1) pts.push({ time: toTimeStr(cruiseMid), altitude: cruiseAlt + 20 }) // 阶梯爬升
  else pts.push({ time: toTimeStr(cruiseMid), altitude: cruiseAlt })

  // 下降段（下降速率 1500-2500 fpm）
  const descendRate = 1500 + (4 - variant) * 250
  const descendMin = Math.round((cruiseAlt * 100) / descendRate)
  const descSteps = 2 + (variant % 2)
  const descStart = new Date(dep.getTime() + (flightMin - descendMin) * 60000)
  for (let i = 1; i <= descSteps; i++) {
    const t = new Date(descStart.getTime() + (descendMin * i / descSteps) * 60000)
    const remaining = cruiseAlt * 100 * (1 - i / descSteps)
    pts.push({ time: toTimeStr(t), altitude: Math.round(remaining / 100) })
  }

  // 着陆
  const arr = new Date(dep.getTime() + flightMin * 60000)
  pts.push({ time: toTimeStr(arr), altitude: 0 })

  return pts
}

// ---- 禁航区模板 ----
const makeRestrictionZones = (depTime: string, flightMin: number): RestrictionZone[] => {
  const depDate = new Date(`2026-01-01T${depTime}:00`)
  const mid = new Date(depDate.getTime() + (flightMin * 0.45) * 60000)
  const midHh = String(mid.getHours()).padStart(2, '0')
  const midMm = String(mid.getMinutes()).padStart(2, '0')
  const end = new Date(depDate.getTime() + (flightMin * 0.6) * 60000)
  const endHh = String(end.getHours()).padStart(2, '0')
  const endMm = String(end.getMinutes()).padStart(2, '0')
  return [
    {
      notamRef: 'A2253/26',
      startTime: `${midHh}:${midMm}`,
      endTime: `${endHh}:${endMm}`,
      minAlt: 200, maxAlt: 350,
      label: 'ZBAA 禁航区 A2253/26',
    },
  ]
}

// ============================================================
// 28 条航班分析数据（关键航班有完整数据，其余使用简化数据）
// ============================================================
export const MOCK_ANALYSIS: Record<string, FlightAnalysisData> = {
  // ---- 受影响航班：完整数据 ----
  MU5678: {
    flightNo: 'MU5103', delayMinutes: 36, originalRoute: 'ZSSS PIMOL A593 P54 W554 SAREX ZGGG',
    aircraftType: 'B738', registration: 'B-5678',
    depIcao: 'ZSSS', arrIcao: 'ZGGG',
    scheduledDeparture: '13:30', estimatedDeparture: '14:05',
    timeline: makeTimeline('13:30', 150, [
      { label: 'PIMOL', offsetMin: 18, affected: true },
      { label: 'P54', offsetMin: 55 },
      { label: 'SAREX', offsetMin: 108 },
    ]),
    altitudeProfile: makeAltProfile('13:30', 150, 330, 0),
    restrictionZones: [
      { notamRef: 'A2253/26', startTime: '13:55', endTime: '14:50', minAlt: 250, maxAlt: 370, label: 'ZBAA 周边禁航 A2253/26' },
      { notamRef: 'A2261/26', startTime: '14:20', endTime: '15:10', minAlt: 150, maxAlt: 280, label: 'PIMOL 训练区 A2261/26' },
    ],
    alternateRoutes: [
      { id: 'alt1', name: 'MU5678A1', route: 'ZSSS SHZ A470 P250 G327 P53 ZGGG', waypoints: ['SHZ', 'P250', 'P53'], distance: 680, affectedWaypoints: [], fuelDelta: '+13min' },
      { id: 'alt2', name: 'MU5678A2', route: 'ZSSS PIMOL W161 P270 R473 ZGGG', waypoints: ['PIMOL', 'P270'], distance: 720, affectedWaypoints: ['PIMOL'], fuelDelta: '+18min' },
      { id: 'alt3', name: 'MU5678A3', route: 'ZSSS WHA G327 P250 A593 P53 ZGGG', waypoints: ['WHA', 'P250', 'P53'], distance: 755, affectedWaypoints: [], fuelDelta: '+25min' },
      { id: 'alt4', name: 'MU5678A4', route: 'ZSSS SHZ B221 P120 H22 ZGGG', waypoints: ['SHZ', 'P120'], distance: 810, affectedWaypoints: [], fuelDelta: '+32min' },
    ],
  },

  CZ9012: {
    flightNo: 'CZ3601', delayMinutes: 21, originalRoute: 'ZGGG QF A461 P60 CKA ZUUU',
    aircraftType: 'A330', registration: 'B-9012',
    depIcao: 'ZGGG', arrIcao: 'ZUUU',
    scheduledDeparture: '14:00', estimatedDeparture: '14:20',
    timeline: makeTimeline('14:00', 150, [
      { label: 'QF', offsetMin: 15 },
      { label: 'P60', offsetMin: 50, affected: true },
      { label: 'CKA', offsetMin: 105 },
    ]),
    altitudeProfile: makeAltProfile('14:00', 150, 350, 1),
    restrictionZones: [
      { notamRef: 'A2288/26', startTime: '14:20', endTime: '15:10', minAlt: 280, maxAlt: 390, label: 'ZSPD 进近区 A2288/26' },
    ],
    alternateRoutes: [
      { id: 'alt1', name: 'CZ9012B1', route: 'ZGGG QF R473 P270 W161 P54 ZUUU', waypoints: ['QF', 'P270', 'P54'], distance: 890, affectedWaypoints: [], fuelDelta: '+15min' },
      { id: 'alt2', name: 'CZ9012B2', route: 'ZGGG LMN G471 P180 H25 ZUUU', waypoints: ['LMN', 'P180'], distance: 950, affectedWaypoints: [], fuelDelta: '+25min' },
    ],
  },

  HU3456: {
    flightNo: 'CA1507', delayMinutes: 46, originalRoute: 'ZBAA CDY B215 JB W66 ZLXY',
    aircraftType: 'B789', registration: 'B-3456',
    depIcao: 'ZBAA', arrIcao: 'ZLXY',
    scheduledDeparture: '14:15', estimatedDeparture: '15:00',
    timeline: makeTimeline('14:15', 115, [
      { label: 'CDY', offsetMin: 12, affected: true },
      { label: 'JB', offsetMin: 45, affected: true },
    ]),
    altitudeProfile: makeAltProfile('14:15', 115, 280, 2),
    restrictionZones: [
      { notamRef: 'A2253/26', startTime: '14:30', endTime: '15:30', minAlt: 180, maxAlt: 310, label: 'ZBAA 禁航区 A2253/26' },
      { notamRef: 'A2260/26', startTime: '15:00', endTime: '15:40', minAlt: 120, maxAlt: 260, label: 'ZHCC 训练区 A2260/26' },
    ],
    alternateRoutes: [
      { id: 'alt1', name: 'HU3456C1', route: 'ZBAA CDY G212 P80 W50 ZLXY', waypoints: ['CDY', 'P80'], distance: 580, affectedWaypoints: ['CDY'], fuelDelta: '+10min' },
      { id: 'alt2', name: 'HU3456C2', route: 'ZBAA VM B208 P120 G45 ZLXY', waypoints: ['VM', 'P120'], distance: 650, affectedWaypoints: [], fuelDelta: '+20min' },
      { id: 'alt3', name: 'HU3456C3', route: 'ZBAA YV W32 P200 H18 ZLXY', waypoints: ['YV', 'P200'], distance: 710, affectedWaypoints: [], fuelDelta: '+28min' },
    ],
  },

  CA8025: {
    flightNo: 'MU5301', delayMinutes: 56, originalRoute: 'ZSPD SHR A599 WYN H25 ZGGG',
    aircraftType: 'A359', registration: 'B-8025',
    depIcao: 'ZSPD', arrIcao: 'ZGGG',
    scheduledDeparture: '15:30', estimatedDeparture: '16:25',
    timeline: makeTimeline('15:30', 155, [
      { label: 'SHR', offsetMin: 15, affected: true },
      { label: 'WYN', offsetMin: 65, affected: true },
    ]),
    altitudeProfile: makeAltProfile('15:30', 155, 370, 3),
    restrictionZones: [
      { notamRef: 'A2288/26', startTime: '15:45', endTime: '17:00', minAlt: 220, maxAlt: 390, label: 'ZSPD 离场区 A2288/26' },
    ],
    alternateRoutes: [
      { id: 'alt1', name: 'CA8025D1', route: 'ZSPD HSN B221 P45 A599 ZGGG', waypoints: ['HSN', 'P45'], distance: 710, affectedWaypoints: [], fuelDelta: '+13min' },
      { id: 'alt2', name: 'CA8025D2', route: 'ZSPD SHZ G204 P88 W34 ZGGG', waypoints: ['SHZ', 'P88'], distance: 780, affectedWaypoints: [], fuelDelta: '+24min' },
    ],
  },

  // ---- 其余航班：简化分析数据 ----
  CA1234: {
    flightNo: 'CA1501', delayMinutes: 0, originalRoute: 'ZBAA VM B208 ZSSS',
    aircraftType: 'A320', registration: 'B-1234',
    depIcao: 'ZBAA', arrIcao: 'ZSSS',
    scheduledDeparture: '13:00', estimatedDeparture: '13:00',
    timeline: makeTimeline('13:00', 140, [
      { label: 'VM', offsetMin: 15 }, { label: 'P54', offsetMin: 60 },
    ]),
    altitudeProfile: makeAltProfile('13:00', 140, 310, 0),
    restrictionZones: [],
    alternateRoutes: [],
  },

  '3U8601': {
    flightNo: '3U8601', delayMinutes: 0, originalRoute: 'ZUUU CZH B213 ZUCK',
    aircraftType: 'A319', registration: 'B-7890',
    depIcao: 'ZUUU', arrIcao: 'ZUCK',
    scheduledDeparture: '14:30', estimatedDeparture: '14:30',
    timeline: makeTimeline('14:30', 50, [
      { label: 'CZH', offsetMin: 15 },
    ]),
    altitudeProfile: makeAltProfile('14:30', 50, 180, 1),
    restrictionZones: [],
    alternateRoutes: [],
  },

  // ---- 其余受影响航班：完整数据 ----

  MU1357: {
    flightNo: 'CZ3401', delayMinutes: 51, originalRoute: 'ZGGG P270 A599 SHZ G204 ZSPD',
    aircraftType: 'B77W', registration: 'B-1357',
    depIcao: 'ZGGG', arrIcao: 'ZSPD',
    scheduledDeparture: '15:00', estimatedDeparture: '15:50',
    timeline: makeTimeline('15:00', 150, [
      { label: 'P270', offsetMin: 20, affected: true },
      { label: 'SHZ', offsetMin: 70, affected: true },
    ]),
    altitudeProfile: makeAltProfile('15:00', 150, 350, 2),
    restrictionZones: [
      { notamRef: 'A2288/26', startTime: '15:20', endTime: '16:10', minAlt: 200, maxAlt: 360, label: 'ZSPD 进近区 A2288/26' },
      { notamRef: 'A2300/26', startTime: '15:45', endTime: '16:30', minAlt: 280, maxAlt: 380, label: 'ZBAA 训练区 A2300/26' },
    ],
    alternateRoutes: [
      { id: 'alt1', name: 'MU1357E1', route: 'ZGGG SHL A470 P250 G327 ZSPD', waypoints: ['SHL', 'P250'], distance: 720, affectedWaypoints: [], fuelDelta: '+15min' },
      { id: 'alt2', name: 'MU1357E2', route: 'ZGGG LMN G471 P88 W34 ZSPD', waypoints: ['LMN', 'P88'], distance: 780, affectedWaypoints: [], fuelDelta: '+22min' },
      { id: 'alt3', name: 'MU1357E3', route: 'ZGGG P270 R473 P45 A599 ZSPD', waypoints: ['P270', 'P45'], distance: 850, affectedWaypoints: ['P270'], fuelDelta: '+28min' },
    ],
  },

  HU9876: {
    flightNo: 'HU7401', delayMinutes: 64, originalRoute: 'ZJHK LH R339 BHY W70 ZBAA',
    aircraftType: 'B788', registration: 'B-9876',
    depIcao: 'ZJHK', arrIcao: 'ZBAA',
    scheduledDeparture: '16:00', estimatedDeparture: '17:05',
    timeline: makeTimeline('16:00', 210, [
      { label: 'LH', offsetMin: 15, affected: true },
      { label: 'BHY', offsetMin: 55, affected: true },
    ]),
    altitudeProfile: makeAltProfile('16:00', 210, 370, 3),
    restrictionZones: [
      { notamRef: 'A2291/26', startTime: '16:15', endTime: '18:00', minAlt: 150, maxAlt: 320, label: 'ZJHK 台风区 A2291/26' },
      { notamRef: 'A2253/26', startTime: '17:30', endTime: '18:30', minAlt: 250, maxAlt: 390, label: 'ZBAA 禁航区 A2253/26' },
    ],
    alternateRoutes: [
      { id: 'alt1', name: 'HU9876F1', route: 'ZJHK SAMAS A202 P25 G471 ZBAA', waypoints: ['SAMAS', 'P25'], distance: 1450, affectedWaypoints: [], fuelDelta: '+18min' },
      { id: 'alt2', name: 'HU9876F2', route: 'ZJHK LH R473 P120 W37 ZBAA', waypoints: ['LH', 'P120'], distance: 1520, affectedWaypoints: ['LH'], fuelDelta: '+28min' },
    ],
  },

  CZ3579: {
    flightNo: 'CZ3301', delayMinutes: 30, originalRoute: 'ZSAM FQG A470 P169 ZGGG',
    aircraftType: 'A321', registration: 'B-3579',
    depIcao: 'ZSAM', arrIcao: 'ZGGG',
    scheduledDeparture: '16:30', estimatedDeparture: '17:00',
    timeline: makeTimeline('16:30', 80, [
      { label: 'FQG', offsetMin: 12, affected: true },
      { label: 'P169', offsetMin: 38 },
    ]),
    altitudeProfile: makeAltProfile('16:30', 80, 260, 0),
    restrictionZones: [
      { notamRef: 'A2263/26', startTime: '16:35', endTime: '17:20', minAlt: 120, maxAlt: 290, label: 'ZSAM 离场区 A2263/26' },
    ],
    alternateRoutes: [
      { id: 'alt1', name: 'CZ3579G1', route: 'ZSAM XLN A470 P169 ZGGG', waypoints: ['XLN', 'P169'], distance: 420, affectedWaypoints: [], fuelDelta: '+8min' },
      { id: 'alt2', name: 'CZ3579G2', route: 'ZSAM FQG R200 W22 ZGGG', waypoints: ['FQG'], distance: 460, affectedWaypoints: ['FQG'], fuelDelta: '+14min' },
    ],
  },

  MU8080: {
    flightNo: 'MU5701', delayMinutes: 40, originalRoute: 'ZSHC SHR G204 P250 W554 ZBAA',
    aircraftType: 'A320', registration: 'B-8080',
    depIcao: 'ZSHC', arrIcao: 'ZBAA',
    scheduledDeparture: '17:00', estimatedDeparture: '17:40',
    timeline: makeTimeline('17:00', 120, [
      { label: 'SHR', offsetMin: 15, affected: true },
      { label: 'P250', offsetMin: 50, affected: true },
    ]),
    altitudeProfile: makeAltProfile('17:00', 120, 310, 1),
    restrictionZones: [
      { notamRef: 'A2289/26', startTime: '17:15', endTime: '18:00', minAlt: 200, maxAlt: 330, label: 'ZSHC 离场区 A2289/26' },
      { notamRef: 'A2253/26', startTime: '17:45', endTime: '18:30', minAlt: 250, maxAlt: 340, label: 'ZBAA 周边 A2253/26' },
    ],
    alternateRoutes: [
      { id: 'alt1', name: 'MU8080H1', route: 'ZSHC HSN B221 P88 G327 ZBAA', waypoints: ['HSN', 'P88'], distance: 650, affectedWaypoints: [], fuelDelta: '+13min' },
      { id: 'alt2', name: 'MU8080H2', route: 'ZSHC SHR W161 P270 H25 ZBAA', waypoints: ['SHR', 'P270'], distance: 720, affectedWaypoints: ['SHR'], fuelDelta: '+22min' },
    ],
  },

  '3U8703': {
    flightNo: '3U8703', delayMinutes: 56, originalRoute: 'ZUUU CZH B330 P120 H11 ZYTX',
    aircraftType: 'A330', registration: 'B-5555',
    depIcao: 'ZUUU', arrIcao: 'ZYTX',
    scheduledDeparture: '17:30', estimatedDeparture: '18:25',
    timeline: makeTimeline('17:30', 195, [
      { label: 'CZH', offsetMin: 18, affected: true },
      { label: 'P120', offsetMin: 75, affected: true },
    ]),
    altitudeProfile: makeAltProfile('17:30', 195, 360, 2),
    restrictionZones: [
      { notamRef: 'A2256/26', startTime: '17:45', endTime: '19:00', minAlt: 180, maxAlt: 370, label: 'ZUUU 离场区 A2256/26' },
      { notamRef: 'A2290/26', startTime: '19:00', endTime: '20:00', minAlt: 220, maxAlt: 380, label: 'ZYTX 进近区 A2290/26' },
    ],
    alternateRoutes: [
      { id: 'alt1', name: '3U5555I1', route: 'ZUUU ZW B213 W30 H11 ZYTX', waypoints: ['ZW', 'W30'], distance: 1380, affectedWaypoints: [], fuelDelta: '+20min' },
      { id: 'alt2', name: '3U5555I2', route: 'ZUUU CZH G212 P200 R11 ZYTX', waypoints: ['CZH', 'P200'], distance: 1450, affectedWaypoints: ['CZH'], fuelDelta: '+30min' },
      { id: 'alt3', name: '3U5555I3', route: 'ZUUU JTG B330 W80 H8 ZYTX', waypoints: ['JTG', 'W80'], distance: 1520, affectedWaypoints: [], fuelDelta: '+35min' },
    ],
  },

  CZ3030: {
    flightNo: 'CZ3901', delayMinutes: 46, originalRoute: 'ZGGG YIN A461 VYK ZBTJ',
    aircraftType: 'A333', registration: 'B-3030',
    depIcao: 'ZGGG', arrIcao: 'ZBTJ',
    scheduledDeparture: '18:15', estimatedDeparture: '19:00',
    timeline: makeTimeline('18:15', 180, [
      { label: 'YIN', offsetMin: 22, affected: true },
      { label: 'VYK', offsetMin: 98, affected: true },
    ]),
    altitudeProfile: makeAltProfile('18:15', 180, 370, 3),
    restrictionZones: [
      { notamRef: 'A2255/26', startTime: '18:30', endTime: '19:30', minAlt: 200, maxAlt: 370, label: 'ZGGG 离场区 A2255/26' },
      { notamRef: 'A2261/26', startTime: '19:30', endTime: '20:30', minAlt: 250, maxAlt: 390, label: 'ZBTJ 进近区 A2261/26' },
    ],
    alternateRoutes: [
      { id: 'alt1', name: 'CZ3030J1', route: 'ZGGG LMN G471 P250 A461 ZBTJ', waypoints: ['LMN', 'P250'], distance: 1100, affectedWaypoints: [], fuelDelta: '+15min' },
      { id: 'alt2', name: 'CZ3030J2', route: 'ZGGG YIN R473 P45 W37 ZBTJ', waypoints: ['YIN', 'P45'], distance: 1180, affectedWaypoints: ['YIN'], fuelDelta: '+25min' },
    ],
  },

  HU5050: {
    flightNo: 'HU7601', delayMinutes: 25, originalRoute: 'ZJHK LH R339 BHY W30 ZLXY',
    aircraftType: 'B789', registration: 'B-5050',
    depIcao: 'ZJHK', arrIcao: 'ZLXY',
    scheduledDeparture: '19:00', estimatedDeparture: '19:25',
    timeline: makeTimeline('19:00', 195, [
      { label: 'LH', offsetMin: 15 },
      { label: 'BHY', offsetMin: 60, affected: true },
    ]),
    altitudeProfile: makeAltProfile('19:00', 195, 370, 0),
    restrictionZones: [
      { notamRef: 'A2291/26', startTime: '19:15', endTime: '20:30', minAlt: 180, maxAlt: 350, label: 'ZJHK 台风区 A2291/26' },
    ],
    alternateRoutes: [
      { id: 'alt1', name: 'HU5050K1', route: 'ZJHK SAMAS A202 P80 G212 ZLXY', waypoints: ['SAMAS', 'P80'], distance: 1280, affectedWaypoints: [], fuelDelta: '+13min' },
      { id: 'alt2', name: 'HU5050K2', route: 'ZJHK LH B330 P200 W30 ZLXY', waypoints: ['LH', 'P200'], distance: 1350, affectedWaypoints: [], fuelDelta: '+22min' },
    ],
  },

  MU7070: {
    flightNo: 'MU5901', delayMinutes: 70, originalRoute: 'ZSSS PIMOL A593 P54 W554 ZPPP',
    aircraftType: 'B77W', registration: 'B-7070',
    depIcao: 'ZSSS', arrIcao: 'ZPPP',
    scheduledDeparture: '20:00', estimatedDeparture: '21:10',
    timeline: makeTimeline('20:00', 210, [
      { label: 'PIMOL', offsetMin: 20, affected: true },
      { label: 'P54', offsetMin: 80 },
    ]),
    altitudeProfile: makeAltProfile('20:00', 210, 370, 1),
    restrictionZones: [
      { notamRef: 'A2254/26', startTime: '20:15', endTime: '21:30', minAlt: 200, maxAlt: 380, label: 'ZSSS 离场区 A2254/26' },
      { notamRef: 'A2268/26', startTime: '21:30', endTime: '22:30', minAlt: 280, maxAlt: 390, label: 'ZPPP 进近区 A2268/26' },
    ],
    alternateRoutes: [
      { id: 'alt1', name: 'MU7070L1', route: 'ZSSS SHZ B221 P250 G327 ZPPP', waypoints: ['SHZ', 'P250'], distance: 1200, affectedWaypoints: [], fuelDelta: '+18min' },
      { id: 'alt2', name: 'MU7070L2', route: 'ZSSS WHA G327 P120 H24 ZPPP', waypoints: ['WHA', 'P120'], distance: 1280, affectedWaypoints: [], fuelDelta: '+28min' },
      { id: 'alt3', name: 'MU7070L3', route: 'ZSSS PIMOL W161 P88 R473 ZPPP', waypoints: ['PIMOL', 'P88'], distance: 1350, affectedWaypoints: ['PIMOL'], fuelDelta: '+35min' },
    ],
  },

  '3U8901': {
    flightNo: '3U8901', delayMinutes: 36, originalRoute: 'ZUCK QJG B330 P120 A599 ZSAM',
    aircraftType: 'A319', registration: 'B-9090',
    depIcao: 'ZUCK', arrIcao: 'ZSAM',
    scheduledDeparture: '21:00', estimatedDeparture: '21:35',
    timeline: makeTimeline('21:00', 135, [
      { label: 'QJG', offsetMin: 15, affected: true },
      { label: 'P120', offsetMin: 55 },
    ]),
    altitudeProfile: makeAltProfile('21:00', 135, 330, 2),
    restrictionZones: [
      { notamRef: 'A2258/26', startTime: '21:10', endTime: '22:00', minAlt: 150, maxAlt: 340, label: 'ZUCK 离场区 A2258/26' },
    ],
    alternateRoutes: [
      { id: 'alt1', name: '3U9090M1', route: 'ZUCK FLG B213 W80 A599 ZSAM', waypoints: ['FLG', 'W80'], distance: 780, affectedWaypoints: [], fuelDelta: '+10min' },
      { id: 'alt2', name: '3U9090M2', route: 'ZUCK QJG R343 P200 W22 ZSAM', waypoints: ['QJG', 'P200'], distance: 850, affectedWaypoints: ['QJG'], fuelDelta: '+20min' },
    ],
  },

  MU1314: {
    flightNo: 'HU7701', delayMinutes: 60, originalRoute: 'ZSPD PIMOL A593 WHA B330 ZUUU',
    aircraftType: 'B788', registration: 'B-1314',
    depIcao: 'ZSPD', arrIcao: 'ZUUU',
    scheduledDeparture: '22:00', estimatedDeparture: '23:00',
    timeline: makeTimeline('22:00', 180, [
      { label: 'PIMOL', offsetMin: 18, affected: true },
      { label: 'WHA', offsetMin: 65, affected: true },
    ]),
    altitudeProfile: makeAltProfile('22:00', 180, 370, 3),
    restrictionZones: [
      { notamRef: 'A2288/26', startTime: '22:15', endTime: '23:30', minAlt: 200, maxAlt: 380, label: 'ZSPD 离场区 A2288/26' },
      { notamRef: 'A2304/26', startTime: '23:30', endTime: '00:30', minAlt: 280, maxAlt: 390, label: 'ZUUU 进近区 A2304/26' },
    ],
    alternateRoutes: [
      { id: 'alt1', name: 'MU1314N1', route: 'ZSPD SHZ B221 P250 G327 ZUUU', waypoints: ['SHZ', 'P250'], distance: 1050, affectedWaypoints: [], fuelDelta: '+15min' },
      { id: 'alt2', name: 'MU1314N2', route: 'ZSPD HSN G204 P88 W24 ZUUU', waypoints: ['HSN', 'P88'], distance: 1120, affectedWaypoints: [], fuelDelta: '+25min' },
      { id: 'alt3', name: 'MU1314N3', route: 'ZSPD PIMOL W161 P270 H18 ZUUU', waypoints: ['PIMOL', 'P270'], distance: 1200, affectedWaypoints: ['PIMOL'], fuelDelta: '+35min' },
    ],
  },
}

// 非受影响航班查询 MOCK_ANALYSIS 时返回 undefined，modal 显示"未受影响"
