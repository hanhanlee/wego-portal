import React from 'react';
import {ChatText} from '@phosphor-icons/react';
import {contextualHref} from './routing.js';

export default function TeacherNotesPage({notes,ctx}) {
  const ordered=notes.toSorted((a,b)=>b.date.localeCompare(a.date));
  return <>
    <div className="page-header"><div><h1>{ctx.label}導師聯絡事項</h1><p>整理導師透過 LINE 傳達的班級提醒，依通知日期由新到舊排列。</p></div></div>
    <p className="context-note">方便回查要準備的物品、需繳回的資料與班級活動提醒；如有調整，請以導師最新通知為準。</p>
    {ordered.length?<section className="teacher-notes" aria-label="導師通知紀錄">{ordered.map(note=><article key={note.id}>
      <time dateTime={note.date}>{note.date.replaceAll('-','/')}</time>
      <div><h2>{note.title}</h2>{note.paragraphs.map((p,i)=><p key={i}>{p}</p>)}
        {note.action?<p className="context-note"><strong>家長配合事項：</strong>{note.action}</p>:null}
        {note.dueDate?<p><strong>截止日期：</strong><time dateTime={note.dueDate}>{note.dueDate.replaceAll('-','/')}</time></p>:null}
        {note.image?<figure className="teacher-note-image"><a href={`${import.meta.env.BASE_URL}${note.image.path}`} target="_blank" rel="noopener noreferrer" aria-label="開啟通知附圖（另開分頁）"><img src={`${import.meta.env.BASE_URL}${note.image.path}`} alt={note.image.alt} loading="lazy"/></a><figcaption>{note.image.caption}點圖可放大查看。</figcaption></figure>:null}
        <small className="source">來源：導師 LINE 通知（重點整理）</small>
      </div>
    </article>)}</section>:<section className="teacher-notes-empty"><ChatText aria-hidden="true"/><h2>目前尚無聯絡事項紀錄</h2><p>後續整理的導師通知會顯示在這裡，方便依日期查閱。</p></section>}
    <a className="text-link" href={contextualHref('/notices',ctx,location.hostname)}>查看其他通知公告</a>
  </>;
}
