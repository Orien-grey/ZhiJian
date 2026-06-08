// ============================================================
// 地图悬停情报数据 — 航路点/航路/限制区/机场详情
// ============================================================

export interface WaypointDetail {
  code: string; name: string; lng: number; lat: number
  type: 'VOR' | 'NDB' | 'DME' | 'FIX' | 'RNAV'
  freq?: string; routes: string[]; elevation: string
}

export interface RouteDetail {
  id: string; name: string; direction: string
  length: number; waypoints: string[]; rnavCapable: boolean
  minAlt: string; maxAlt: string
}

export interface ZoneDetail {
  id: string; name: string; type: string; notamRef: string
  effective: string; altitude: string; radius?: number
  controllingUnit: string; contactFreq: string
  detail: string; affectedRoutes: string[]
}

export interface AirportDetail {
  icao: string; iata: string; name: string; runways: number
  longestRwy: string; elevation: string; metar: string
  notams: number; status: 'normal' | 'restricted'
}

// ==================== 航路点详情（42个关键点） ====================
export const WAYPOINT_DETAILS: Record<string, WaypointDetail> = {
  ANDIN:{ code:'ANDIN',name:'ANDIN',lng:116.50,lat:40.05,type:'VOR',freq:'114.50 MHz',routes:['G212','A461','G341'],elevation:'35m' },
  DOVCA:{ code:'DOVCA',name:'DOVCA',lng:111.00,lat:34.80,type:'FIX',routes:['G212','B215','B208','B339'],elevation:'280m' },
  CKA:  { code:'CKA',  name:'CKA',  lng:113.50,lat:34.50,type:'RNAV',routes:['G212','A461','B208'],elevation:'120m' },
  TAMEG:{ code:'TAMEG',name:'TAMEG',lng:107.50,lat:35.50,type:'VOR',freq:'113.20 MHz',routes:['B330','B215'],elevation:'950m' },
  YBL:  { code:'YBL',  name:'YBL',  lng:100.00,lat:38.50,type:'NDB',freq:'345 kHz',routes:['B215','B451','W187'],elevation:'1520m' },
  KAGSO:{ code:'KAGSO',name:'KAGSO',lng:106.80,lat:33.20,type:'FIX',routes:['B330'],elevation:'620m' },
  PIMOL:{ code:'PIMOL',name:'PIMOL',lng:121.20,lat:30.80,type:'VOR',freq:'116.80 MHz',routes:['A593','A470','W161'],elevation:'8m' },
  SHZ:  { code:'SHZ',  name:'SHZ',  lng:121.80,lat:31.10,type:'VOR',freq:'112.40 MHz',routes:['A470'],elevation:'5m' },
  WHA:  { code:'WHA',  name:'WHA',  lng:120.10,lat:30.20,type:'RNAV',routes:['A593','G327','W554'],elevation:'25m' },
  LIGMA:{ code:'LIGMA',name:'LIGMA',lng:117.00,lat:29.50,type:'FIX',routes:['A593','W161','W554'],elevation:'110m' },
  QF:   { code:'QF',   name:'QF',   lng:113.80,lat:23.20,type:'VOR',freq:'112.10 MHz',routes:['A461','R473'],elevation:'30m' },
  P270: { code:'P270', name:'P270', lng:119.50,lat:26.50,type:'RNAV',routes:['R473','W161','W554'],elevation:'150m' },
  ENH:  { code:'ENH',  name:'ENH',  lng:109.50,lat:30.30,type:'NDB',freq:'278 kHz',routes:['B330','W527'],elevation:'420m' },
  DS:   { code:'DS',   name:'DS',   lng:112.30,lat:29.80,type:'VOR',freq:'113.70 MHz',routes:['B208','W527'],elevation:'35m' },
  P250: { code:'P250', name:'P250', lng:118.30,lat:32.50,type:'RNAV',routes:['G212','A593','G327','A470'],elevation:'50m' },
  P53:  { code:'P53',  name:'P53',  lng:117.80,lat:30.80,type:'FIX',routes:['A593','W161','G327'],elevation:'90m' },
  P60:  { code:'P60',  name:'P60',  lng:114.00,lat:30.50,type:'FIX',routes:['A461','R473','W527'],elevation:'65m' },
  P44:  { code:'P44',  name:'P44',  lng:119.00,lat:33.50,type:'FIX',routes:['G327','A470'],elevation:'8m' },
  P17:  { code:'P17',  name:'P17',  lng:121.50,lat:31.20,type:'RNAV',routes:['G212','A588','A470'],elevation:'5m' },
  P10:  { code:'P10',  name:'P10',  lng:122.50,lat:42.00,type:'VOR',freq:'115.30 MHz',routes:['A588','G341','W206'],elevation:'180m' },
  P23:  { code:'P23',  name:'P23',  lng:125.50,lat:43.50,type:'FIX',routes:['A588','G341','W206'],elevation:'310m' },
  BM:   { code:'BM',   name:'BM',   lng:124.00,lat:45.50,type:'NDB',freq:'385 kHz',routes:['A588','G341','W206'],elevation:'145m' },
  P432: { code:'P432', name:'P432', lng:120.50,lat:41.50,type:'FIX',routes:['A588','G341'],elevation:'220m' },
  LJG:  { code:'LJG',  name:'LJG',  lng:100.20,lat:26.80,type:'VOR',freq:'115.90 MHz',routes:['R339'],elevation:'2240m' },
  P140: { code:'P140', name:'P140', lng:98.50, lat:24.00,type:'RNAV',routes:['R339'],elevation:'1680m' },
  P293: { code:'P293', name:'P293', lng:101.80,lat:27.50,type:'FIX',routes:['R339'],elevation:'1930m' },
  P73:  { code:'P73',  name:'P73',  lng:100.50,lat:25.80,type:'FIX',routes:['R339'],elevation:'1850m' },
  P122: { code:'P122', name:'P122', lng:105.80,lat:28.50,type:'RNAV',routes:['W77','A581'],elevation:'380m' },
  P126: { code:'P126', name:'P126', lng:103.20,lat:29.00,type:'FIX',routes:['W77','G471'],elevation:'520m' },
  P303: { code:'P303', name:'P303', lng:108.20,lat:31.50,type:'FIX',routes:['W77'],elevation:'260m' },
  P84:  { code:'P84',  name:'P84',  lng:102.50,lat:31.00,type:'NDB',freq:'312 kHz',routes:['G471'],elevation:'2850m' },
  P472: { code:'P472', name:'P472', lng:111.50,lat:30.00,type:'VOR',freq:'114.10 MHz',routes:['G471','W527'],elevation:'55m' },
  P49:  { code:'P49',  name:'P49',  lng:110.80,lat:28.20,type:'FIX',routes:['B330','G471','A581'],elevation:'310m' },
  P470: { code:'P470', name:'P470', lng:112.50,lat:27.80,type:'RNAV',routes:['B330','B208','A581'],elevation:'80m' },
  WXI:  { code:'WXI',  name:'WXI',  lng:114.50,lat:28.00,type:'FIX',routes:['A581'],elevation:'65m' },
  P454: { code:'P454', name:'P454', lng:115.00,lat:25.50,type:'FIX',routes:['B330','A461','A581'],elevation:'180m' },
  SAREX:{ code:'SAREX',name:'SAREX',lng:116.80,lat:24.50,type:'RNAV',routes:['W554'],elevation:'340m' },
  P508: { code:'P508', name:'P508', lng:112.00,lat:22.80,type:'FIX',routes:['A461','R473'],elevation:'45m' },
  P321: { code:'P321', name:'P321', lng:114.20,lat:22.50,type:'FIX',routes:['A461'],elevation:'22m' },
  P169: { code:'P169', name:'P169', lng:96.00, lat:37.00,type:'VOR',freq:'116.30 MHz',routes:['B451','W187'],elevation:'3100m' },
  KCA:  { code:'KCA',  name:'KCA',  lng:84.50, lat:41.50,type:'NDB',freq:'420 kHz',routes:['B451'],elevation:'980m' },
  HMI:  { code:'HMI',  name:'HMI',  lng:94.50, lat:42.50,type:'VOR',freq:'113.90 MHz',routes:['B451','W187'],elevation:'1450m' },
  P120: { code:'P120', name:'P120', lng:104.50,lat:30.00,type:'RNAV',routes:[],elevation:'510m' },
  P268: { code:'P268', name:'P268', lng:110.50,lat:21.00,type:'FIX',routes:[],elevation:'25m' },
  P87:  { code:'P87',  name:'P87',  lng:88.00, lat:44.00,type:'NDB',freq:'352 kHz',routes:['B451'],elevation:'820m' },
  P206: { code:'P206', name:'P206', lng:90.00, lat:38.50,type:'FIX',routes:['W187'],elevation:'2950m' },
  BISUN:{ code:'BISUN',name:'BISUN',lng:123.80,lat:41.20,type:'RNAV',routes:['B339'],elevation:'75m' },
  DONVO:{ code:'DONVO',name:'DONVO',lng:109.00,lat:25.50,type:'FIX',routes:[],elevation:'380m' },
  ELAPO:{ code:'ELAPO',name:'ELAPO',lng:114.80,lat:38.20,type:'VOR',freq:'115.60 MHz',routes:[],elevation:'180m' },
  FULAR:{ code:'FULAR',name:'FULAR',lng:92.50, lat:35.00,type:'NDB',freq:'295 kHz',routes:[],elevation:'4620m' },
  GOLAB:{ code:'GOLAB',name:'GOLAB',lng:104.00,lat:32.00,type:'FIX',routes:[],elevation:'1150m' },
  HAREX:{ code:'HAREX',name:'HAREX',lng:120.80,lat:36.20,type:'RNAV',routes:[],elevation:'60m' },
  IGMOT:{ code:'IGMOT',name:'IGMOT',lng:115.50,lat:28.50,type:'FIX',routes:[],elevation:'85m' },
  JULIP:{ code:'JULIP',name:'JULIP',lng:98.00, lat:30.50,type:'VOR',freq:'114.80 MHz',routes:[],elevation:'3350m' },
  KATLO:{ code:'KATLO',name:'KATLO',lng:119.80,lat:29.20,type:'RNAV',routes:[],elevation:'210m' },
  LADIX:{ code:'LADIX',name:'LADIX',lng:106.50,lat:26.50,type:'FIX',routes:[],elevation:'1120m' },
  MEPOG:{ code:'MEPOG',name:'MEPOG',lng:118.00,lat:35.00,type:'VOR',freq:'113.40 MHz',routes:['B339'],elevation:'65m' },
  NIRON:{ code:'NIRON',name:'NIRON',lng:95.00, lat:28.00,type:'NDB',freq:'268 kHz',routes:[],elevation:'3880m' },
  OLPEX:{ code:'OLPEX',name:'OLPEX',lng:112.50,lat:33.50,type:'FIX',routes:['B339'],elevation:'240m' },
  PALOD:{ code:'PALOD',name:'PALOD',lng:102.00,lat:36.00,type:'RNAV',routes:[],elevation:'2050m' },
  RIGAM:{ code:'RIGAM',name:'RIGAM',lng:121.00,lat:29.50,type:'FIX',routes:[],elevation:'35m' },
  SABIX:{ code:'SABIX',name:'SABIX',lng:108.50,lat:22.50,type:'VOR',freq:'116.50 MHz',routes:[],elevation:'140m' },
  TIDON:{ code:'TIDON',name:'TIDON',lng:117.50,lat:25.00,type:'RNAV',routes:[],elevation:'420m' },
  ULGAP:{ code:'ULGAP',name:'ULGAP',lng:124.50,lat:40.80,type:'FIX',routes:['W206'],elevation:'55m' },
}

