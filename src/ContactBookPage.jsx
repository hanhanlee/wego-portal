import React,{useMemo,useState} from 'react';
import {BookOpen,CalendarDots,CheckCircle,ClipboardText,Package} from '@phosphor-icons/react';
import {contactBookMonths} from './contact-book-data.js';

const sectionConfig=[
  ['homework','今日作業',BookOpen],['returns','發回與繳回',CheckCircle],['tomorrow','明日準備',Package],['reminders','學習提醒',ClipboardText],['notes','導師叮嚀',CalendarDots]
];
const displayDate=date=>`${Number(date.slice(5,7))}/${Number(date.slice(8,10))}`;

export default function ContactBookPage({entries,ctx,updated,initialDate}){
  const ordered=useMemo(()=>entries.toSorted((a,b)=>b.date.localeCompare(a.date)),[entries]);
  const months=contactBookMonths(ordered);
  const initial=ordered.find(entry=>entry.date===initialDate)||ordered[0];
  const [month,setMonth]=useState(initial?.date.slice(0,7)||months[0]);
  const monthEntries=ordered.filter(entry=>entry.date.startsWith(month));
  const [selectedId,setSelectedId]=useState(initial?.id);
  const selected=monthEntries.find(entry=>entry.id===selectedId)||monthEntries[0];
  function chooseMonth(value){setMonth(value);setSelectedId(ordered.find(entry=>entry.date.startsWith(value))?.id)}
  return <>
    <div className="page-header"><div><h1>{ctx.label}每日聯絡簿</h1><p>作業、繳交資料、明日準備與導師提醒，依日期集中查閱。</p></div><time>內容最後更新：{updated}</time></div>
    <p className="context-note">每日內容皆由紙本聯絡簿人工核對整理；若紙本有後續手寫更正，請以孩子帶回的最新版本為準。</p>
    <section className="contact-book-layout">
      <aside className="contact-book-index" aria-label="聯絡簿日期">
        <label htmlFor="contact-book-month">查看月份</label>
        <select id="contact-book-month" value={month} onChange={event=>chooseMonth(event.target.value)}>{months.map(value=><option value={value} key={value}>{value.replace('-', ' 年 ')} 月</option>)}</select>
        <nav>{monthEntries.map(entry=><button type="button" className={entry.id===selected?.id?'selected':undefined} aria-pressed={entry.id===selected?.id} onClick={()=>setSelectedId(entry.id)} key={entry.id}><time dateTime={entry.date}>{displayDate(entry.date)}</time><span>星期{entry.weekday}</span></button>)}</nav>
      </aside>
      {selected?<article className="contact-book-entry">
        <header><div><span>{monthEntries.findIndex(entry=>entry.id===selected.id)===0?'本月最新':'歷史紀錄'}</span><h2><time dateTime={selected.date}>{selected.date.replaceAll('-',' / ')}</time>（{selected.weekday}）</h2></div><small>點左側日期切換</small></header>
        <div className="contact-book-sections">{sectionConfig.map(([key,title,Icon])=>selected[key]?.length?<section key={key}><h3><Icon aria-hidden="true"/>{title}</h3><ol>{selected[key].map(item=><li key={item}>{item}</li>)}</ol></section>:null)}</div>
        <footer><small className="source">來源：{selected.source}</small><p>原始聯絡簿含簽章等資料，僅保存在私密來源庫。</p></footer>
      </article>:<p className="empty-message">這個月份目前沒有已整理的聯絡簿。</p>}
    </section>
  </>;
}
