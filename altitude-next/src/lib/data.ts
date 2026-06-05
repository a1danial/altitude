export interface Perk {
  id: string;
  name: string;
  pop: number;
  desc: string;
}

export interface LoungePerks {
  visits: string | null;
  access: string | null;
  condition: string | null;
  lounges: string | null;
}

export interface InsurancePerks {
  disruptions: string | null;
  medical: string | null;
  accident: string | null;
  condition: string | null;
  underwriter: string | null;
}

export interface CardPerks {
  lounge?: LoungePerks;
  insurance?: InsurancePerks;
  overseas?: string | null;
  miles?: string | null;
  transfer?: string | null;
  fasttrack?: string | null;
  hotel?: string | null;
  golf?: string | null;
  concierge?: string | null;
  roaming?: string | null;
  businessclass?: string | null;
  wifi?: string | null;
  protection?: string | null;
}

export interface Card {
  id: string;
  name: string;
  tier: string;
  net: string;
  num: string;
  theme: string;
  fg: string;
  minSalary: number;
  fee: number;
  waiver: string;
  perks: CardPerks;
}

export interface Lounge {
  id?: string;
  code: string;
  city: string;
  name: string;
  term: string;
  net: string;
  region: string;
  amen: string[];
  cards?: string[];
  lon?: number;
  lat?: number;
}

export interface Hub {
  city: string;
  code: string;
  lon: number;
  lat: number;
}

export interface Region {
  id: string;
  label: string;
}

export const PERKS: Perk[] = [
  {id:'lounge',        name:'Airport Lounge Access',     pop:1,  desc:'Unwind before departure in premium global lounges.'},
  {id:'insurance',     name:'Travel Insurance',           pop:2,  desc:'Complimentary cover for trips, delays and medical.'},
  {id:'overseas',      name:'Overseas Spending Rewards',  pop:3,  desc:'Elevated cashback or points on foreign currency spend.'},
  {id:'miles',         name:'Air Miles & Reward Points',  pop:4,  desc:'Earn frequent-flyer miles on everyday spending.'},
  {id:'transfer',      name:'Airport Transfers',          pop:8,  desc:'Chauffeured limousine rides to and from the terminal.'},
  {id:'fasttrack',     name:'Fast-Track Immigration',     pop:6,  desc:'Skip the queues with priority immigration lanes.'},
  {id:'hotel',         name:'Hotel Privileges',           pop:7,  desc:'Elite status, upgrades and late checkout at hotels.'},
  {id:'golf',          name:'Golf Privileges',            pop:11, desc:'Complimentary green fees at partner courses.'},
  {id:'concierge',     name:'24/7 Concierge',             pop:5,  desc:'A dedicated team for bookings and requests, anytime.'},
  {id:'roaming',       name:'Global Data Roaming',        pop:9,  desc:'Stay connected abroad with included mobile data.'},
  {id:'businessclass', name:'Business Class Fare Deals',  pop:10, desc:'Negotiated discounts on premium-cabin airfares.'},
  {id:'wifi',          name:'In-Flight WiFi Credit',      pop:12, desc:'Reimbursed connectivity while you fly.'},
  {id:'protection',    name:'Purchase Protection',        pop:13, desc:'Cover for new purchases against damage or theft.'},
];

