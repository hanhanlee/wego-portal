// 10/8 忠班導師通知與隨附英文資料；共通徵件另在 calendar-data.js。
const source='一忠導師 LINE 通知（2026-10-08）';
const event=(key,date,title,detail,extra={})=>({uid:`vwej3-${key}`,d:`${Number(date.slice(5,7))}/${Number(date.slice(8))}`,start:date,end:date,title,detail,source,...extra});
export const classOctoberEvents=[
  event('multilearning-fieldtrip-20261014','2026-10-14','多元學習校外教學','限 10/14 學藝營參加【多元學習】課程的孩子。穿體育服，準備可裝水壺、雨傘、防疫用品、衛生紙或濕紙巾的手提袋；可帶一包小餅乾與乾淨塑膠袋或夾鏈袋裝未吃完的食物。'),
  event('chinese-lesson-7-test-20261012','2026-10-12','國(七)平測+聽寫','依 10/8 通知「下週一」換算。'),
  event('chinese-review-4-6-20261014','2026-10-14','國第4–6課總複習卷+聽寫','依 10/8 通知「下週三」換算。'),
  event('math-lesson-4-test-20261016','2026-10-16','數(四)平測','依 10/8 通知「下週五」換算。'),
  event('chinese-lesson-8-test-20261016','2026-10-16','國(八)平測+聽寫','依 10/8 通知「下週五」換算。'),
  event('abacus-midterm-20261022','2026-10-22','珠算期中評量','範圍：珠算本 P1–P11。10/15 因 WBC 停課，珠算本 10/22 再帶到學校。'),
  event('english-oral-1-20261022','2026-10-22','英文期中口試第 1 次','導師通知 10/22 口試。口試單範圍：課本 p.1–26、28；習作 p.1–18；U1–U3 補充教材。'),
  event('english-oral-2-20261029','2026-10-29','英文期中口試第 2 次','導師通知 10/29 口試。口試單印製的整體口試期間為 10/19–10/30。'),
  event('english-listening-20261102','2026-11-02','英文聽力測驗','導師通知 11/2。口試單印製的整體聽力期間為 10/23–11/3。'),
  event('english-u3-quiz-20261028','2026-10-28','英 U3 Quiz','1A 英文作業表 10/23、10/27 均指向 10/28；範圍 E p.22–26、28。',{source:'Weekly Homework（1A，2026-10）'})
];
export const octoberEventDetails={
  'vwej3-wbc-20261015':{detail:'地點 WBC 大樓。穿薇小體服長褲及運動鞋；提袋裝滿 600cc 的水壺、個人藥品，若下雨帶折傘。課程：閱讀解密、雲動身韻、創藝智造、盤上冒險。請勿遲到；行前通知另提醒勿攜帶零食、口香糖及飲料。',source:'一忠 WBC 行前通知（2026-10）',sequence:1},
  'vwej3-morning-speech-order-4-115s1':{detail:'第三組中文晨間朗讀，內容為國語第七課課文；請大聲朗讀並練習上下臺禮儀。',source,sequence:2},
  'wego-flu-vaccination-115':{detail:'本校公費流感疫苗校園接種日；忠班導師提醒：若臨時不注射，請提前通知老師。',source,sequence:1},
  'wego-midterm-115':{detail:'11/4（三）國語、英文；11/5（四）數學、生活。正常時間放學。月考前一週有藝能科月考，包含珠算（成績併入數學科）、健體、音樂、文化薪傳、表演藝術；珠算期中評量已通知 10/22，其他科日期待通知。英文口試 10/22、10/29，聽力 11/2。',source,sequence:3}
};
