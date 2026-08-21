// RFC 5545 iCalendar 產生器（純函式，瀏覽器與 Node 皆可用）。
// 供 scripts/gen-ics.mjs 產生整學期訂閱 feed，也供前端產生「加入單一事件」的 .ics。

export const TZID='Asia/Taipei';

const enc=new TextEncoder();
const z=n=>String(n).padStart(2,'0');

function icsDate(iso){return iso.replace(/-/g,'');}            // YYYY-MM-DD -> YYYYMMDD

function plusDayCompact(iso){                                   // 全天事件 DTEND 需為隔天(排他)
  const d=new Date(iso+'T00:00:00Z');
  d.setUTCDate(d.getUTCDate()+1);
  return `${d.getUTCFullYear()}${z(d.getUTCMonth()+1)}${z(d.getUTCDate())}`;
}

export function stamp(date=new Date()){                         // DTSTAMP: YYYYMMDDTHHMMSSZ
  return `${date.getUTCFullYear()}${z(date.getUTCMonth()+1)}${z(date.getUTCDate())}`
       + `T${z(date.getUTCHours())}${z(date.getUTCMinutes())}${z(date.getUTCSeconds())}Z`;
}

function esc(s){                                                // 跳脫 SUMMARY/DESCRIPTION
  return String(s==null?'':s)
    .replace(/\\/g,'\\\\').replace(/;/g,'\\;').replace(/,/g,'\\,')
    .replace(/\r?\n/g,'\\n');
}

function fold(line){                                            // RFC 5545：每行 <=75 octet，續行以空白開頭
  if(enc.encode(line).length<=75) return line;
  let out='',cur='',bytes=0,first=true;
  for(const ch of line){
    const b=enc.encode(ch).length;
    const limit=first?74:73;                                   // 續行含前導空白，留餘裕
    if(bytes+b>limit){out+=(out?'\r\n ':'')+cur;cur=ch;bytes=b;first=false;}
    else{cur+=ch;bytes+=b;}
  }
  out+=(out?'\r\n ':'')+cur;
  return out;
}

function eventLines(ev,dtstamp){
  const desc=ev.detail?`${ev.detail} ｜ 來源：${ev.source}`:`來源：${ev.source}`;
  return [
    'BEGIN:VEVENT',
    `UID:${ev.uid}@wego-portal`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART;VALUE=DATE:${icsDate(ev.start)}`,
    `DTEND;VALUE=DATE:${plusDayCompact(ev.end)}`,
    `SUMMARY:${esc(ev.title)}`,
    `DESCRIPTION:${esc(desc)}`,
    'SEQUENCE:0',
    'STATUS:CONFIRMED',
    'TRANSP:TRANSPARENT',
    'END:VEVENT'
  ];
}

export function buildCalendar(events,{name='薇閣小一資料站',dtstamp=stamp()}={}){
  const lines=[
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//WeGo Grade 1//ZH-TW//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${esc(name)}`,
    `X-WR-TIMEZONE:${TZID}`,
    ...events.flatMap(ev=>eventLines(ev,dtstamp)),
    'END:VCALENDAR'
  ];
  return lines.map(fold).join('\r\n')+'\r\n';
}
