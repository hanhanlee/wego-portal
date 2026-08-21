# 薇閣小一資料站

提供小一家長查閱日期行程、學習資源、學校事務與班級公告的公開資訊網站。

本 repository 只包含人工整理、去識別化並核准公開的內容，不包含 LINE 原文、
聊天截圖、家長姓名、帳密、QR Code 或私密來源對照。

## 網站結構

- **公開首頁（`#/`）**：全校／一年級共通資訊，直接對外。首頁不連向任何班級頁。
- **班級專屬頁（`#/class/<slug>`）**：各班日常細節，僅透過專屬短網址提供給該班家長
  （用來避免各班互相比較，屬社交區隔、**非資安**）。未知網址會顯示「查無此頁」。
  slug 對照與私密內容留在 private repo，不進本 repo。

## 開發規範

動任何前端／設計改動前，請先讀 [`DESIGN.md`](./DESIGN.md)：內含架構與路由約定、
設計系統（色票／字體／圖示／動效）、必要 skills 的通用 import 方法，以及發布前檢查。

## 本機開發

無 pnpm 時可用 node 內建的 corepack：

```bash
corepack pnpm install
corepack pnpm dev      # http://localhost:5173
```

正式建置：

```bash
corepack pnpm build
```
