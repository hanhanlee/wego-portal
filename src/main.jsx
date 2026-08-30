import React, {useEffect, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {
  IconContext, Bell,
  BookOpen, Bus, CalendarDots, CaretRight, Clock, House, Leaf, Megaphone,
  Package, Buildings, ShieldCheck, TShirt, ShoppingBag, Car, PlayCircle, GraduationCap, Sun
} from '@phosphor-icons/react';
import './styles.css';
import {buildCalendar} from './ics.js';
import {classPortals, resolvePortalData} from './portal-data.js';
import LinksPage from './LinksPage.jsx';
import TimetablePage from './TimetablePage.jsx';
import {classTimetables} from './timetable-data.js';
import {COMMON_ORIGIN, defaultClassForHost, routeForLocation, contextualHref} from './routing.js';

const UPDATED='2026年8月30日';
const COMMON_TITLE='Wego小一小鈴鐺資訊站';
const nav=[
  ['/','首頁',House],
  ['/calendar','日期行程',CalendarDots],
  ['/learning','學習成長',BookOpen],
  ['/school','學校事務',Buildings],
  ['/notices','班級公告',Megaphone],
  ['/links','常用連結',BookOpen]
];

const pencilImages=[
  ['/assets/class1/pencil-grip/grip-overview.jpg','正確握筆姿勢：虎口、手腕、三點抓握、三指分開及筆尖方向'],
  ['/assets/class1/pencil-grip/writing-posture.jpg','正確書寫坐姿：手肘、骨盆、膝蓋與腳踝保持約九十度'],
  ['/assets/class1/pencil-grip/hand-position.jpg','正確握筆手勢示意'],
  ['/assets/class1/pencil-grip/incorrect-grips-three.jpg','三種不建議的握筆方式'],
  ['/assets/class1/pencil-grip/incorrect-grips-six.jpg','六種常見錯誤握筆姿勢']
];

// 資料分兩層：common（全校／一年級共通，公開）與 classes（各班專屬，隱藏路由）。
// class slug 屬社交區隔、非資安；詳見 private repo docs/class-routing-revision-2026-08-08.md。
const schoolSections=[
  ['daily','日常用品',Package],
  ['uniform','制服與尺寸',TShirt],
  ['book-covers','書套參考',BookOpen],
  ['purchases','購買與加購',ShoppingBag],
  ['transport','接送與校車',Bus],
  ['parking','活動停車',Car]
];

const schoolRows={
  daily:[
    {scope:'class',title:'日常攜帶用品',summary:'聯絡簿、鉛筆盒、水壺、餐具與餐巾、衛生紙、手帕、備用口罩、酒精擦與姓名貼。',date:'暑輔期間',reference:'一忠暑輔日常提醒',source:'一忠班級群組通知'},
    {scope:'class',title:'護眼護照',summary:'提供共 6 次專業視力檢查服務，每年限使用 1 次，使用期限至畢業當年度 6 月 30 日；請妥善保管。',date:'8月上旬',reference:'護眼護照發放提醒',source:'一忠班級群組通知'},
    {scope:'class',title:'交通安全親子共學手冊',summary:'配合教育局政策發放，家長可利用在家時間陪孩子閱讀，共同培養交通安全觀念。',date:'8月上旬',reference:'交通安全親子共學手冊發放提醒',source:'一忠班級群組通知'},
    {scope:'common',title:'一年級日常用品',summary:'聯絡簿、鉛筆盒、水壺、餐具、手帕與面紙；各班仍以導師當日通知為準。',date:'日常使用',reference:'一年級導師通知',source:'一年級導師通知'},
    {scope:'class',title:'英文手提袋',summary:'班上每位孩子都有一個，目前放在教室，開學後發下；現階段不需加訂。',date:'8/2',reference:'英文手提袋說明',source:'一忠班級群組通知'}
  ],
  uniform:[
    {scope:'class',title:'夏季制體服更換',summary:'請勿下水、勿拆標，放回原透明袋與原牛皮紙袋，並填妥更換單。',date:'8/3–8/6',reference:'夏季制體服更換公告',source:'一忠班級群組通知'},
    {scope:'class',title:'小學制服尺寸',summary:'採偶數號：110 公分約 6 號、120 公分約 8 號、130 公分約 10 號、140 公分約 12 號、150 公分約 14 號。',date:'8/2',reference:'制服尺寸說明',source:'一忠班級群組通知'},
    {scope:'common',title:'制服穿著整理參考',summary:'制服搭配黑皮鞋；體育服搭配白襪與白色運動鞋。鞋襪可自行外購，仍以導師當週安排為準。',date:'學期參考',reference:'薇小校服整理參考',source:'小鈴噹群組熱心家長整理'},
    {scope:'common',title:'幼兒園服裝與書包延用',summary:'幼兒園體服與書包若仍堪用，可先延用；實際穿著請依班級通知。',date:'入學參考',reference:'薇小校服整理參考',source:'小鈴噹群組熱心家長整理'}
  ],
  purchases:[
    {scope:'class',title:'夏季制體服加購',summary:'由孩子向老師領取訂購單，隔日將訂購單與費用放入資料夾交給老師。',date:'8/4–8/6',reference:'夏季制體服加購公告',source:'一忠班級群組通知'},
    {scope:'common',title:'115學年度制體服價格參考',summary:'新生註冊須知列示：夏季制服 1,650 元、夏季體育服 1,150 元、冬季制服 4,650 元。',date:'115/4/30',reference:'小一新生菁英班入學註冊須知',source:'學校通知'},
    {scope:'common',title:'書包與手提袋單品參考',summary:'舊訂購單列示書包 880 元、手提袋 200 元；價格可能調整，購買前請以新訂購單為準。',date:'歷史價格',reference:'夏季服裝訂購單',source:'小鈴噹群組熱心家長整理'}
  ],
  transport:[
    {scope:'class',title:'校車異動回報系統',summary:'由學校提供的校車異動回報系統入口進入，使用孩子的帳號密碼登入；若無法開啟，請以導師或學校最新說明為準。',date:'8/21確認',reference:'校車異動回報系統登入說明',source:'一忠班級群組通知'},
    {scope:'common',title:'115學年度第一學期校車登錄',summary:'所有學生無論校車、車接或家接皆須完成調查；原公告填寫期間已截止。',date:'7/20–7/23',reference:'上放學方式暨校車搭乘申請調查表',source:'學校通知'},
    {scope:'common',title:'暑輔日常放學方式',summary:'第一班校車、車接與家接為 15:20；第二班校車為 16:20。異動仍依學校 App 與導師通知辦理。',date:'暑輔期間',reference:'一年級暑輔注意事項',source:'一年級導師通知'}
  ],
  parking:[
    {scope:'common',title:'新生家長說明會停車',summary:'當次活動開放校園停車，車位有限；停妥後無法提前離場，亦可使用鄰近停車空間。',date:'7/17（已結束）',reference:'新生家長說明會會前注意事項',source:'學校通知'},
    {scope:'common',title:'學校日停車方式',summary:'目前只有 114 學年度舊資料，當時校園不開放停車；不可直接套用到 115 學年度。',date:'114學年度參考',reference:'114學年度學校日通知',source:'學校通知'}
  ]
};

const bookCovers=[
  ['國語','課本、習作','260 加寬'],['國語','甲本／乙本','260／265'],['國語','測驗本','210 加寬'],
  ['數學','課本、習作','260 加寬'],['數學','藍本','210 加寬'],['生活','課本、習作','260 加寬'],
  ['英語','課本、習作','300／306'],['英語','讀經本','260／265'],['其他','聯絡簿','300／306']
];

const schoolOriginals={
  daily:[
    {src:'/assets/references/school-affairs/daily-supplies.jpg',title:'小一新生應攜帶物品通知',meta:'學校資料圖片'},
    {href:'https://youtu.be/GV3-fsCDSmQ?si=dqMdRebUylT37ZDi',title:'田園教學裝備準備重點',meta:'YouTube・一忠班級群組提供'}
  ],
  uniform:[{src:'/assets/references/school-affairs/uniform-guide.jpg',title:'薇小校服整理參考',meta:'小鈴噹群組熱心家長整理'}],
  'book-covers':[{src:'/assets/references/school-affairs/book-cover-sizes.jpg',title:'114學年度菁英班書套尺寸參考',meta:'小鈴噹群組熱心家長整理'}],
  purchases:[{src:'/assets/references/school-affairs/summer-order-form.jpg',title:'夏季服裝訂購單與價格參考',meta:'小鈴噹群組熱心家長提供'}],
  transport:[{src:'/assets/references/school-affairs/transport-guide.jpg',title:'暑輔服裝、請假與接送注意事項',meta:'一年級暑輔資料'}],
  parking:[
    {src:'/assets/references/school-affairs/parent-meeting-parking.jpg',title:'新生家長說明會會前注意事項',meta:'學校通知・2026年7月16日'},
    {src:'/assets/references/school-affairs/school-day-parking-114.jpg',title:'114學年度學校日通知',meta:'歷史參考資料'}
  ]
};

const classicalOriginals=[
  {src:'/assets/references/learning/classical-progress-115.jpg',title:'115學年度暑輔第二週聯絡單',meta:'千字文、琵琶行背誦進度'},
  {src:'/assets/references/learning/classical-reading-note.jpg',title:'暑假經典進度提醒',meta:'薇閣小學教務處'}
];

// 經典文學篇目：資料驅動、可持續增補。occasion／note 的情境標註以私密庫 LINE 原始匯出交叉核對，
// 只放去識別化內容。scope='class' 者只在班級頁顯示（暑輔驗收屬導師群脈絡）；'common' 為全校共通。
const classics=[
  {id:'qianziwen', scope:'common', tone:'summer', title:'《千字文》', occasion:'暑輔背誦・驗收',
   note:'暑輔期間背誦，暑輔尾聲由導師驗收背誦成果。',
   video:{href:'https://youtu.be/IFg7VOQ6DN0', label:'《千字文（一）》練習影片', meta:'YouTube・小鈴噹群組熱心家長提供'},
   source:'一年級導師通知'},
  {id:'pipaxing', scope:'common', tone:'summer', title:'《琵琶行》', occasion:'暑輔背誦・驗收',
   note:'暑輔背誦，接續《千字文》之後由導師驗收。',
   video:{href:'https://youtu.be/LJbsp4lnvUw', label:'《琵琶行》練習影片', meta:'YouTube・小鈴噹群組熱心家長提供'},
   source:'一年級導師通知'},
  {id:'macarthur', scope:'common', tone:'graduation', title:'麥克阿瑟《為子祈禱文》', occasion:'畢業典禮吟誦',
   note:'薇閣畢業典禮全體畢業生進場時吟誦，是創辦人對孩子的期許；教務主任於新生家長座談會提及，邀家長在家陪孩子一起誦讀。',
   video:{href:'https://youtu.be/8VSbJKs5ILs', label:'麥克阿瑟《為子祈禱文》', meta:'YouTube・小鈴噹群組熱心家長提供'},
   source:'學校家長座談會（導師轉述）'}
];

// 路由解析：可選的 /class/:slug 前綴攜帶班級脈絡，其後為一般路徑。
function parseRoute(){
  return routeForLocation(location.hash,location.hostname);
}

// 依脈絡組出 hash 連結：班級脈絡自動帶上 /class/:slug 前綴，避免手寫路徑掉出脈絡。
function withCtx(path,ctx){
  return contextualHref(path,ctx,location.hostname);
}

function Source({children}){return <small className="source">來源：{children}</small>}
function TimetableEntry({ctx}){return ctx.kind==='class'&&classTimetables[ctx.slug]?<a className="home-links-entry" href={withCtx('/timetable',ctx)}><CalendarDots weight="duotone"/><div><strong>班級課表</strong><span>115 學年度第 1 學期・每週課程與作息</span></div><CaretRight/></a>:null}
function PageHeader({title,description}){return <div className="page-header"><div><h1>{title}</h1>{description&&<p>{description}</p>}</div><time>內容最後更新：{UPDATED}</time></div>}
function SectionTitle({icon:Icon,children}){return <h2 className="section-title"><Icon/>{children}</h2>}
function MediaReferences({items}){return <section className="media-references" aria-label="原始資料與外部資源"><div><h2>原始資料與延伸資源</h2><p>摘要方便快速閱讀；需要核對細節時，可開啟原圖或原始連結。</p></div><div className="media-strip">{items.map(item=>item.src?<a href={item.src} target="_blank" rel="noreferrer" className="media-card" key={item.src}><img src={item.src} alt={item.title} loading="lazy"/><span><strong>{item.title}</strong><small>{item.meta}</small></span><CaretRight/></a>:<a href={item.href} target="_blank" rel="noreferrer" className="media-card external" key={item.href}><span className="external-icon"><BookOpen/></span><span><strong>{item.title}</strong><small>{item.meta}</small></span><CaretRight/></a>)}</div></section>}

function HomePage({d,ctx}){
  const isClass=ctx.kind==='class';
  return <>
    <section className="home-intro">
      <div className="welcome-copy">{!isClass&&<Bell className="welcome-bell" weight="duotone" aria-hidden="true"/>}<h1>{isClass?`${d.label}班級資訊`:COMMON_TITLE}</h1><p>{isClass?'查看班級行程、每週課表與生活提醒。':'整理一年級共通的學校行程、學習提醒與生活資訊，陪家長一起從容準備每一天。'}</p><time>內容最後更新：{UPDATED}</time></div>
      <div className="recent-panel"><h2>近期重要事項</h2>{d.events.slice(0,3).map(ev=><a href={withCtx('/calendar',ctx)} className="recent-row" key={ev.uid}><time>{ev.d}</time><div><strong>{ev.title}</strong>{ev.detail&&<span>{ev.detail}</span>}<Source>{ev.source}</Source></div><CaretRight/></a>)}</div>
    </section>
    <section className="portal-directory" aria-label="資訊分類">
      <a href={withCtx('/calendar',ctx)}><span className="directory-icon"><CalendarDots weight="duotone"/></span><h2>日期行程</h2><p>學校與班級的重要日期</p><ul>{d.events.slice(0,3).map(ev=><li key={ev.uid}><time>{ev.d}</time>{ev.title}</li>)}</ul><CaretRight className="directory-arrow"/></a>
      <a href={withCtx('/learning',ctx)}><span className="directory-icon"><BookOpen weight="duotone"/></span><h2>學習成長</h2><p>考試、評量與學習參考</p><ul><li>近期評量與範圍</li><li>學習資源整理</li><li>學習建議與指引</li></ul><CaretRight className="directory-arrow"/></a>
      <a href={withCtx('/school',ctx)}><span className="directory-icon"><Buildings weight="duotone"/></span><h2>學校事務</h2><p>用品、服裝、購買與接送</p><div className="topic-preview"><span><Package/>用品</span><span><TShirt/>制服</span><span><ShoppingBag/>加購</span><span><Bus/>接送</span><span><Car/>停車</span></div><CaretRight className="directory-arrow"/></a>
      <a href={withCtx('/notices',ctx)}><span className="directory-icon"><Megaphone weight="duotone"/></span><h2>班級公告</h2><p>最新通知與資訊更正</p><ul>{d.notices.slice(-3).toReversed().map(item=><li key={item.id}>{item.title}</li>)}</ul><CaretRight className="directory-arrow"/></a>
    </section>
    <TimetableEntry ctx={ctx}/>
    <a className="home-links-entry" href={withCtx('/links',ctx)}><BookOpen weight="duotone"/><div><strong>家長常用連結</strong><span>學校官網、校車異動、語言學習與文件下載</span></div><CaretRight/></a>
    <section className="update-band"><Clock/><strong>最新更新</strong><span>{isClass&&classTimetables[ctx.slug]?'新增一忠班級課表、家長常用連結與校車異動注意事項。':'新增家長常用連結與校車異動注意事項。'}</span></section>
  </>;
}

function feedUrls(ctx){
  const base=import.meta.env.BASE_URL||'/';
  const file=ctx.kind==='class'?`class-${ctx.slug}.ics`:'wego-common.ics';
  const origin=typeof location!=='undefined'?location.origin:'';
  const https=`${origin}${base}calendar/${file}`.replace(/([^:]\/)\/+/g,'$1');
  return {https, webcal:https.replace(/^https?:/,'webcal:'),
    google:`https://calendar.google.com/calendar/u/0/r/settings/addbyurl?cid=${encodeURIComponent(https)}`};
}
function addSingleEvent(ev){
  const ics=buildCalendar([ev],{name:ev.title});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([ics],{type:'text/calendar'}));
  a.download=`${ev.uid}.ics`;a.click();URL.revokeObjectURL(a.href);
}
function CalendarPage({d,ctx}){
  const {https,webcal,google}=feedUrls(ctx);
  return <>
    <PageHeader title={`${d.label}日期行程`} description="依日期查看學校與班級事項"/>
    <TimetableEntry ctx={ctx}/>
    <section className="subscribe-panel">
      <div className="subscribe-copy"><h2><CalendarDots weight="duotone"/>訂閱整學期行事曆</h2><p>訂閱一次即可。之後我們更新日期或新增事件，你的行事曆會自動同步，不必重新匯入（Apple 通常數十分鐘內、Google 可能延遲數小時；緊急更正仍以網站公告為準）。</p></div>
      <div className="subscribe-actions">
        <a className="primary-button" href={webcal}><CalendarDots/>iPhone / Mac 訂閱</a>
        <a className="outline-button" href={google} target="_blank" rel="noreferrer"><CalendarDots/>Google 日曆訂閱</a>
      </div>
      <label className="subscribe-url"><span>訂閱網址（可複製手動加入）</span><input type="text" readOnly value={https} onFocus={e=>e.target.select()}/></label>
    </section>
    <section>
      <SectionTitle icon={CalendarDots}>重要日期</SectionTitle>
      <div className="event-list">{d.events.map(ev=><article key={ev.uid}><time>{ev.d}</time><div><h3>{ev.title}</h3>{ev.detail&&<p>{ev.detail}</p>}<Source>{ev.source}</Source><button type="button" className="add-one" onClick={()=>addSingleEvent(ev)}><CalendarDots/>只加入這一筆</button></div></article>)}</div>
    </section>
  </>;
}

