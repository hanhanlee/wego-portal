import {resolvePortalData} from './portal-data.js';
import {linkGroups} from './links-data.js';
import {textbookVersions115} from './textbook-data.js';
import {classHomework} from './homework-data.js';
import {homeworkDays} from './homework-months.js';
import {classTimetables} from './timetable-data.js';
import {classTeacherNotes} from './teacher-notes-data.js';
import {classContactBooks} from './contact-book-data.js';
import {morningSpeech} from './morning-speech-data.js';

const join=value=>Array.isArray(value)?value.filter(Boolean).join(' '):(value||'');
export const normalizeSearchText=value=>String(value||'').normalize('NFKC').toLocaleLowerCase('zh-Hant').replace(/[，。；：、（）()｜|/\\]+/g,' ').replace(/\s+/g,' ').trim();

export function buildSearchRecords(ctx,extras={}){
  const slug=ctx.kind==='class'?ctx.slug:null;
  const portal=resolvePortalData(slug);
  const records=new Map();
  const add=record=>{
    const value={scope:'common',date:'',...record};
    value.searchText=normalizeSearchText([value.title,value.body,value.category,value.date,value.source].join(' '));
    records.set(`${value.title}|${value.date}`,value);
  };

  for(const event of portal.events) add({id:`event-${event.uid}`,scope:slug&&event.uid.startsWith(`${slug}-`)?'class':'common',category:'日期行程',title:event.title,body:event.detail,date:event.start,source:event.source,path:`/calendar/${event.uid}`});
  for(const notice of portal.notices) add({id:`notice-${notice.id}`,scope:slug&&notice.id.startsWith(`${slug}-`)?'class':'common',category:'通知公告',title:notice.title,body:join(notice.paragraphs)||notice.summary,date:notice.start,source:notice.source,path:`/notices/${notice.id}`});

  for(const [section,rows] of Object.entries(extras.schoolRows||{})) for(const row of rows){
    if(row.scope==='class'&&!slug) continue;
    add({id:`school-${section}-${row.title}`,scope:row.scope==='class'?'class':'common',category:'學校事務',title:row.title,body:`${row.summary} ${row.reference}`,date:row.date,source:row.source,path:`/school/${section}`});
  }
  for(const item of extras.classics||[]){
    if(item.scope==='class'&&!slug) continue;
    add({id:`classic-${item.id}`,scope:item.scope==='class'?'class':'common',category:'學習成長',title:item.title,body:`${item.occasion} ${item.note}`,source:item.source,path:'/learning'});
  }
  for(const group of linkGroups) for(const item of group.items) add({id:`link-${item.id}`,category:'常用連結',title:item.title,body:`${item.description} ${item.access}`,source:'家長常用連結',path:'/links'});
  add({id:'textbooks-115',category:'學習成長',title:'115 學年度各年級課本版本',body:textbookVersions115.map(row=>`${row.grade} 國語${row.chinese} 數學${row.math} 生活${row.life||''} 自然${row.science||''} 社會${row.social||''}`).join('；'),source:'學校教務相關 Q&A',path:'/learning'});
  add({id:'morning-speech-rules',category:'學習成長',title:'晨間演說進行方式',body:[...morningSpeech.rules,...morningSpeech.instructions].join(' '),source:'小鈴鐺群組',path:'/learning'});

  if(slug){
    for(const row of morningSpeech.schedules[slug]||[]) add({id:`speech-${slug}-${row.order}`,scope:'class',category:'班級行程',title:`晨間演說｜${row.group}${row.language}第 ${row.session} 次朗讀`,body:`座號 ${row.seatNumbers.join('、')}；順序 ${row.order} ${row.week}`,date:row.iso,source:'小鈴鐺群組',path:`/calendar/${slug}-morning-speech-order-${row.order}-115s1`,seatNumbers:row.seatNumbers});
    for(const note of classTeacherNotes[slug]||[]) add({id:`teacher-${note.id}`,scope:'class',category:'導師聯絡',title:note.title,body:`${join(note.paragraphs)} ${note.action||''}`,date:note.date,source:'導師 LINE 通知',path:'/teacher-notes'});
    for(const entry of classContactBooks[slug]||[]) add({id:`book-${entry.id}`,scope:'class',category:'每日聯絡簿',title:`${Number(entry.date.slice(5,7))}/${Number(entry.date.slice(8,10))} 每日聯絡簿`,body:[entry.homework,entry.returns,entry.tomorrow,entry.reminders,entry.notes].flat().filter(Boolean).join(' '),date:entry.date,source:entry.source,path:`/contact-book/${entry.date}`});
    for(const day of homeworkDays(classHomework[slug])) add({id:`homework-${day.date}`,scope:'class',category:'英文作業',title:`${Number(day.date.slice(5,7))}/${Number(day.date.slice(8,10))} 英文作業`,body:join(day.items),date:day.date,source:day.source,path:'/homework'});
    const timetable=classTimetables[slug];
    if(timetable) add({id:`timetable-${slug}`,scope:'class',category:'班級課表',title:timetable.title,body:timetable.rows.map(row=>`${row.label} ${row.time} ${row.shared||join(row.lessons)}`).join(' '),source:timetable.semester,path:'/timetable'});
  }
  return [...records.values()];
}

export function searchRecords(records,query,category='全部'){
  const tokens=normalizeSearchText(query).split(' ').filter(Boolean);
  if(!tokens.length) return [];
  const seatMatch=normalizeSearchText(query).match(/座號\s*(\d{1,2})/);
  return records.filter(record=>(category==='全部'||record.category===category)&&(!seatMatch||record.seatNumbers?.includes(Number(seatMatch[1])))&&tokens.every(token=>record.searchText.includes(token))).map(record=>{
    const title=normalizeSearchText(record.title);
    const score=tokens.reduce((total,token)=>total+(title.startsWith(token)?80:title.includes(token)?50:record.category.includes(token)?20:5),0)+(record.scope==='class'?2:0);
    return {...record,score};
  }).toSorted((a,b)=>b.score-a.score||b.date.localeCompare(a.date)||a.title.localeCompare(b.title,'zh-Hant'));
}

export function searchSnippet(text,query,limit=150){
  const value=String(text||'');
  if(value.length<=limit) return value;
  const token=normalizeSearchText(query).split(' ').find(Boolean)||'';
  const index=normalizeSearchText(value).indexOf(token);
  const start=Math.max(0,(index<0?0:index)-Math.floor(limit/3));
  const end=Math.min(value.length,start+limit);
  return `${start>0?'…':''}${value.slice(start,end).trim()}${end<value.length?'…':''}`;
}
