---
title: 用 clsx 整理條件式 className
date: 2026-04-15
description: 說明為何純字串拼接難以維護，以及如何用 clsx 讓條件式樣式更簡潔易讀。
tags: [Next.js, clsx, Tailwind CSS, React]
---

條件式樣式在 React 開發中很常見，但字串拼接的寫法容易出錯也難以閱讀。`clsx` 提供了更清晰的解法。

## 問題：條件式 className 的混亂

當元件需要根據狀態套用不同樣式時，最直覺的寫法是拼接字串：

```tsx
className={'inline-flex rounded-full ' + (status === 'paid' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-500')}
```

隨著條件增加，這類寫法會變得難以維護，也容易在空格處出錯。

## 解法：clsx

[`clsx`](https://github.com/lukeed/clsx) 是一個輕量函式庫，讓你用物件語法來切換 class name——key 是 class 字串，value 是條件，值為 `true` 時該 class 才會被加入。

安裝：

```bash
npm install clsx
```

## 實際範例

以 `InvoiceStatus` 元件為例：狀態為 `'paid'` 時顯示綠色，`'pending'` 時顯示灰色。

```tsx
// app/ui/invoices/status.tsx
import clsx from 'clsx';

export default function InvoiceStatus({ status }: { status: string }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2 py-1 text-sm',
        {
          'bg-gray-100 text-gray-500': status === 'pending',
          'bg-green-500 text-white': status === 'paid',
        },
      )}
    >
      {/* ... */}
    </span>
  );
}
```

第一個參數放永遠套用的基礎樣式，第二個參數的物件則根據條件動態切換。

## 一句話總結

| 主題 | 核心機制 |
|---|---|
| `clsx` | 物件語法切換 class，條件式樣式更易讀、不易出錯 |
