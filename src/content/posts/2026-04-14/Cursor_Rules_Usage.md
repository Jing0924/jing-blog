---
title: 使用 .cursor/rules/ 為 AI 建立持久規範
date: 2026-04-14
description: 介紹如何透過 .cursor/rules/ 資料夾建立 .mdc 規則檔，讓 Cursor AI 在每次對話中自動套用專案慣例與程式碼規範。
tags: [Cursor, AI, 工具]
---

Cursor 提供 `.cursor/rules/` 資料夾，讓你以 `.mdc` 檔案的形式預先定義規則，AI 在對話時會自動參考這些規則，不需要每次重複說明專案慣例。

## 檔案格式

規則檔採用 Markdown 加上 YAML frontmatter：

```
.cursor/rules/
  typescript-standards.mdc
  react-patterns.mdc
  commit-rules.mdc
```

每個 `.mdc` 檔的結構如下：

```markdown
---
description: 這條規則的用途說明
globs: **/*.ts
alwaysApply: false
---

# 規則標題

規則內容...
```

## Frontmatter 欄位

| 欄位 | 類型 | 說明 |
|------|------|------|
| `description` | string | 規則的簡短說明，顯示於規則選單 |
| `globs` | string | 檔案 glob pattern，符合時自動套用 |
| `alwaysApply` | boolean | `true` 表示每次對話都套用 |

## 三種套用模式

### 1. 永遠套用

適合全專案通用的規範，例如 commit 格式、命名慣例：

```yaml
---
description: 專案 Commit 訊息規範
alwaysApply: true
---
```

### 2. 依檔案類型套用

開啟符合 glob pattern 的檔案時自動生效：

```yaml
---
description: TypeScript 撰寫慣例
globs: **/*.ts
alwaysApply: false
---
```

### 3. 手動選用

`alwaysApply: false` 且不設 `globs`，需要在對話中手動引入。

## 撰寫要點

- **簡潔**：每條規則盡量控制在 50 行以內，聚焦單一主題
- **可執行**：寫法像清晰的內部文件，明確告訴 AI 該做什麼
- **附範例**：提供正確與錯誤的程式碼範例，避免歧義

## 本部落格現有規則

目前 `.cursor/rules/commit-rules.mdc` 定義了 Conventional Commits 格式，讓 AI 每次產生 commit 訊息時都遵循相同規範，不需要在對話中重複說明。

## 參考資料

- [Cursor Rules Documentation](https://cursor.com/zh-Hant/docs/rules)
