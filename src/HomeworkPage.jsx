import React,{useState} from 'react';
import './homework-calendar.css';
import {taipeiDate} from './updates-data.js';
import {contextualHref} from './routing.js';
import {homeworkDays,monthSources,monthCells,moveMonth} from './homework-months.js';
import {ArrowUpRight,CaretLeft,CaretRight} from '@phosphor-icons/react';

export default function HomeworkPage({homework,updated,ctx}) {
  const days=homeworkDays(homework);
  const today=taipeiDate();
  const availableMonths=[...new Set(days.map(day=>day.date.slice(0,7)))];
  const latest=availableMonths.at(-1)||today.slice(0,7);
  const [month,setMonth]=useState(latest);
  const [selected,setSelected]=useState(null);
  const monthDays=days.filter(day=>day.date.startsWith(month+'-'));
  const byDate=new Map(monthDays.map(day=>[day.date,day]));
  const activeDate=selected?.startsWith(month+'-')?selected:(monthDays.find(day=>day.date===today)?.date||monthDays[0]?.date||`${month}-01`);
  const active=byDate.get(activeDate);
  const sources=monthSources(homework,month);
  const cells=monthCells(month);
  const monthTitle=`${month.slice(0,4)} 年 ${Number(month.slice(5))} 月`;
  function changeMonth(value) {if(/^\d{4}-(0[1-9]|1[0-2])$/.test(value)&&Number(value.slice(0,4))>=1900&&Number(value.slice(0,4))<=2100){setMonth(value);setSelected(null);}}
  return <>
    <div className="page-header"><div><h1>{homework.title}</h1><p>依年月查閱每日作業，原圖隨月份顯示。</p></div><time>內容最後更新：{updated}</time></div>
    <p className="context-note">E：英文課本；SW：本課單詞，請參考課本 p.45、46；PR：Phonics in reading。Review 表示複習。</p>
    <div className="homework-calendar-actions"><a className="text-link" href={contextualHref('/calendar',ctx,location.hostname)}>查看一忠行事曆與訂閱方式</a></div>
    <nav className="homework-month-nav" aria-label="作業月份切換">
      <button className="outline-button" type="button" aria-label="上一個月" disabled={month==='1900-01'} onClick={()=>changeMonth(moveMonth(month,-1))}><CaretLeft/></button>
      <label>查閱月份<input aria-label="查閱月份" type="month" min="1900-01" max="2100-12" value={month} onChange={event=>changeMonth(event.target.value)}/></label>
      <button className="outline-button" type="button" aria-label="下一個月" disabled={month==='2100-12'} onClick={()=>changeMonth(moveMonth(month,1))}><CaretRight/></button>
      <button type="button" className="outline-button" onClick={()=>changeMonth(latest)}>最新有資料月份</button>
    </nav>
    <h2 className="section-title">{monthTitle}作業月曆</h2>
    <p className="homework-month-summary">本月已整理 {monthDays.length} 天作業。「尚無公告」不代表沒有作業，請以老師通知為準。</p>
    <p className="homework-mobile-help">點選日期查看當日完整作業；可切換月份查閱歷史資料。</p>
    <section className="homework-calendar" aria-label={`${monthTitle}英文作業月曆`}>
      <div className="homework-weekdays">{['一','二','三','四','五','六','日'].map(day=><span key={day}>週{day}</span>)}</div>
      {Array.from({length:cells.length/7},(_,week)=><div className="homework-week" key={week}>{cells.slice(week*7,week*7+7).map((date,index)=>{
        const day=byDate.get(date);
        return date?<article className={`homework-cell${date===today?' today':''}${date===activeDate?' selected':''}${!day?' unannounced':''}`} key={date}>
          <h3><time dateTime={date}>{Number(date.slice(-2))}</time>{date===today?'・今天':''}</h3>
          <button type="button" className="homework-date-button" aria-label={`${date}，${day?`${day.items.length}項作業`:'尚無公告'}`} aria-pressed={date===activeDate} onClick={()=>setSelected(date)}><time dateTime={date}>{Number(date.slice(-2))}</time><small>{date===today?'今天':day?`${day.items.length} 項`:'—'}</small></button>
          {day?<ul>{day.items.map(item=><li key={item}>{item}</li>)}</ul>:<p className="homework-no-entry">尚無公告</p>}
        </article>:<div className="homework-cell outside-month" key={`blank-${index}`} aria-hidden="true"/>;
      })}</div>)}
      <div className="homework-selected" aria-live="polite"><h2>{activeDate.replaceAll('-','/')} 英文作業</h2>{active?<ul>{active.items.map(item=><li key={item}>{item}</li>)}</ul>:<p>尚無公告，請以老師通知為準。</p>}</div>
    </section>
    <section aria-labelledby="homework-reference">
      <h2 className="section-title" id="homework-reference">{monthTitle}對應原圖</h2>
      {sources.length?<p>原圖依涵蓋的作業日期歸檔；跨月作業表會在相關月份顯示，同月可有多份。</p>:<p>本月尚無作業原圖。</p>}
      {sources.map(source=>{
        const imageUrl=`${import.meta.env.BASE_URL}${source.image}`;
        return <article className="homework-source" key={source.id}><h3>{source.period}・{source.source}</h3>{source.note?<p>{source.note}</p>:null}
          <a className="outline-button" href={imageUrl} target="_blank" rel="noopener noreferrer">開啟作業原圖 <ArrowUpRight/></a>
          <a className="homework-image" href={imageUrl} target="_blank" rel="noopener noreferrer" aria-label={`放大 ${source.period} 作業原圖（另開分頁）`}><img src={imageUrl} alt={`${source.source}，${source.period} 作業表`} loading="lazy"/></a>
        </article>;
      })}
    </section>
  </>;
}