export const CARDS: Card[] = [
  {id:'aurora', name:'Aurora Infinite', tier:'Invitation Only', net:'World Elite', num:'•••• 0001',
   theme:'linear-gradient(135deg,#1c1812 0%,#3a2f17 45%,#0c0a07 100%)', fg:'#ecdcb4',
   minSalary:600000, fee:3180, waiver:'By invitation — non-waivable',
   perks:{lounge:{visits:'Unlimited visits',access:'Cardholder + 1 supplementary + unlimited guests',condition:null,lounges:'1,300+ lounges worldwide · Priority Pass Select'},insurance:{disruptions:'Trip cancellation up to RM 50,000\nTrip delay up to RM 5,000 · min. 6-hour delay',medical:'Up to RM 1,000,000 overseas medical & hospitalisation',accident:'Up to RM 5,000,000 accidental death & disablement',condition:'Active cardholder, no flight purchase required',underwriter:'AIG Malaysia Insurance Berhad'},overseas:'5% cashback, all currencies',miles:'2.0 miles per RM 1',transfer:'8 limousine transfers / year',fasttrack:'Priority lanes at 30+ airports',hotel:'Marriott & Hilton elite status',golf:'Unlimited green fees',concierge:'Dedicated lifestyle manager',roaming:'Unlimited data, 100+ countries',businessclass:'Up to 35% off business class',wifi:'Full in-flight WiFi credit',protection:'180-day purchase protection'}},
  {id:'meridian', name:'Meridian Reserve', tier:'Reserve', net:'World Elite', num:'•••• 1875',
   theme:'linear-gradient(135deg,#0e1a16 0%,#163a31 50%,#08110e 100%)', fg:'#cfe6da',
   minSalary:300000, fee:1500, waiver:'Waived with RM 150,000 annual spend',
   perks:{lounge:{visits:'Unlimited visits',access:'Cardholder + 1 guest',condition:null,lounges:'1,300+ lounges · Priority Pass'},insurance:{disruptions:'Trip cancellation up to RM 30,000\nTrip delay up to RM 3,000 · min. 6-hour delay',medical:'Up to RM 500,000 overseas medical & hospitalisation',accident:'Up to RM 2,000,000 accidental death & disablement',condition:'Active cardholder, no flight purchase required',underwriter:'Chubb Insurance Malaysia Berhad'},overseas:'3% cashback, all currencies',miles:'1.5 miles per RM 1',transfer:'4 limousine transfers / year',fasttrack:'Priority lanes, select airports',hotel:'Hilton Honors Gold status',golf:'12 green fees / year',concierge:'24/7 concierge desk',roaming:null,businessclass:'Up to 20% off business class',wifi:'RM 200 WiFi credit / year',protection:'90-day purchase protection'}},
  {id:'horizon', name:'Horizon World Elite', tier:'World Elite', net:'World Elite', num:'•••• 4421',
   theme:'linear-gradient(135deg,#0c1320 0%,#1d2c47 50%,#080d16 100%)', fg:'#cdd9ee',
   minSalary:200000, fee:1080, waiver:'Waived with RM 100,000 annual spend',
   perks:{lounge:{visits:'Unlimited visits',access:'Cardholder + 2 guests',condition:'Min. RM 6,000 spend in each qualifying quarter',lounges:'1,300+ lounges · Priority Pass'},insurance:{disruptions:'Trip cancellation up to RM 20,000\nTrip delay up to RM 2,000 · min. 6-hour delay',medical:'Up to RM 500,000 overseas medical & hospitalisation',accident:'Up to RM 2,000,000 accidental death & disablement',condition:'Active cardholder, no flight purchase required',underwriter:'Chubb Insurance Malaysia Berhad'},overseas:'2.5% cashback, all currencies',miles:'1.5 miles per RM 1',transfer:'2 limousine transfers / year',fasttrack:'Fast-track at KLIA',hotel:'Accor Plus membership',golf:'8 green fees / year',concierge:'24/7 concierge desk',roaming:'Unlimited data, 50 countries',businessclass:'Up to 15% off premium fares',wifi:'RM 150 WiFi credit / year',protection:'90-day purchase protection'}},
  {id:'solstice', name:'Solstice Platinum', tier:'Platinum', net:'Signature', num:'•••• 6630',
   theme:'linear-gradient(135deg,#1d1d20 0%,#3c3c43 50%,#141416 100%)', fg:'#e3e3e8',
   minSalary:150000, fee:800, waiver:'Waived with RM 80,000 annual spend',
   perks:{lounge:{visits:'6 visits / year',access:'Cardholder only',condition:'Min. RM 500 single or cumulative spend within 30 days before / after lounge entry',lounges:'25 Plaza Premium Lounges · Asia-Pacific'},insurance:{disruptions:null,medical:null,accident:'Up to RM 1,000,000 accidental death & disablement',condition:'Active cardholder, no flight purchase required',underwriter:'N/A — confirm with issuer'},overseas:'2% cashback, all currencies',miles:'1.2 miles per RM 1',transfer:'2 airport transfers / year',fasttrack:null,hotel:null,golf:'6 green fees / year',concierge:'24/7 concierge desk',roaming:null,businessclass:null,wifi:null,protection:'90-day purchase protection'}},
  {id:'voyager', name:'Voyager Signature', tier:'Signature', net:'Signature', num:'•••• 2208',
   theme:'linear-gradient(135deg,#241712 0%,#4c3120 50%,#150d08 100%)', fg:'#ecd6bf',
   minSalary:120000, fee:600, waiver:'Waived with RM 60,000 annual spend',
   perks:{lounge:{visits:'4 visits / year',access:'Cardholder + 1 guest (shared quota)',condition:null,lounges:'Plaza Premium Lounges · Malaysia'},insurance:{disruptions:null,medical:null,accident:'Up to RM 1,000,000 accidental death & disablement',condition:'Active cardholder, no flight purchase required',underwriter:'N/A — confirm with issuer'},overseas:'1.5% cashback, all currencies',miles:'1.0 mile per RM 1',transfer:null,fasttrack:null,hotel:null,golf:null,concierge:'Travel concierge desk',roaming:'RM 50 roaming credit / trip',businessclass:null,wifi:null,protection:'60-day purchase protection'}},
  {id:'equator', name:'Equator Gold', tier:'Gold', net:'Gold', num:'•••• 9914',
   theme:'linear-gradient(135deg,#2a2114 0%,#5e4824 50%,#1a1409 100%)', fg:'#f0dcb0',
   minSalary:60000, fee:240, waiver:'Waived with RM 30,000 annual spend',
   perks:{lounge:{visits:'2 visits / year',access:'Cardholder only',condition:'Min. RM 3,000 spend in the preceding calendar month',lounges:'Plaza Premium Lounge · KLIA & KLIA2'},insurance:{disruptions:null,medical:null,accident:'Up to RM 500,000 accidental death & disablement',condition:'Active cardholder, no flight purchase required',underwriter:'N/A — confirm with issuer'},overseas:'1% cashback, all currencies',miles:'0.8 miles per RM 1',transfer:null,fasttrack:null,hotel:null,golf:null,concierge:null,roaming:null,businessclass:null,wifi:null,protection:'60-day purchase protection'}},
];

