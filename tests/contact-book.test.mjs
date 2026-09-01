import test from 'node:test';
import assert from 'node:assert/strict';
import {classContactBooks,contactBookMonths} from '../src/contact-book-data.js';

test('一忠聯絡簿依穩定日期收錄且月份可擴充',()=>{
  const entries=classContactBooks.vwej3;
  assert.deepEqual(entries.map(entry=>entry.date),['2026-08-31','2026-09-01']);
  assert.deepEqual(contactBookMonths(entries),['2026-09','2026-08']);
  assert.equal(new Set(entries.map(entry=>entry.id)).size,entries.length);
});

test('每日聯絡簿包含作業與準備事項，不保存學生名單',()=>{
  for(const entry of classContactBooks.vwej3){
    assert.ok(entry.homework.length>0);
    assert.ok(entry.tomorrow.length>0);
    assert.equal('students' in entry,false);
  }
});
