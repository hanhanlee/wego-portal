// 行事曆事件的單一真實來源：網站畫面與 .ics 訂閱 feed 都由此產生，避免兩套資料不同步。
// 每個事件：
//   uid    穩定唯一識別（改日期時務必保留同一個 uid，訂閱端才會更新而非新增一筆）
//   d      顯示用日期字串（人看的，如 '11/4–5'）
//   title  事件名稱
//   detail 補充說明（可空）
//   source 去識別化來源標籤
//   start/end  ISO 日期（YYYY-MM-DD，含頭含尾）。全天事件；.ics 會把 end 轉為隔天(排他)。
// 115 學年度第一學期：2026 秋 ~ 2027 春。日期請與原始行事曆／通知逐項核對後再調整。

export const common={
  label:'一年級共通',
  events:[
    {uid:'wego-open-115s1',      d:'8/31',    title:'第一學期開學', detail:'', source:'學校行事曆', start:'2026-08-31', end:'2026-08-31'},
    {uid:'wego-schoolday-115s1', d:'9/19',    title:'學校日',       detail:'', source:'學校行事曆', start:'2026-09-19', end:'2026-09-19'},
    {uid:'wego-midterm-115',     d:'11/4–5',  title:'期中學力檢測', detail:'', source:'學校行事曆', start:'2026-11-04', end:'2026-11-05'},
    {uid:'wego-final-115',       d:'1/12–13', title:'期末學力檢測', detail:'', source:'學校行事曆', start:'2027-01-12', end:'2027-01-13'}
  ]
};

export const classes={
  vwej3:{
    label:'一忠',
    events:[
      {uid:'vwej3-eng-0812',       d:'8/12', title:'暑輔英語評量',   detail:'英語評量',     source:'一忠班級群組通知', start:'2026-08-12', end:'2026-08-12'},
      {uid:'vwej3-introcard-0817', d:'8/17', title:'自我介紹卡繳交', detail:'最晚繳交日期', source:'一忠班級群組通知', start:'2026-08-17', end:'2026-08-17'}
    ]
  }
};