function OccasionTag({tone,children}){const Icon=tone==='graduation'?GraduationCap:Sun;return <span className={`occasion occasion-${tone}`}><Icon weight="fill"/>{children}</span>}

function LearningPage({d,ctx}){
  const isClass=ctx.kind==='class';
  const items=classics.filter(c=>isClass||c.scope!=='class');
  return <>
    <PageHeader title={`${d.label}學習成長`} description="考試、評量與學習參考"/>
    <TimetableEntry ctx={ctx}/>
    <section>
      <SectionTitle icon={BookOpen}>近期考試與評量</SectionTitle>
      <div className="simple-table">{d.exams.map(item=><div key={item.id}><time>{item.date}</time><strong>{item.title}</strong><Source>{item.source}</Source></div>)}</div>
    </section>
    <section className="classics-section">
      <SectionTitle icon={BookOpen}>經典文學</SectionTitle>
      <p className="section-intro">查看背誦與吟誦安排，陪孩子一起在家練習。</p>
      <div className="classics-list">{items.map(c=><article className="classic-item" key={c.id}>
        <div className="classic-head"><h3>{c.title}</h3><OccasionTag tone={c.tone}>{c.occasion}</OccasionTag></div>
        <p>{c.note}</p>
        <div className="classic-foot">
          <a className="classic-video" href={c.video.href} target="_blank" rel="noreferrer"><PlayCircle weight="duotone"/><span><strong>{c.video.label}</strong><small>{c.video.meta}</small></span><CaretRight/></a>
          <Source>{c.source}</Source>
        </div>
      </article>)}</div>
      {isClass&&<div className="classics-progress">
        <h3><Sun weight="fill"/>一忠背誦驗收進度</h3>
        <p>7月31日班級通知：多數孩子已完成《千字文》背誦，導師接續驗收《琵琶行》，請孩子利用時間多加練習。</p>
        <Source>一忠班級群組通知</Source>
      </div>}
    </section>
    {isClass&&<MediaReferences items={classicalOriginals}/>}
    {isClass&&<section className="article-section">
      <SectionTitle icon={BookOpen}>書寫練習</SectionTitle>
      <article className="learning-article">
        <header><div><h2>正確握筆與書寫姿勢</h2><p>正確握筆、常見錯誤方式與書寫坐姿。</p></div><div><time>2026年8月5日</time><Source>一忠班級群組通知</Source></div></header>
        <div className="guide-gallery">{pencilImages.map(([src,alt])=><figure key={src}><a href={src} target="_blank" rel="noreferrer"><img src={src} alt={alt} loading="lazy"/></a><figcaption>{alt}</figcaption></figure>)}</div>
      </article>
    </section>}
  </>;
}

