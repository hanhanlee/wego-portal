import {commonPortal, classPortals} from './portal-data.js';

// 更新日期來自已核對的發布紀錄，與活動日期分開；同一內容用相同 contentId。
export const updates = [
  {id:'textbooks-20260831',contentId:'textbooks-115',scope:'common',updatedAt:'2026-08-31',category:'學習資訊',type:'新增',title:'各年級課本版本',summary:'查看 115 學年度國語、數學、生活、自然與社會版本。',path:'/learning'},
  {id:'pickup-pass-20260831',contentId:'pickup-pass',scope:'common',updatedAt:'2026-08-31',category:'校務通知',type:'新增',noticeId:'wego-pickup-pass-reissue-115s1',summary:'8/31–9/2 受理，9/7 起依序發放。'},
  {id:'calendar-20260830',contentId:'calendar-115s1',scope:'common',updatedAt:'2026-08-30',category:'日期行程',type:'補充',title:'第一學期行事曆補齊',summary:'查看活動、繳費與假日安排。',path:'/calendar'},
  {id:'links-20260830',contentId:'parent-links',scope:'common',updatedAt:'2026-08-30',category:'常用連結',type:'新增',title:'家長常用連結整理',summary:'校務與語言學習入口集中查找。',path:'/links'},
  {id:'bus-guide-20260830',contentId:'bus-guide',scope:'common',updatedAt:'2026-08-30',category:'接送資訊',type:'補充',title:'校車異動注意事項',summary:'查看異動方式與參考說明。',path:'/links/bus'},
  {id:'homework-20260831',contentId:'english-homework',scope:'vwej3',updatedAt:'2026-08-31',category:'學習',type:'新增',title:'英文作業 8/31–9/18',summary:'三週複習、單字與測驗提醒。',path:'/homework',noticeId:'vwej3-english-homework-20260831'},
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
