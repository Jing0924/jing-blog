---
title: 用 curl 列出 Gemini 可用模型
date: 2026-04-19
description: 透過 Generative Language API 的 models 端點，列出支援 generateContent 的模型名稱。
tags: [Gemini, GoogleGenerativeAI, curl, jq]
---

選模型或除錯時，需要先確認 API 回傳哪些模型 ID，才能對應到文件或 SDK 的 `model` 參數。

## 問題：如何快速列出帳號可用的 Gemini 模型

手動翻文件容易漏掉 preview 或地區差異；若要在本機一鍵對照「實際可呼叫」的模型清單，需要直接打 API。

## 解法：呼叫 Generative Language API 的 `models` 端點並用 `jq` 篩選

對 `v1beta/models` 發 GET 請求，用 `jq` 只保留 `supportedGenerationMethods` 含 `generateContent` 的項目，輸出 `.name`（即 `models/...` 形式的模型 ID）。

## 實際範例

```bash
# scripts/list-gemini-models.sh
set -a && source .env.local && set +a
curl -sS "https://generativelanguage.googleapis.com/v1beta/models?key=${GOOGLE_GENERATIVE_AI_API_KEY}" \
  | jq -r '.models[]? | select(.supportedGenerationMethods[]? == "generateContent") | .name'
```

下列為某次執行時的完整輸出（僅作備份；實際清單會隨產品更新而變動）：

```text
models/gemini-2.5-flash
models/gemini-2.5-pro
models/gemini-2.0-flash
models/gemini-2.0-flash-001
models/gemini-2.0-flash-lite-001
models/gemini-2.0-flash-lite
models/gemini-2.5-flash-preview-tts
models/gemini-2.5-pro-preview-tts
models/gemma-3-1b-it
models/gemma-3-4b-it
models/gemma-3-12b-it
models/gemma-3-27b-it
models/gemma-3n-e4b-it
models/gemma-3n-e2b-it
models/gemma-4-26b-a4b-it
models/gemma-4-31b-it
models/gemini-flash-latest
models/gemini-flash-lite-latest
models/gemini-pro-latest
models/gemini-2.5-flash-lite
models/gemini-2.5-flash-image
models/gemini-3-pro-preview
models/gemini-3-flash-preview
models/gemini-3.1-pro-preview
models/gemini-3.1-pro-preview-customtools
models/gemini-3.1-flash-lite-preview
models/gemini-3-pro-image-preview
models/nano-banana-pro-preview
models/gemini-3.1-flash-image-preview
models/lyria-3-clip-preview
models/lyria-3-pro-preview
models/gemini-3.1-flash-tts-preview
models/gemini-robotics-er-1.5-preview
models/gemini-robotics-er-1.6-preview
models/gemini-2.5-computer-use-preview-10-2025
models/deep-research-pro-preview-12-2025
```

## 一句話總結

| 主題 | 核心機制 |
|---|---|
| `GOOGLE_GENERATIVE_AI_API_KEY` | 從 `.env.local` 載入後帶在 `key` query 參數 |
| `jq` 篩選 | 只列出支援 `generateContent` 的 `models/...` 名稱 |
