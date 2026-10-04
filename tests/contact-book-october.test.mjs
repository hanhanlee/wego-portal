import test from 'node:test';
import assert from 'node:assert/strict';
import {resolvePortalData} from '../src/portal-data.js';
import {buildSearchRecords,searchRecords} from '../src/search-index.js';
import {resolveUpdates} from '../src/updates-data.js';
import {classContactBooks} from '../src/contact-book-data.js';
test('新聯絡簿跨月完整，手寫不清與放假衝突不猜測',()=>{
 const entries=classContactBooks.vwej3.filter(e=>e.date>='2026-09-21');
 assert.equal(entries.length,8);
 assert.ok(entries.find(e=>e.date==='2026-09-22').homework.some(t=>t.includes('未轉錄')));
 assert.ok(entries.find(e=>e.date==='2026-09-24').homework.includes('寫娃娃本 P32、P33。'));
 assert.ok(entries.find(e=>e.date==='2026-09-24').reminders.some(t=>t.includes('待導師確認')));
});
test('塗氟更正保留 UID，新增日期僅忠班可見，共通連假自動繼承',()=>{
 const events=resolvePortalData('vwej3').events;
 assert.equal(new Set(events.map(e=>e.uid)).size,events.length);
 assert.equal(events.find(e=>e.uid==='vwej3-fluoride-20260922').start,'2026-09-23');
 assert.equal(events.find(e=>e.uid==='vwej3-fluoride-20260922').sequence,1);
 assert.equal(events.find(e=>e.uid==='vwej3-english-u2-quiz-20261007').start,'2026-10-07');
 const common=resolvePortalData();
 assert.ok(common.events.find(e=>e.uid==='wego-national-day-115').detail.includes('10/11'));
 assert.equal(common.events.some(e=>e.uid.startsWith('vwej3')),false);
 const records=buildSearchRecords({kind:'common'});
 for(const q of ['U2 Quiz','WeSTEAM','塗氟','一忠']) assert.equal(searchRecords(records,q).length,0,q);
 assert.equal(resolveUpdates(null,'2026-10-04').some(e=>e.id==='contact-book-20261004'),false);
});
