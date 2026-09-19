import test from 'node:test';
import assert from 'node:assert/strict';
import {schoolDayNote,schoolDayEvents,schoolDayEventDetails} from '../src/school-day-20260919.js';
import {resolvePortalData} from '../src/portal-data.js';
import {buildSearchRecords,searchRecords} from '../src/search-index.js';
import {resolveUpdates} from '../src/updates-data.js';
import {buildCalendar} from '../src/ics.js';

test('學校日段落可在忠班搜尋，來源正確且共通搜尋與近期更新隔離',()=>{
  const classRecords=buildSearchRecords({kind:'class',slug:'vwej3'});
  const commonRecords=buildSearchRecords({kind:'common'});
  for(const query of ['WeSTEAM','蟯蟲紙','學生行為備忘','安親卷','模仿寫作']){
    const results=searchRecords(classRecords,query).filter(r=>r.id===`teacher-${schoolDayNote.id}`);
    assert.equal(results.length,1,query);
    assert.equal(results[0].source,schoolDayNote.source);
    assert.equal(searchRecords(commonRecords,query).some(r=>r.id===results[0].id),false);
  }
  assert.equal(searchRecords(commonRecords,'WeSTEAM').length,0);
  assert.equal(resolveUpdates(null,'2026-09-19').some(r=>r.id==='school-day-class-20260919'),false);
  assert.equal(resolveUpdates('vwej3','2026-09-19')[0].contentId,schoolDayNote.id);
  assert.equal(schoolDayNote.sections.length,17);
  assert.equal(schoolDayNote.images,undefined);
});

test('學校日新增日期只屬忠班，原有活動 UID 不重複且共通內容不變',()=>{
  const common=resolvePortalData().events;
  const events=resolvePortalData('vwej3').events;
  assert.equal(new Set(events.map(e=>e.uid)).size,events.length);
  for(const added of schoolDayEvents){
    assert.equal(common.some(e=>e.uid===added.uid),false);
    assert.equal(events.filter(e=>e.uid===added.uid).length,1);
  }
  for(const [uid,override] of Object.entries(schoolDayEventDetails)){
    assert.equal(events.filter(e=>e.uid===uid).length,1);
    assert.equal(events.find(e=>e.uid===uid).detail,override.detail);
    assert.notEqual(common.find(e=>e.uid===uid).detail,override.detail);
  }
  assert.equal(common.find(e=>e.uid==='wego-midterm-115').sequence,1);
  assert.equal(events.find(e=>e.uid==='wego-midterm-115').sequence,2);
  assert.equal(events.find(e=>e.uid==='wego-closing-115s1').start,'2027-01-20');
  assert.equal(events.filter(e=>e.start==='2026-10-16'&&/流感/.test(e.title)).length,1);
  const ics=buildCalendar(events,{dtstamp:'20260919T000000Z'});
  assert.match(ics,/UID:vwej3-fluoride-20260922@wego-portal/);
  assert.equal((ics.match(/UID:wego-closing-115s1@wego-portal/g)||[]).length,1);
});
