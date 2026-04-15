---
title: Next.js 專案設定並部署至Vercel
date: 2026-04-13
description: 學習如何設定並部署 Next.js 專案至 Vercel，包含常見的 npm 命名限制踩坑。
tags: [Next.js]
---

用 `create-next-app` 建立專案並部署至 Vercel，過程遇到 npm 命名限制。

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

```text
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

## 重點整理

| 步驟 | 核心機制 |
|---|---|
| `create-next-app` | 一行指令建立含 TS、Tailwind、App Router 的專案 |
| npm 命名限制 | 套件名稱不允許大寫，需全小寫加 `-` |
| Vercel 部署 | 連結 GitHub repo，自動偵測 Next.js 並部署 |
