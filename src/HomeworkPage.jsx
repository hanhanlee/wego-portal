import React from 'react';
import {ArrowUpRight, BookOpen} from '@phosphor-icons/react';

export default function HomeworkPage({homework, updated}) {
  const imageUrl = `${import.meta.env.BASE_URL}${homework.image}`;
  return <>
    <div className="page-header"><div><h1>{homework.title}</h1><p>Weekly Homework・{homework.period}</p></div><time>內容最後更新：{updated}</time></div>
    <p className="context-note">E：英文課本；SW：本課單詞，請參考課本 p.45、46；PR：Phonics in reading。Review 表示複習。</p>
    <p className="homework-warning">測驗日期請向老師確認：9/11 寫「下週二考 U1 Quiz」（9/15），9/15 又寫「明考 U1 Quiz」（9/16），原表兩處日期不一致。以下保留原表提醒，以老師最新通知為準。</p>
    {homework.weeks.map(week=><section key={week.label}>
      <h2 className="section-title"><BookOpen/>{week.label}</h2>
      <div className="homework-days">{week.days.map(day=><article key={day.date}>
        <h3><time dateTime={day.date}>{day.label}</time></h3>
        <ul>{day.items.map(item=><li key={item}>{item}</li>)}</ul>
      </article>)}</div>
    </section>)}
    <section aria-labelledby="homework-reference">
      <h2 className="section-title" id="homework-reference">英文作業原圖</h2>
      <p>可開啟原圖放大對照；作業如有調整，請以老師最新通知為準。</p>
      <a className="outline-button" href={imageUrl} target="_blank" rel="noopener noreferrer">開啟英文作業原圖 <ArrowUpRight/></a>
      <a className="homework-image" href={imageUrl} target="_blank" rel="noopener noreferrer" aria-label="放大 Weekly Homework 原圖（另開分頁）"><img src={imageUrl} alt="1B 英文 Weekly Homework，8月31日至9月18日三週作業表" width="869" height="526" loading="lazy"/></a>
      <small className="source">來源：{homework.source}</small>
    </section>
  </>;
}
