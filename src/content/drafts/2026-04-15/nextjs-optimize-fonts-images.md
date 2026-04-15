---
title: Next.js 字型與圖片優化
date: 2026-04-15
description: 介紹 next/font 與 next/image 的核心機制，說明為何它們能消除 CLS、減少額外 network request，以及如何在實際專案中套用。
tags: [Next.js, 效能優化, 字型, 圖片]
---

自訂字型與英雄圖片是首頁常見的設計元素，但若處理不當，兩者都會傷害效能與使用者體驗。Next.js 分別透過 `next/font` 與 `next/image` 解決這個問題。

## 字型優化：next/font

### 問題：Cumulative Layout Shift（CLS）

瀏覽器在自訂字型載入前，會先用 fallback / system font 渲染文字；字型載入後再替換，導致文字大小、間距或版面位移。這個指標稱為 **Cumulative Layout Shift**，是 Google 評估網站效能的核心指標之一。

### 解法：Build time 下載

`next/font` 在 **build time** 下載字型檔，並與其他靜態資源一起部署。使用者造訪時不需要額外的 network request，CLS 問題從根本消除。

### 建立 fonts.ts

```ts
// app/ui/fonts.ts
import { Inter, Lusitana } from 'next/font/google';

export const inter = Inter({ subsets: ['latin'] });

export const lusitana = Lusitana({
  weight: ['400', '700'],
  subsets: ['latin'],
});
```

### 套用到全域 layout

```tsx
// app/layout.tsx
import { inter } from '@/app/ui/fonts';

<body className={`${inter.className} antialiased`}>{children}</body>
```

`antialiased` 是 Tailwind 提供的工具類別，讓字型邊緣更平滑；非必要，但建議加上。

主字型（Inter）放在 `<body>`，全站生效；次字型（Lusitana）則直接加在特定元件的 `className`：

```tsx
// app/ui/acme-logo.tsx
<p className={`${lusitana.className} text-xl ...`}>...</p>
```

---

## 圖片優化：next/image

### 問題：原生 `<img>` 的缺口

使用原生 `<img>` 需要手動處理以下四件事：

1. RWD 響應式尺寸
2. 依裝置指定不同圖片大小
3. 防止 layout shift
4. viewport 外的圖片 lazy load

### 解法：`<Image>` 元件

`next/image` 的 `<Image>` 元件自動處理上述所有問題：

- **防止 layout shift**：載入前保留空間
- **自動縮圖**：避免對小螢幕傳送過大圖片
- **預設 lazy load**：進入 viewport 才載入
- **現代格式**：在支援的瀏覽器中輸出 WebP / AVIF

### 桌面與手機不同圖片

```tsx
// app/ui/hero.tsx
import Image from 'next/image';

<Image
  src="/hero-desktop.png"
  width={1000}
  height={760}
  className="hidden md:block"
  alt="desktop version"
/>
<Image
  src="/hero-mobile.png"
  width={560}
  height={620}
  className="block md:hidden"
  alt="mobile version"
/>
```

`width` / `height` 代表**原始圖片的長寬比**，而非最終渲染尺寸。Next.js 用這組數值計算比例、保留空間，實際顯示大小由 CSS 決定。

用 Tailwind 的 `hidden md:block` / `block md:hidden` 控制在哪種螢幕顯示哪張圖。

---

## 重點整理

| 主題 | 核心機制 |
|---|---|
| `next/font` | Build time 下載，zero runtime request，消除 CLS |
| `next/image` | 自動 lazy load、resize、WebP/AVIF、防 layout shift |
