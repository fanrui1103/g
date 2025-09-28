@echo off
REM 测试部署脚本 - 用于在部署到GitHub Pages前验证构建是否正常

REM 清理旧的构建文件
if exist dist rmdir /s /q dist

REM 安装依赖
npm install

REM 安装gh-pages（如果尚未安装）
npm install gh-pages --save-dev

REM 构建应用
npm run build

REM 检查构建是否成功
if exist dist (
  echo 构建成功！您可以通过npm run preview预览构建结果，或通过npm run deploy部署到GitHub Pages
  echo 预览命令: npm run preview
  echo 部署命令: npm run deploy
  echo.
  echo 重要提示:
  echo 1. 请确保vite.config.ts中的base配置与您的GitHub仓库名称一致
  echo 2. 部署到GitHub Pages后，API代理功能将不可用
  echo 3. 详细部署步骤请查看GITHUB_PAGES_DEPLOY_GUIDE.md文件
) else (
  echo 构建失败！请检查错误信息并修复问题后重试
)

pause