import test from 'node:test';
import assert from 'node:assert/strict';
import {buildSearchRecords,searchRecords,searchSnippet} from '../src/search-index.js';
import {learningNotices} from '../src/learning-notices-data.js';

const extras={schoolRows:{transport:[{scope:'common',title:'交通安全',summary:'禁止併排停車',date:'9/1',reference:'交通通知',source:'學校'}]},classics:[]};

test('共通搜尋不包含一忠聯絡簿或英文作業',()=>{
  const records=buildSearchRecords({kind:'common'},extras);
  assert.equal(searchRecords(records,'寫注音習寫簿').length,0);
  assert.ok(searchRecords(records,'禁止 併排').some(record=>record.title==='交通安全'));
});

test('一忠搜尋繼承共通並能找到中文聯絡簿內容',()=>{
  const records=buildSearchRecords({kind:'class',slug:'vwej3',label:'一忠'},extras);
  assert.ok(searchRecords(records,'寫注音習寫簿').some(record=>record.category==='每日聯絡簿'));
  assert.ok(searchRecords(records,'禁止 併排').some(record=>record.scope==='common'));
  assert.ok(searchRecords(records,'EP.14','每日聯絡簿').some(record=>record.date==='2026-09-01'));
});

test('搜尋支援全形正規化、多關鍵字與類型篩選',()=>{
  const records=buildSearchRecords({kind:'class',slug:'vwej3',label:'一忠'},extras);
  assert.ok(searchRecords(records,'９／１９ 學校日').length>0);
  assert.equal(searchRecords(records,'警報器','英文作業').length,0);
});

test('摘要靠近命中內容且聯絡簿連到正確日期',()=>{
  const records=buildSearchRecords({kind:'class',slug:'vwej3',label:'一忠'},extras);
  const result=searchRecords(records,'學生本土語言')[0];
  assert.ok(searchSnippet(result.body,'學生本土語言').includes('學生本土語言'));
  assert.equal(result.path,'/contact-book/2026-09-01');
});

test('一忠可用完整座號查到唯一晨間演說組別，共通不可查到',()=>{
  const classRecords=buildSearchRecords({kind:'class',slug:'vwej3',label:'一忠'},extras);
  const classResults=searchRecords(classRecords,'座號 5');
  assert.equal(classResults.length,1);
  assert.equal(classResults[0].title,'晨間演說｜第二組英文第 3 次朗讀');
  assert.equal(searchRecords(buildSearchRecords({kind:'common'},extras),'座號 5').length,0);
});

test('共通學習通知可搜尋且不帶出班級來源',()=>{
  const records=buildSearchRecords({kind:'common'},{...extras,learningNotices});
  assert.ok(searchRecords(records,'防滑襪').some(record=>record.title==='低年級表演藝術課服裝提醒'));
  assert.ok(searchRecords(records,'日語 教科書 音檔').some(record=>record.title==='英、日語課本音檔使用方式'));
  assert.equal(records.filter(record=>record.id.startsWith('learning-')).some(record=>record.searchText.includes('一忠')),false);
});

test('共通搜尋可找到學校日電子手冊通知',()=>{
  const records=buildSearchRecords({kind:'common'},extras);
  const results=searchRecords(records,'學校日 電子手冊');
  assert.equal(results.length,1);
  assert.equal(results[0].path,'/notices/wego-schoolday-notice-115s1');
});

test('共通搜尋可找到 NIAS 流感疫苗簽署通知',()=>{
  const records=buildSearchRecords({kind:'common'},extras);
  const results=searchRecords(records,'流感疫苗 同意 不同意');
  assert.ok(results.some(result=>result.path==='/notices/wego-flu-vaccine-consent-115'));
  assert.ok(results.some(result=>result.path==='/calendar/wego-flu-consent-deadline-115'));
});

test('下週考試通知與行程只可在一忠搜尋',()=>{
  const classRecords=buildSearchRecords({kind:'class',slug:'vwej3',label:'一忠'},extras);
  assert.ok(searchRecords(classRecords,'注音1本第二課').some(result=>result.path==='/teacher-notes'));
  assert.ok(searchRecords(classRecords,'數學第一單元平測').some(result=>result.path==='/calendar/vwej3-math-unit-1-test-20260915'));
  const commonRecords=buildSearchRecords({kind:'common'},extras);
  assert.equal(searchRecords(commonRecords,'注音1本第二課').length,0);
  assert.equal(searchRecords(commonRecords,'數學第一單元平測').length,0);
});
