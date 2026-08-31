export const isHomework=event=>event.uid.includes('-english-homework-');
export function timelineEvents(events,filter,today) {
  const visible=events.filter(event=>filter==='all'||(filter==='homework'?isHomework(event):!isHomework(event)))
    .toSorted((a,b)=>a.start.localeCompare(b.start)||a.uid.localeCompare(b.uid));
  return {past:visible.filter(event=>(event.end||event.start)<today),current:visible.filter(event=>(event.end||event.start)>=today)};
}
export function monthTarget(events,month) {
  const first=`${month}-01`;
  return events.find(event=>event.start.slice(0,7)<=month&&(event.end||event.start)>=first);
}
