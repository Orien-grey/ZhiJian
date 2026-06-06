// ============================================================
// 右侧航班动态 — 模拟数据
// ============================================================

export type FlightStatus = 'planned' | 'dispatched' | 'in_flight' | 'landing' | 'actual'

export interface FlightItem {
  id: string
  flightNo: string
  star: boolean // ★标记
  scheduledTime: string
  depIcao: string
  depName: string
  arrIcao: string
  arrName: string
  estimatedTime: string
  status: FlightStatus
  statusLabel: string
  countdown: string // 倒计时
  isAffected: boolean // 是否受影响航班
  isCompanyRoute: boolean // 公司航线
  aircraftType: string
  registration: string
}

export const FLIGHT_STATUS_MAP: Record<FlightStatus, { label: string; color: string }> = {
  planned: { label: '计划', color: '#64748b' },
  dispatched: { label: '签派', color: '#3b82f6' },
  in_flight: { label: '在飞', color: '#10b981' },
  landing: { label: '即将降落', color: '#f59e0b' },
  actual: { label: '实际', color: '#94a3b8' },
}

export const MOCK_FLIGHTS: FlightItem[] = [
  { id: 'f1', flightNo: 'CA1234', star: true, scheduledTime: '13:00', depIcao: 'ZBAA', depName: '北京', arrIcao: 'ZSSS', arrName: '上海', estimatedTime: '15:20', status: 'in_flight', statusLabel: '在飞', countdown: '01:45', isAffected: false, isCompanyRoute: false, aircraftType: 'A320', registration: 'B-1234' },
  { id: 'f2', flightNo: 'MU5678', star: false, scheduledTime: '13:30', depIcao: 'ZSSS', depName: '上海', arrIcao: 'ZGGG', arrName: '广州', estimatedTime: '16:00', status: 'in_flight', statusLabel: '在飞', countdown: '02:05', isAffected: true, isCompanyRoute: true, aircraftType: 'B738', registration: 'B-5678' },
  { id: 'f3', flightNo: 'CZ9012', star: true, scheduledTime: '14:00', depIcao: 'ZGGG', depName: '广州', arrIcao: 'ZUUU', arrName: '成都', estimatedTime: '16:30', status: 'dispatched', statusLabel: '签派', countdown: '00:15', isAffected: false, isCompanyRoute: false, aircraftType: 'A330', registration: 'B-9012' },
  { id: 'f4', flightNo: 'HU3456', star: false, scheduledTime: '14:15', depIcao: 'ZBAA', depName: '北京', arrIcao: 'ZLXY', arrName: '西安', estimatedTime: '16:10', status: 'landing', statusLabel: '即将降落', countdown: '00:08', isAffected: true, isCompanyRoute: false, aircraftType: 'B789', registration: 'B-3456' },
  { id: 'f5', flightNo: '3U7890', star: false, scheduledTime: '14:30', depIcao: 'ZUUU', depName: '成都', arrIcao: 'ZUCK', arrName: '重庆', estimatedTime: '15:20', status: 'actual', statusLabel: '实际', countdown: '--', isAffected: false, isCompanyRoute: true, aircraftType: 'A319', registration: 'B-7890' },
  { id: 'f6', flightNo: 'CA2468', star: true, scheduledTime: '14:45', depIcao: 'ZSSS', depName: '上海', arrIcao: 'ZBAA', arrName: '北京', estimatedTime: '17:15', status: 'planned', statusLabel: '计划', countdown: '00:32', isAffected: false, isCompanyRoute: false, aircraftType: 'A321', registration: 'B-2468' },
  { id: 'f7', flightNo: 'MU1357', star: false, scheduledTime: '15:00', depIcao: 'ZGGG', depName: '广州', arrIcao: 'ZSPD', arrName: '浦东', estimatedTime: '17:30', status: 'planned', statusLabel: '计划', countdown: '00:47', isAffected: true, isCompanyRoute: true, aircraftType: 'B77W', registration: 'B-1357' },
  { id: 'f8', flightNo: 'CZ4680', star: false, scheduledTime: '15:15', depIcao: 'ZLXY', depName: '西安', arrIcao: 'ZBAA', arrName: '北京', estimatedTime: '17:00', status: 'in_flight', statusLabel: '在飞', countdown: '01:15', isAffected: false, isCompanyRoute: false, aircraftType: 'A320', registration: 'B-4680' },
  { id: 'f9', flightNo: 'CA8025', star: true, scheduledTime: '15:30', depIcao: 'ZSPD', depName: '浦东', arrIcao: 'ZGGG', arrName: '广州', estimatedTime: '18:05', status: 'dispatched', statusLabel: '签派', countdown: '00:22', isAffected: true, isCompanyRoute: false, aircraftType: 'A359', registration: 'B-8025' },
  { id: 'f10', flightNo: '3U1111', star: false, scheduledTime: '15:45', depIcao: 'ZUCK', depName: '重庆', arrIcao: 'ZUUU', arrName: '成都', estimatedTime: '16:35', status: 'landing', statusLabel: '即将降落', countdown: '00:05', isAffected: false, isCompanyRoute: true, aircraftType: 'A319', registration: 'B-1111' },
  { id: 'f11', flightNo: 'HU9876', star: false, scheduledTime: '16:00', depIcao: 'ZJHK', depName: '海口', arrIcao: 'ZBAA', arrName: '北京', estimatedTime: '19:30', status: 'planned', statusLabel: '计划', countdown: '00:55', isAffected: true, isCompanyRoute: false, aircraftType: 'B788', registration: 'B-9876' },
  { id: 'f12', flightNo: 'MU5432', star: true, scheduledTime: '16:15', depIcao: 'ZBTJ', depName: '天津', arrIcao: 'ZSSS', arrName: '上海', estimatedTime: '18:15', status: 'planned', statusLabel: '计划', countdown: '01:05', isAffected: false, isCompanyRoute: false, aircraftType: 'B738', registration: 'B-5432' },
  { id: 'f13', flightNo: 'CZ3579', star: false, scheduledTime: '16:30', depIcao: 'ZSAM', depName: '厦门', arrIcao: 'ZGGG', arrName: '广州', estimatedTime: '17:50', status: 'in_flight', statusLabel: '在飞', countdown: '00:55', isAffected: true, isCompanyRoute: true, aircraftType: 'A321', registration: 'B-3579' },
  { id: 'f14', flightNo: 'CA6789', star: true, scheduledTime: '16:45', depIcao: 'ZBAA', depName: '北京', arrIcao: 'ZPPP', arrName: '昆明', estimatedTime: '20:15', status: 'planned', statusLabel: '计划', countdown: '01:20', isAffected: false, isCompanyRoute: false, aircraftType: 'B789', registration: 'B-6789' },
  { id: 'f15', flightNo: 'MU8080', star: false, scheduledTime: '17:00', depIcao: 'ZSHC', depName: '杭州', arrIcao: 'ZBAA', arrName: '北京', estimatedTime: '19:00', status: 'planned', statusLabel: '计划', countdown: '01:30', isAffected: true, isCompanyRoute: false, aircraftType: 'A320', registration: 'B-8080' },
  { id: 'f16', flightNo: 'CZ2460', star: false, scheduledTime: '17:15', depIcao: 'ZHCC', depName: '郑州', arrIcao: 'ZUCK', arrName: '重庆', estimatedTime: '19:15', status: 'planned', statusLabel: '计划', countdown: '01:42', isAffected: false, isCompanyRoute: true, aircraftType: 'B738', registration: 'B-2460' },
  { id: 'f17', flightNo: '3U5555', star: true, scheduledTime: '17:30', depIcao: 'ZUUU', depName: '成都', arrIcao: 'ZYTX', arrName: '沈阳', estimatedTime: '20:45', status: 'planned', statusLabel: '计划', countdown: '01:55', isAffected: true, isCompanyRoute: false, aircraftType: 'A330', registration: 'B-5555' },
  { id: 'f18', flightNo: 'CA1010', star: false, scheduledTime: '17:45', depIcao: 'ZSNJ', depName: '南京', arrIcao: 'ZLLL', arrName: '兰州', estimatedTime: '20:30', status: 'planned', statusLabel: '计划', countdown: '02:05', isAffected: false, isCompanyRoute: false, aircraftType: 'A320', registration: 'B-1010' },
  { id: 'f19', flightNo: 'MU2020', star: false, scheduledTime: '18:00', depIcao: 'ZSPD', depName: '浦东', arrIcao: 'ZYTX', arrName: '沈阳', estimatedTime: '20:30', status: 'planned', statusLabel: '计划', countdown: '02:10', isAffected: false, isCompanyRoute: true, aircraftType: 'B738', registration: 'B-2020' },
  { id: 'f20', flightNo: 'CZ3030', star: true, scheduledTime: '18:15', depIcao: 'ZGGG', depName: '广州', arrIcao: 'ZBTJ', arrName: '天津', estimatedTime: '21:15', status: 'planned', statusLabel: '计划', countdown: '02:40', isAffected: true, isCompanyRoute: false, aircraftType: 'A333', registration: 'B-3030' },
  { id: 'f21', flightNo: '3U4040', star: false, scheduledTime: '18:30', depIcao: 'ZUUU', depName: '成都', arrIcao: 'ZSHC', arrName: '杭州', estimatedTime: '21:00', status: 'planned', statusLabel: '计划', countdown: '02:05', isAffected: false, isCompanyRoute: true, aircraftType: 'A320', registration: 'B-4040' },
  { id: 'f22', flightNo: 'HU5050', star: false, scheduledTime: '19:00', depIcao: 'ZJHK', depName: '海口', arrIcao: 'ZLXY', arrName: '西安', estimatedTime: '22:15', status: 'dispatched', statusLabel: '签派', countdown: '00:35', isAffected: true, isCompanyRoute: false, aircraftType: 'B789', registration: 'B-5050' },
  { id: 'f23', flightNo: 'CA6060', star: true, scheduledTime: '19:30', depIcao: 'ZBAA', depName: '北京', arrIcao: 'ZUGY', arrName: '贵阳', estimatedTime: '22:45', status: 'planned', statusLabel: '计划', countdown: '02:45', isAffected: false, isCompanyRoute: false, aircraftType: 'A21N', registration: 'B-6060' },
  { id: 'f24', flightNo: 'MU7070', star: false, scheduledTime: '20:00', depIcao: 'ZSSS', depName: '上海', arrIcao: 'ZPPP', arrName: '昆明', estimatedTime: '23:30', status: 'planned', statusLabel: '计划', countdown: '02:55', isAffected: true, isCompanyRoute: true, aircraftType: 'B77W', registration: 'B-7070' },
  { id: 'f25', flightNo: 'CZ8080', star: false, scheduledTime: '20:30', depIcao: 'ZHCC', depName: '郑州', arrIcao: 'ZSNJ', arrName: '南京', estimatedTime: '22:00', status: 'planned', statusLabel: '计划', countdown: '01:05', isAffected: false, isCompanyRoute: false, aircraftType: 'B738', registration: 'B-8080' },
  { id: 'f26', flightNo: '3U9090', star: true, scheduledTime: '21:00', depIcao: 'ZUCK', depName: '重庆', arrIcao: 'ZSAM', arrName: '厦门', estimatedTime: '23:15', status: 'planned', statusLabel: '计划', countdown: '01:50', isAffected: true, isCompanyRoute: false, aircraftType: 'A319', registration: 'B-9090' },
  { id: 'f27', flightNo: 'CA1112', star: false, scheduledTime: '21:30', depIcao: 'ZLXY', depName: '西安', arrIcao: 'ZSSS', arrName: '上海', estimatedTime: '23:45', status: 'planned', statusLabel: '计划', countdown: '01:40', isAffected: false, isCompanyRoute: true, aircraftType: 'A321', registration: 'B-1112' },
  { id: 'f28', flightNo: 'MU1314', star: false, scheduledTime: '22:00', depIcao: 'ZSPD', depName: '浦东', arrIcao: 'ZUUU', arrName: '成都', estimatedTime: '01:00', status: 'planned', statusLabel: '计划', countdown: '02:20', isAffected: true, isCompanyRoute: false, aircraftType: 'B788', registration: 'B-1314' },
]

