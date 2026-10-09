import test from 'node:test';
import assert from 'node:assert/strict';
import {resolvePortalData} from '../src/portal-data.js';
import {resolveUpdates} from '../src/updates-data.js';
import {buildSearchRecords,searchRecords} from '../src/search-index.js';
import {classHomework} from '../src/homework-data.js';
import {homeworkDays} from '../src/homework-months.js';

test('美術徵件共通且忠班繼承，忠班通知與行程不進共通搜尋',()=>{
  const common=resolvePortalData();
  const cls=resolvePortalData('vwej3');
  const uid='wego-art-three-pieces-deadline-115';
  assert.equal(common.events.filter(e=>e.uid===uid).length,1);
  assert.equal(cls.events.filter(e=>e.uid===uid).length,1);
  assert.equal(common.notices.find(n=>n.id==='wego-art-three-pieces-115').expiresOn,'2026-11-13');
  assert.equal(new Set(cls.events.map(e=>e.uid)).size,cls.events.length);
  const records=buildSearchRecords({kind:'common'});
  assert.ok(searchRecords(records,'三件展').length>0);
  for(const query of ['WBC 大樓','珠算本P1-P11','國第4-6課','英文期中口試第 1 次'])
    assert.equal(searchRecords(records,query).length,0,query);
  assert.equal(resolveUpdates(null,'2026-10-09').some(u=>u.id==='teacher-important-20261009'),false);
  assert.ok(resolveUpdates(null,'2026-10-09').some(u=>u.id==='art-three-pieces-20261009'));
});

test('忠班既有日期不重複，英語作業表和口試日期一致',()=>{
  const events=resolvePortalData('vwej3').events;
  const byUid=uid=>events.find(e=>e.uid===uid);
  assert.match(byUid('vwej3-wbc-20261015').detail,/600cc/);
  assert.equal(byUid('vwej3-morning-speech-order-4-115s1').start,'2026-10-14');
  assert.equal(byUid('wego-flu-vaccination-115').sequence,1);
  assert.equal(byUid('vwej3-english-oral-1-20261022').start,'2026-10-22');
  assert.equal(byUid('vwej3-english-oral-2-20261029').start,'2026-10-29');
  assert.equal(byUid('vwej3-english-listening-20261102').start,'2026-11-02');
  const days=homeworkDays(classHomework.vwej3);
  assert.equal(days.filter(d=>d.date.startsWith('2026-10')).length,15);
  assert.deepEqual(days.find(d=>d.date==='2026-10-15').items,['No Homework']);
  assert.ok(days.find(d=>d.date==='2026-10-27').items.some(item=>item.includes('明考 U3 Quiz')));
  assert.equal(byUid('vwej3-english-u3-quiz-20261028').start,'2026-10-28');
});