function SchoolRows({rows,Icon}){return <div className="affairs-table"><div className="affairs-head"><span>主題</span><span>摘要</span><span>參考日期</span><span>活動／文件名稱</span><span>來源</span></div>{rows.map(row=><article key={row.title}><div className="affairs-topic"><span><Icon/></span><h3>{row.title}</h3></div><p>{row.summary}</p><time>{row.date}</time><strong>{row.reference}</strong><Source>{row.source}</Source></article>)}</div>}

function SchoolAffairsPage({d,ctx,path}){
  const key=path.split('/')[2]||'daily';
  const active=schoolSections.find(([id])=>id===key)||schoolSections[0];
  const [,label,Icon]=active;
  const isClass=ctx.kind==='class';
  const rows=(schoolRows[key]||[]).filter(row=>row.scope==='common'||row.scope==='both'||(isClass&&row.scope==='class'));
  return <><PageHeader title={`${d.label}學校事務`} description="用品、服裝、購買、接送與校園活動資訊"/>
    <nav className="school-tabs" aria-label="學校事務分類">{schoolSections.map(([id,name,TabIcon])=><a href={withCtx(`/school/${id}`,ctx)} className={key===id?'selected':''} key={id}><TabIcon/><span>{name}</span></a>)}</nav>
    <div className="affairs-layout"><section className="affairs-content"><SectionTitle icon={Icon}>{label}</SectionTitle>{key==='book-covers'?<><p className="context-note">這份是 114 學年度菁英班低年級整理資料。115 學年度教材可能調整，購買前請核對實體書本。</p><div className="reference-table"><div className="reference-head"><strong>科目</strong><strong>書目</strong><strong>參考尺寸</strong></div>{bookCovers.map(([subject,book,size])=><div key={subject+book}><span>{subject}</span><span>{book}</span><strong>{size}</strong></div>)}</div><div className="reference-meta"><time>參考日期：114學年度</time><strong>活動／文件：菁英班書套尺寸參考</strong><Source>小鈴噹群組熱心家長整理</Source></div></>:<SchoolRows rows={rows} Icon={Icon}/>}<MediaReferences items={schoolOriginals[key]||[]}/></section>
      <aside className="affairs-aside"><h2>學校事務分類</h2>{schoolSections.map(([id,name,AsideIcon])=><a href={withCtx(`/school/${id}`,ctx)} className={key===id?'selected':''} key={id}><AsideIcon/><span>{name}</span><CaretRight/></a>)}<p><Leaf/>舊學年度資料僅供參考，請以學校最新通知為準。</p></aside>
    </div>
  </>;
}

