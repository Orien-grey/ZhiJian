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
  ZLXY: [
    { id:'n21', ref:'A2259/26', type:'replace', startDate:'2026-06-02', endDate:'2026-06-18', summary:'05/23 不可着陆，06/24 正常使用', affectedFacility:'RWY 05/23', priority:'A' },
    { id:'n22', ref:'A2305/26', type:'new', startDate:'2026-06-06', endDate:'2026-06-22', summary:'05 跑道关闭进行ILS校准', affectedFacility:'RWY 05', priority:'A' },
    { id:'n23', ref:'M5100/26', type:'new', startDate:'2026-06-01', endDate:'2026-06-30', summary:'停机坪东区重新划线，部分机位关闭', affectedFacility:'东区停机坪', priority:'M' },
  ],
  ZUCK: [
    { id:'n24', ref:'A2258/26', type:'replace', startDate:'2026-06-03', endDate:'2026-06-19', summary:'滑行道 C 关闭进行道面修复', affectedFacility:'TWY C', priority:'B' },
    { id:'n25', ref:'A2303/26', type:'new', startDate:'2026-06-07', endDate:'2026-06-25', summary:'02R 不可用于起飞（灯光系统升级）', affectedFacility:'RWY 02R', priority:'A' },
  ],
  ZHCC: [
    { id:'n26', ref:'A2260/26', type:'replace', startDate:'2026-06-01', endDate:'2026-06-20', summary:'12R/30L 跑道关闭进行定期维护', affectedFacility:'RWY 12R/30L', priority:'A' },
    { id:'n27', ref:'A2306/26', type:'new', startDate:'2026-06-05', endDate:'2026-06-26', summary:'机场不可用于备降（雷达升级）', affectedFacility:'机场全区域', priority:'A' },
    { id:'n28', ref:'B4100/26', type:'new', startDate:'2026-06-03', endDate:'2026-06-17', summary:'VOR/DME CGO 频率检查，可能短时中断', affectedFacility:'CGO VOR/DME', priority:'B' },
  ],
  ZSAM: [
    { id:'n29', ref:'A2263/26', type:'replace', startDate:'2026-06-02', endDate:'2026-06-16', summary:'05/23 不可用于起飞（PAPI校准）', affectedFacility:'RWY 05/23', priority:'A' },
    { id:'n30', ref:'A2301/26', type:'new', startDate:'2026-06-04', endDate:'2026-06-20', summary:'滑行道 B 因排水工程关闭', affectedFacility:'TWY B', priority:'B' },
  ],
  ZSHC: [
    { id:'n31', ref:'A2289/26', type:'replace', startDate:'2026-06-05', endDate:'2026-06-21', summary:'07/25 不可用于起飞（道面检查）', affectedFacility:'RWY 07/25', priority:'A' },
    { id:'n32', ref:'B3300/26', type:'new', startDate:'2026-06-08', endDate:'2026-06-28', summary:'RNAV进近程序更新，新航图生效', affectedFacility:'所有RNAV程序', priority:'B' },
  ],
  ZBTJ: [
    { id:'n33', ref:'A2261/26', type:'replace', startDate:'2026-06-01', endDate:'2026-06-15', summary:'16R/34L 跑道关闭（除冰设备测试）', affectedFacility:'RWY 16R/34L', priority:'A' },
    { id:'n34', ref:'M2800/26', type:'new', startDate:'2026-06-10', endDate:'2026-07-10', summary:'APU测试区迁移至东侧', affectedFacility:'东侧测试区', priority:'M' },
  ],
  ZYTX: [
    { id:'n35', ref:'A2290/26', type:'replace', startDate:'2026-06-03', endDate:'2026-06-18', summary:'机场不可用于起飞（跑道摩擦系数测试）', affectedFacility:'所有跑道', priority:'A' },
    { id:'n36', ref:'B2500/26', type:'new', startDate:'2026-06-06', endDate:'2026-06-20', summary:'NDB TX 维护停用，使用VOR替代', affectedFacility:'TX NDB', priority:'B' },
  ],
  ZPPP: [
    { id:'n37', ref:'A2268/26', type:'replace', startDate:'2026-06-01', endDate:'2026-06-16', summary:'机场关闭进行应急演练', affectedFacility:'机场全区域', priority:'A' },
    { id:'n38', ref:'A2307/26', type:'new', startDate:'2026-06-05', endDate:'2026-06-22', summary:'03/21 不可用于起飞（高原性能验证）', affectedFacility:'RWY 03/21', priority:'A' },
    { id:'n39', ref:'C1900/26', type:'new', startDate:'2026-06-08', endDate:'2026-06-18', summary:'高空温度异常，注意发动机性能衰减', affectedFacility:'全空域', priority:'B' },
  ],
  ZJHK: [
    { id:'n40', ref:'A2291/26', type:'replace', startDate:'2026-06-02', endDate:'2026-06-25', summary:'台风天气，机场关闭至次日01:00', affectedFacility:'机场全区域', priority:'A' },
    { id:'n41', ref:'B1800/26', type:'new', startDate:'2026-06-05', endDate:'2026-06-15', summary:'ILS 09 下滑道异常，降至CAT I标准', affectedFacility:'ILS 09', priority:'B' },
  ],
  ZGSZ: [
    { id:'n42', ref:'A2501/26', type:'new', startDate:'2026-06-05', endDate:'2026-06-28', summary:'夜间施工关闭，00:30-04:00不可用', affectedFacility:'机场全区域', priority:'A' },
    { id:'n43', ref:'B4400/26', type:'replace', startDate:'2026-06-03', endDate:'2026-06-13', summary:'ATIS频率变更 127.80→127.95', affectedFacility:'ATIS', priority:'B' },
  ],
  ZSNJ: [
    { id:'n44', ref:'A2502/26', type:'new', startDate:'2026-06-04', endDate:'2026-06-24', summary:'06/24 不可着陆（NDB进近程序停用）', affectedFacility:'RWY 06/24', priority:'A' },
    { id:'n45', ref:'A2503/26', type:'replace', startDate:'2026-06-06', endDate:'2026-06-20', summary:'滑行道 A 除冰作业，夜间关闭', affectedFacility:'TWY A', priority:'B' },
    { id:'n46', ref:'C3500/26', type:'new', startDate:'2026-06-07', endDate:'2026-06-14', summary:'空军活动，西侧空域限制通行', affectedFacility:'西侧空域', priority:'B' },
  ],
  ZHHH: [
    { id:'n47', ref:'A2504/26', type:'replace', startDate:'2026-06-01', endDate:'2026-06-19', summary:'04L/22R 跑道关闭（道面重铺）', affectedFacility:'RWY 04L/22R', priority:'A' },
    { id:'n48', ref:'M6200/26', type:'new', startDate:'2026-06-05', endDate:'2026-07-05', summary:'新增RNAV AR进近程序试运行', affectedFacility:'RNAV AR程序', priority:'M' },
  ],
  ZSJN: [
    { id:'n49', ref:'A2272/26', type:'replace', startDate:'2026-06-02', endDate:'2026-06-18', summary:'机场关闭进行跑道延长施工', affectedFacility:'机场全区域', priority:'A' },
    { id:'n50', ref:'B2900/26', type:'new', startDate:'2026-06-04', endDate:'2026-06-14', summary:'VOR/DME JN 维护，使用GPS替代', affectedFacility:'JN VOR/DME', priority:'B' },
  ],
  ZUGY: [
    { id:'n51', ref:'A2404/26', type:'replace', startDate:'2026-06-03', endDate:'2026-06-16', summary:'机场夜间关闭施工，02:00-05:30', affectedFacility:'机场全区域', priority:'A' },
    { id:'n52', ref:'A2405/26', type:'new', startDate:'2026-06-06', endDate:'2026-06-20', summary:'01L/19R 不可着陆（高原减载要求）', affectedFacility:'RWY 01L/19R', priority:'A' },
  ],
  ZLLL: [
    { id:'n53', ref:'A2402/26', type:'replace', startDate:'2026-06-04', endDate:'2026-06-18', summary:'18/36 不可起飞（道面摩擦不足）', affectedFacility:'RWY 18/36', priority:'A' },
    { id:'n54', ref:'A2403/26', type:'new', startDate:'2026-06-07', endDate:'2026-06-28', summary:'机场不可备降（高海拔减载）', affectedFacility:'机场全区域', priority:'A' },
  ],
  ZBNY: [
    { id:'n55', ref:'A2407/26', type:'replace', startDate:'2026-06-01', endDate:'2026-06-14', summary:'机场夜间关闭，03:00-05:30不可用', affectedFacility:'机场全区域', priority:'A' },
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
  ZLXY: {
    icao:'ZLXY', metar:'ZLXY 061400Z 06004KT 6000 HZ FEW030 29/17 Q1014 NOSIG',
    taf:'ZLXY 061100Z 0612/0718 06004KT 6000 HZ FEW030 BECMG 0700/0702 22006KT',
    wind:'060° / 4kt', visibility:'6 km (霾)', ceiling:'3000ft FEW', temp:'29°C', qnh:'1014 hPa', trend:'stable',
  },
  ZUCK: {
    icao:'ZUCK', metar:'ZUCK 061400Z VRB02KT 5000 BR SCT020 27/20 Q1011 NOSIG',
    taf:'ZUCK 061100Z 0612/0718 VRB02KT 5000 BR SCT020 BECMG 0616/0618 2000 BR',
    wind:'VRB / 2kt', visibility:'5 km (轻雾)', ceiling:'2000ft SCT', temp:'27°C', qnh:'1011 hPa', trend:'deteriorating',
  },
  ZHCC: {
    icao:'ZHCC', metar:'ZHCC 061400Z 12008KT 7000 NSC 25/14 Q1016 NOSIG',
    taf:'ZHCC 061100Z 0612/0718 12008KT CAVOK BECMG 0706/0708 18010KT',
    wind:'120° / 8kt', visibility:'7 km', ceiling:'无云', temp:'25°C', qnh:'1016 hPa', trend:'stable',
  },
  ZSAM: {
    icao:'ZSAM', metar:'ZSAM 061400Z 15012KT 9999 FEW020 BKN050 30/24 Q1010 NOSIG',
    taf:'ZSAM 061100Z 0612/0718 15012KT 9999 FEW020 BKN050 TEMPO 0612/0616 4000 +SHRA',
    wind:'150° / 12kt', visibility:'10km+', ceiling:'2000ft FEW / 5000ft BKN', temp:'30°C', qnh:'1010 hPa', trend:'deteriorating',
  },
  ZSNJ: {
    icao:'ZSNJ', metar:'ZSNJ 061400Z 20006KT 8000 -RA OVC040 23/16 Q1012 TEMPO 4000 RA',
    taf:'ZSNJ 061100Z 0612/0718 20006KT 8000 -RA OVC040 TEMPO 0612/0618 3000 +RA',
    wind:'200° / 6kt', visibility:'8 km (小雨)', ceiling:'4000ft OVC', temp:'23°C', qnh:'1012 hPa', trend:'deteriorating',
  },
  ZBTJ: {
    icao:'ZBTJ', metar:'ZBTJ 061400Z 05010KT 6000 HZ NSC 27/13 Q1015 NOSIG',
    taf:'ZBTJ 061100Z 0612/0718 05010KT 6000 HZ NSC BECMG 0700/0702 12006KT',
    wind:'050° / 10kt', visibility:'6 km (霾)', ceiling:'无云', temp:'27°C', qnh:'1015 hPa', trend:'stable',
  },
  ZSPD: {
    icao:'ZSPD', metar:'ZSPD 061400Z 18012KT 8000 -SHRA BKN030 OVC060 25/19 Q1009 TEMPO 4000 TSRA',
    taf:'ZSPD 061100Z 0612/0718 18012KT 8000 -SHRA BKN030 TEMPO 0612/0616 2000 +TSRA BECMG 0700/0702 15008KT',
    wind:'180° / 12kt', visibility:'8 km (阵雨)', ceiling:'3000ft BKN', temp:'25°C', qnh:'1009 hPa', trend:'deteriorating',
  },
  ZSHC: {
    icao:'ZSHC', metar:'ZSHC 061400Z 19008KT 6000 -RA SCT015 OVC035 24/18 Q1011 NOSIG',
    taf:'ZSHC 061100Z 0612/0718 19008KT 6000 -RA SCT015 OVC035 BECMG 0618/0620 34004KT 4000 BR',
    wind:'190° / 8kt', visibility:'6 km (小雨)', ceiling:'1500ft SCT / 3500ft OVC', temp:'24°C', qnh:'1011 hPa', trend:'stable',
  },
  ZGSZ: {
    icao:'ZGSZ', metar:'ZGSZ 061400Z 17010KT 9999 SCT025 31/24 Q1009 NOSIG',
    taf:'ZGSZ 061100Z 0612/0718 17010KT 9999 SCT025 BECMG 0616/0618 VRB03KT',
    wind:'170° / 10kt', visibility:'10km+', ceiling:'2500ft SCT', temp:'31°C', qnh:'1009 hPa', trend:'stable',
  },
  ZJHK: {
    icao:'ZJHK', metar:'ZJHK 061400Z 12018G28KT 4000 +TSRA BKN015CB OVC030 26/23 Q1005 TEMPO 2000',
    taf:'ZJHK 061100Z 0612/0718 12018G28KT 4000 +TSRA BKN015CB TEMPO 0612/0618 1500 +TSRA BECMG 0706/0708 12010KT 8000 NSW',
    wind:'120° / 18G28kt', visibility:'4 km (强雷雨)', ceiling:'1500ft CB BKN', temp:'26°C', qnh:'1005 hPa', trend:'deteriorating',
  },
  ZYTX: {
    icao:'ZYTX', metar:'ZYTX 061400Z 32014KT 9999 FEW040 18/04 Q1018 NOSIG',
    taf:'ZYTX 061100Z 0612/0718 32014KT CAVOK BECMG 0700/0702 29006KT',
    wind:'320° / 14kt', visibility:'10km+', ceiling:'4000ft FEW', temp:'18°C', qnh:'1018 hPa', trend:'stable',
  },
  ZPPP: {
    icao:'ZPPP', metar:'ZPPP 061400Z 21006KT 9999 FEW030TCU SCT040 22/13 Q1023 NOSIG',
    taf:'ZPPP 061100Z 0612/0718 21006KT 9999 FEW030TCU SCT040 TEMPO 0614/0618 VRB15KT 3000 TSRA',
    wind:'210° / 6kt', visibility:'10km+', ceiling:'3000ft TCU FEW / 4000ft SCT', temp:'22°C', qnh:'1023 hPa', trend:'stable',
  },
  ZSJN: {
    icao:'ZSJN', metar:'ZSJN 061400Z 18006KT 5000 HZ NSC 28/16 Q1013 NOSIG',
    taf:'ZSJN 061100Z 0612/0718 18006KT 5000 HZ NSC BECMG 0706/0708 20008KT',
    wind:'180° / 6kt', visibility:'5 km (霾)', ceiling:'无云', temp:'28°C', qnh:'1013 hPa', trend:'stable',
  },
  ZUGY: {
    icao:'ZUGY', metar:'ZUGY 061400Z 16004KT 4000 BR SCT010 OVC030 21/18 Q1025 NOSIG',
    taf:'ZUGY 061100Z 0612/0718 16004KT 4000 BR SCT010 OVC030 BECMG 0702/0704 6000 NSW',
    wind:'160° / 4kt', visibility:'4 km (薄雾)', ceiling:'1000ft SCT / 3000ft OVC', temp:'21°C', qnh:'1025 hPa', trend:'improving',
  },
  ZLLL: {
    icao:'ZLLL', metar:'ZLLL 061400Z 31008KT 8000 NSC 22/06 Q1020 NOSIG',
    taf:'ZLLL 061100Z 0612/0718 31008KT CAVOK BECMG 0700/0702 06004KT',
    wind:'310° / 8kt', visibility:'8 km', ceiling:'无云', temp:'22°C', qnh:'1020 hPa', trend:'stable',
  },
  ZBNY: {
    icao:'ZBNY', metar:'ZBNY 061400Z 18006KT 5000 HZ NSC 28/15 Q1013 NOSIG',
    taf:'ZBNY 061100Z 0612/0718 18006KT 5000 HZ NSC BECMG 0618/0620 VRB02KT 3000 BR',
    wind:'180° / 6kt', visibility:'5 km (霾)', ceiling:'无云', temp:'28°C', qnh:'1013 hPa', trend:'deteriorating',
  },
  ZHHH: {
    icao:'ZHHH', metar:'ZHHH 061400Z 15008KT 7000 -RA SCT020 OVC050 24/17 Q1013 NOSIG',
    taf:'ZHHH 061100Z 0612/0718 15008KT 7000 -RA SCT020 OVC050 BECMG 0700/0702 12004KT 9999 NSW',
    wind:'150° / 8kt', visibility:'7 km (小雨)', ceiling:'2000ft SCT / 5000ft OVC', temp:'24°C', qnh:'1013 hPa', trend:'improving',
  },
}