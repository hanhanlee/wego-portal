import React from 'react';
import {BookOpen,CalendarDots,CaretRight,Megaphone,ChatText,Notebook} from '@phosphor-icons/react';
import {classHomework} from './homework-data.js';
import {classTimetables} from './timetable-data.js';
import {contextualHref} from './routing.js';
import {resolveUpdates,upcomingEvents} from './updates-data.js';
import useToday from './useToday.js';
import {classTeacherNotes} from './teacher-notes-data.js';
import {classContactBooks} from './contact-book-data.js';

const href=(path,ctx)=>contextualHref(path,ctx,location.hostname);

export function UpdateList({items,ctx,compact=false,today}) {
  return <div className={`updates-list${compact?' updates-preview':''}`}>
    {items.length?items.map(item=><a className="update-row" href={href(item.path,ctx)} key={item.contentId}>
      <time dateTime={item.updatedAt}>{item.updatedAt.slice(5).replace('-','/')}</time>
      <div className="update-copy">
        <span className="update-category">{ctx.kind==='class'?`${item.scope==='common'?'共通':ctx.label}・`:''}{item.category}</span>
        <h3>{item.title}</h3>
        <p>{item.summary}</p>
        {item.expiresOn&&item.expiresOn<today?<span className="update-expired">申請已截止</span>:null}
      </div>
      <CaretRight aria-hidden="true"/>
    </a>):<p className="empty-message">目前沒有新的更新。</p>}
  </div>;
}

export default function HomePage({d,ctx,updated}) {
  const today=useToday();
  const isClass=ctx.kind==='class';
  const items=resolveUpdates(isClass?ctx.slug:null,today).slice(0,4);
  const upcoming=upcomingEvents(d.events,today);
  const hasHomework=isClass&&classHomework[ctx.slug];
  const hasTimetable=isClass&&classTimetables[ctx.slug];
  return <>
    <div className="home-heading">
      <div><h1>{isClass?`${d.label}班級資訊`:'一年級共通資訊'}</h1><p>{isClass?'查看班級近況與學校共通提醒。':'學校通知與生活資訊，一起從容準備。'}</p></div>
      <time>內容更新至 {updated}</time>
    </div>
    {hasHomework||hasTimetable?<nav className="home-shortcuts" aria-label="班級常用捷徑">
      {isClass&&classContactBooks[ctx.slug]?<a href={href('/contact-book',ctx)}><Notebook aria-hidden="true"/>每日聯絡簿</a>:null}
      {isClass&&classTeacherNotes[ctx.slug]?<a href={href('/teacher-notes',ctx)}><ChatText aria-hidden="true"/>導師聯絡事項</a>:null}
      {hasHomework?<a href={href('/homework',ctx)}><BookOpen aria-hidden="true"/>英文作業</a>:null}
      {hasTimetable?<a href={href('/timetable',ctx)}><CalendarDots aria-hidden="true"/>班級課表</a>:null}
    </nav>:null}
    <div className="home-columns">
      <section className="home-updates" aria-labelledby="recent-updates">
        <div className="home-section-heading"><h2 id="recent-updates"><Megaphone aria-hidden="true"/>近期更新</h2><a className="text-link" href={href('/notices',ctx)}>查看全部<CaretRight aria-hidden="true"/></a></div>
        <UpdateList items={items} ctx={ctx} today={today} compact/>
      </section>
      <section className="home-upcoming" aria-labelledby="upcoming-dates">
        <div className="home-section-heading"><h2 id="upcoming-dates"><CalendarDots aria-hidden="true"/>接下來的日期</h2></div>
        <div className="upcoming-list">{upcoming.length?upcoming.map(event=><a className="upcoming-row" key={event.uid} href={href(`/calendar/${event.uid}`,ctx)}>
          <time dateTime={event.start}>{event.d}</time><span>{event.title}{event.start<=today?<small>{event.start===today?'今天':'進行中'}</small>:null}</span>
        </a>):<p className="empty-message">目前沒有已整理的後續行程。</p>}</div>
        <a className="text-link calendar-more" href={href('/calendar',ctx)}>查看完整行事曆<CaretRight aria-hidden="true"/></a>
      </section>
    </div>
  </>;
}
