import {common as commonCalendar, classes as classCalendars} from './calendar-data.js';

export const commonPortal={
  label:'一年級共通',
  events:commonCalendar.events,
  exams:[
    {id:'wego-midterm-115',date:'11/4–5',title:'期中學力檢測',source:'學校行事曆',start:'2026-11-04'},
    {id:'wego-final-115',date:'1/12–13',title:'期末學力檢測',source:'學校行事曆',start:'2027-01-12'}
  ],
  notices:[
    {id:'wego-open-notice-115s1',date:'8/31',title:'第一學期開學',source:'學校行事曆',start:'2026-08-31'},
    {id:'wego-pickup-pass-reissue-115s1',expiresOn:'2026-09-02',date:'8/31–9/2',title:'車家接證補發申請',source:'薇閣小學學務處',start:'2026-08-31',
      paragraphs:[
        '申請期間：2026 年 8 月 31 日至 9 月 2 日。除乘坐校車的同學外，若有車家接證需求，請家長協助填寫申請表單。',
        '學務處將審核並確認車家接使用狀況，予以補發；9 月 7 日（週一）起依申請次序分批發放。',
        '洽詢：薇閣小學學務處丁老師，28912668 分機 301。'
      ],
      link:{url:'https://forms.gle/BXizKNMPjpaNGU5AA',label:'填寫車家接證補發申請表'}},
    {id:'wego-schoolday-notice-115s1',expiresOn:'2026-09-30',date:'9/19（六）08:40–11:40',title:'115學年度學校日',source:'薇閣小學學校日通知（2026-09-11）',start:'2026-09-19',
      paragraphs:[
        '親愛的家長，您好：',
        '恭喜孩子的學習更上一層樓，邁向另一個知識範疇。',
        '115學年度學校日將於 9 月 19 日（六）上午舉行，詳細時間請見邀請卡，敬邀您蒞校參加。',
        '本學年各項學校日電子手冊資料連結如下，請於有效期限內完成下載。相信透過親師合作，我們更能幫助孩子健康快樂的成長與學習。',
        '115學年度學校日相關電子檔案：請直接點選以下連結，有效日期為 9/11～9/30。',
        '校方下載頁會要求輸入學生身分證字號進行身分確認；請只在 wgps.tp.edu.tw 官方頁面填寫，本站不會收集或保存該資料。',
        '期待下週六與您見面，祝福闔家舒心平安。'
      ],
      link:{url:'https://www.wgps.tp.edu.tw/registered/school_day_index.asp',label:'下載學校日相關電子檔案'},
      image:{path:'assets/references/school-day/school-day-invitation-20260919.jpg',alt:'115學年度學校日邀請卡，9月19日上午8時40分至11時40分',caption:'115學年度學校日邀請卡'},
      expiredMessage:'電子檔案下載期限已截止，通知與邀請卡保留供查閱。'},
    {id:'wego-flu-vaccine-consent-115',expiresOn:'2026-09-30',date:'9/30（三）17:00 前截止',title:'流感疫苗接種意願線上簽署',source:'導師通知（2026-09-11）',start:'2026-09-30',
      paragraphs:[
        '本校公費流感疫苗校園接種日期：115年10月16日（五）。',
        '簽署截止期限為115年9月30日（三）17：00前，請在此期限前完成線上簽署意願或修改接種意願。',
        '同意或不同意皆需簽署，於截止期限前皆可修改意願。',
        '若無法在校接種，有意願自行前往合約醫療院所接種公費流感疫苗者，請跟導師登記。將於學校設站【後】發下「補接種通知單」。',
        '請使用手機點選下方連結，完成學生接種意願簽署。',
        '簽署頁會要求輸入學生身分證字號或居留證號及生日進行身分驗證；請只在 cdc.gov.tw 官方頁面填寫，本站不會收集或保存任何接種意願或身分資料。',
        '感謝您的協助與配合！'
      ],
      link:{url:'https://nias-school-survey.cdc.gov.tw/survey/000000000000A8A2eb3c?openExternalBrowser=1',label:'前往 NIAS 簽署接種意願'},
      expiredMessage:'線上簽署期限已截止，通知內容保留供查閱。'}
  ]
};

export const classPortals={
  vwej3:{
    label:'一忠',
    events:classCalendars.vwej3.events,
    exams:[
      {id:'vwej3-eng-0812',date:'8/12（三）',title:'暑輔英語評量',source:'一忠班級群組通知',start:'2026-08-12'}
    ],
    notices:[
      {id:'vwej3-english-homework-20260831',date:'8/31',title:'更正 8/31–9/18 英文作業（1A）',source:'Weekly Homework（1A）',start:'2026-08-31',paragraphs:['已依新版 1A 作業表更正每日內容與原圖，取代先前版本。請由首頁或「學習成長」的「英文作業」入口查看。']},
      {id:'vwej3-bus-system-0821',date:'8/21',title:'校車異動回報系統可使用學生帳號密碼登入',source:'一忠班級群組通知',start:'2026-08-21'},
      {id:'vwej3-eye-traffic-0808',date:'8月上旬',title:'補充護眼護照與交通安全親子共學手冊說明',source:'一忠班級群組通知',start:'2026-08-08'},
      {id:'vwej3-pencil-0805',date:'8/5',title:'新增正確握筆與書寫姿勢參考',source:'一忠班級群組通知',start:'2026-08-05'},
      {id:'vwej3-uniform-bag-0802',date:'8/2',title:'補充制體服尺寸與英文手提袋說明',source:'一忠班級群組通知',start:'2026-08-02'},
      {id:'vwej3-uniform-purchase-0731',date:'7/31',title:'夏季制體服更換與加購方式',source:'一忠班級群組通知',start:'2026-07-31'},
      {id:'vwej3-introcard-correction-0731',date:'7/31',title:'自我介紹卡期限更正為 8月17日',source:'一忠班級群組通知',start:'2026-07-31'}
    ]
  }
};

export function mergeById(commonItems,classItems){
  const merged=new Map(commonItems.map(item=>[item.id??item.uid,item]));
  for(const item of classItems) merged.set(item.id??item.uid,item);
  return [...merged.values()].toSorted((a,b)=>(a.start||'').localeCompare(b.start||''));
}

export function resolvePortalData(classSlug=null){
  if(!classSlug) return commonPortal;
  const classPortal=classPortals[classSlug];
  if(!classPortal) return null;
  return {
    label:classPortal.label,
    events:mergeById(commonPortal.events,classPortal.events),
    exams:mergeById(commonPortal.exams,classPortal.exams),
    notices:mergeById(commonPortal.notices,classPortal.notices)
  };
}
