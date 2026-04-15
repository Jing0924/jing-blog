---
title: Next.js Layouts 與 Pages 機制
date: 2026-04-15
description: 說明 Next.js 的檔案系統路由、layout 共用 UI、Partial Rendering 與 Root Layout 的運作方式。
tags: [Next.js, 路由, Layout]
---

Next.js 用資料夾結構定義路由，並以 `layout.tsx` 跨頁共享 UI，兩者搭配能有效減少重複程式碼與不必要的重繪。

## 問題：路由要怎麼定義？

傳統框架通常需要另外設定路由表，Next.js 改用**檔案系統路由**：資料夾對應 URL 路徑段（route segment），但必須在資料夾內放 `page.tsx` 才能讓該路由可被存取。

## 解法：File-System Routing

```text
/app
├── dashboard/
│   ├── page.tsx          ← 公開路由 /dashboard
│   ├── customers/
│   │   └── page.tsx      ← /dashboard/customers
│   └── invoices/
│       └── page.tsx      ← /dashboard/invoices
├── ui/                   ← 不對外，可共置
└── lib/                  ← 不對外，可共置
```

Next.js 的特殊命名規範讓你可以把 UI 元件、測試檔等放在同一資料夾內（共置，Colocation），**只有 `page.tsx` 的內容會對外公開**。

---

## 問題：多頁面共用的 UI 要重複寫嗎？

側欄導覽、頁首等跨頁元素若放在每個 `page.tsx`，修改時需要逐一更新。

## 解法：layout.tsx 共用 UI

使用 `layout.tsx` 建立跨頁面共享的 UI，`children` 會接收巢狀的 page 或另一個 layout：

```tsx
// app/dashboard/layout.tsx
import SideNav from '@/app/ui/dashboard/sidenav';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}
```

Dashboard 下的所有 page 會自動被包在這個 `<Layout />` 內。

## 實際範例

Root Layout 是每個 Next.js 專案必須存在的根 layout，加入此處的 UI 會套用至所有頁面：

```tsx
// app/layout.tsx
import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
```

導頁時，**只有 page 元件會重新渲染，layout 不會重新渲染**（部分渲染，Partial Rendering）。好處是保留 layout 內的 client-side React state，效能更佳。

---

## 重點整理

| 概念 | 說明 |
|---|---|
| `page.tsx` | 讓路由可被存取，必要檔案 |
| `layout.tsx` | 跨頁面共享 UI，支援巢狀 |
| Root Layout | 全域套用，每個專案必須有 |
| Partial Rendering | 導頁時 layout 不重新渲染，只更新 page |
| Colocation | 非 `page.tsx` 的檔案不對外公開 |