function NoticesPage({d}){return <><PageHeader title={`${d.label}班級公告`} description="查看最新通知與重要提醒"/><section><SectionTitle icon={Megaphone}>最新通知</SectionTitle><div className="notice-list">{d.notices.toReversed().map(item=><article key={item.id}><time>{item.date}</time><div><h3>{item.title}</h3><Source>{item.source}</Source></div></article>)}</div></section></>}

function NotFoundPage(){return <section className="notfound"><h1>查無此頁</h1><p>這個網址沒有對應的內容，可能是連結有誤或內容已更新。</p><a className="outline-button" href={defaultClassForHost(location.hostname)?`${COMMON_ORIGIN}/`:'#/'}><House/>回到共通首頁</a></section>}

function App(){
  const [route,setRoute]=useState(parseRoute());
  useEffect(()=>{const onHash=()=>{setRoute(parseRoute());scrollTo(0,0)};addEventListener('hashchange',onHash);return()=>removeEventListener('hashchange',onHash)},[]);
  const {classSlug,path}=route;
  useEffect(()=>{document.title=classSlug&&classPortals[classSlug]?`${classPortals[classSlug].label}班級資訊｜薇閣小一資料站`:COMMON_TITLE;},[classSlug]);

  let ctx, d, notfound=false;
  if(classSlug){
    const cls=classPortals[classSlug];
    if(cls){ctx={kind:'class',slug:classSlug,label:cls.label};d=resolvePortalData(classSlug);}
    else{notfound=true;ctx={kind:'common'};}
  }else{ctx={kind:'common'};d=resolvePortalData();}

  let page;
  if(notfound) page=<NotFoundPage/>;
  else if(path==='/') page=<HomePage d={d} ctx={ctx}/>;
  else if(path==='/calendar') page=<CalendarPage d={d} ctx={ctx}/>;
  else if(path==='/learning') page=<LearningPage d={d} ctx={ctx}/>;
  else if(path.startsWith('/school')) page=<SchoolAffairsPage d={d} ctx={ctx} path={path}/>;
  else if(path==='/notices') page=<NoticesPage d={d} ctx={ctx}/>;
  else if(path==='/links') page=<LinksPage updated={UPDATED}/>;
  else if(path==='/timetable') page=ctx.kind==='class'&&classTimetables[ctx.slug]?<TimetablePage timetable={classTimetables[ctx.slug]} updated={UPDATED}/>:<NotFoundPage/>;
  else page=<HomePage d={d} ctx={ctx}/>;

  const activePath=path==='/timetable'?'/calendar':path.startsWith('/school')?'/school':path;
  return <div className={ctx.kind==='common'?'common-site':'class-site'}>
    <header className="site-header">
      <a className="brand" href={withCtx('/',ctx)}>{ctx.kind==='common'?<Bell className="brand-bell" weight="duotone"/>:<Leaf weight="duotone"/>}{ctx.kind==='common'?COMMON_TITLE:'薇閣小一資料站'}{ctx.kind==='class'&&<span className="class-badge">{ctx.label}</span>}</a>
      <nav aria-label="主要導覽">{nav.map(([p,label,NavIcon])=><a key={p} href={withCtx(p,ctx)} className={activePath===p?'active':''}><NavIcon/><span>{label}</span></a>)}</nav>
    </header>
    <main key={`${classSlug||'common'}:${path}`}>{page}</main>
    <footer><nav>{nav.map(([p,label])=><a href={withCtx(p,ctx)} key={p}>{label}</a>)}</nav><p><ShieldCheck/>本站為家長整理資訊，請以學校與導師最新通知為準。</p><small>內容最後更新：{UPDATED}</small></footer>
  </div>;
}

createRoot(document.getElementById('root')).render(
  <IconContext.Provider value={{weight:'regular'}}><App/></IconContext.Provider>
);
