# 薇閣小一資料站｜設計與開發規範（DESIGN.md）

版本：1.0 ｜ 建立：2026-08-08

> 這份文件定下**目前的架構約定、設計系統、必要 skills 與通用 import 方法**，
> 目的是讓之後的改動（無論是 Claude、Codex 或其他 agent）都能保持一致。
> **動工前請先讀完本檔。** 主計畫在 private repo `docs/website-plan.md`；
> 班級路由的決策背景在 private repo `docs/class-routing-revision-2026-08-08.md`。

---

## 1. 架構與路由約定

### 1.1 資料模型（`src/main.jsx` 的 `siteData`）

```text
siteData = {
  common:  { label, events[], exams[], notices[] },          // 全校／一年級共通（公開）
  classes: { "<slug>": { label, events[], exams[], notices[] } } // 各班專屬（隱藏路由）
}
```

- 學校事務資料 `schoolRows` 以 `scope` 欄位分流：`'common'`（共通）、`'class'`（班級專屬）、`'both'`。
- 新增班級 = 在 `classes` 加一個 key，並給該班一條專屬網址。**不需改架構、不需資料庫。**
- **經典文學** 用資料驅動的 `classics` 陣列（學習成長頁），可持續增補；每篇含
  `id / scope('common'|'class') / tone('summer'|'graduation') / title / occasion（用途情境標籤）/
  note / video / source`。**情境標註（暑輔驗收、畢業吟誦等）須以私密庫 LINE 原始匯出交叉核對後再寫入，
  只放去識別化內容**；`scope='class'` 者只在班級頁顯示。新增篇目＝加一個陣列項目即可。

### 1.2 隱藏路由（社交區隔，非資安）

- 共通頁：`#/`、`#/calendar`、`#/learning`、`#/school/:section`、`#/notices`。
- 班級頁：`#/class/:slug`、`#/class/:slug/calendar` …（slug 前綴攜帶「班級脈絡」）。
- **首頁與任何共通頁不得出現通往班級頁的連結**（含 View Source）。未知 slug → `查無此頁`，不洩漏任何 slug。
- 所有導覽連結一律用 `withCtx(path, ctx)` 產生，**禁止手寫 `#/...` 路徑**，否則會掉出班級脈絡。
- **界線（務必遵守）**：隱藏 slug 只是「避免各班互相比較」的社交摩擦，**不是資安**。
  slug 會出現在公開 bundle、可被枚舉。真正的私密資料（家長 LINE ID、學生個資、帳密、
  QR Code、健康資料）**永遠只留在 private repo**，不得因為「藏在班級頁」就放進 bundle。
  若日後要真正防止外人挖 repo → 將公開 repo 轉 private ＋ 改用 Vercel（見 website-plan §13.3）。

### 1.3 slug 規格

- 5 碼隨機，字元集去除易混淆者：`abcdefghjkmnpqrstuvwxyz23456789`（去 `i l o 0 1`）。
- **無可猜前綴**（不要 `grade1-`）。
- slug↔班級對照存於 **private repo** `data/private/class-slugs.json`，**不進公開 repo**。
- 約兩年重編班時另產新 slug，舊 slug 內容停止更新（不必刪除）。

---

## 2. 設計系統（「晨光紙張 × 精煉極簡」）

方向：溫馨、清楚、安心，帶小學生活感但不幼稚。採 minimalist-ui 的**精煉極簡**（editorial、
暖色單色調、大留白、扁平），但**保留學校的綠＋杏作為點綴**維持識別度。**不做花俏動畫。**

### 2.1 色票（`src/styles.css` 的 CSS 變數，唯一真實來源）

| Token | 值 | 用途 |
|---|---|---|
| `--bg` | `#f7f6f3` | 暖白畫布（首頁/頁首/頁尾底，**不上大面積主色**） |
| `--surface` | `#fff` | 卡片／表格面 |
| `--ink` | `#124f4a` | 沉穩青綠：**標題與主要點綴** |
| `--text` | `#2f3437` | 暖炭色內文（**不用純黑**） |
| `--muted` | `#787774` | 次要文字 |
| `--line` | `#e7e6e1` | 極淡暖灰髮絲線（1px 邊框／分隔） |
| `--sage` / `--sage-2` | `#eef3ea` / `#e2ece0` | 淡綠點綴面（圖示底、表頭、選中態、badge） |
| `--apricot` | `#c17d38` | 杏色點綴（標題底線、section-title 圖示） |
| `--shadow` | `0 2px 10px rgba(23,42,36,.05)` | 扁平陰影（opacity < .06） |

### 2.2 字體

- 標題（editorial serif）：`'Noto Serif TC'` 600/700。
- 內文／UI：`'Noto Sans TC'` 400–700。行高 ≥ 1.6，手機內文 ≥ 16px。
- 由 `styles.css` 頂端 Google Fonts `@import` 載入。

### 2.3 版面與元件

- 大留白、強層級、少卡片；主容器最寬 `--max: 1380px`。
- 邊框一律 `1px solid var(--line)`；圓角 8–14px；**禁止**重陰影、漸層大色塊、霓虹、pill 大容器。
- 按鈕最小高度 44px（`.outline-button`）。標籤／badge 可用 pill（小字、寬字距）。

### 2.4 圖示

