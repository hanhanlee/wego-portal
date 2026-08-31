import {commonPortal, classPortals} from './portal-data.js';

// 更新日期來自已核對的發布紀錄，與活動日期分開；同一內容用相同 contentId。
export const updates = [
  {id:'teacher-note-20260831',contentId:'teacher-20260831-important',scope:'vwej3',updatedAt:'2026-08-31',category:'導師通知',type:'新增',title:'8/31 導師重要通知',summary:'資料保管、9/1 穿運動服、學用品及防身警報器補發提醒。',path:'/teacher-notes'},
  {id:'textbooks-20260831',contentId:'textbooks-115',scope:'common',updatedAt:'2026-08-31',category:'學習資訊',type:'新增',title:'各年級課本版本',summary:'查看 115 學年度國語、數學、生活、自然與社會版本。',path:'/learning'},
  {id:'bus-gps-20260831',contentId:'bus-gps',scope:'common',updatedAt:'2026-08-31',category:'接送資訊',type:'新增',title:'新增校車 GPS 追蹤入口',summary:'已加入常用連結，方便前往校方追蹤頁面。',path:'/links'},
  {id:'pickup-pass-20260831',contentId:'pickup-pass',scope:'common',updatedAt:'2026-08-31',category:'校務通知',type:'新增',noticeId:'wego-pickup-pass-reissue-115s1',summary:'8/31–9/2 受理，9/7 起依序發放。'},
  {id:'calendar-20260830',contentId:'calendar-115s1',scope:'common',updatedAt:'2026-08-31',category:'日期行程',type:'補充',title:'行事曆新增今天定位與篩選',summary:'從今天查看近期事項，可跳轉月份並篩選校務或英文作業。',path:'/calendar'},
  {id:'links-20260830',contentId:'parent-links',scope:'common',updatedAt:'2026-08-30',category:'常用連結',type:'新增',title:'家長常用連結整理',summary:'校務與語言學習入口集中查找。',path:'/links'},
  {id:'bus-guide-20260830',contentId:'bus-guide',scope:'common',updatedAt:'2026-08-30',category:'接送資訊',type:'補充',title:'校車異動注意事項',summary:'查看異動方式與參考說明。',path:'/links/bus'},
  {id:'homework-20260831',contentId:'english-homework',scope:'vwej3',updatedAt:'2026-08-31',category:'學習',type:'更正',title:'英文作業月曆與原圖歸檔',summary:'可切換年月查閱每日作業與對應原圖，並同步一忠行事曆。',path:'/homework',noticeId:'vwej3-english-homework-20260831'},
  {id:'timetable-20260830',contentId:'timetable-115s1',scope:'vwej3',updatedAt:'2026-08-30',category:'課表',type:'新增',title:'第一學期每週課表',summary:'查看每日課程與作息時間。',path:'/timetable'}
];

export function taipeiDate(now=new Date()) {
  const parts=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now);
  const part=type=>parts.find(p=>p.type===type).value;
  return `${part('year')}-${part('month')}-${part('day')}`;
}

export function selectUpdates(items,slug=null,today=taipeiDate()) {
  const scoped=items.filter(item=>(item.scope==='common'||(slug&&item.scope===slug))&&item.updatedAt&&item.updatedAt<=today)
    .toSorted((a,b)=>b.updatedAt.localeCompare(a.updatedAt)||Number(b.scope===slug)-Number(a.scope===slug));
  const seen=new Set();
  const unique=scoped.filter(item=>{if(seen.has(item.contentId)) return false;seen.add(item.contentId);return true;});
  // 最多一筆有效置頂；截止後仍留在歷史，但不再置頂。
  const pinned=unique.find(item=>item.pinUntil>=today&&(!item.expiresOn||item.expiresOn>=today));
  return pinned?[pinned,...unique.filter(item=>item!==pinned)]:unique;
}

export function resolveUpdates(slug=null,today=taipeiDate()) {
  if(slug&&!classPortals[slug]) return [];
  const notices=[...commonPortal.notices,...(classPortals[slug]?.notices||[])];
  const resolved=updates.map(item=>{
    const notice=item.noticeId?notices.find(n=>n.id===item.noticeId):null;
    return {...item,title:item.title||notice?.title,path:item.path||`/notices/${item.noticeId}`,expiresOn:notice?.expiresOn||item.expiresOn};
  }).filter(item=>item.title);
  return selectUpdates(resolved,slug,today);
}

export function upcomingEvents(events,today=taipeiDate(),limit=3) {
  return events.filter(event=>(event.end||event.start)>=today)
    .toSorted((a,b)=>a.start.localeCompare(b.start)).slice(0,limit);
}
