import {Megaphone} from '@phosphor-icons/react';
import {morningSpeech,morningSpeechEventUid} from './morning-speech-data.js';
import {contextualHref} from './routing.js';
export default function MorningSpeechSection({ctx}){const schedule=ctx.kind==='class'?(morningSpeech.schedules[ctx.slug]||[]):[];return <section className="morning-speech-section">
  <h2 className="section-title"><Megaphone/>晨間演說</h2><p className="section-intro">{schedule.length>0?'全校進行方式、班級抽籤結果與日期集中查閱。':'了解晨間演說的進行方式與朗讀準備。'}</p>
  <ol className="speech-rules">{morningSpeech.rules.map(rule=><li key={rule}>{rule}</li>)}</ol><small className="source">來源：小鈴鐺群組</small>
  <div className="speech-preparation"><h3>朗讀內容與上台方式</h3><ul>{morningSpeech.instructions.map(item=><li key={item}>{item}</li>)}</ul>{schedule.length>0&&<p>分組座號已依班級紙本通知核對，請由下表確認孩子所屬組別。</p>}</div>
  {schedule.length>0&&<div className="speech-schedule"><header><div><span>一忠專屬</span><h3>115 學年度第一學期分組日期</h3></div><p>依校長抽籤順序排列</p></header>
    <div className="speech-table-wrap" tabIndex="0" aria-label="一忠晨間演說分組日期與座號，可左右捲動"><table className="speech-table"><thead><tr><th scope="col">順序</th><th scope="col">組別</th><th scope="col">座號</th><th scope="col">日期</th><th scope="col">中／英文次序</th><th scope="col">週次</th><th scope="col">行事曆</th></tr></thead><tbody>{schedule.map(item=><tr key={item.group}><td>{item.order}</td><th scope="row">{item.group}</th><td className="speech-seat-numbers">{item.seatNumbers.join('、')}</td><td><time dateTime={item.iso}>{item.date}</time></td><td><span className={`language-tag language-${item.language==='中文'?'zh':'en'}`}>{item.language}第 {item.session} 次</span></td><td>{item.week}</td><td><a className="speech-calendar-link" href={contextualHref(`/calendar/${morningSpeechEventUid(ctx.slug,item)}`,ctx,location.hostname)}>查看行事曆</a></td></tr>)}</tbody></table></div>
    <a className="speech-reference" href="/assets/class1/learning/morning-speech-115s1.png" target="_blank" rel="noreferrer"><img src="/assets/class1/learning/morning-speech-115s1.png" alt="115 學年度第一學期一忠晨間演說分組日期原圖" loading="lazy"/><span>開啟分組日期原圖</span></a><small className="source">來源：小鈴鐺群組</small>
  </div>}
</section>}
