---
title: Next.js 用 Link 元件做客戶端導航
date: 2026-04-16
description: 用 <Link> 取代 <a> 避免整頁重整，搭配 usePathname 實作 active link 高亮。
tags: [Next.js, React, 導航, routing]
---

傳統用 `<a>` 標籤切換頁面會觸發整頁重新整理（full page refresh），Next.js 提供 `<Link>` 元件解決這個問題。

## 問題：切換路由時整頁重整

sidebar 用 `<a href="...">` 連結，每次點擊都會重新載入整個 HTML，體驗像多頁應用（MPA），而不是 SPA。

## 解法：`next/link` 的 `<Link>` 元件

用 `<Link href="...">` 取代 `<a href="...">` 即可啟用客戶端導航（client-side navigation）。Next.js 會自動：

- **code splitting**：依路由切割 bundle，單一頁面錯誤不影響其他頁
- **prefetching**：當 `<Link>` 進入 viewport，背景預先載入目標路由的程式碼，點擊後幾乎即時切換

## 實際範例

```tsx
// app/ui/dashboard/nav-links.tsx
import Link from 'next/link';

export default function NavLinks() {
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
```

---

## 問題：無法判斷當前所在路由

純 `<Link>` 不知道目前 URL，無法自動高亮 active 狀態。

## 解法：`usePathname` + `clsx` 條件樣式

`usePathname()` 是 React hook，須在 Client Component 中使用，所以要在檔案頂部加 `'use client'`。搭配 `clsx` 做條件 class 注入。

## 實際範例

```tsx
// app/ui/dashboard/nav-links.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-sky-100 text-blue-600': pathname === link.href,
              },
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
```

## 重點整理

| 主題 | 核心機制 |
|---|---|
| `<Link>` | 取代 `<a>`，啟用 client-side navigation，消除整頁重整 |
| prefetching | `<Link>` 進入 viewport 時自動預載目標路由 bundle |
| `usePathname` | 讀取當前路徑，需加 `'use client'` |
| `clsx` | 依 `pathname === link.href` 條件注入 active 樣式 |