export const LOUNGES: Lounge[] = [
  {code:'KUL',city:'Kuala Lumpur',name:'Plaza Premium Lounge',term:'KLIA Terminal 1 · International Departures',net:'Plaza Premium',region:'apac',amen:['Hot buffet','Showers','Bar','Wi-Fi','Nap rooms'],lon:101.7,lat:3.1,cards:['aurora','meridian','horizon','solstice','voyager','equator']},
  {code:'KUL',city:'Kuala Lumpur',name:'Plaza Premium Lounge',term:'KLIA2 · Gateway, Level 2',net:'Plaza Premium',region:'apac',amen:['À la carte','Showers','Wi-Fi'],lon:101.7,lat:3.1,cards:['aurora','meridian','horizon','solstice','voyager','equator']},
  {code:'SIN',city:'Singapore',name:'SATS Premier Lounge',term:'Changi · Terminal 3',net:'Priority Pass',region:'apac',amen:['Hot buffet','Showers','Bar','Quiet zone'],lon:103.98,lat:1.36,cards:['aurora','meridian','horizon']},
  {code:'HKG',city:'Hong Kong',name:'Plaza Premium Lounge',term:'HKG · Terminal 1, Gate 1 & 60',net:'Plaza Premium',region:'apac',amen:['Noodle bar','Showers','Bar','Wi-Fi'],lon:113.92,lat:22.31,cards:['aurora','meridian','horizon','solstice']},
  {code:'HND',city:'Tokyo',name:'TIAT Lounge',term:'Haneda · Terminal 3',net:'Priority Pass',region:'apac',amen:['Japanese bites','Sake bar','Wi-Fi'],lon:139.78,lat:35.55,cards:['aurora','meridian','horizon']},
  {code:'BKK',city:'Bangkok',name:'Miracle Lounge',term:'Suvarnabhumi · Concourse D & G',net:'Priority Pass',region:'apac',amen:['Thai cuisine','Showers','Massage chairs'],lon:100.75,lat:13.69,cards:['aurora','meridian','horizon']},
  {code:'SYD',city:'Sydney',name:'Plaza Premium Lounge',term:'Sydney · T1 International',net:'Plaza Premium',region:'apac',amen:['Buffet','Bar','Showers','Wi-Fi'],lon:151.18,lat:-33.94,cards:['aurora','meridian','horizon','solstice']},
  {code:'DXB',city:'Dubai',name:'Marhaba Lounge',term:'DXB · Terminal 3, Concourse B',net:'Priority Pass',region:'mideast',amen:['Live cooking','Champagne','Showers','Spa'],lon:55.36,lat:25.25,cards:['aurora','meridian','horizon']},
  {code:'DOH',city:'Doha',name:'Al Maha Lounge',term:'Hamad International · Departures',net:'Priority Pass',region:'mideast',amen:['Buffet','Showers','Wi-Fi'],lon:51.61,lat:25.27,cards:['aurora','meridian','horizon']},
  {code:'IST',city:'Istanbul',name:'IGA Lounge',term:'Istanbul Airport · International',net:'Priority Pass',region:'europe',amen:['Golf simulator','Cinema','Buffet','Showers'],lon:28.82,lat:40.98,cards:['aurora','meridian','horizon']},
  {code:'LHR',city:'London',name:'Plaza Premium Lounge',term:'Heathrow · Terminals 2 & 4',net:'Plaza Premium',region:'europe',amen:['Bar','Showers','Wi-Fi','Work pods'],lon:-0.46,lat:51.48,cards:['aurora','meridian','horizon']},
  {code:'FRA',city:'Frankfurt',name:'Luxx Lounge',term:'Frankfurt · Terminal 1, Concourse B',net:'Priority Pass',region:'europe',amen:['Buffet','Bar','Wi-Fi'],lon:8.57,lat:50.04,cards:['aurora','meridian','horizon']},
  {code:'JFK',city:'New York',name:'Wingtips Lounge',term:'JFK · Terminal 4',net:'Priority Pass',region:'americas',amen:['Craft bar','Buffet','Showers'],lon:-73.78,lat:40.64,cards:['aurora','meridian','horizon']},
  {code:'LAX',city:'Los Angeles',name:'KAL Lounge',term:'LAX · Tom Bradley International',net:'Priority Pass',region:'americas',amen:['Hot dishes','Bar','Wi-Fi'],lon:-118.41,lat:33.94,cards:['aurora','meridian','horizon']},
];

/* Home marker — HUBS proper are derived from LOUNGES at runtime */
export const HOME_HUB: Hub = {city:'Kuala Lumpur', code:'KUL', lon:101.7, lat:3.1};

export const REGIONS: Region[] = [
  {id:'apac',     label:'Asia-Pacific'},
  {id:'mideast',  label:'Middle East'},
  {id:'europe',   label:'Europe'},
  {id:'americas', label:'Americas'},
  {id:'africa',   label:'Africa'},
];