// ==================== 航路详情 ====================
export const ROUTE_DETAILS: Record<string, RouteDetail> = {
  G212:{ id:'G212',name:'G212',direction:'双向',length:820,waypoints:['ANDIN','DOVCA','CKA','P250','P17'],rnavCapable:true,minAlt:'FL120',maxAlt:'FL360' },
  B330:{ id:'B330',name:'B330',direction:'双向',length:1350,waypoints:['TAMEG','KAGSO','ENH','P49','P470','P454'],rnavCapable:true,minAlt:'FL150',maxAlt:'FL390' },
  A593:{ id:'A593',name:'A593',direction:'东向',length:680,waypoints:['P250','P53','WHA','LIGMA','PIMOL'],rnavCapable:true,minAlt:'FL140',maxAlt:'FL340' },
  A461:{ id:'A461',name:'A461',direction:'南北',length:1100,waypoints:['ANDIN','CKA','P60','QF','P454'],rnavCapable:true,minAlt:'FL100',maxAlt:'FL350' },
  B215:{ id:'B215',name:'B215',direction:'东西',length:590,waypoints:['YBL','TAMEG','DOVCA'],rnavCapable:false,minAlt:'FL160',maxAlt:'FL310' },
  R473:{ id:'R473',name:'R473',direction:'南北',length:480,waypoints:['P60','QF','P270'],rnavCapable:true,minAlt:'FL080',maxAlt:'FL280' },
  W77: { id:'W77', name:'W77', direction:'东西',length:520,waypoints:['P303','P126','P122'],rnavCapable:true,minAlt:'FL100',maxAlt:'FL300' },
  G471:{ id:'G471',name:'G471',direction:'南北',length:720,waypoints:['P126','P84','P472','P49'],rnavCapable:true,minAlt:'FL130',maxAlt:'FL330' },
  W161:{ id:'W161',name:'W161',direction:'南北',length:380,waypoints:['P53','LIGMA','P270'],rnavCapable:true,minAlt:'FL090',maxAlt:'FL260' },
  A588:{ id:'A588',name:'A588',direction:'双向',length:960,waypoints:['BM','P23','P10','P432','P17'],rnavCapable:true,minAlt:'FL180',maxAlt:'FL380' },
  G341:{ id:'G341',name:'G341',direction:'双向',length:960,waypoints:['ANDIN','P432','P10','P23','BM'],rnavCapable:true,minAlt:'FL180',maxAlt:'FL380' },
  B208:{ id:'B208',name:'B208',direction:'东西',length:680,waypoints:['DOVCA','CKA','DS','P470'],rnavCapable:false,minAlt:'FL120',maxAlt:'FL320' },
  A581:{ id:'A581',name:'A581',direction:'东西',length:620,waypoints:['P122','P49','WXI','P470','P454'],rnavCapable:true,minAlt:'FL110',maxAlt:'FL330' },
  W527:{ id:'W527',name:'W527',direction:'南北',length:450,waypoints:['ENH','P472','DS','P60'],rnavCapable:true,minAlt:'FL100',maxAlt:'FL280' },
  G327:{ id:'G327',name:'G327',direction:'南北',length:400,waypoints:['P44','P250','P53','WHA'],rnavCapable:true,minAlt:'FL100',maxAlt:'FL310' },
  W554:{ id:'W554',name:'W554',direction:'南北',length:520,waypoints:['WHA','LIGMA','P270','SAREX'],rnavCapable:true,minAlt:'FL090',maxAlt:'FL270' },
  A470:{ id:'A470',name:'A470',direction:'双向',length:620,waypoints:['P250','P44','P17','SHZ','PIMOL'],rnavCapable:true,minAlt:'FL100',maxAlt:'FL340' },
  B451:{ id:'B451',name:'B451',direction:'东西',length:980,waypoints:['KCA','P87','HMI','P169','YBL'],rnavCapable:false,minAlt:'FL200',maxAlt:'FL380' },
  W187:{ id:'W187',name:'W187',direction:'南北',length:580,waypoints:['YBL','HMI','P206','P169'],rnavCapable:true,minAlt:'FL160',maxAlt:'FL340' },
  R339:{ id:'R339',name:'R339',direction:'南北',length:750,waypoints:['P293','LJG','P73','P140'],rnavCapable:true,minAlt:'FL130',maxAlt:'FL350' },
  W206:{ id:'W206',name:'W206',direction:'南北',length:550,waypoints:['BM','P23','P10','ULGAP'],rnavCapable:true,minAlt:'FL150',maxAlt:'FL320' },
  B339:{ id:'B339',name:'B339',direction:'南北',length:580,waypoints:['BISUN','MEPOG','OLPEX','DOVCA'],rnavCapable:true,minAlt:'FL100',maxAlt:'FL330' },
}

