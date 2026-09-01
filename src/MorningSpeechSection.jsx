import {Megaphone} from '@phosphor-icons/react';
import {morningSpeech} from './morning-speech-data.js';
export default function MorningSpeechSection({ctx}){const schedule=ctx.kind==='class'?(morningSpeech.schedules[ctx.slug]||[]):[];return <section className="morning-speech-section">
  <h2 className="section-title"><Megaphone/>晨間演說</h2><p className="section-intro">先了解全校進行方式；班級入口另會顯示該班抽籤結果與日期。</p>
  <ol className="speech-rules">{morningSpeech.rules.map(rule=><li key={rule}>{rule}</li>)}</ol><small className="source">來源：小鈴鐺群組</small>
  {schedule.length>0&&<div className="speech-schedule"><header><div><span>一忠專屬</span><h3>115 學年度第一學期分組日期</h3></div><p>依校長抽籤順序排列</p></header>
    <div className="speech-table-wrap" tabIndex="0" aria-label="一忠晨間演說分組日期，可左右捲動"><table className="speech-table"><thead><tr><th scope="col">順序</th><th scope="col">組別</th><th scope="col">日期</th><th scope="col">中／英</th><th scope="col">週次</th></tr></thead><tbody>{schedule.map(item=><tr key={item.group}><td>{item.order}</td><th scope="row">{item.group}</th><td><time dateTime={item.iso}>{item.date}</time></td><td><span className={`language-tag language-${item.language==='中文'?'zh':'en'}`}>{item.language}</span></td><td>{item.week}</td></tr>)}</tbody></table></div>
    <a className="speech-reference" href="/assets/class1/learning/morning-speech-115s1.png" target="_blank" rel="noreferrer"><img src="/assets/class1/learning/morning-speech-115s1.png" alt="115 學年度第一學期一忠晨間演說分組日期原圖" loading="lazy"/><span>開啟分組日期原圖</span></a><small className="source">來源：小鈴鐺群組</small>
  </div>}
</section>}
