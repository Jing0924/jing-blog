---
title: Next.js 元件渲染與 Server/Client 分工
date: 2026-04-14
description: 理解 Next.js 中 Server Component 與 Client Component 的差異、使用限制，以及如何設計混合渲染架構。
tags: [Next.js]
---

# 元件渲染與 Server/Client 分工

Next.js 混合了伺服器與客戶端渲染，以達到最佳效能。

## 伺服器元件 (Server Components)

- **預設狀態**: 所有元件預設都是 Server Component。
- **特點**: 在伺服器執行，瀏覽器不需下載該元件的 JS，有利於 SEO 與初始載入效能。
- **限制**: 不能使用 React Hook（`useState`、`useEffect`）或瀏覽器 API（`window`、`onClick`）。

## 客戶端元件 (Client Components)

- **宣告方式**: 在檔案最頂端加上 `"use client"`。
- **特點**: 在瀏覽器執行，處理所有互動邏輯。
- **最佳實踐**: 盡量保持在「葉子節點」，只將需要互動的小元件設為 Client Component。

## 混合模式 (Hybrid)

| 需求 | 負責元件 | 做法 |
|---|---|---|
| 讀取資料 | Server Component | `async/await` 直接取資料 |
| 即時互動 | Client Component | event listener、state |