/** 受影响航班分析 */
export interface FlightAnalysis {
  flightNo: string
  delayMinutes: number
  aircraftType: string
  registration: string
  originalRoute: string
  alternateRoutes: AlternateRoute[]
}

export interface AlternateRoute {
  id: string
  name: string
  route: string
  waypoints: string[]
  distance: number
  affectedWaypoints: string[]
}

export const MOCK_FLIGHT_ANALYSIS: Record<string, FlightAnalysis> = {
  'MU5678': {
    flightNo: 'MU5678', delayMinutes: 35, aircraftType: 'B738', registration: 'B-5678',
    originalRoute: 'ZSSS PIMOL A593 P54 W554 SAREX ZGGG',
    alternateRoutes: [
      { id: 'alt1', name: 'MU5678A1', route: 'ZSSS SHZ A470 P250 G327 P53 ZGGG', waypoints: ['SHZ', 'P250', 'P53'], distance: 680, affectedWaypoints: [] },
      { id: 'alt2', name: 'MU5678A2', route: 'ZSSS PIMOL W161 P270 R473 ZGGG', waypoints: ['PIMOL', 'P270'], distance: 720, affectedWaypoints: ['PIMOL'] },
      { id: 'alt3', name: 'MU5678A3', route: 'ZSSS WHA G327 P250 A593 P53 ZGGG', waypoints: ['WHA', 'P250', 'P53'], distance: 755, affectedWaypoints: [] },
    ],
  },
  'CZ9012': {
    flightNo: 'CZ9012', delayMinutes: 20, aircraftType: 'A330', registration: 'B-9012',
    originalRoute: 'ZGGG QF A461 P60 CKA ZUUU',
    alternateRoutes: [
      { id: 'alt1', name: 'CZ9012B1', route: 'ZGGG QF R473 P270 W161 P54 ZUUU', waypoints: ['QF', 'P270', 'P54'], distance: 890, affectedWaypoints: [] },
    ],
  },
}
