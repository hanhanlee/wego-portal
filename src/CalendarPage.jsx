import React,{useEffect,useRef,useState} from 'react';
import {CalendarDots,CaretRight} from '@phosphor-icons/react';
import {contextualHref} from './routing.js';
import {classTimetables} from './timetable-data.js';
import useToday from './useToday.js';
import {timelineEvents,monthTarget,isHomework} from './calendar-timeline.js';
import './calendar-timeline.css';

// Remember position only when opening an event from this timeline.
const returnPositions=new Map();
export default function CalendarPage({d,ctx,feeds,addEvent,updated}) {
  const key=ctx.kind==='class'?ctx.slug:'common';
  const [restore]=useState(()=>{const saved=returnPositions.get(key);returnPositions.delete(key);return saved;});
  const today=useToday();
  const [filter,setFilter]=useState(restore?.filter||'all');
  const [month,setMonth]=useState(restore?.month||today.slice(0,7));
  const [target,setTarget]=useState(restore?{kind:'restore',scrollY:restore.scrollY}:{kind:'today'});
  const [message,setMessage]=useState('');
  const subscriptionRef=useRef(null),todayRef=useRef(null),toolbar=useRef(null),rowRefs=useRef(new Map());
  const href=path=>contextualHref(path,ctx,location.hostname);
  const {past,current}=timelineEvents(d.events,filter,today);
  const all=[...past,...current];
  useEffect(()=>{
    const frame=requestAnimationFrame(()=>{
      if(target.kind==='restore'){window.scrollTo({top:target.scrollY,behavior:'instant'});return;}
      const event=target.kind==='month'?monthTarget(all,target.month):null;
      const node=target.kind==='month'?(event?rowRefs.current.get(event.uid):null):todayRef.current;
      if(!node){setMessage('這個月份沒有符合篩選條件的事項，可切換月份或篩選。');return;}
      setMessage('');
      const header=document.querySelector('.site-header')?.getBoundingClientRect().height||80;
      const offset=header+(toolbar.current?.getBoundingClientRect().height||160)+16;
      window.scrollTo({top:Math.max(0,window.scrollY+node.getBoundingClientRect().top-offset),behavior:'instant'});
    });
    return()=>cancelAnimationFrame(frame);
    // Only explicit navigation moves the viewport; midnight refresh never interrupts reading.
  },[target]);
  function jumpMonth(event){const value=event.currentTarget.value;if(/^\d{4}-(0[1-9]|1[0-2])$/.test(value)){setMonth(value);setTarget({kind:'month',month:value});}}
  function focusToday(){setMonth(today.slice(0,7));setTarget({kind:'today'});}
  function changeFilter(value){setFilter(value);setMonth(today.slice(0,7));setTarget({kind:'today'});}
  function remember(event){if(event.button===0&&!event.ctrlKey&&!event.metaKey&&!event.shiftKey&&!event.altKey)returnPositions.set(key,{scrollY:window.scrollY,filter,month});}
  function row(event,old=false){return <article className={`timeline-event${old?' is-past':''}`} key={event.uid} ref={node=>{if(node)rowRefs.current.set(event.uid,node);else rowRefs.current.delete(event.uid);}}>
    <time dateTime={event.start}>{event.start.slice(0,4)}<strong>{event.d}</strong></time>
    <div><span className="timeline-kind">{isHomework(event)?'英文作業':'校務與班級'}{old?'・已結束':event.start<today?'・進行中':event.start===today?'・今天':''}</span>
      <h3><a href={href(`/calendar/${event.uid}`)} onClick={remember}>{event.title}<CaretRight aria-hidden="true"/></a></h3>
      {event.detail?<p>{event.detail}</p>:null}<small className="source">來源：{event.source}</small>
      <button type="button" className="add-one" onClick={()=>addEvent(event)}><CalendarDots aria-hidden="true"/>只加入這一筆</button>
    </div>
  </article>;}
  return <>
    <div className="page-header"><div><h1>{d.label}日期行程</h1><p>從今天開始看，往上回查過去，往下查看接下來的事項。</p></div><time>內容最後更新：{updated}</time></div>
    <details className="timeline-subscribe" ref={subscriptionRef}><summary>{ctx.kind==='class'?'訂閱行事曆與班級課表':'訂閱行事曆'}</summary><div className="subscribe-panel">
      <div className="subscribe-copy"><h2>訂閱整學期行事曆</h2><p>訂閱內容包含全部事項，不受下方畫面篩選影響。更新後由行事曆服務定期同步，緊急更正仍以網站與校方通知為準。</p></div>
      <div className="subscribe-actions"><a className="primary-button" href={feeds.webcal}>iPhone / Mac 訂閱</a><a className="outline-button" href={feeds.google} target="_blank" rel="noreferrer">Google 日曆訂閱</a></div>
      <label className="subscribe-url"><span>訂閱網址</span><input readOnly value={feeds.https} onFocus={event=>event.target.select()}/></label>
      {ctx.kind==='class'&&classTimetables[ctx.slug]?<a className="text-link" href={href('/timetable')}>查看班級課表</a>:null}
    </div></details>
    <div className="timeline-toolbar" ref={toolbar}>
      <div className="timeline-controls"><h2>重要日期</h2><label>跳至月份<input type="month" value={month} onInput={jumpMonth} onChange={jumpMonth}/></label><button className="outline-button" type="button" onClick={focusToday}>回到今天</button></div>
      <button className="timeline-subscribe-trigger" type="button" onClick={()=>{subscriptionRef.current.open=true;subscriptionRef.current.scrollIntoView({block:'start',behavior:'instant'});}}>訂閱行事曆</button><div className="timeline-filters" role="group" aria-label="行程篩選">{[['all','全部'],['school','校務與班級'],...(ctx.kind==='class'?[['homework','英文作業']]:[])].map(([value,label])=><button type="button" key={value} aria-pressed={filter===value} onClick={()=>changeFilter(value)}>{label}</button>)}</div>
      {message?<p role="status">{message}</p>:null}
    </div>
    <section className="calendar-timeline" aria-label="日期時間軸">
      {past.map(event=>row(event,true))}
      <div className="timeline-today" ref={todayRef}><strong>今天 · {today.replaceAll('-','/')}</strong><span>往上看過去・往下看接下來</span></div>
      {current.map(event=>row(event))}
      {!current.length?<p className="timeline-empty">目前沒有符合篩選條件的後續事項；可往上查閱過去紀錄。</p>:null}
    </section>
  </>;
}
