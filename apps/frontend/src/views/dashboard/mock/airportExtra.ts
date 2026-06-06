// ============================================================
// 机场扩展数据 — NOTAM 历史 / 通信导航设施 / 气象信息
// ============================================================

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
  pcategory: string; annualMovements: string; passengerCapacity: string
}

/** 气象快照 */
export interface AirportWeather {
  icao: string; metar: string; taf: string
  wind: string; visibility: string; ceiling: string; temp: string; qnh: string
  trend: 'improving' | 'stable' | 'deteriorating'
}

// ==================== NOTAM 历史 ====================
export const MOCK_AIRPORT_NOTAMS: Record<string, AirportNotam[]> = {
  ZBAA: [
    { id:'n1', ref:'A2253/26', type:'new', startDate:'2026-06-05', endDate:'2026-06-20', summary:'18R/36L 跑道因维护关闭，每日 07:00-10:30', affectedFacility:'RWY 18R/36L', priority:'A' },
    { id:'n2', ref:'A2261/26', type:'replace', startDate:'2026-06-03', endDate:'2026-06-18', summary:'滑行道 A 部分关闭，绕行 TWY B/C', affectedFacility:'TWY A', priority:'B' },
    { id:'n3', ref:'A2300/26', type:'new', startDate:'2026-06-06', endDate:'2026-06-25', summary:'18R 不可用于着陆，仅限起飞', affectedFacility:'RWY 18R', priority:'A' },
    { id:'n4', ref:'B1189/26', type:'cancel', startDate:'2026-05-15', endDate:'2026-05-30', summary:'ILS 18L 定期维护完成，恢复使用', affectedFacility:'ILS 18L', priority:'M' },
    { id:'n5', ref:'A2401/26', type:'new', startDate:'2026-06-08', endDate:'2026-06-28', summary:'36R 进近灯光系统检修，降至 CAT I', affectedFacility:'RWY 36R ALS', priority:'A' },
    { id:'n6', ref:'M3056/26', type:'new', startDate:'2026-06-01', endDate:'2026-06-30', summary:'停机位 201-210 施工关闭', affectedFacility:'停机位 201-210', priority:'M' },
  ],
  ZSSS: [
    { id:'n7', ref:'A2254/26', type:'new', startDate:'2026-06-04', endDate:'2026-06-19', summary:'18L/36R 跑道关闭进行道面修复', affectedFacility:'RWY 18L/36R', priority:'A' },
    { id:'n8', ref:'A2302/26', type:'new', startDate:'2026-06-07', endDate:'2026-06-22', summary:'18L 不可用于起飞（夜间施工）', affectedFacility:'RWY 18L', priority:'A' },
    { id:'n9', ref:'B2100/26', type:'replace', startDate:'2026-06-02', endDate:'2026-06-12', summary:'VOR/DME SHA 频率变更测试 112.4→112.8', affectedFacility:'SHA VOR/DME', priority:'B' },
  ],
  ZGGG: [
    { id:'n10', ref:'A2255/26', type:'replace', startDate:'2026-06-01', endDate:'2026-06-21', summary:'02R/20L 跑道不可用于起飞和着陆', affectedFacility:'RWY 02R/20L', priority:'A' },
    { id:'n11', ref:'C1088/26', type:'new', startDate:'2026-06-05', endDate:'2026-07-05', summary:'无人机活动，机场西侧 5NM 禁飞区', affectedFacility:'机场西侧空域', priority:'B' },
  ],
  ZUUU: [
    { id:'n12', ref:'A2256/26', type:'replace', startDate:'2026-06-03', endDate:'2026-06-18', summary:'02L 不可用于起飞（道面施工）', affectedFacility:'RWY 02L', priority:'A' },
    { id:'n13', ref:'A2304/26', type:'new', startDate:'2026-06-06', endDate:'2026-06-23', summary:'机场不可用于备降（容量限制）', affectedFacility:'机场全区域', priority:'A' },
    { id:'n14', ref:'M4120/26', type:'new', startDate:'2026-06-01', endDate:'2026-06-15', summary:'ILS 02R 下滑道定期校准', affectedFacility:'ILS 02R', priority:'M' },
  ],
  ZWWW: [
    { id:'n15', ref:'A2310/26', type:'new', startDate:'2026-06-01', endDate:'2026-06-30', summary:'07/25 跑道改造关闭', affectedFacility:'RWY 07/25', priority:'A' },
    { id:'n16', ref:'A2311/26', type:'replace', startDate:'2026-06-02', endDate:'2026-06-20', summary:'A3 联络道扩宽工程关闭', affectedFacility:'TWY A3', priority:'B' },
    { id:'n17', ref:'B3560/26', type:'new', startDate:'2026-06-05', endDate:'2026-07-05', summary:'NDB URC 维护暂停，用 RNAV 替代', affectedFacility:'URC NDB', priority:'B' },
    { id:'n18', ref:'C2200/26', type:'new', startDate:'2026-06-08', endDate:'2026-06-15', summary:'军事演习，北侧 30NM 限制区激活', affectedFacility:'北侧空域', priority:'B' },
  ],
  ZSPD: [
    { id:'n19', ref:'A2288/26', type:'replace', startDate:'2026-06-04', endDate:'2026-06-24', summary:'16L/34R 不可起飞，16R/34L 正常', affectedFacility:'RWY 16L/34R', priority:'A' },
    { id:'n20', ref:'A2289/26', type:'new', startDate:'2026-06-10', endDate:'2026-06-20', summary:'机场不可着陆（夜间灯光维护）', affectedFacility:'所有跑道', priority:'A' },
  ],
}

