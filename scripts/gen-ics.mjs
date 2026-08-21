// 產生整學期訂閱用的 .ics feed 到 public/calendar/，build 前自動執行（見 package.json）。
// 使用固定 DTSTAMP，讓內容未變時輸出穩定、不會每次 build 都讓訂閱端誤判為更新。
import {writeFileSync, mkdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname, resolve} from 'node:path';
import {common, classes} from '../src/calendar-data.js';
import {buildCalendar} from '../src/ics.js';

const here=dirname(fileURLToPath(import.meta.url));
const outDir=resolve(here,'../public/calendar');
mkdirSync(outDir,{recursive:true});

// 內容更新時手動調整這個時間戳（並保留各事件 uid），訂閱端便會辨識為更新。
const DTSTAMP='20260808T000000Z';

const write=(file,events,name)=>{
  writeFileSync(resolve(outDir,file), buildCalendar(events,{name,dtstamp:DTSTAMP}), 'utf8');
  console.log(`  ✓ ${file}  (${events.length} events)`);
};

console.log('Generating calendar feeds:');
write('wego-common.ics', common.events, `薇閣小一・${common.label}`);
for(const [slug,cls] of Object.entries(classes)){
  write(`class-${slug}.ics`, cls.events, `薇閣小一・${cls.label}`);
}
