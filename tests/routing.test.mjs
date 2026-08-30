import test from 'node:test';
import assert from 'node:assert/strict';
import {routeForLocation,contextualHref} from '../src/routing.js';

test('myclass 根網址直接顯示一忠，共通與預覽網域維持共通',()=>{
  assert.deepEqual(routeForLocation('','myclass.kiddorpg.cc'),{classSlug:'vwej3',path:'/'});
  for(const host of ['info.kiddorpg.cc','localhost','preview.vercel.app','myclass.kiddorpg.cc.example.com'])
    assert.deepEqual(routeForLocation('',host),{classSlug:null,path:'/'});
});
test('班級短路徑導覽能還原相同脈絡',()=>{
  const ctx={kind:'class',slug:'vwej3'};
  for(const path of ['/','/calendar','/learning','/timetable','/links']){
    const href=contextualHref(path,ctx,'myclass.kiddorpg.cc');
    assert.equal(href.includes('/class/'),false);
    assert.deepEqual(routeForLocation(href,'myclass.kiddorpg.cc'),{classSlug:'vwej3',path});
    assert.deepEqual(routeForLocation(contextualHref(path,ctx,'info.kiddorpg.cc'),'info.kiddorpg.cc'),{classSlug:'vwej3',path});
  }
});
test('保留舊班級網址、未知班級及舊校務路徑',()=>{
  for(const host of ['myclass.kiddorpg.cc','info.kiddorpg.cc']){
    assert.deepEqual(routeForLocation('#/class/vwej3/timetable',host),{classSlug:'vwej3',path:'/timetable'});
    assert.deepEqual(routeForLocation('#/class/unknown',host),{classSlug:'unknown',path:'/'});
  }
  assert.deepEqual(routeForLocation('#/transport','myclass.kiddorpg.cc'),{classSlug:'vwej3',path:'/school/transport'});
  assert.deepEqual(routeForLocation('#/school','info.kiddorpg.cc'),{classSlug:null,path:'/school/daily'});
});
