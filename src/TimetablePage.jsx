import React from 'react';
import {ArrowUpRight} from '@phosphor-icons/react';

export default function TimetablePage({timetable, updated}) {
  const imageUrl=`${import.meta.env.BASE_URL}${timetable.image}`;
  return <>
    <div className="page-header"><div><h1>{timetable.title}</h1><p>{timetable.semester}</p></div><time>內容最後更新：{updated}</time></div>
    <p className="context-note">依班級課表整理，課程與作息如有調整，請以導師最新通知為準。教室／場地標示保留原圖代碼。</p>
    <p className="timetable-hint">手機可左右滑動表格查看星期一至星期五；下方原圖可點開放大。</p>
    <div className="timetable-scroll" role="region" aria-label="一忠每週課表，可左右捲動" tabIndex={0}>
      <table className="timetable"><caption>{timetable.semester}・週一至週五作息</caption>
        <thead><tr><th scope="col">節次／時間</th>{timetable.days.map(day=><th scope="col" key={day}>{day}</th>)}</tr></thead>
        <tbody>{timetable.rows.map(row=><tr key={row.time} className={row.shared?'timetable-shared':undefined}>
          <th scope="row"><span>{row.label}</span><small>{row.time}</small></th>
          {row.shared ? <td colSpan={5}>{row.shared}</td> : row.lessons.map((lesson,index)=>{
            const [subject,room]=lesson.split('｜');
            return <td key={timetable.days[index]}><strong>{subject}</strong>{room && <small>{room}</small>}</td>;
          })}
        </tr>)}</tbody>
      </table>
    </div>
    <p className="timetable-footnote">＊原圖午餐時間寫為 12:20–12:40，但分鐘欄標示 40 分鐘，兩者不一致；此處照錄時間欄，實際時段請向導師確認。未標示的空檔不另推定活動。</p>
    <section aria-labelledby="timetable-reference"><h2 className="section-title" id="timetable-reference">課表原圖</h2>
      <p>查看完整課表與科任教師資訊。</p>
      <figure className="timetable-reference"><a href={imageUrl} target="_blank" rel="noopener noreferrer" aria-label="開啟一年忠班課表原圖（另開分頁）"><img src={imageUrl} alt="115學年度第1學期菁英班一年忠班完整日課表" loading="lazy" width="1717" height="2442"/><span>開啟原圖放大查看 <ArrowUpRight aria-hidden="true"/></span></a></figure>
      <small className="source">來源：維護者提供之學校一年忠班日課表（2026/8/30 收錄）。</small>
    </section>
  </>;
}
