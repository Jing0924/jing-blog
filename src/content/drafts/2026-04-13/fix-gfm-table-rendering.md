---
title: 修正 ReactMarkdown 無法渲染 GFM 表格的問題
date: 2026-04-13
description: 在 Next.js 專案中使用 react-markdown 時，GFM 表格排版亂掉的原因與修正方式
tags: [Next.js, Markdown, react-markdown, remark-gfm]
---

## 問題描述

在 draft 文章頁面，Markdown 內容中的 GFM 表格（`| 欄位 | 欄位 |` 格式）無法正確渲染，畫面上顯示的是一整串帶有 `|` 的純文字，而非正常的表格。

## 根本原因

GFM（GitHub Flavored Markdown）的表格語法並非標準 CommonMark 的一部分，需要額外的 `remark-gfm` 外掛才能解析。

專案中雖然已安裝 `remark-gfm`，但在 `src/app/drafts/[date]/[slug]/page.tsx` 使用 `<ReactMarkdown>` 時，只傳入了 `rehypePlugins`，忘記傳入 `remarkPlugins`：

```tsx
// src/app/drafts/[date]/[slug]/page.tsx
// 修正前（缺少 remarkPlugins）
<ReactMarkdown rehypePlugins={[rehypeHighlight]}>
  {content}
</ReactMarkdown>
```

`remark-gfm` 屬於 **remark 外掛**（作用於 Markdown → AST 解析階段），必須放在 `remarkPlugins` 而非 `rehypePlugins`。

## 修正方式

在 `page.tsx` 加上 `import remarkGfm from 'remark-gfm'`，並將其傳給 `remarkPlugins`：

```tsx
// src/app/drafts/[date]/[slug]/page.tsx
import remarkGfm from 'remark-gfm'

<ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
  {content}
</ReactMarkdown>
```

## 重點觀念

| 外掛類型 | 傳入屬性 | 作用階段 | 範例 |
|----------|----------|----------|------|
| remark 外掛 | `remarkPlugins` | Markdown → mdast（解析） | `remark-gfm`、`remark-math` |
| rehype 外掛 | `rehypePlugins` | hast → HTML（輸出） | `rehype-highlight`、`rehype-katex` |

兩者處理的階段不同，不可混用。
