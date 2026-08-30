import React from 'react';
import {ArrowUpRight, Link as LinkIcon, ShieldCheck, Bus} from '@phosphor-icons/react';
import {linkGroups, busNotes} from './links-data.js';

export default function LinksPage({updated}) {
  return <>
    <div className="page-header"><div><h1>家長常用連結</h1><p>校務查詢、學習資源與常用文件，一處找到。</p></div><time>內容最後更新：{updated}</time></div>
    <aside className="links-account" aria-label="登入與個資提醒">
      <ShieldCheck weight="duotone"/>
      <div><h2>開啟前，先確認登入帳號</h2><p>校內 Google 帳號格式為「學號@wgps.tp.edu.tw」。學號與帳號可由下方「學生資訊查詢」取得；家長登入與學生 Google 帳號可能不同，請依各系統的校方說明操作。</p><p>密碼請查看校方通知或洽學校協助。本站不收集、儲存帳號密碼或孩子的身分資料。所有外部連結均另開分頁。</p></div>
    </aside>
    <div className="links-groups">{linkGroups.map(group=><section className="links-group" key={group.id} aria-labelledby={`links-${group.id}`}>
      <h2 className="section-title" id={`links-${group.id}`}><LinkIcon/>{group.title}</h2>
      <div className="resource-list">{group.items.map(item=><article className="resource-row" key={item.id}>
        <div><span className="resource-access">{item.access}</span><h3><a href={item.href} target="_blank" rel="noopener noreferrer">{item.title}<ArrowUpRight aria-hidden="true"/><span className="sr-only">（另開分頁）</span></a></h3><p>{item.description}</p>
        </div>
        <span className="resource-domain">{new URL(item.href).hostname}</span>
      </article>)}</div>
    </section>)}</div>
    <section className="bus-notes" aria-labelledby="bus-notes-title">
      <h2 className="section-title" id="bus-notes-title"><Bus/>校車異動：送出前請留意</h2>
      <p className="section-intro">依提供的系統注意事項截圖整理（2026/8/30 收錄；原圖未標示公告日期）。申請時間、費用與規則請以系統當下公告及校車室確認為準。</p>
      <p className="bus-contact">校車室 <a href="tel:0228973452">02-2897-3452</a></p>
      <ol>{busNotes.map(note=><li key={note.title}><strong>{note.title}</strong><p>{note.text}</p></li>)}</ol>
      <figure className="bus-reference">
        <a href={`${import.meta.env.BASE_URL}assets/references/school-affairs/bus-change-notice.png`} target="_blank" rel="noopener noreferrer" aria-label="查看校車異動申請注意事項原圖（另開分頁）">
          <img src={`${import.meta.env.BASE_URL}assets/references/school-affairs/bus-change-notice.png`} alt="校車異動回報系統的六項申請注意事項，包含申請期限、聯絡方式及費用" loading="lazy" width="1893" height="799"/>
          <span>查看校車注意事項原圖<ArrowUpRight aria-hidden="true"/></span>
        </a>
        <figcaption>點擊圖片可另開原圖、放大查看。2026/8/30 收錄，原圖未標示公告日期；請以校方最新公告為準。</figcaption>
      </figure>
    </section>
    <p className="links-source">來源：家長提供之學校服務連結與校車系統注意事項。部分資源需登入；無法開啟時，請確認學校帳號或洽校方，本站不代為登入。</p>
  </>;
}
