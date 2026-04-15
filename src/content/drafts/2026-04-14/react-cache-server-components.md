---
title: 用 React cache() 避免 Server Component 重複讀檔
date: 2026-04-14
description: 在 Next.js App Router 中，同一個 request 內多個元件呼叫同一個資料函式，會重複觸發 I/O。用 React 內建的 cache() 可以讓結果在同一個 render pass 內共用。
tags: [Next.js, React, Performance, Server Components]
---

## 問題：每次呼叫都重新讀檔

`getAllDrafts()` 是一個普通函式，會讀取硬碟上所有的 `.md` 檔案：

```ts
// src/lib/posts.ts
export function getAllDrafts(): DraftMeta[] {
  const dateFolders = fs.readdirSync(draftsDir);
  for (const date of dateFolders) {
    // 讀取每個資料夾下的每個檔案...
  }
  return results.sort(...);
}
```

在一次 build 或 request 中，這個函式可能被呼叫多次：

- `src/app/page.tsx` 首頁呼叫一次
- `src/app/drafts/[date]/[slug]/page.tsx` 的 `generateStaticParams` 呼叫一次

每次呼叫都是獨立的 I/O 操作，**重複讀取所有檔案**。

## 解法：用 `cache()` 包住函式

React 提供了 [`cache()`](https://react.dev/reference/react/cache)，可以讓同一個 request / render cycle 內對同一函式的重複呼叫共用同一份結果。

```ts
// src/lib/posts.ts
import { cache } from "react";

// 修改前
export function getAllDrafts(): DraftMeta[] { ... }

// 修改後
export const getAllDrafts = cache(function getAllDrafts(): DraftMeta[] { ... });
```

呼叫端完全不需要改動，因為對外的介面（函式名稱與參數）完全一樣。

## cache() 的運作方式

`cache()` 會以**函式的參數**作為 key，在同一個 request 內將結果記憶起來：

```text
第一次呼叫 getAllDrafts()  →  讀檔、計算、儲存結果
第二次呼叫 getAllDrafts()  →  直接回傳上次的結果（不讀檔）
第三次呼叫 getAllDrafts()  →  同上
```

## 關鍵觀念

| 概念 | 說明 |
|------|------|
| `cache()` 的作用域 | 每個 **request** 內有效，不跨 request |
| 適用場景 | 同一個 render pass 內多個 Server Component 需要同一份資料 |
| 不適用場景 | 需要跨 request 長期快取 → 改用 Next.js 的 `unstable_cache` |
| 與 `useMemo` 的差異 | `useMemo` 用在 Client Component；`cache()` 用在 Server Component |

## 注意事項

- `cache()` 只在 **React Server Components** 環境下有效
- 在開發模式（`next dev`）中，每次 HMR 都是新的 request，看不出快取效果；但在 `next build` 時效果明顯
- 不帶任何參數呼叫的函式（如 `getAllDrafts()`），React 會用空的參數列表作為 cache key，所有呼叫都共用同一份結果
