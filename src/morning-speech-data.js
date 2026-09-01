export const morningSpeech={
  rules:[
    '晨間演說由全校同步進行。','班上同學分為六組；各班分組方式可能不同。','出場順序由校長抽籤決定。','週三早晨到別班進行朗讀或演說。','一年級朗讀課文，不用背稿；二年級起演說自己的暑假作業，須背稿。','上學期抽到中文的組別，下學期改為英文；上學期抽到英文的組別，下學期改為中文。','順利完成者於期末獲頒獎狀；未達標者須重新朗讀或演說一次。'
  ],
  instructions:[
    '英文朗讀內容為英語課文，範圍由英文課公告；中文朗讀內容為國語課文，範圍由聯絡簿公告。',
    '中文朗讀開始前先向老師與同學問好，說明班級、座號及朗讀課次；朗讀後以「我的朗讀到此結束，謝謝大家！」作結。',
    '請在家多練習，聲音宏亮、速度放慢，並把內容念清楚。'
  ],
  schedules:{vwej3:[
    {group:'第一組',date:'9/16',iso:'2026-09-16',language:'中文',order:1,week:'W3'},
    {group:'第四組',date:'9/23',iso:'2026-09-23',language:'英文',order:2,week:'W4'},
    {group:'第六組',date:'9/30',iso:'2026-09-30',language:'中文',order:3,week:'W5'},
    {group:'第三組',date:'10/14',iso:'2026-10-14',language:'中文',order:4,week:'W7'},
    {group:'第五組',date:'10/21',iso:'2026-10-21',language:'英文',order:5,week:'W8'},
    {group:'第二組',date:'11/18',iso:'2026-11-18',language:'英文',order:6,week:'W12'}
  ]}
};
export function morningSpeechEvents(slug){return (morningSpeech.schedules[slug]||[]).map(item=>({uid:`${slug}-morning-speech-order-${item.order}-115s1`,d:item.date,title:`晨間演說｜${item.group}${item.language}朗讀`,detail:`順序 ${item.order}・${item.week}；週三早晨到別班進行${item.language}課文朗讀，一年級不用背稿。`,source:'小鈴鐺群組',start:item.iso,end:item.iso}))}
