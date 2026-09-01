import test from 'node:test';
import assert from 'node:assert/strict';
import {morningSpeech,morningSpeechEvents} from '../src/morning-speech-data.js';
import {resolvePortalData} from '../src/portal-data.js';

test('一忠晨間演說六組依抽籤順序且都在週三',()=>{
  const rows=morningSpeech.schedules.vwej3;
  assert.equal(rows.length,6);
  assert.deepEqual(rows.map(row=>row.order),[1,2,3,4,5,6]);
  assert.equal(new Set(rows.map(row=>row.group)).size,6);
  assert.equal(rows.filter(row=>row.language==='中文').length,3);
  assert.equal(rows.filter(row=>row.language==='英文').length,3);
  for(const row of rows) assert.equal(new Date(`${row.iso}T00:00:00Z`).getUTCDay(),3);
});

test('晨間演說只併入一忠行事曆並維持唯一 UID',()=>{
  const events=morningSpeechEvents('vwej3');
  assert.equal(events.length,6);
  assert.equal(new Set(events.map(event=>event.uid)).size,6);
  assert.equal(resolvePortalData().events.some(event=>event.uid.includes('morning-speech')),false);
  const merged=resolvePortalData('vwej3').events.filter(event=>event.uid.includes('morning-speech'));
  assert.deepEqual(merged.map(event=>event.uid).toSorted(),events.map(event=>event.uid).toSorted());
});
