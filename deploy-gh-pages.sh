#!/bin/bash

# GitHub Pages 快速部署脚本
# 使用方法: ./deploy-gh-pages.sh "提交信息"

set -e

echo "🚀 开始部署到 GitHub Pages..."

# 检查是否有未提交的更改
if [[ -n $(git status -s) ]]; then
    echo "📝 检测到未提交的更改，正在提交..."
    git add .
    
    # 使用提供的提交信息或默认信息
    COMMIT_MSG="${1:-chore: update for GitHub Pages deployment}"
    git commit -m "$COMMIT_MSG"
else
    echo "✅ 工作目录干净，无需提交"
fi

# 推送到远程仓库
echo "📤 推送代码到 GitHub..."
git push origin main

echo "✅ 部署已触发！"
echo ""
echo "📊 查看部署进度:"
echo "   https://github.com/$(git remote get-url origin | sed 's/.*github.com[:/]\(.*\)\.git/\1/')/actions"
echo ""
echo "🌐 部署完成后访问:"
echo "   https://$(git remote get-url origin | sed 's/.*github.com[:/]\(.*\)\/.*/\1/').github.io/$(git remote get-url origin | sed 's/.*\/\(.*\)\.git/\1/')/"
echo ""
echo "⏱️  预计等待时间: 2-5 分钟"
