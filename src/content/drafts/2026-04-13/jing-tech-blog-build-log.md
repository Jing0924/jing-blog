---
title: Jing Tech Blog — 建置全記錄
date: 2026-04-13
description: 從 Next.js 專案建立、部署 Vercel，到整合 MDX + Git Submodule 的完整流程
tags: [Next.js, MDX, git submodule, Vercel, Tailwind CSS]
---

## 一、建立 Next.js 專案

### 建立指令

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

此指令自動設定：

- TypeScript
- Tailwind CSS v4
- ESLint
- App Router（新架構）
- `src/` 目錄結構
- `@/*` 路徑別名

### 遇到的問題

**錯誤訊息：**

```text
Could not create a project called "Jing-Tech-Blog" because of npm naming restrictions:
  * name can no longer contain capital letters
```

**原因：** npm 套件名稱不允許使用大寫字母

**解法：** 專案名稱改用全小寫 `jing-tech-blog`

---

## 二、部署至 Vercel

1. 前往 [vercel.com](https://vercel.com) 並用 GitHub 帳號登入
2. 點擊 "Add New Project" → Import Git Repository
3. 選擇 `jing-tech-blog` repo → Import
4. Vercel 自動偵測 Framework 為 Next.js，確認設定後點 Deploy
5. 幾分鐘後取得 `xxx.vercel.app` 網址

---

## 三、筆記倉庫掛入 Git Submodule

筆記內容放在另一個 repo（`daily-learning-log`），透過 `git submodule` 掛入部落格的 `src/content`。

```bash
git submodule add https://github.com/Jing0924/daily-learning-log src/content
```

這會在根目錄產生 `.gitmodules`：

```ini
[submodule "src/content"]
    path = src/content
    url = https://github.com/Jing0924/daily-learning-log
```

### 筆記的目錄結構

```text
src/content/
├── posts/         ← 正式文章（.md）
└── drafts/
    └── 2026-4-13/
        ├── nextjs-project-setup.md
        └── jing-tech-blog-build-log.md
```

每篇 Markdown 檔案最上方需加 frontmatter：

```yaml
---
title: 文章標題
date: 2026-04-13
description: 簡短描述
tags: [Next.js]
---
```

### Submodule 同步方式

寫入 `src/content` 後需要兩個分開的 git 操作：

```bash
# Step 1：在子模組 commit + push（同步到 daily-learning-log）
cd src/content
git add .
git commit -m "add new note"
git push

# Step 2：回主倉庫更新 submodule 指針
cd ../..
git add src/content
git commit -m "chore: update content submodule"
git push
```

---

## 四、安裝套件

```bash
npm install @next/mdx @mdx-js/loader @mdx-js/react @types/mdx
npm install gray-matter remark-gfm
npm install @tailwindcss/typography
npm install react-markdown rehype-highlight highlight.js
```

| 套件 | 用途 |
|------|------|
| `@next/mdx` | Next.js 整合 MDX |
| `gray-matter` | 解析 frontmatter |
| `remark-gfm` | GFM 語法支援（表格、刪除線等） |
| `@tailwindcss/typography` | `prose` 排版樣式 |
| `react-markdown` | 將 Markdown 渲染為 React 元件 |
| `rehype-highlight` | 程式碼區塊語法高亮 |
| `highlight.js` | 高亮主題（使用 `github-dark`） |

---

## 五、設定檔修改

### `next.config.ts`

```ts
// next.config.ts
import createMDX from '@next/mdx'

const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
}

const withMDX = createMDX({
  options: {
    remarkPlugins: ['remark-gfm'],
  },
})

export default withMDX(nextConfig)
```

### `mdx-components.tsx`（根目錄，Next.js MDX 必要）

```tsx
// mdx-components.tsx
import type { MDXComponents } from 'mdx/types'

export function useMDXComponents(): MDXComponents {
  return {}
}
```

### `src/app/globals.css`

```css
/* src/app/globals.css */
@import "tailwindcss";
@plugin "@tailwindcss/typography";

:root {
  --background: #ffffff;
  --foreground: #171717;
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}
```

---

## 六、文章讀取工具函式 `src/lib/posts.ts`

```ts
// src/lib/posts.ts
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDir = path.join(process.cwd(), 'src/content/posts')
const draftsDir = path.join(process.cwd(), 'src/content/drafts')

interface Frontmatter {
  title?: string
  date?: string
  description?: string
  tags?: string[]
}

export interface DraftMeta extends Frontmatter {
  date: string
  slug: string
}

export interface PostMeta extends Frontmatter {
  slug: string
}

export function getDraft(date: string, slug: string) {
  const filePath = path.join(draftsDir, date, `${slug}.md`)
  const raw = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(raw)
  if (data.date) data.date = String(data.date).split('T')[0]
  return { data, content }
}

export function getAllPosts(): PostMeta[] {
  const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'))
  return files.map(file => {
    const slug = file.replace(/\.md$/, '')
    const { data } = matter(fs.readFileSync(path.join(postsDir, file), 'utf8'))
    return { slug, ...(data as Frontmatter) }
  })
}

export function getAllDrafts(): DraftMeta[] {
  const results: DraftMeta[] = []
  const dateFolders = fs.readdirSync(draftsDir)
  for (const date of dateFolders) {
    const dateDir = path.join(draftsDir, date)
    if (!fs.statSync(dateDir).isDirectory()) continue
    const files = fs.readdirSync(dateDir).filter(f => f.endsWith('.md'))
    for (const file of files) {
      const slug = file.replace(/\.md$/, '')
      const { data } = matter(fs.readFileSync(path.join(dateDir, file), 'utf8'))
      results.push({ ...(data as Frontmatter), date: String(date), slug })
    }
  }
  return results
}
```

提供三個函式：

| 函式 | 說明 |
|------|------|
| `getAllDrafts()` | 掃描 `drafts/**/*.md`，回傳所有草稿 meta |
| `getAllPosts()` | 掃描 `posts/*.md`，回傳所有正式文章 meta |
| `getDraft(date, slug)` | 讀取單篇草稿的 frontmatter + 內文 |

---

## 七、頁面架構

### Layout（`src/app/layout.tsx`）

- 全站 `<header>` 導覽列：左側品牌名「Jing's Blog」，右側「學習日誌」連結
- 使用 Geist Sans / Geist Mono（Google Font）
- metadata：`title: "Jing's Tech Blog"`、`lang="zh-TW"`

### 首頁（`src/app/page.tsx`）

- Hero 區：自我介紹 + GitHub 連結
- 最新學習日誌：顯示最新 5 篇草稿（title、description、date），可點擊進入文章

### 學習日誌列表（`src/app/drafts/page.tsx`）

- 路由：`/drafts`
- 列出所有草稿，以卡片樣式呈現 date、title、description、tags

### 草稿文章頁（`src/app/drafts/[date]/[slug]/page.tsx`）

- 路由：`/drafts/[date]/[slug]`（例：`/drafts/2026-4-13/nextjs-project-setup`）
- `generateStaticParams()` 預先產生所有靜態路徑，`dynamicParams = false`
- 使用 `react-markdown` + `rehype-highlight` 渲染 Markdown 內文
- 套用 `prose prose-zinc dark:prose-invert` Tailwind typography 樣式
- 程式碼高亮主題：`highlight.js/styles/github-dark.css`

---

## 八、目前進度（2026-04-13）

- [x] Next.js 16 + TypeScript + Tailwind CSS v4 專案建立
- [x] 部署至 Vercel
- [x] `daily-learning-log` 以 git submodule 掛入 `src/content`
- [x] MDX / Markdown 渲染流程完整建立
- [x] 首頁、日誌列表頁、文章詳細頁完成
- [x] 程式碼語法高亮（github-dark 主題）
- [x] Dark mode 支援
- [ ] 正式文章（`posts/`）頁面尚未建立
- [ ] SEO / Open Graph / sitemap 尚未設定
- [ ] 搜尋功能尚未建立
