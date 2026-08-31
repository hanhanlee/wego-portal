import test from 'node:test';
import assert from 'node:assert/strict';
import {textbookVersions115} from '../src/textbook-data.js';

test('115 學年度課本版本涵蓋一至六年級且年級不重複',()=>{
  assert.deepEqual(textbookVersions115.map(row=>row.grade),['一年級','二年級','三年級','四年級','五年級','六年級']);
});

test('低年級使用生活，中高年級使用自然與社會',()=>{
  for(const row of textbookVersions115.slice(0,2)) {
    assert.ok(row.life);
    assert.equal(row.science,null);
    assert.equal(row.social,null);
  }
  for(const row of textbookVersions115.slice(2)) {
    assert.equal(row.life,null);
    assert.ok(row.science);
    assert.ok(row.social);
  }
});

test('課本出版社與學校資料一致',()=>{
  assert.deepEqual(textbookVersions115.map(({chinese,math})=>[chinese,math]),[
    ['康軒','康軒'],['翰林','翰林'],['翰林','康軒'],['翰林','翰林'],['康軒','康軒'],['翰林','翰林']
  ]);
  assert.ok(textbookVersions115.every(row=>(row.life||row.science)==='康軒'));
  assert.ok(textbookVersions115.slice(2).every(row=>row.social==='康軒'));
});

test('只強調指定年級的國語與數學康軒版本',()=>{
  assert.deepEqual(textbookVersions115.map(row=>[row.grade,row.emphasized||[]]),[
    ['一年級',['chinese','math']],['二年級',[]],['三年級',['math']],['四年級',[]],['五年級',['chinese','math']],['六年級',[]]
  ]);
});
