---
title: 在 Vercel 建立 Postgres 資料庫並植入初始資料
date: 2026-04-16
description: 從 GitHub 部署到建立 Vercel Postgres、設定環境變數、seed 資料庫的完整流程。
tags: [Vercel, PostgreSQL, Next.js, 資料庫]
---

用 Vercel 部署 Next.js 專案時，可以直接從 Dashboard 建立 Postgres 資料庫並連結，省去自架 DB 的麻煩。

---

## 問題：本地開發沒有資料，不知道如何快速建立資料庫

從教學範本起步的專案通常沒有真實資料，需要一個能快速連上雲端 DB、塞入初始資料的方式。

## 解法：Vercel Postgres + seed script

1. 將專案推上 GitHub，接著在 [vercel.com/signup](https://vercel.com/signup) 建立帳號（選免費 hobby plan），用 **Continue with GitHub** 連結帳號。
2. 從 Vercel Dashboard Import 該 GitHub repo，點 **Deploy**。
3. 部署後進 Dashboard → **Storage** → **Create Database**，選 Neon 或 Supabase（依帳號建立時間而定）。
4. 建議選 **iad1（Washington D.C.）** region，與預設 Vercel 部署區域相同，降低延遲。
5. 建完後到 `.env.local` tab，點 **Show secret** → **Copy Snippet**，貼到本地 `.env` 檔案。

> 確保 `.gitignore` 已包含 `.env`，避免 secrets 被推上 GitHub。

---

## 實際範例

```bash
# 重命名範本環境變數檔
mv .env.example .env
```

```sql
-- app/query/route.ts 內的驗證查詢
SELECT invoices.amount, customers.name
FROM invoices
JOIN customers ON invoices.customer_id = customers.id
WHERE invoices.amount = 666;
```

seed 資料庫：啟動 dev server 後直接瀏覽器訪問 `localhost:3000/seed`，出現 `"Database seeded successfully"` 即完成。

---

## 常見問題排除

- **環境變數複製前記得點 Show secret**，否則會複製到遮罩值。
- `bcrypt` 在某些環境不相容時，可改用 `bcryptjs`。
- 需要重新 seed 時，先用下列指令刪除現有 table（僅限開發環境）：

```sql
DROP TABLE tablename;
```

---

## 重點整理

| 步驟 | 操作 |
|---|---|
| 部署 | GitHub repo → Vercel Import → Deploy |
| 建立 DB | Dashboard → Storage → Create Database |
| 連結 DB | 複製 `.env.local` secrets → 貼到本地 `.env` |
| Seed 資料 | 訪問 `localhost:3000/seed` |
| 驗證 | 訪問 `localhost:3000/query` 確認查詢回傳結果 |
