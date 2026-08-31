import test from 'node:test';
import assert from 'node:assert/strict';
import {homeworkEvents} from '../src/homework-calendar.js';
import {resolvePortalData} from '../src/portal-data.js';
import {buildCalendar} from '../src/ics.js';
import {classHomework} from '../src/homework-data.js';
import {homeworkDays,monthSources,monthCells,moveMonth} from '../src/homework-months.js';

test('月份支援跨年、閏年與完整週排列',()=>{
  assert.equal(moveMonth('2026-12',1),'2027-01');
  assert.equal(moveMonth('2027-01',-1),'2026-12');
  assert.equal(monthCells('2028-02').filter(Boolean).length,29);
  assert.equal(monthCells('2026-09')[0],null);
  assert.equal(monthCells('2026-09')[1],'2026-09-01');
  assert.equal(monthCells('2026-09').length%7,0);
});
test('跨月來源同時對應8月9月，無資料月份不顯示舊原圖',()=>{
  const hw=classHomework.vwej3;
  assert.equal(monthSources(hw,'2026-08')[0].id,'2026-08-31-1a');
  assert.equal(monthSources(hw,'2026-09')[0].id,'2026-08-31-1a');
  assert.deepEqual(monthSources(hw,'2026-10'),[]);
  assert.equal(homeworkDays(hw).filter(day=>day.date.startsWith('2026-09')).length,14);
});
test('追加月份保留歷史、同月多來源、同日更正不重複',()=>{
  const period=(id,date,text)=>({id,source:id,weeks:[{days:[{date,items:[text]}]}]});
  const hw={periods:[period('first','2026-09-01','old'),period('second','2026-09-15','next'),period('oct','2026-10-01','oct'),period('corrected','2026-09-01','new')]};
  assert.equal(homeworkDays(hw).length,3);
  assert.deepEqual(homeworkDays(hw)[0].items,['new']);
  assert.deepEqual(monthSources(hw,'2026-09').map(p=>p.id),['second','corrected']);
  assert.deepEqual(monthSources(hw,'2026-10').map(p=>p.id),['oct']);
  assert.deepEqual(homeworkDays({periods:[]}),[]);
});

test('15天英文作業只加入一忠，UID依班級與日期固定',()=>{
  const events=homeworkEvents('vwej3');
  assert.equal(events.length,15);
  assert.equal(new Set(events.map(e=>e.uid)).size,15);
  assert.equal(events[0].uid,'vwej3-english-homework-2026-08-31');
  assert.equal(events.at(-1).start,'2026-09-18');
  assert.ok(events.every(e=>e.start===e.end));
  assert.ok(resolvePortalData().events.every(e=>!e.uid.includes('english-homework')));
  assert.equal(resolvePortalData('vwej3').events.filter(e=>e.uid.includes('english-homework')).length,15);
  assert.deepEqual(homeworkEvents('unknown'),[]);
});
test('訂閱包含完整作業與隔日結束，保留來源的相對日提醒',()=>{
  const event=homeworkEvents('vwej3').find(e=>e.start==='2026-09-11');
  assert.match(event.detail,/下週三考 U1 Quiz/);
  const ics=buildCalendar([event]).replace(/\r\n /g,'');
  assert.match(ics,/DTSTART;VALUE=DATE:20260911/);
  assert.match(ics,/DTEND;VALUE=DATE:20260912/);
  assert.match(ics,/Review PR p.10–14/);
  assert.match(ics,/Weekly Homework（1A）/);
});