- **函式庫：`@phosphor-icons/react`（不要用 lucide / feather / heroicons）。**
- 預設 `weight="regular"`（由 `IconContext.Provider` 設定）；**功能性大圖示**（四大入口、brand）用 `weight="duotone"` 取得淡綠雙色。
- CSS 以 `width` 指定尺寸，並全域 `svg{height:auto}` 讓 Phosphor 的 `1em` 高度跟著寬度成正方形。
- lucide → Phosphor 對照（供日後增修比對）：
  `Home→House`、`CalendarDays→CalendarDots`、`School→Buildings`、`Shirt→TShirt`、
  `PackageOpen→Package`、`BusFront→Bus`、`SquareParking→Car`、`ChevronRight→CaretRight`、
  `Clock3→Clock`；`BookOpen / Megaphone / ShoppingBag / ShieldCheck / Leaf` 名稱不變。

### 2.5 動效（安靜、克制）

- 載入時內容區塊 `translateY(12px)+opacity` 於 `.6s cubic-bezier(.16,1,.3,1)` 淡入，
  以 `nth-child` 做 stagger（`main>*`）。
- 只動 `transform / opacity`。全部包在 `@media(prefers-reduced-motion:no-preference)`，
  reduce 時不播放。**不引入 GSAP**（工具型網站不需要，且 GitHub Pages 求零依賴）。

---

## 3. 行事曆訂閱（已實作）

家長「訂閱」一次，之後維護者更新即自動同步（Apple 較快、Google 可能延遲數小時）。

- **單一資料來源**：所有事件在 `src/calendar-data.js`（`common` 與 `classes[slug]`），
  每事件含 `uid / d / title / detail / source / start / end`。網站畫面與 `.ics` 都由此產生，不會兩套。
- **feed 產生**：`scripts/gen-ics.mjs`（用 `src/ics.js`）在 `dev`／`build` 前執行，輸出
  `public/calendar/wego-common.ics`、`public/calendar/class-<slug>.ics`（每班一份）→ 部署後即固定網址。
- **UI**（`CalendarPage`）：
  - **訂閱整學期**：`webcal://<host>/calendar/…ics`（iPhone/Mac 直接跳訂閱）＋ Google「從網址加入」深連結 ＋ 可複製的 https 網址。
  - **只加入這一筆**：每筆事件用 `buildCalendar([ev])` 產生單一 `.ics` 下載（一次性用途保留）。
  - feed 路徑依脈絡：共通頁 → `wego-common.ics`；班級頁 → `class-<slug>.ics`。主機由 `location.origin`＋`import.meta.env.BASE_URL` 推導，`webcal` = 把 `https` 換成 `webcal`，不寫死網域。
- **ICS 格式**（`src/ics.js`，見 website-plan §6.3）：RFC 5545、每事件永久 `UID`、全天事件
  `DTEND` 取隔天(排他)、時區 `Asia/Taipei`、75-octet 折行、`SEQUENCE`。
- **維護規則**：改日期／改事件時**務必保留同一個 `uid`**（訂閱端才會更新而非新增一筆）；
  內容有變時可調整 `gen-ics.mjs` 的 `DTSTAMP` 常數。**部署後才會生效**——改本機要重新 build/deploy。
- **待補**：`calendar-data.js` 的日期需與原始行事曆／通知逐項人工核對；取消事件時加 `STATUS:CANCELLED`（目前 `ics.js` 產 `CONFIRMED`，未來可加參數）。

---

## 4. 必要 skills 與通用 import 方法

> 設計改動請在下列 skills 的規範下進行。**未來 agent 可能不是 Claude（可能是 Codex 等）**，
> 因此採用**跨 agent 通用**的安裝方式：`npx skills add`（會裝到 `.agents/skills/`，並為
> Claude Code／Codex／Gemini CLI／Copilot 等建立對應設定）。

在專案容器目錄 `E:\workspace\wego-portal`（兩個 repo 的上層）執行：

```bash
# 1) Minimalist UI（本設計系統的主要依據）
npx skills add https://github.com/Leonxlnx/taste-skill --skill minimalist-ui

# 2) GSAP（動畫參考；本專案目前不引入，僅備查）
npx skills add https://github.com/greensock/gsap-skills
```

- 安裝後位於 `.agents/skills/`（universal），Claude Code 另有 `.claude/skills/` symlink。
- **Anthropic Front-End Design** 是 Claude 專屬 plugin skill（`document-skills:frontend-design`），
  非 Claude 的 agent 無法直接載入；其核心主張（有個性的字體、克制一致的色票、精煉極簡、
  高完成度細節）已濃縮在本檔第 2 節，非 Claude agent 依本檔執行即可等效。
- 若換到別的機器／agent，只要重跑上面兩行即可取得一致規範；規範本身仍以本 DESIGN.md 為準。

---

## 5. 開發、建置與驗收

```bash
# 本機開發（無 pnpm 時用 corepack；node 自帶）
corepack pnpm install
corepack pnpm dev      # http://localhost:5173

# 正式建置
corepack pnpm build
```

發布前必檢（對照 website-plan §13.3、§15）：

1. `#/` 及共通頁**找不到任何 `#/class/` 連結**（含 View Source）。
2. 三種路由正確：共通首頁、`#/class/:slug`（顯示 badge 與該班內容）、未知 slug → 查無此頁。
3. `dist` 掃描無私密資料（家長姓名／LINE ID／帳密／學號／電話／QR Code／`private-review`）。
4. 桌面與 390px 手機版無水平溢出、無 App console 錯誤。
5. 修改既有檔前先備份 `*.bak-YYYYMMDD`（工作區硬規則）；只有維護者要求才 commit，
   且排除 `*.bak-*`、`data/private/`、原始 LINE 記錄。
