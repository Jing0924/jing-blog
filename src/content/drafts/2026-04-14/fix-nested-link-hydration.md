---
title: 踩坑：巢狀 <a> 標籤造成 Hydration Error
date: 2026-04-14
description: 在 Next.js 中把 TagPill 改成可點擊連結時，因為 <Link> 巢狀在 <Link> 裡面，導致 HTML 非法結構與 Hydration 錯誤。
tags: [Next.js, Debug]
---

## 錯誤訊息

```text
<a> cannot contain a nested <a>.

Uncaught Error: Hydration failed because the server rendered HTML didn't match the client.
```

## 發生原因

在將 `TagPill` 元件從 `<span>` 改成 `<Link>` 之後，出現了這個錯誤。

問題出在 JSX 的**結構巢狀**：整張卡片被一個 `<Link>` 包住，而 `TagPill` 裡又有一個 `<Link>`，導致 HTML 渲染出：

```html
<!-- 違法的 HTML 結構 -->
<a href="/drafts/2026-4-14/some-post">   <!-- 外層 Link -->
  <article>
    ...
    <a href="/drafts?tag=NextJS">         <!-- TagPill 的 Link，巢狀在 <a> 裡！ -->
      NextJS
    </a>
  </article>
</a>
```

HTML 規範明確禁止 `<a>` 裡面放 `<a>`，瀏覽器在解析時會修正這個結構，但這樣一來伺服器渲染（SSR）的 HTML 和客戶端重新渲染的結果不一致，就會觸發 **Hydration Error**。

## 解法：縮小外層 Link 的範圍

把 `<article>` 移到最外層，`<Link>` 只包住標題區塊，Tags 則放在 `<Link>` 關閉標籤之後：

```tsx
// src/app/drafts/page.tsx
// ❌ 修改前：<Link> 包住整個 article，TagPill 巢狀其中
<li>
  <Link href="/drafts/...">
    <article>
      <h2>標題</h2>
      <TagPill href="/drafts?tag=..." />  {/* <a> 在 <a> 裡面 */}
    </article>
  </Link>
</li>

// ✅ 修改後：<article> 在最外層，<Link> 只包標題，Tags 在外面
<li>
  <article>
    <Link href="/drafts/...">
      <h2>標題</h2>
    </Link>
    <TagPill href="/drafts?tag=..." />    {/* <a> 不再巢狀 */}
  </article>
</li>
```

## 關鍵觀念

- `<Link>` 在 Next.js 中會渲染成 `<a>` 標籤
- **`<a>` 裡面不能放 `<a>`**，這是 HTML 規範
- 當 SSR 產出的 HTML 和 Client 渲染結果不同，就會觸發 Hydration Error
- 解法通常是**調整 JSX 的巢狀結構**，讓互動元素彼此平行，而非巢狀