// ==================== 机场标记详情 ====================
export const AIRPORT_DETAILS: Record<string, AirportDetail> = {
  ZBAA:{ icao:'ZBAA',iata:'PEK',name:'北京首都',runways:3,longestRwy:'3810m',elevation:'35m',metar:'18006KT 8000 FEW040 28/15 Q1012',notams:6,status:'normal' },
  ZSSS:{ icao:'ZSSS',iata:'SHA',name:'上海虹桥',runways:2,longestRwy:'3400m',elevation:'3m',metar:'21008KT 6000 -RA BKN020 26/18 Q1009',notams:3,status:'restricted' },
  ZGGG:{ icao:'ZGGG',iata:'CAN',name:'广州白云',runways:3,longestRwy:'3800m',elevation:'15m',metar:'16010KT 9999 SCT030 32/22 Q1010',notams:2,status:'normal' },
  ZUUU:{ icao:'ZUUU',iata:'CTU',name:'成都双流',runways:2,longestRwy:'3600m',elevation:'495m',metar:'VRB02KT 5000 HZ NSC 30/19 Q1013',notams:3,status:'normal' },
  ZLXY:{ icao:'ZLXY',iata:'XIY',name:'西安咸阳',runways:2,longestRwy:'3800m',elevation:'479m',metar:'06004KT 6000 HZ FEW030 29/17 Q1014',notams:3,status:'normal' },
  ZUCK:{ icao:'ZUCK',iata:'CKG',name:'重庆江北',runways:3,longestRwy:'3800m',elevation:'416m',metar:'VRB02KT 5000 BR SCT020 27/20 Q1011',notams:2,status:'restricted' },
  ZHCC:{ icao:'ZHCC',iata:'CGO',name:'郑州新郑',runways:2,longestRwy:'3600m',elevation:'151m',metar:'12008KT 7000 NSC 25/14 Q1016',notams:3,status:'normal' },
  ZSAM:{ icao:'ZSAM',iata:'XMN',name:'厦门高崎',runways:1,longestRwy:'3400m',elevation:'18m',metar:'15012KT 9999 FEW020 BKN050 30/24 Q1010',notams:2,status:'normal' },
  ZSNJ:{ icao:'ZSNJ',iata:'NKG',name:'南京禄口',runways:2,longestRwy:'3600m',elevation:'15m',metar:'20006KT 8000 -RA OVC040 23/16 Q1012',notams:3,status:'restricted' },
  ZBTJ:{ icao:'ZBTJ',iata:'TSN',name:'天津滨海',runways:2,longestRwy:'3600m',elevation:'3m',metar:'05010KT 6000 HZ NSC 27/13 Q1015',notams:2,status:'normal' },
  ZSPD:{ icao:'ZSPD',iata:'PVG',name:'上海浦东',runways:4,longestRwy:'4000m',elevation:'4m',metar:'18012KT 8000 -SHRA BKN030 25/19 Q1009',notams:2,status:'restricted' },
  ZSHC:{ icao:'ZSHC',iata:'HGH',name:'杭州萧山',runways:2,longestRwy:'3600m',elevation:'7m',metar:'19008KT 6000 -RA OVC035 24/18 Q1011',notams:2,status:'normal' },
  ZGSZ:{ icao:'ZGSZ',iata:'SZX',name:'深圳宝安',runways:2,longestRwy:'3800m',elevation:'4m',metar:'17010KT 9999 SCT025 31/24 Q1009',notams:2,status:'normal' },
  ZJHK:{ icao:'ZJHK',iata:'HAK',name:'海口美兰',runways:1,longestRwy:'3600m',elevation:'23m',metar:'12018G28KT 4000 +TSRA BKN015CB 26/23 Q1005',notams:2,status:'restricted' },
  ZYTX:{ icao:'ZYTX',iata:'SHE',name:'沈阳桃仙',runways:2,longestRwy:'3600m',elevation:'60m',metar:'32014KT 9999 FEW040 18/04 Q1018',notams:2,status:'normal' },
  ZPPP:{ icao:'ZPPP',iata:'KMG',name:'昆明长水',runways:2,longestRwy:'4500m',elevation:'2102m',metar:'21006KT 9999 FEW030TCU 22/13 Q1023',notams:3,status:'normal' },
  ZSJN:{ icao:'ZSJN',iata:'TNA',name:'济南遥墙',runways:1,longestRwy:'3600m',elevation:'23m',metar:'18006KT 5000 HZ NSC 28/16 Q1013',notams:1,status:'restricted' },
  ZUGY:{ icao:'ZUGY',iata:'KWE',name:'贵阳龙洞堡',runways:1,longestRwy:'3200m',elevation:'1139m',metar:'16004KT 4000 BR OVC030 21/18 Q1025',notams:2,status:'normal' },
  ZWWW:{ icao:'ZWWW',iata:'URC',name:'乌鲁木齐天山',runways:3,longestRwy:'3600m',elevation:'648m',metar:'32012KT 9999 FEW040 22/08 Q1018',notams:4,status:'restricted' },
}
