import {common as commonCalendar, classes as classCalendars} from './calendar-data.js';

export const commonPortal={
  label:'一年級共通',
  events:commonCalendar.events,
  exams:[
    {id:'wego-midterm-115',date:'11/4–5',title:'期中學力檢測',source:'學校行事曆',start:'2026-11-04'},
    {id:'wego-final-115',date:'1/12–13',title:'期末學力檢測',source:'學校行事曆',start:'2027-01-12'}
  ],
  notices:[
    {id:'wego-open-notice-115s1',date:'8/31',title:'第一學期開學',source:'學校行事曆',start:'2026-08-31'},
    {id:'wego-schoolday-notice-115s1',date:'9/19',title:'學校日',source:'學校行事曆',start:'2026-09-19'}
  ]
};

export const classPortals={
  vwej3:{
    label:'一忠',
    events:classCalendars.vwej3.events,
    exams:[
      {id:'vwej3-eng-0812',date:'8/12（三）',title:'暑輔英語評量',source:'一忠班級群組通知',start:'2026-08-12'}
    ],
    notices:[
      {id:'vwej3-bus-system-0821',date:'8/21',title:'校車異動回報系統可使用學生帳號密碼登入',source:'一忠班級群組通知',start:'2026-08-21'},
      {id:'vwej3-eye-traffic-0808',date:'8月上旬',title:'補充護眼護照與交通安全親子共學手冊說明',source:'一忠班級群組通知',start:'2026-08-08'},
      {id:'vwej3-pencil-0805',date:'8/5',title:'新增正確握筆與書寫姿勢參考',source:'一忠班級群組通知',start:'2026-08-05'},
      {id:'vwej3-uniform-bag-0802',date:'8/2',title:'補充制體服尺寸與英文手提袋說明',source:'一忠班級群組通知',start:'2026-08-02'},
      {id:'vwej3-uniform-purchase-0731',date:'7/31',title:'夏季制體服更換與加購方式',source:'一忠班級群組通知',start:'2026-07-31'},
      {id:'vwej3-introcard-correction-0731',date:'7/31',title:'自我介紹卡期限更正為 8月17日',source:'一忠班級群組通知',start:'2026-07-31'}
    ]
  }
};

export function mergeById(commonItems,classItems){
  const merged=new Map(commonItems.map(item=>[item.id??item.uid,item]));
  for(const item of classItems) merged.set(item.id??item.uid,item);
  return [...merged.values()].toSorted((a,b)=>(a.start||'').localeCompare(b.start||''));
}

export function resolvePortalData(classSlug=null){
  if(!classSlug) return commonPortal;
  const classPortal=classPortals[classSlug];
  if(!classPortal) return null;
  return {
    label:classPortal.label,
    events:mergeById(commonPortal.events,classPortal.events),
    exams:mergeById(commonPortal.exams,classPortal.exams),
    notices:mergeById(commonPortal.notices,classPortal.notices)
  };
}
