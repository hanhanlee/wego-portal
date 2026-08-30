import test from 'node:test';
import assert from 'node:assert/strict';
import {buildCalendar} from '../src/ics.js';
import {
  commonPortal,
  mergeById,
  resolvePortalData
} from '../src/portal-data.js';

test('共通資料不包含一忠專屬內容',()=>{
  const common=resolvePortalData();
  assert.equal(common,commonPortal);
  assert.equal(common.events.some(item=>item.uid.startsWith('vwej3-')),false);
  assert.equal(common.exams.some(item=>item.id.startsWith('vwej3-')),false);
  assert.equal(common.notices.some(item=>item.id.startsWith('vwej3-')),false);
});

test('一忠自動包含全部共通與班級專屬資料',()=>{
  const classData=resolvePortalData('vwej3');
  const classEventIds=new Set(classData.events.map(item=>item.uid));
  const classExamIds=new Set(classData.exams.map(item=>item.id));
  const classNoticeIds=new Set(classData.notices.map(item=>item.id));

  for(const item of commonPortal.events) assert.equal(classEventIds.has(item.uid),true);
  for(const item of commonPortal.exams) assert.equal(classExamIds.has(item.id),true);
  for(const item of commonPortal.notices) assert.equal(classNoticeIds.has(item.id),true);
  assert.equal(classEventIds.has('vwej3-eng-0812'),true);
  assert.equal(classExamIds.has('vwej3-eng-0812'),true);
  assert.equal(classNoticeIds.has('vwej3-bus-system-0821'),true);
});

test('班級同 ID 資料覆蓋共通資料且不重複',()=>{
  const merged=mergeById(
    [{id:'same',title:'共通版本',start:'2026-09-01'}],
    [{id:'same',title:'班級更正',start:'2026-09-02'}]
  );
  assert.deepEqual(merged,[{id:'same',title:'班級更正',start:'2026-09-02'}]);
});

test('一忠 ICS 同時包含共通與班級事件',()=>{
  const classData=resolvePortalData('vwej3');
  const ics=buildCalendar(classData.events,{dtstamp:'20260830T000000Z'});
  assert.match(ics,/UID:wego-open-115s1@wego-portal/);
  assert.match(ics,/UID:wego-final-115@wego-portal/);
  assert.match(ics,/UID:vwej3-eng-0812@wego-portal/);
});

test('未知班級不回傳其他班級資料',()=>{
  assert.equal(resolvePortalData('unknown'),null);
});
