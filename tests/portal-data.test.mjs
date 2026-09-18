import test from 'node:test';
import assert from 'node:assert/strict';
import {buildCalendar} from '../src/ics.js';
import {
  commonPortal,
  mergeById,
  resolvePortalData
} from '../src/portal-data.js';
import {classTeacherNotes} from '../src/teacher-notes-data.js';

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

test('學校日通知與行事曆使用同一活動時間並保留下載期限',()=>{
  const notice=commonPortal.notices.find(item=>item.id==='wego-schoolday-notice-115s1');
  const event=commonPortal.events.find(item=>item.uid==='wego-schoolday-115s1');
  assert.equal(notice.date,'9/19（六）08:40–11:40');
  assert.equal(notice.expiresOn,'2026-09-30');
  assert.equal(notice.link.url,'https://www.wgps.tp.edu.tw/registered/school_day_index.asp');
  assert.equal(notice.image.path,'assets/references/school-day/school-day-invitation-20260919.jpg');
  assert.equal(event.d,notice.date);
  assert.equal(event.sequence,2);
});

test('流感疫苗簽署通知與兩筆重要日期只加入共通資料一次',()=>{
  const notice=commonPortal.notices.find(item=>item.id==='wego-flu-vaccine-consent-115');
  assert.equal(notice.expiresOn,'2026-09-30');
  assert.equal(new URL(notice.link.url).hostname,'nias-school-survey.cdc.gov.tw');
  assert.ok(notice.paragraphs.some(item=>item.includes('同意或不同意皆需簽署')));
  const ids=commonPortal.events.map(item=>item.uid);
  assert.equal(ids.filter(id=>id==='wego-flu-consent-deadline-115').length,1);
  assert.equal(ids.filter(id=>id==='wego-flu-vaccination-115').length,1);
  assert.ok(resolvePortalData('vwej3').notices.some(item=>item.id===notice.id));
});

test('9/11 導師考試通知照錄並只加入一忠行事曆',()=>{
  const note=classTeacherNotes.vwej3.find(item=>item.id==='teacher-20260911-next-week-tests');
  assert.equal(note.verbatim,true);
  assert.deepEqual(note.paragraphs,[
    '🔔下週考試科目與範圍','🔺週一：','國語(二)平測+聽寫','＊聽寫範圍：注音1本第二課。',
    '＊每週皆有國語平測+聽寫，請利用假日多做練習。','＊國語課本中的每一個插圖名稱，也都是要熟練的語詞。',
    '🔺週二：','數學第一單元平測','英U1 SW 5-8','🔺週三：','英U1 Quiz','🔺週四：',
    '國語(三)平測+聽寫','＊聽寫範圍：注音1本第三課','請利用假日提早準備喔！'
  ]);
  const expected=[
    'vwej3-chinese-lesson-2-test-20260914','vwej3-math-unit-1-test-20260915',
    'vwej3-english-u1-sw-5-8-20260915','vwej3-english-u1-quiz-20260916',
    'vwej3-chinese-lesson-3-test-20260917'
  ];
  const commonIds=new Set(resolvePortalData().events.map(item=>item.uid));
  const classIds=new Set(resolvePortalData('vwej3').events.map(item=>item.uid));
  for(const id of expected){
    assert.equal(commonIds.has(id),false);
    assert.equal(classIds.has(id),true);
  }
});

test('9/18 學校日座談會提醒照錄且不重複建立行事曆事件',()=>{
  const note=classTeacherNotes.vwej3.find(item=>item.id==='teacher-20260918-school-day-reminder');
  assert.equal(note.verbatim,true);
  assert.deepEqual(note.paragraphs,[
    '各位家長：您好！',
    '關於明天的座談會，有以下提醒喔！',
    '1️⃣校園開放入校時間為8:40，一年級家長請直接至五樓活動中心。',
    '2️⃣校園不開放停車，敬請搭乘大眾交通工具，開車者請使用學校鄰近停車空間。',
    '3️⃣教室空間有限，建議一位家長參加，也因活動屬於座談會，小孩建議委託其他家人照顧喔！',
    '4️⃣當天教室搭配期許卡活動，敬請各位家長隨身攜帶一枝原子筆，並請自備茶水，一起愛護地球。',
    '5️⃣活動預計11:30結束，敬請家長安排週末午後的家庭歡聚時光。',
    '感謝您的配合♥️'
  ]);
  const schoolDayEvents=resolvePortalData('vwej3').events.filter(item=>item.uid==='wego-schoolday-115s1');
  assert.equal(schoolDayEvents.length,1);
});
