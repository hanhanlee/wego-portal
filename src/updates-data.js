import {commonPortal, classPortals} from './portal-data.js';

// 更新日期來自已核對的發布紀錄，與活動日期分開；同一內容用相同 contentId。
export const updates = [
  {id:'teacher-note-20260904',contentId:'teacher-20260904',scope:'vwej3',updatedAt:'2026-09-04',category:'導師通知',type:'新增',title:'9/4 導師聯絡事項',summary:'開學第一週習慣、大白本與學生證保管，以及注音學習和下週一平測、聽寫提醒。',path:'/teacher-notes'},
  {id:'teacher-note-20260903',contentId:'teacher-20260903-important',scope:'vwej3',updatedAt:'2026-09-03',category:'導師通知',type:'新增',title:'9/3 導師重要通知',summary:'班書每週四帶回閱讀、星期一繳回，以及中英複習班第 1 週安親卷留存與複習提醒。',path:'/teacher-notes'},
  {id:'common-learning-notices-20260902',contentId:'common-learning-notices',scope:'common',updatedAt:'2026-09-02',category:'學習資訊',type:'新增',title:'外語音檔與表演藝術課提醒',summary:'查看英、日語課本音檔使用步驟及低年級表演藝術課安全服裝準備。',path:'/learning'},
  {id:'daily-schedule-20260901',contentId:'daily-schedule-115',scope:'common',updatedAt:'2026-09-01',category:'學校事務',type:'新增',title:'115學年度每日作息時間表',summary:'晨間閱讀、上下課、午餐午休、放學與課後安親時段集中查閱。',path:'/school/daily'},
  {id:'site-search-20260901',contentId:'site-search',scope:'common',updatedAt:'2026-09-01',category:'網站功能',type:'新增',title:'新增全文關鍵字搜尋',summary:'可搜尋已整理的作業、通知、日期、學習與校務內容。',path:'/search'},
  {id:'contact-book-20260901',contentId:'contact-book-daily',scope:'vwej3',updatedAt:'2026-09-04',category:'每日聯絡簿',type:'更新',title:'新增 9/4 每日聯絡簿',summary:'注音、國語、英文作業、家長簽名項目、下週一服裝與愛閱讀存摺。',path:'/contact-book'},
  {id:'traffic-guidance-20260901',contentId:'traffic-guidance-20260901',scope:'common',updatedAt:'2026-09-01',category:'接送資訊',type:'新增',title:'上放學交通宣導注意事項',summary:'校門口行車、下車、車接時間與接送方式變更提醒。',path:'/school/transport'},
  {id:'morning-speech-common-20260901',contentId:'morning-speech-115s1',scope:'common',updatedAt:'2026-09-01',category:'學習資訊',type:'新增',title:'晨間演說進行方式',summary:'整理分組、抽籤、朗讀／演說與期末獎狀規則。',path:'/learning'},
  {id:'morning-speech-vwej3-20260901',contentId:'morning-speech-115s1',scope:'vwej3',updatedAt:'2026-09-01',category:'班級行程',type:'新增',title:'一忠晨間演說分組日期',summary:'六組日期為 9/16 至 11/18，並已加入一忠行事曆。',path:'/learning'},
  {id:'foreign-audio-20260901',contentId:'foreign-audio',scope:'common',updatedAt:'2026-09-01',category:'學習資源',type:'補充',title:'菁英班英、日語課本音檔',summary:'可由學校外語教學資源頁下載。',path:'/links'},
  {id:'teacher-note-20260831',contentId:'teacher-20260831-important',scope:'vwej3',updatedAt:'2026-08-31',category:'導師通知',type:'新增',title:'8/31 導師重要通知',summary:'資料保管、9/1 穿運動服、學用品及防身警報器補發提醒。',path:'/teacher-notes'},
  {id:'textbooks-20260831',contentId:'textbooks-115',scope:'common',updatedAt:'2026-08-31',category:'學習資訊',type:'新增',title:'各年級課本版本',summary:'查看 115 學年度國語、數學、生活、自然與社會版本。',path:'/learning'},
  {id:'bus-gps-20260831',contentId:'bus-gps',scope:'common',updatedAt:'2026-09-02',category:'接送資訊',type:'更正',title:'國小校車資訊查詢入口',summary:'已更正為薇閣國小校車位置查詢網站；進入後須依校方頁面驗證學生身分。',path:'/links'},
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
