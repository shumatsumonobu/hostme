#!/usr/bin/env bash
# =================================================================
# deploy.sh — Windowsから一発でCloudflare Workersにデプロイするスクリプト
#
# 背景:
#   opennextjs-cloudflareはWSL（Linux）環境でのビルドが必要だが、
#   開発はWindows環境で行っている。node_modulesのネイティブバイナリが
#   Windows/Linux間で互換性がないため、以下の手順を自動化する:
#
#   1. WSL内でLinux用node_modulesをクリーンインストール
#   2. WSL内でビルド＋Cloudflareにデプロイ
#   3. WSL内のnode_modulesを削除（Windows側と混在させない）
#   4. Windows用node_modulesを再インストール（ローカル開発に復帰）
#
# 使い方:
#   npm run cf:deploy
#
# 前提:
#   - WSL（Ubuntu）がインストール済み
#   - WSL内にNode.js/npmが利用可能（nvm経由OK）
#   - dev serverは事前に停止すること（node_modulesを削除するため）
# =================================================================
set -e

# スクリプトの場所からプロジェクトルートを自動取得（環境依存しない）
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
WIN_PROJECT="$(cd "$SCRIPT_DIR/.." && pwd -W 2>/dev/null || pwd)"
# MSYS pwd は /c/Users/... 形式なので、pwd -W で C:/Users/... に変換してから wslpath へ渡す
PROJECT=$(wsl.exe -e bash -c "wslpath '${WIN_PROJECT}'" | tr -d '\r')

echo ""
echo "=========================================="
echo "  hostme — Cloudflare Workers デプロイ"
echo "=========================================="
echo ""
echo "⚠  dev server が起動中の場合は先に停止してください"
echo ""

# WSLで一括実行（セッション1回で完結させて高速化）
echo ">>> WSL: クリーンインストール → ビルド → デプロイ → クリーンアップ"
wsl.exe -e bash -ic "
  cd $PROJECT &&
  rm -rf node_modules package-lock.json &&
  npm install &&
  npx opennextjs-cloudflare build &&
  npx opennextjs-cloudflare deploy &&
  rm -rf node_modules package-lock.json
"

# Windows用node_modulesを復帰（ローカル開発に戻れるようにする）
echo ""
echo ">>> Windows: node_modules 復帰"
rm -rf .next
npm install
if [ ! -f "node_modules/@next/swc-win32-x64-msvc/next-swc.win32-x64-msvc.node" ]; then
  echo "⚠  SWC binary missing after install. Run 'npm install' manually."
fi

echo ""
echo "=========================================="
echo "  デプロイ完了！"
echo "=========================================="
