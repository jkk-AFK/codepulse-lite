# GitHub Pages 快速部署脚本 (PowerShell)
# 使用方法: .\deploy-gh-pages.ps1 "提交信息"

param(
    [string]$CommitMessage = "chore: update for GitHub Pages deployment"
)

Write-Host "🚀 开始部署到 GitHub Pages..." -ForegroundColor Cyan

# 检查是否有未提交的更改
$status = git status --porcelain
if ($status) {
    Write-Host "📝 检测到未提交的更改，正在提交..." -ForegroundColor Yellow
    git add .
    git commit -m $CommitMessage
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ 提交失败" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✅ 工作目录干净，无需提交" -ForegroundColor Green
}

# 推送到远程仓库
Write-Host "📤 推送代码到 GitHub..." -ForegroundColor Cyan
git push origin main

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ 推送失败" -ForegroundColor Red
    exit 1
}

Write-Host "✅ 部署已触发！" -ForegroundColor Green
Write-Host ""

# 获取仓库信息
$remoteUrl = git remote get-url origin
if ($remoteUrl -match "github\.com[:/](.+)/(.+)\.git") {
    $username = $Matches[1]
    $reponame = $Matches[2]
    
    Write-Host "📊 查看部署进度:" -ForegroundColor Cyan
    Write-Host "   https://github.com/$username/$reponame/actions" -ForegroundColor White
    Write-Host ""
    Write-Host "🌐 部署完成后访问:" -ForegroundColor Cyan
    Write-Host "   https://$username.github.io/$reponame/" -ForegroundColor White
    Write-Host ""
}

Write-Host "⏱️  预计等待时间: 2-5 分钟" -ForegroundColor Yellow
