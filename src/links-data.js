// 家長提供的共通常用入口；只保存公開網址與去識別化說明，不保存登入資料。
export const linkGroups = [
  {id:'school', title:'學校與家長服務', items:[
    {id:'bus-gps', title:'薇閣國小校車資訊查詢', href:'https://www.wgps.tp.edu.tw/registered/stu_schoolBus_Map.asp', description:'前往薇閣國小校車位置查詢網站；需依校方頁面完成學生身分確認。', access:'需驗證學生身分'},
    {id:'website', title:'學校官網', href:'https://esweb.wgps.tp.edu.tw/nss/p/index', description:'學校公告、校務資訊與最新消息。', access:'公開瀏覽'},
    {id:'parents', title:'家長專區', href:'https://esweb.wgps.tp.edu.tw/nss/p/7000', description:'校方彙整的家長服務入口；各項服務依頁面指示登入。', access:'依服務登入'},
    {id:'student', title:'學生資訊查詢', href:'https://www.wgps.tp.edu.tw/registered/stu_ldap_index.asp', description:'查詢學號、校內 Google 帳號等學生資訊。', access:'依校方驗證'},
    {id:'bus', title:'校車異動回報系統', href:'https://www.wgps.tp.edu.tw/Registered/school_bus_std_change.asp', description:'搭乘校車學生申請接送或下車地點異動；送出前請先閱讀下方注意事項。', access:'依校方驗證'}
  ]},
  {id:'learning', title:'語言學習', items:[
    {id:'languages', title:'外語教學資源', href:'https://esweb.wgps.tp.edu.tw/nss/p/8005', description:'菁英班英語、日語課本音檔，可至學校官網下載。', access:'校內 Google 帳號'},
    {id:'japanese', title:'日語通關密語', href:'https://www.wgps.tp.edu.tw/japanesepassphrase/index.asp', description:'依校方頁面指示，以孩子身分資料登入。請勿在本站輸入個人資料。', access:'依校方驗證'},
    {id:'raz-account', title:'Raz-Kids 帳號密碼查詢', href:'https://www.wgps.tp.edu.tw/registered/stu_RazKids_index.asp', description:'透過學校系統查詢孩子的閱讀平台登入資訊。', access:'依校方驗證'},
    {id:'raz', title:'Raz-Kids 閱讀平台', href:'https://www.raz-kids.com/', description:'取得學校提供的登入資訊後，前往閱讀平台使用。', access:'Raz-Kids 帳號'}
  ]},
  {id:'documents', title:'行事曆與下載文件', items:[
    {id:'calendar', title:'學期行事曆', href:'https://drive.google.com/file/d/1_-DQ5C-ZmX998kn2K11ysOR_cD9pc0r0/view', description:'校方提供的行事曆文件；請核對文件上的學年度與版本。', access:'學校帳號 · Google Drive'},
    {id:'paper', title:'書香、學士獎空白稿紙', href:'https://drive.google.com/file/d/1ONix18QoHAv82O5_mlhNf25IQSQP6lzL/view', description:'開啟學校提供的空白稿紙，再依需要下載或列印。', access:'學校帳號 · Google Drive'}
  ]}
];

// 依維護者於 2026-08-30 提供的校車系統截圖整理；截圖沒有公告版本日期。
export const busNotes = [
  {title:'同日期只記錄一次變更', text:'送出後若還需調整，請在相應截止時間前致電校車室申請。'},
  {title:'改為家接、車接', text:'當日搭校車改為家接或車接，須於下午 3:00 前申請；週三學藝營與暑期輔導期間改為下午 1:00 前。'},
  {title:'當日變更下車地點', text:'須於下午 2:00 前與校車室聯絡確認，超過下午 2:00 不受理。'},
  {title:'其他日期變更下車地點', text:'填寫完成後，仍須與校車室聯絡確認。'},
  {title:'請假須另外申請', text:'此系統僅供搭乘校車學生辦理異動；學生請假須另至校務 App 申請。'},
  {title:'跨車與臨時搭乘', text:'跨車須在固定時間、地點且有座位才可申請，每學期新臺幣 2,000 元；臨時變更搭乘視空位辦理，每次新臺幣 200 元。上、放學分開計算；費用以校方最新公告為準。'}
];
