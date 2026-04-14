---
title: 用 Vercel Deploy Hook 自動同步 Submodule 內容
date: 2026-4-13
tags: [vercel, github-actions, submodule, ci]
---

## 問題背景

當部落格的內容（`src/content`）以 Git Submodule 管理時，每次新增筆記需要：

1. 在 content repo commit
2. 回到主 repo 更新 submodule 指針並再次 commit

兩次 commit 非常繁瑣。

## 解法：Vercel Deploy Hook + GitHub Actions

讓 content repo 每次 push 時，自動通知 Vercel 重新 build，主 repo 完全不需要手動更新。

## 步驟一：在 Vercel 建立 Deploy Hook

1. 進入 Vercel Dashboard → 選擇部落格專案
2. **Settings** → **Git** → 往下找 **Deploy Hooks**
3. 填入名稱（例如 `content-updated`）、branch（`main`）
4. 點 **Create Hook**，複製產生的 URL

URL 格式如下：

```
https://api.vercel.com/v1/integrations/deploy/prj_xxxx/yyyyyy
```

## 步驟二：在 content repo 加 GitHub Action

在 `daily-learning-log` repo 建立 `.github/workflows/trigger-vercel.yml`：

```yaml
name: Trigger Vercel Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Vercel rebuild
        run: curl -X POST "${{ secrets.VERCEL_DEPLOY_HOOK_URL }}"
```

## 步驟三：在 GitHub 設定 Secret

1. 進入 `daily-learning-log` repo 的 **Settings**
2. **Secrets and variables** → **Actions** → **New repository secret**
3. Name：`VERCEL_DEPLOY_HOOK_URL`
4. Value：貼上步驟一複製的 URL

## 步驟四：確認 Vercel 能正確 checkout Submodule

在 Vercel 專案的 **Settings** → **Build & Development Settings** → **Build Command** 改為：

```bash
git submodule update --init --recursive && next build
```

## 結果

之後只需要在 `daily-learning-log` commit + push，Vercel 就會自動重新 build 部落格，主 repo 完全不需要動。

```
content repo push
    ↓
GitHub Action 觸發
    ↓
Vercel 重新 build（含最新 submodule 內容）
    ↓
部落格自動更新
```
