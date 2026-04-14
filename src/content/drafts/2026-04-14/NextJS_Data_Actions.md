---
title: Next.js 資料獲取與 Server Actions
date: 2026-04-14
description: 學習如何在 Server Component 中直接 fetch 資料、環境變數的公私有規則，以及用 Server Actions 取代傳統 API Route 進行資料寫入。
tags: [Next.js]
---

# 資料獲取與 Server Actions

Next.js 簡化了前後端溝通的流程。

## 資料獲取 (Data Fetching)

在 Server Component 中，可以直接使用 `async/await` 呼叫 API，不需要 `useEffect`：

```tsx
// app/posts/page.tsx
export default async function PostsPage() {
  const posts = await fetch('https://api.example.com/posts').then(r => r.json());
  return <ul>{posts.map(p => <li key={p.id}>{p.title}</li>)}</ul>;
}
```

## 環境變數安全性

| 命名規則 | 可見範圍 | 範例 |
|---|---|---|
| `API_KEY=xxx` | 僅 Server 可讀 | 資料庫密碼、第三方 API Key |
| `NEXT_PUBLIC_API_KEY=xxx` | Server + Client 皆可讀 | 公開的地圖 API Key |

> **注意**: 帶有 `NEXT_PUBLIC_` 前綴的變數會被打包進瀏覽器 JS，請勿存放機密資訊。

## Server Actions (`"use server"`)

- **定義**: 在 `async` 函式頂端加上 `"use server"`。
- **用途**: 讓前端按鈕或表單可以直接觸發後端的資料寫入邏輯（如存入資料庫），不需要自建 API Route。
- **安全**: 必須在函式內部進行權限與身分驗證，不可信任任何來自前端的輸入。

## 讓資料即時更新

Server Action 執行完寫入後，Next.js 的快取不會自動失效，需要手動通知框架重新抓取資料。

### `revalidatePath()`

最常用的方式。在 Server Action 完成後呼叫，指定需要重新驗證的路由：

```tsx
'use server'
import { revalidatePath } from 'next/cache'

export async function createPost(formData: FormData) {
  await db.post.create({ data: { title: formData.get('title') } })
  revalidatePath('/posts') // 讓 /posts 頁面下次請求時重新 fetch
}
```

### `revalidateTag()`

若多個頁面共用同一筆資料，可以用 tag 批次失效：

```tsx
// 在 fetch 時打上 tag
const posts = await fetch('https://api.example.com/posts', {
  next: { tags: ['posts'] }
}).then(r => r.json())

// 在 Server Action 中失效
import { revalidateTag } from 'next/cache'
revalidateTag('posts')
```

### `router.refresh()` (Client Component)

若需要在客戶端觸發（例如按鈕點擊後），可搭配 `useRouter`：

```tsx
'use client'
import { useRouter } from 'next/navigation'

export function RefreshButton() {
  const router = useRouter()
  return <button onClick={() => router.refresh()}>重新整理</button>
}
```

> `router.refresh()` 會重新向 Server 請求當前路由的資料，不會觸發整頁重新載入（保留 React state）。