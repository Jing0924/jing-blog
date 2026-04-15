---
title: Next.js 檔案系統路由 (App Router)
date: 2026-04-14
description: 了解 Next.js App Router 的資料夾即路由規則、動態路由，以及 layout、loading、not-found 等特殊檔案的用途。
tags: [Next.js]
---

在 Next.js 中，資料夾結構直接對應網址路徑。

## 核心規則

- **根目錄**: 所有路由都放在 `app/` 資料夾下。
- **頁面檔案**: 必須命名為 `page.tsx`（或 `.js`、`.jsx`）才能被公開存取。
- **動態路由**: 使用中括號命名資料夾，例如 `[id]`。

## 結構範例

| 檔案路徑 | 對應網址 |
|---|---|
| `app/page.tsx` | `/`（首頁） |
| `app/blog/page.tsx` | `/blog` |
| `app/blog/[id]/page.tsx` | `/blog/123`（動態 ID） |

## 特殊檔案

- `layout.tsx`: 定義共享版面（如導覽列），不會隨路由切換而重新渲染。
- `loading.tsx`: 該層級路由抓取資料時自動顯示的載入畫面。
- `not-found.tsx`: 觸發 `notFound()` 函式時顯示的 404 頁面。

## 重點整理

| 概念 | 核心機制 |
|---|---|
| `page.tsx` | 讓路由可被存取的必要檔案 |
| `[id]` 資料夾 | 動態路由，參數透過 `params.id` 取得 |
| `layout.tsx` | 定義共享版面，路由切換時不重新渲染 |
| `loading.tsx` | 資料載入中自動顯示的 Suspense fallback |