---
title: Next.js 專案設定並部署至Vercel
date: 2026-04-13
description: 學習如何設定集部署 Next.js 專案
tags: [Next.js]
---

（原本的內容繼續往下）

# 建立 Next.js 專案

## 建立指令

```bash
cd /Users/jingliao/Projects/Daily/Jing-Tech-Blog
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

## 此指令自動設定

- TypeScript
- Tailwind CSS
- ESLint
- App Router（新架構）
- `src/` 目錄結構
- `@/*` 路徑別名

## 遇到的問題

**錯誤訊息：**

```
Could not create a project called "Jing-Tech-Blog" because of npm naming restrictions:
  * name can no longer contain capital letters
```

**原因：** npm 套件名稱不允許使用大寫字母

**解法：** 專案名稱改用全小寫，例如 `jing-tech-blog`

---

## 部署至 Vercel

1. 前往 [vercel.com](https://vercel.com) 並登入（可用 GitHub 帳號直接登入）
2. 點擊 **"Add New Project"**
3. 選擇 **Import Git Repository**
4. 選擇你的 GitHub 帳號，找到 `jing-tech-blog` repo，點擊 **Import**
5. 確認專案設定（通常不需要改動）：
   - **Framework Preset**：Vercel 會自動偵測為 Next.js
   - **Build Command**：`next build`（自動填入）
   - **Output Directory**：自動設定
   - 若有環境變數（`.env`），在 **Environment Variables** 區塊新增
6. 點擊 **"Deploy"** — 等待幾分鐘即可完成

部署完成後，Vercel 會提供一個 `xxx.vercel.app` 的網址。
