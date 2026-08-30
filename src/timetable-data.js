// 依維護者提供的 115 學年度第一學期一年忠班課表逐格整理；不得套用至其他班。
export const classTimetables = {
  vwej3: {
    title:'一年忠班課表', semester:'115 學年度第 1 學期・菁英班',
    image:'assets/class1/timetable/115-semester-1.png',
    days:['星期一','星期二','星期三','星期四','星期五'],
    rows:[
      {time:'08:00–08:20', label:'晨間', lessons:['朝會','晨間活動','晨間活動','晨間活動','晨間活動']},
      {time:'08:20–08:40', label:'早餐', shared:'早餐時光'},
      {time:'08:40–08:55', label:'準備', shared:'晨讀時光（08:40–08:50）・上課準備（08:50–08:55）'},
      {time:'08:55–09:35', label:'第 1 節', lessons:['國語','國語','國語','英語聽講｜1D','國語']},
      {time:'09:40–10:20', label:'第 2 節', lessons:['英語聽講｜2B','數學','國語','閱讀與寫作','生活']},
      {time:'10:20–10:30', label:'課間', shared:'課間活動'},
      {time:'10:30–11:10', label:'第 3 節', lessons:['數學','美勞｜Art 1','英語｜1B','閱讀與寫作','表演藝術｜Dance Studio']},
      {time:'11:20–12:00', label:'第 4 節', lessons:['文化薪傳｜Calligraphy','美勞｜Art 1','健康與體育｜Playground','珠算','英語｜2F']},
      {time:'12:20–12:40', label:'午餐＊', shared:'午餐時光'},
      {time:'13:00–13:40', label:'第 5 節', lessons:['國語','WeSTEAM｜Innovation Studio','生活','英語專題','閱讀指導｜Library']},
      {time:'13:50–14:30', label:'第 6 節', lessons:['日語｜1D','WeSTEAM｜Innovation Studio','多元學習','數學','健康與體育｜Playground']},
      {time:'14:40–15:20', label:'第 7 節', lessons:['數學','英語｜1B','多元學習','音樂｜IP5','數學']},
      {time:'15:25–15:40', label:'第 8 節', shared:'經典文學導讀'},
      {time:'15:40–16:20', label:'第 9 節', shared:'課業輔導'},
      {time:'16:25–16:40', label:'放學', shared:'放學'}
    ]
  }
};
