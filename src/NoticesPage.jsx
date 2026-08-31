import React from 'react';
import {CaretRight} from '@phosphor-icons/react';
import {UpdateList} from './HomePage.jsx';
import {resolveUpdates} from './updates-data.js';
import {contextualHref} from './routing.js';
import useToday from './useToday.js';

export default function NoticesPage({d,ctx,updated,notice=null}) {
  const today=useToday();
  const items=resolveUpdates(ctx.kind==='class'?ctx.slug:null,today);
  const represented=new Set(items.map(item=>item.noticeId));
  const older=d.notices.filter(item=>!represented.has(item.id));
  const href=path=>contextualHref(path,ctx,location.hostname);
  const expired=notice?.expiresOn&&notice.expiresOn<today;
  return <>
    <div className="page-header"><div><h1>{notice?notice.title:`${d.label}通知公告`}</h1><p>{notice?'通知內容與相關資訊':'依內容更新日期排序，查看最新整理與既有通知。'}</p></div><time>內容更新至 {updated}</time></div>
    {notice?<><article className="notice-detail"><p className="notice-date">{notice.date}</p>{expired?<p>此項申請已截止，以下保留供查閱。</p>:null}{notice.paragraphs?.map(p=><p key={p}>{p}</p>)}{notice.link&&!expired?<a className="outline-button" href={notice.link.url} target="_blank" rel="noopener noreferrer">{notice.link.label}</a>:null}<small className="source">{notice.source}</small></article><a className="text-link" href={href('/notices')}>查看全部通知<CaretRight/></a></>:<>
      <section><h2>所有更新</h2><UpdateList items={items} ctx={ctx} today={today}/></section>
      {older.length?<section><h2>既有通知</h2><p>以下日期為事項日期，不代表本站發布日期。</p><div className="existing-notices">{older.map(item=><a key={item.id} href={href(`/notices/${item.id}`)}><time>{item.date}</time><strong>{item.title}</strong><CaretRight/></a>)}</div></section>:null}
    </>}
  </>;
}
