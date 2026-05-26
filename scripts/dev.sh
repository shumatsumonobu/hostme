#!/usr/bin/env bash
# =================================================================
# dev.sh — 開発サーバー起動スクリプト（自動判定付き）
#
# node_modules が存在しない、package.json が更新されている、
# またはSWCバイナリが壊れている場合は自動でクリーンインストール
# してから起動する。通常時は即 next dev を起動（追加コストなし）。
#
# 使い方:
#   npm run dev
# =================================================================
set -e

SWC_BIN="node_modules/@next/swc-win32-x64-msvc/next-swc.win32-x64-msvc.node"
if [ ! -d "node_modules" ] || [ "package.json" -nt "node_modules" ] || [ ! -f "$SWC_BIN" ]; then
  echo ">>> node_modules を再インストール中..."
  npx -y rimraf node_modules .next
  npm install
fi

npx next dev
