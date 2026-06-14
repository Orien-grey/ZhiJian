// ============================================================
// 右侧航班动态 — 真实风格模拟数据
// 航班号参照各航司真实号段，注册号B-XXXX格式，时间逻辑自洽
// ============================================================

export type FlightStatus = 'planned' | 'dispatched' | 'in_flight' | 'landing' | 'actual'

export interface FlightItem {
  id: string
  flightNo: string; star: boolean; scheduledTime: string
  depIcao: string; depName: string; arrIcao: string; arrName: string
  estimatedTime: string; status: FlightStatus; statusLabel: string
  countdown: string; isAffected: boolean; isCompanyRoute: boolean
  aircraftType: string; registration: string
}

export const FLIGHT_STATUS_MAP: Record<FlightStatus, { label: string; color: string }> = {
  planned:    { label: '计划',     color: '#64748b' },
  dispatched: { label: '签派',     color: '#3b82f6' },
  in_flight:  { label: '在飞',     color: '#10b981' },
  landing:    { label: '即将降落', color: '#f59e0b' },
  actual:     { label: '实际',     color: '#94a3b8' },
}

// 排序逻辑：标星优先 → 受影响 → 按计划时间
export const MOCK_FLIGHTS: FlightItem[] = [
  // ⭐ 标星航班（状态错开：在飞/即将降落/签派）
  { id:'f03', flightNo:'CZ3101', star:true,  scheduledTime:'07:15', depIcao:'ZGGG', depName:'广州', arrIcao:'ZBAA', arrName:'北京首都', estimatedTime:'10:20', status:'in_flight',  statusLabel:'在飞', countdown:'01:45', isAffected:true,  isCompanyRoute:true,  aircraftType:'A359', registration:'B-30C3' },
  { id:'f07', flightNo:'MU5201', star:true,  scheduledTime:'08:55', depIcao:'ZSSS', depName:'上海', arrIcao:'ZGGG', arrName:'广州白云', estimatedTime:'11:15', status:'landing',    statusLabel:'即将降落', countdown:'00:08', isAffected:true,  isCompanyRoute:true,  aircraftType:'B738', registration:'B-5801' },
  { id:'f21', flightNo:'CA1507', star:true,  scheduledTime:'13:30', depIcao:'ZBAA', depName:'北京', arrIcao:'ZSSS', arrName:'上海虹桥', estimatedTime:'15:50', status:'dispatched', statusLabel:'签派', countdown:'00:25', isAffected:true,  isCompanyRoute:true,  aircraftType:'B77W', registration:'B-7953' },

  // ---- 上午时段（06:00-10:00） ----
  { id:'f01', flightNo:'CA1501', star:false, scheduledTime:'06:30', depIcao:'ZBAA', depName:'北京', arrIcao:'ZSSS', arrName:'上海虹桥', estimatedTime:'08:50', status:'landing',    statusLabel:'即将降落', countdown:'00:05', isAffected:false, isCompanyRoute:true,  aircraftType:'A359', registration:'B-32DM' },
  { id:'f02', flightNo:'MU5103', star:false, scheduledTime:'07:00', depIcao:'ZSSS', depName:'上海', arrIcao:'ZBAA', arrName:'北京首都', estimatedTime:'09:20', status:'in_flight',  statusLabel:'在飞', countdown:'01:10', isAffected:false, isCompanyRoute:false, aircraftType:'B77W', registration:'B-7868' },
  { id:'f04', flightNo:'HU7801', star:false, scheduledTime:'07:45', depIcao:'ZJHK', depName:'海口', arrIcao:'ZSPD', arrName:'上海浦东', estimatedTime:'10:30', status:'in_flight',  statusLabel:'在飞', countdown:'02:05', isAffected:true,  isCompanyRoute:false, aircraftType:'B789', registration:'B-206M' },
  { id:'f05', flightNo:'CA4102', star:false, scheduledTime:'08:10', depIcao:'ZUUU', depName:'成都', arrIcao:'ZLXY', arrName:'西安咸阳', estimatedTime:'09:30', status:'actual',     statusLabel:'实际', countdown:'--',   isAffected:false, isCompanyRoute:false, aircraftType:'A21N', registration:'B-32A1' },
  { id:'f06', flightNo:'3U8701', star:false, scheduledTime:'08:30', depIcao:'ZUCK', depName:'重庆', arrIcao:'ZGGG', arrName:'广州白云', estimatedTime:'10:15', status:'in_flight',  statusLabel:'在飞', countdown:'00:50', isAffected:false, isCompanyRoute:true,  aircraftType:'A320', registration:'B-8680' },
  { id:'f08', flightNo:'CZ3501', star:false, scheduledTime:'09:20', depIcao:'ZLXY', depName:'西安', arrIcao:'ZUUU', arrName:'成都双流', estimatedTime:'10:50', status:'dispatched', statusLabel:'签派', countdown:'00:20', isAffected:false, isCompanyRoute:false, aircraftType:'A320', registration:'B-1635' },
  { id:'f09', flightNo:'CA1301', star:false, scheduledTime:'09:40', depIcao:'ZBAA', depName:'北京', arrIcao:'ZGGG', arrName:'广州白云', estimatedTime:'12:50', status:'actual',     statusLabel:'实际', countdown:'--',   isAffected:false, isCompanyRoute:true,  aircraftType:'B77W', registration:'B-7952' },
  { id:'f10', flightNo:'MU5401', star:false, scheduledTime:'10:00', depIcao:'ZSPD', depName:'浦东', arrIcao:'ZUUU', arrName:'成都双流', estimatedTime:'13:10', status:'dispatched', statusLabel:'签派', countdown:'00:18', isAffected:true,  isCompanyRoute:false, aircraftType:'A333', registration:'B-6108' },

  // ---- 中午时段（10:00-13:00） ----
  { id:'f11', flightNo:'HU7101', star:false, scheduledTime:'10:15', depIcao:'ZHCC', depName:'郑州', arrIcao:'ZBTJ', arrName:'天津滨海', estimatedTime:'11:30', status:'landing',    statusLabel:'即将降落', countdown:'00:05', isAffected:false, isCompanyRoute:false, aircraftType:'B738', registration:'B-5489' },
  { id:'f12', flightNo:'CZ3301', star:false, scheduledTime:'10:30', depIcao:'ZSAM', depName:'厦门', arrIcao:'ZGGG', arrName:'广州白云', estimatedTime:'11:40', status:'in_flight',  statusLabel:'在飞', countdown:'00:35', isAffected:true,  isCompanyRoute:true,  aircraftType:'A321', registration:'B-6972' },
  { id:'f13', flightNo:'3U8601', star:false, scheduledTime:'10:50', depIcao:'ZUUU', depName:'成都', arrIcao:'ZUCK', arrName:'重庆江北', estimatedTime:'11:50', status:'actual',     statusLabel:'实际', countdown:'--',   isAffected:false, isCompanyRoute:true,  aircraftType:'A319', registration:'B-6438' },
  { id:'f14', flightNo:'CA4103', star:false, scheduledTime:'11:10', depIcao:'ZBAA', depName:'北京', arrIcao:'ZSHC', arrName:'杭州萧山', estimatedTime:'13:10', status:'in_flight',  statusLabel:'在飞', countdown:'01:05', isAffected:false, isCompanyRoute:false, aircraftType:'A21N', registration:'B-32E7' },
  { id:'f15', flightNo:'MU5601', star:false, scheduledTime:'11:30', depIcao:'ZBTJ', depName:'天津', arrIcao:'ZSSS', arrName:'上海虹桥', estimatedTime:'13:20', status:'dispatched', statusLabel:'签派', countdown:'00:22', isAffected:false, isCompanyRoute:false, aircraftType:'B738', registration:'B-1295' },
  { id:'f16', flightNo:'CZ3201', star:false, scheduledTime:'11:55', depIcao:'ZSNJ', depName:'南京', arrIcao:'ZUUU', arrName:'成都双流', estimatedTime:'14:30', status:'planned',    statusLabel:'计划', countdown:'00:40', isAffected:true,  isCompanyRoute:false, aircraftType:'A321', registration:'B-6639' },
  { id:'f17', flightNo:'CA1403', star:false, scheduledTime:'12:15', depIcao:'ZSPD', depName:'浦东', arrIcao:'ZLXY', arrName:'西安咸阳', estimatedTime:'14:40', status:'dispatched', statusLabel:'签派', countdown:'00:28', isAffected:true,  isCompanyRoute:true,  aircraftType:'A359', registration:'B-32B8' },
  { id:'f18', flightNo:'HU7201', star:false, scheduledTime:'12:40', depIcao:'ZJHK', depName:'海口', arrIcao:'ZLXY', arrName:'西安咸阳', estimatedTime:'15:50', status:'planned',    statusLabel:'计划', countdown:'00:50', isAffected:true,  isCompanyRoute:false, aircraftType:'B789', registration:'B-209H' },
  { id:'f19', flightNo:'3U8501', star:false, scheduledTime:'13:00', depIcao:'ZPPP', depName:'昆明', arrIcao:'ZUCK', arrName:'重庆江北', estimatedTime:'14:20', status:'dispatched', statusLabel:'签派', countdown:'00:15', isAffected:false, isCompanyRoute:true,  aircraftType:'A320', registration:'B-8471' },
  { id:'f20', flightNo:'MU5501', star:false, scheduledTime:'13:20', depIcao:'ZSAM', depName:'厦门', arrIcao:'ZBAA', arrName:'北京首都', estimatedTime:'16:00', status:'planned',    statusLabel:'计划', countdown:'00:55', isAffected:false, isCompanyRoute:true,  aircraftType:'B738', registration:'B-5521' },

  // ---- 下午时段（13:00-17:00） ----
  { id:'f22', flightNo:'CZ3601', star:false, scheduledTime:'13:45', depIcao:'ZGGG', depName:'广州', arrIcao:'ZUUU', arrName:'成都双流', estimatedTime:'16:10', status:'in_flight',  statusLabel:'在飞', countdown:'01:35', isAffected:true,  isCompanyRoute:false, aircraftType:'A330', registration:'B-6107' },
  { id:'f23', flightNo:'MU5105', star:false, scheduledTime:'14:00', depIcao:'ZSSS', depName:'上海', arrIcao:'ZPPP', arrName:'昆明长水', estimatedTime:'17:20', status:'dispatched', statusLabel:'签派', countdown:'00:32', isAffected:false, isCompanyRoute:true,  aircraftType:'B77W', registration:'B-7869' },
  { id:'f24', flightNo:'CA1801', star:false, scheduledTime:'14:15', depIcao:'ZBAA', depName:'北京', arrIcao:'ZLXY', arrName:'西安咸阳', estimatedTime:'16:10', status:'landing',    statusLabel:'即将降落', countdown:'00:08', isAffected:true,  isCompanyRoute:false, aircraftType:'B789', registration:'B-20D1' },
  { id:'f25', flightNo:'3U8801', star:false, scheduledTime:'14:30', depIcao:'ZUUU', depName:'成都', arrIcao:'ZBYN', arrName:'太原武宿', estimatedTime:'16:10', status:'actual',     statusLabel:'实际', countdown:'--',   isAffected:false, isCompanyRoute:true,  aircraftType:'A319', registration:'B-6439' },
  { id:'f26', flightNo:'HU7301', star:false, scheduledTime:'14:45', depIcao:'ZGSZ', depName:'深圳', arrIcao:'ZLXY', arrName:'西安咸阳', estimatedTime:'17:30', status:'dispatched', statusLabel:'签派', countdown:'00:25', isAffected:false, isCompanyRoute:false, aircraftType:'B789', registration:'B-209J' },
  { id:'f27', flightNo:'CZ3401', star:false, scheduledTime:'15:00', depIcao:'ZGGG', depName:'广州', arrIcao:'ZSPD', arrName:'上海浦东', estimatedTime:'17:15', status:'planned',    statusLabel:'计划', countdown:'00:45', isAffected:true,  isCompanyRoute:true,  aircraftType:'B77W', registration:'B-2019' },
  { id:'f28', flightNo:'CA4201', star:false, scheduledTime:'15:15', depIcao:'ZLXY', depName:'西安', arrIcao:'ZBAA', arrName:'北京首都', estimatedTime:'17:00', status:'in_flight',  statusLabel:'在飞', countdown:'00:55', isAffected:false, isCompanyRoute:false, aircraftType:'A320', registration:'B-1285' },
  { id:'f29', flightNo:'MU5301', star:false, scheduledTime:'15:30', depIcao:'ZSPD', depName:'浦东', arrIcao:'ZGGG', arrName:'广州白云', estimatedTime:'18:05', status:'dispatched', statusLabel:'签派', countdown:'00:18', isAffected:true,  isCompanyRoute:false, aircraftType:'A359', registration:'B-32AE' },
  { id:'f30', flightNo:'3U8901', star:false, scheduledTime:'15:50', depIcao:'ZUCK', depName:'重庆', arrIcao:'ZSAM', arrName:'厦门高崎', estimatedTime:'18:00', status:'planned',    statusLabel:'计划', countdown:'00:55', isAffected:true,  isCompanyRoute:false, aircraftType:'A320', registration:'B-8531' },

  // ---- 傍晚时段（16:00-19:00） ----
  { id:'f31', flightNo:'CA1601', star:false, scheduledTime:'16:00', depIcao:'ZBTJ', depName:'天津', arrIcao:'ZSSS', arrName:'上海虹桥', estimatedTime:'17:50', status:'dispatched', statusLabel:'签派', countdown:'00:12', isAffected:false, isCompanyRoute:true,  aircraftType:'B738', registration:'B-5490' },
  { id:'f32', flightNo:'MU5701', star:false, scheduledTime:'16:15', depIcao:'ZSHC', depName:'杭州', arrIcao:'ZBAA', arrName:'北京首都', estimatedTime:'18:15', status:'planned',    statusLabel:'计划', countdown:'01:05', isAffected:true,  isCompanyRoute:false, aircraftType:'A320', registration:'B-6691' },
  { id:'f33', flightNo:'CZ3801', star:false, scheduledTime:'16:30', depIcao:'ZHCC', depName:'郑州', arrIcao:'ZUCK', arrName:'重庆江北', estimatedTime:'18:30', status:'planned',    statusLabel:'计划', countdown:'01:15', isAffected:false, isCompanyRoute:true,  aircraftType:'B738', registration:'B-1253' },
  { id:'f34', flightNo:'HU7401', star:false, scheduledTime:'16:50', depIcao:'ZJHK', depName:'海口', arrIcao:'ZBAA', arrName:'北京首都', estimatedTime:'20:15', status:'planned',    statusLabel:'计划', countdown:'01:40', isAffected:true,  isCompanyRoute:false, aircraftType:'B788', registration:'B-2758' },
  { id:'f35', flightNo:'CA1701', star:false, scheduledTime:'17:10', depIcao:'ZBAA', depName:'北京', arrIcao:'ZPPP', arrName:'昆明长水', estimatedTime:'20:30', status:'planned',    statusLabel:'计划', countdown:'01:50', isAffected:false, isCompanyRoute:false, aircraftType:'B789', registration:'B-20D8' },
  { id:'f36', flightNo:'3U8703', star:false, scheduledTime:'17:25', depIcao:'ZUUU', depName:'成都', arrIcao:'ZYTX', arrName:'沈阳桃仙', estimatedTime:'20:45', status:'planned',    statusLabel:'计划', countdown:'02:10', isAffected:true,  isCompanyRoute:false, aircraftType:'A330', registration:'B-6115' },
  { id:'f37', flightNo:'MU5801', star:false, scheduledTime:'17:40', depIcao:'ZSNJ', depName:'南京', arrIcao:'ZLLL', arrName:'兰州中川', estimatedTime:'20:10', status:'planned',    statusLabel:'计划', countdown:'01:55', isAffected:false, isCompanyRoute:false, aircraftType:'A320', registration:'B-1508' },
  { id:'f38', flightNo:'CZ3901', star:false, scheduledTime:'18:00', depIcao:'ZGGG', depName:'广州', arrIcao:'ZBTJ', arrName:'天津滨海', estimatedTime:'21:00', status:'planned',    statusLabel:'计划', countdown:'02:20', isAffected:true,  isCompanyRoute:false, aircraftType:'A333', registration:'B-6501' },
  { id:'f39', flightNo:'HU7501', star:false, scheduledTime:'18:20', depIcao:'ZGSZ', depName:'深圳', arrIcao:'ZYTX', arrName:'沈阳桃仙', estimatedTime:'22:00', status:'planned',    statusLabel:'计划', countdown:'03:05', isAffected:false, isCompanyRoute:true,  aircraftType:'B789', registration:'B-20A1' },
  { id:'f40', flightNo:'3U8603', star:false, scheduledTime:'18:40', depIcao:'ZUUU', depName:'成都', arrIcao:'ZSHC', arrName:'杭州萧山', estimatedTime:'21:10', status:'planned',    statusLabel:'计划', countdown:'01:55', isAffected:false, isCompanyRoute:true,  aircraftType:'A320', registration:'B-8478' },

  // ---- 夜间时段（19:00-23:00） ----
  { id:'f41', flightNo:'CA1901', star:false, scheduledTime:'19:00', depIcao:'ZBAA', depName:'北京', arrIcao:'ZUGY', arrName:'贵阳龙洞堡', estimatedTime:'22:10', status:'planned',    statusLabel:'计划', countdown:'02:30', isAffected:false, isCompanyRoute:false, aircraftType:'A21N', registration:'B-32F2' },
  { id:'f42', flightNo:'MU5901', star:false, scheduledTime:'19:15', depIcao:'ZSSS', depName:'上海', arrIcao:'ZPPP', arrName:'昆明长水', estimatedTime:'22:40', status:'dispatched', statusLabel:'签派', countdown:'00:35', isAffected:true,  isCompanyRoute:true,  aircraftType:'B77W', registration:'B-7870' },
  { id:'f43', flightNo:'CZ3103', star:false, scheduledTime:'19:30', depIcao:'ZGGG', depName:'广州', arrIcao:'ZSYT', arrName:'烟台蓬莱', estimatedTime:'22:20', status:'planned',    statusLabel:'计划', countdown:'02:10', isAffected:true,  isCompanyRoute:false, aircraftType:'A321', registration:'B-6973' },
  { id:'f44', flightNo:'HU7601', star:false, scheduledTime:'20:00', depIcao:'ZJHK', depName:'海口', arrIcao:'ZLXY', arrName:'西安咸阳', estimatedTime:'23:10', status:'dispatched', statusLabel:'签派', countdown:'00:30', isAffected:true,  isCompanyRoute:false, aircraftType:'B789', registration:'B-20C5' },
  { id:'f45', flightNo:'3U8803', star:false, scheduledTime:'20:20', depIcao:'ZUCK', depName:'重庆', arrIcao:'ZGGG', arrName:'广州白云', estimatedTime:'22:10', status:'planned',    statusLabel:'计划', countdown:'01:15', isAffected:false, isCompanyRoute:true,  aircraftType:'A320', registration:'B-8681' },
  { id:'f46', flightNo:'CA1509', star:false, scheduledTime:'20:40', depIcao:'ZBNY', depName:'北京南苑', arrIcao:'ZSNJ', arrName:'南京禄口', estimatedTime:'22:20', status:'planned',    statusLabel:'计划', countdown:'01:10', isAffected:false, isCompanyRoute:false, aircraftType:'B738', registration:'B-1522' },
  { id:'f47', flightNo:'MU5107', star:false, scheduledTime:'21:00', depIcao:'ZLXY', depName:'西安', arrIcao:'ZSSS', arrName:'上海虹桥', estimatedTime:'23:10', status:'planned',    statusLabel:'计划', countdown:'01:35', isAffected:false, isCompanyRoute:true,  aircraftType:'A321', registration:'B-1152' },
  { id:'f48', flightNo:'CZ3203', star:false, scheduledTime:'21:30', depIcao:'ZHCC', depName:'郑州', arrIcao:'ZSNJ', arrName:'南京禄口', estimatedTime:'22:40', status:'planned',    statusLabel:'计划', countdown:'00:45', isAffected:false, isCompanyRoute:false, aircraftType:'B738', registration:'B-5579' },
  { id:'f49', flightNo:'HU7701', star:false, scheduledTime:'22:00', depIcao:'ZSPD', depName:'浦东', arrIcao:'ZUUU', arrName:'成都双流', estimatedTime:'00:50', status:'planned',    statusLabel:'计划', countdown:'02:05', isAffected:true,  isCompanyRoute:false, aircraftType:'B788', registration:'B-2760' },
  { id:'f50', flightNo:'CA4301', star:false, scheduledTime:'22:30', depIcao:'ZBAA', depName:'北京', arrIcao:'ZHCC', arrName:'郑州新郑', estimatedTime:'00:05', status:'planned',    statusLabel:'计划', countdown:'01:05', isAffected:false, isCompanyRoute:true,  aircraftType:'B789', registration:'B-20E2' },
]