// ==================== 通信导航设施 ====================
export const MOCK_AIRPORT_FACILITIES: Record<string, AirportFacility> = {
  ZBAA: {
    icao:'ZBAA', atis:'127.60', tower:'118.10 / 118.50', ground:'121.90', approach:'119.70',
    vor:'PEK 114.5 / 18L', ndb:'ZX 345', ilsRunways:['18L CAT IIIB','18R CAT II','36L CAT IIIA','36R CAT I'],
    weatherRadar:true, rvrSensors:['18L TDZ','18L MID','18L END','36R TDZ','36R MID'],
    pcategory:'CAT 10 — 最高消防等级，A380 运行', annualMovements:'约 61 万架次 (2024)', passengerCapacity:'设计 8200 万人次/年',
  },
  ZSSS: {
    icao:'ZSSS', atis:'126.85', tower:'118.30', ground:'121.65', approach:'120.85',
    vor:'SHA 112.4', ndb:'HQ 305', ilsRunways:['18L CAT I','36R CAT I'],
    weatherRadar:true, rvrSensors:['18L TDZ','36R TDZ'],
    pcategory:'CAT 9 — B747 及以下', annualMovements:'约 27 万架次 (2024)', passengerCapacity:'设计 4500 万人次/年',
  },
  ZGGG: {
    icao:'ZGGG', atis:'126.85', tower:'118.80 / 119.60', ground:'121.70', approach:'120.40',
    vor:'BHY 112.1 / P270 116.5', ndb:'CG 239', ilsRunways:['02L CAT II','02R CAT IIIA','20R CAT I'],
    weatherRadar:true, rvrSensors:['02L TDZ','02R TDZ','02R MID','20L TDZ'],
    pcategory:'CAT 10 — 最高消防等级', annualMovements:'约 50 万架次 (2024)', passengerCapacity:'设计 8000 万人次/年',
  },
  ZUUU: {
    icao:'ZUUU', atis:'127.20', tower:'118.85 / 124.35', ground:'121.90', approach:'119.25',
    vor:'CTU 112.9', ndb:'ZW 234', ilsRunways:['02L CAT I','02R CAT II','20L CAT I'],
    weatherRadar:true, rvrSensors:['02L TDZ','02R TDZ'],
    pcategory:'CAT 9 — B777 及以下', annualMovements:'约 36 万架次 (2024)', passengerCapacity:'设计 5500 万人次/年',
  },
  ZWWW: {
    icao:'ZWWW', atis:'127.40', tower:'118.10 / 124.80', ground:'121.80', approach:'119.30',
    vor:'URC 117.1', ndb:'FH 527', ilsRunways:['07 CAT I','25 CAT I','08L CAT IIIA'],
    weatherRadar:true, rvrSensors:['07 TDZ','25 TDZ','08L TDZ','08L MID','08L END'],
    pcategory:'CAT 9 — B787 及以下', annualMovements:'约 24 万架次 (2024)', passengerCapacity:'设计 3500 万人次/年',
  },
}

// ==================== 实时气象 ====================
export const MOCK_AIRPORT_WEATHER: Record<string, AirportWeather> = {
  ZBAA: {
    icao:'ZBAA', metar:'ZBAA 061400Z 18006KT 8000 FEW040 28/15 Q1012 NOSIG',
    taf:'ZBAA 061100Z 0612/0718 18006KT 8000 FEW040 BECMG 0616/0618 05004KT 4000 BR',
    wind:'180° / 6kt', visibility:'8 km', ceiling:'4000ft FEW', temp:'28°C', qnh:'1012 hPa',
    trend:'stable',
  },
  ZSSS: {
    icao:'ZSSS', metar:'ZSSS 061400Z 21008KT 6000 -RA BKN020 OVC050 26/18 Q1009 TEMPO 4000 SHRA',
    taf:'ZSSS 061100Z 0612/0718 21008KT 6000 -RA BKN020 TEMPO 0612/0616 3000 +TSRA',
    wind:'210° / 8kt', visibility:'6 km (小雨)', ceiling:'2000ft BKN', temp:'26°C', qnh:'1009 hPa',
    trend:'deteriorating',
  },
  ZGGG: {
    icao:'ZGGG', metar:'ZGGG 061400Z 16010KT 9999 SCT030 32/22 Q1010 NOSIG',
    taf:'ZGGG 061100Z 0612/0718 16010KT 9999 SCT030 BECMG 0618/0620 VRB03KT',
    wind:'160° / 10kt', visibility:'10km+', ceiling:'3000ft SCT', temp:'32°C', qnh:'1010 hPa',
    trend:'stable',
  },
  ZUUU: {
    icao:'ZUUU', metar:'ZUUU 061400Z 04004KT 5000 HZ NSC 30/19 Q1013 NOSIG',
    taf:'ZUUU 061100Z 0612/0718 VRB03KT 5000 HZ NSC',
    wind:'040° / 4kt', visibility:'5 km (霾)', ceiling:'无云', temp:'30°C', qnh:'1013 hPa',
    trend:'stable',
  },
  ZWWW: {
    icao:'ZWWW', metar:'ZWWW 061400Z 32012KT 9999 FEW040 22/08 Q1018 NOSIG',
    taf:'ZWWW 061100Z 0612/0718 32012KT CAVOK BECMG 0700/0702 05006KT',
    wind:'320° / 12kt', visibility:'10km+', ceiling:'4000ft FEW', temp:'22°C', qnh:'1018 hPa',
    trend:'improving',
  },
}