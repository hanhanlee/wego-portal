import test from 'node:test';
import assert from 'node:assert/strict';
import {classContactBooks,contactBookMonths} from '../src/contact-book-data.js';

test('一忠聯絡簿依穩定日期收錄且月份可擴充',()=>{
  const entries=classContactBooks.vwej3;
  assert.deepEqual(entries.map(entry=>entry.date),['2026-08-31','2026-09-01','2026-09-02','2026-09-03','2026-09-04','2026-09-07','2026-09-08','2026-09-09','2026-09-10']);
  assert.deepEqual(contactBookMonths(entries),['2026-09','2026-08']);
  assert.equal(new Set(entries.map(entry=>entry.id)).size,entries.length);
});

test('9/4 聯絡簿依原句保存作業、簽名及發回資料',()=>{
  const sep4=classContactBooks.vwej3.find(entry=>entry.date==='2026-09-04');
  assert.ok(sep4.homework.includes('練習用尺畫圓圈。'));
  assert.ok(sep4.homework.includes('聽寫範圍：注音1本第一課。'));
  assert.ok(sep4.returns.includes('國語習作第一課 P.8（分數旁邊簽名）。'));
  assert.ok(sep4.notes.includes('愛閱讀存摺'));
});

test('9/2 與 9/3 聯絡簿保留可查閱的核心作業與準備事項',()=>{
  const entries=classContactBooks.vwej3;
  const sep2=entries.find(entry=>entry.date==='2026-09-02');
  const sep3=entries.find(entry=>entry.date==='2026-09-03');
  assert.ok(sep2.homework.includes('每天都有全校共同閱讀的時間，請準備一本中文課外書。'));
  assert.ok(sep2.notes.some(item=>item.includes('數位學生證')));
  assert.ok(sep3.homework.includes('寫注音習寫簿 P8、P9。以後簡稱「娃娃本」。'));
  assert.ok(sep3.tomorrow.some(item=>item.includes('防滑襪')));
});

test('9/7 至 9/10 聯絡簿保留原稿的重要字句與手寫更正',()=>{
  const entries=classContactBooks.vwej3;
  const sep7=entries.find(entry=>entry.date==='2026-09-07');
  const sep8=entries.find(entry=>entry.date==='2026-09-08');
  const sep9=entries.find(entry=>entry.date==='2026-09-09');
  const sep10=entries.find(entry=>entry.date==='2026-09-10');
  assert.ok(sep7.returns.includes('生字回（已交）。'));
  assert.ok(sep7.reminders.includes('感謝您的協助，讓孩子每天都能安心、順利地學習！☺☺☺'));
  assert.ok(sep8.reminders.includes('9/16 星期三第1次中文晨間演說，第一組，座號：1.2.3.4.42.43.44'));
  assert.ok(sep9.homework.includes('英文：複習 EP.12、14。（EP 表示英文課本）背單字：he is、you are。本週五考英文 U1 單字1-4'));
  assert.ok(sep10.tomorrow.includes('明有表演藝術課，穿防滑襪，女生綁頭髮。'));
  assert.ok(sep10.returns.includes('帶回身高體重視力測量結果通知單'));
});

test('每日聯絡簿包含作業與準備事項，不保存學生名單',()=>{
  for(const entry of classContactBooks.vwej3){
    assert.ok(entry.homework.length>0);
    assert.equal('students' in entry,false);
  }
});