/** 受影响航班分析 */
export interface FlightAnalysis {
  flightNo: string; delayMinutes: number; aircraftType: string
  registration: string; originalRoute: string; alternateRoutes: AlternateRoute[]
}

export interface AlternateRoute {
  id: string; name: string; route: string; waypoints: string[]
  distance: number; affectedWaypoints: string[]
}

export const MOCK_FLIGHT_ANALYSIS: Record<string, FlightAnalysis> = {
  'MU5103': { flightNo:'MU5103', delayMinutes:35, aircraftType:'B738', registration:'B-5801', originalRoute:'ZSSS PIMOL A593 P54 W554 SAREX ZGGG', alternateRoutes:[
    { id:'a1', name:'MU5103A1', route:'ZSSS SHZ A470 P250 G327 P53 ZGGG', waypoints:['SHZ','P250','P53'], distance:680, affectedWaypoints:[] },
    { id:'a2', name:'MU5103A2', route:'ZSSS PIMOL W161 P270 R473 ZGGG', waypoints:['PIMOL','P270'], distance:720, affectedWaypoints:['PIMOL'] },
  ]},
  'CZ3601': { flightNo:'CZ3601', delayMinutes:21, aircraftType:'A330', registration:'B-6107', originalRoute:'ZGGG QF A461 P60 CKA ZUUU', alternateRoutes:[
    { id:'b1', name:'CZ3601B1', route:'ZGGG QF R473 P270 W161 P54 ZUUU', waypoints:['QF','P270','P54'], distance:890, affectedWaypoints:[] },
  ]},
}
