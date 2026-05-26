#!/usr/bin/env bash
# =================================================================
# preview.sh — Windowsから一発でCloudflare Workersローカルプレビューするスクリプト
#
# deploy.shと同じ仕組みで、デプロイの代わりにローカルプレビューを実行する。
# Cloudflare Workers環境を手元で確認したい時に使う。
#
# 使い方:
#   npm run cf:preview
#
# 詳細はdeploy.shのコメントを参照。
# =================================================================
set -e

# スクリプトの場所からプロジェクトルートを自動取得（環境依存しない）
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
WIN_PROJECT="$(cd "$SCRIPT_DIR/.." && pwd -W 2>/dev/null || pwd)"
# MSYS pwd は /c/Users/... 形式なので、pwd -W で C:/Users/... に変換してから wslpath へ渡す
PROJECT=$(wsl.exe -e bash -c "wslpath '${WIN_PROJECT}'" | tr -d '\r')

echo ""
echo "=========================================="
echo "  hostme — Cloudflare Workers プレビュー"
echo "=========================================="
echo ""
echo "⚠  dev server が起動中の場合は先に停止してください"
echo ""

# WSLで一括実行（セッション1回で完結させて高速化）
echo ">>> WSL: クリーンインストール → ビルド → プレビュー → クリーンアップ"
wsl.exe -e bash -ic "
  cd $PROJECT &&
  rm -rf node_modules package-lock.json &&
  npm install &&
  npx opennextjs-cloudflare build &&
  npx opennextjs-cloudflare preview &&
  rm -rf node_modules package-lock.json
"

# Windows用node_modulesを復帰（ローカル開発に戻れるようにする）
echo ""
echo ">>> Windows: node_modules 復帰"
npm install

echo ""
echo "=========================================="
echo "  プレビュー完了！"
echo "=========================================="
