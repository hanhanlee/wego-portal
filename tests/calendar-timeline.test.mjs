import test from 'node:test';
import assert from 'node:assert/strict';
import {timelineEvents,monthTarget} from '../src/calendar-timeline.js';
import {resolvePortalData} from '../src/portal-data.js';
test('跨年持續活動留在今天之後，過去事項仍可回查',()=>{
  const events=[{uid:'old',start:'2026-12-01',end:'2026-12-01'},{uid:'ongoing',start:'2026-12-30',end:'2027-01-03'},{uid:'today',start:'2027-01-01',end:'2027-01-01'}];
  const result=timelineEvents(events,'all','2027-01-01');
  assert.deepEqual(result.past.map(e=>e.uid),['old']);
  assert.deepEqual(result.current.map(e=>e.uid),['ongoing','today']);
  assert.equal(monthTarget([...result.past,...result.current],'2027-01').uid,'ongoing');
  assert.equal(monthTarget(events,'2027-03'),undefined);
});
test('十一月焦點不回暑假，篩選保留歷史且不改訂閱資料',()=>{
  const events=resolvePortalData('vwej3').events;
  const copy=JSON.stringify(events);
  const school=timelineEvents(events,'school','2026-11-10');
  const homework=timelineEvents(events,'homework','2026-11-10');
  assert.equal(homework.past.length,15);
  assert.equal(homework.current.length,0);
  assert.ok(school.current.every(e=>e.end>='2026-11-10'));
  assert.ok(school.current[0].start>='2026-11-10');
  assert.ok(!school.past.some(e=>e.uid.includes('-english-homework-')));
  assert.equal(JSON.stringify(events),copy);
});
