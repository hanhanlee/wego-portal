import test from 'node:test';
import assert from 'node:assert/strict';
import {taipeiDate,selectUpdates,resolveUpdates,upcomingEvents} from '../src/updates-data.js';

test('以臺灣午夜換日，不受裝置時區影響',()=>{
  assert.equal(taipeiDate(new Date('2026-08-31T15:59:59Z')),'2026-08-31');
  assert.equal(taipeiDate(new Date('2026-08-31T16:00:00Z')),'2026-09-01');
});
test('共通更新不包含班級作業；忠班繼承共通；未知班級不洩漏',()=>{
  const common=resolveUpdates(null,'2026-08-31'),cls=resolveUpdates('vwej3','2026-08-31');
  assert.ok(common.every(item=>item.scope==='common'));
  assert.ok(cls.some(item=>item.path==='/homework'));
  assert.ok(common.every(item=>cls.some(c=>c.id===item.id)));
  assert.deepEqual(resolveUpdates('unknown','2026-08-31'),[]);
  assert.equal(common.find(i=>i.contentId==='pickup-pass').expiresOn,'2026-09-02');
});
test('依更新日去重，隱藏未來更新，不使用活動日排序',()=>{
  const items=[
    {id:'old',contentId:'a',scope:'common',updatedAt:'2026-08-29',start:'2026-12-31'},
    {id:'new',contentId:'a',scope:'common',updatedAt:'2026-08-31',start:'2026-01-01'},
    {id:'future',contentId:'b',scope:'common',updatedAt:'2026-09-01'},
    {id:'other',contentId:'c',scope:'other',updatedAt:'2026-08-31'}
  ];
  assert.deepEqual(selectUpdates(items,null,'2026-08-31').map(i=>i.id),['new']);
  assert.equal(items.length,4);
});
test('同日同項內容優先採用該班資料',()=>{
  const items=['common','vwej3'].map(scope=>({contentId:'a',scope,updatedAt:'2026-08-31'}));
  assert.equal(selectUpdates(items,'vwej3','2026-08-31')[0].scope,'vwej3');
});
test('最多提升一筆有效置頂，截止通知不再提升',()=>{
  const items=[
    {contentId:'new',scope:'common',updatedAt:'2026-08-31'},
    {contentId:'expired',scope:'common',updatedAt:'2026-08-30',pinUntil:'2026-09-05',expiresOn:'2026-08-30'},
    {contentId:'pin',scope:'common',updatedAt:'2026-08-29',pinUntil:'2026-09-05'},
    {contentId:'second',scope:'common',updatedAt:'2026-08-28',pinUntil:'2026-09-05'}
  ];
  assert.deepEqual(selectUpdates(items,null,'2026-08-31').map(i=>i.contentId),['pin','new','expired','second']);
  assert.equal(selectUpdates(items,null,'2026-09-06')[0].contentId,'new');
});
test('行程保留當天與跨年進行中事項，排除已結束並限制三筆',()=>{
  const items=[{start:'2027-01-03'},{start:'2026-12-30',end:'2027-01-01'},{start:'2026-12-31'},{start:'2027-01-01'},{start:'2027-01-02'}];
  assert.deepEqual(upcomingEvents(items,'2027-01-01').map(e=>e.start),['2026-12-30','2027-01-01','2027-01-02']);
  assert.deepEqual(upcomingEvents(items,'2027-02-01'),[]);
  assert.equal(items[0].start,'2027-01-03');
});
