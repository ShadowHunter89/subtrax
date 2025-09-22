# Subtrax Deployment Script
# Run this script to prepare for deployment

Write-Host "🚀 Starting Subtrax Deployment Preparation..." -ForegroundColor Green

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Please run this script from the Subtrax root directory" -ForegroundColor Red
    exit 1
}

Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow

# Install client dependencies
Set-Location client
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Client dependency installation failed" -ForegroundColor Red
    exit 1
}

Write-Host "🔨 Building client for production..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Client build failed" -ForegroundColor Red
    exit 1
}

# Install server dependencies
Set-Location ../server
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Server dependency installation failed" -ForegroundColor Red
    exit 1
}

# Go back to root
Set-Location ..

Write-Host "✅ Deployment preparation completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "🎯 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Push your code to GitHub: git add . && git commit -m 'Ready for deployment' && git push" -ForegroundColor White
Write-Host "2. Connect your repository to Render/Vercel" -ForegroundColor White
Write-Host "3. Set environment variables in your deployment platform" -ForegroundColor White
Write-Host "4. Deploy using the render.yaml configuration" -ForegroundColor White
Write-Host ""
Write-Host "📋 Check DEPLOYMENT_READY_GUIDE.md for detailed instructions" -ForegroundColor Cyan