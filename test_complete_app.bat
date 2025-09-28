@echo off
:: 设置中文显示
chcp 65001 >nul

:: 定义颜色
set "RED=[91m"
set "GREEN=[92m"
set "YELLOW=[93m"
set "RESET=[0m"

:: 显示欢迎信息
cls
echo %GREEN%=====================================%RESET%
echo %GREEN% 概率分布学习统计Web应用测试工具 %RESET%
echo %GREEN%=====================================%RESET%
echo.

:: 检查是否有可用的浏览器
set "browser="
for %%b in (chrome.exe firefox.exe msedge.exe iexplore.exe) do (
    where %%b >nul 2>nul
    if %errorlevel% equ 0 (
        set "browser=%%b"
        goto :browser_found
    )
)

echo %YELLOW%未找到支持的浏览器。请手动打开浏览器访问以下文件：%RESET%
echo %GREEN%c:\Users\fr189\Desktop\FILE\folder1\complete_index.html%RESET%
goto :end

:browser_found
:: 询问用户想如何运行应用
echo %YELLOW%请选择运行方式：%RESET%
echo "1" - 直接打开完整的index.html文件（简化功能）
echo "2" - 启动开发服务器（完整功能）
echo.

get_choice:
set /p choice="请输入选项 [1/2]: "

if "%choice%"=="1" goto :open_file
if "%choice%"=="2" goto :start_server

echo %RED%无效的选项，请重新输入！%RESET%
goto :get_choice

:open_file
:: 直接打开HTML文件
start "" "%browser%" "c:\Users\fr189\Desktop\FILE\folder1\complete_index.html"
echo.
echo %GREEN%已尝试使用 %browser% 打开完整的index.html文件。%RESET%
echo %YELLOW%注意：直接打开HTML文件可能只能使用部分功能，API请求可能无法正常工作。%RESET%
echo %YELLOW%如需完整功能，请选择选项2启动开发服务器。%RESET%
goto :end

:start_server
:: 检查Node.js是否安装
node --version >nul 2>nul
if %errorlevel% neq 0 (
    echo %RED%未检测到Node.js环境！%RESET%
echo %YELLOW%请先安装Node.js，然后再尝试启动开发服务器。%RESET%
goto :end
)

:: 检查并安装依赖
if not exist "node_modules" (
    echo %YELLOW%未发现node_modules目录，正在安装依赖...%RESET%
npm install
    if %errorlevel% neq 0 (
        echo %RED%依赖安装失败！请检查网络连接并手动运行 npm install。%RESET%
goto :end
    )
)

:: 启动开发服务器
start "开发服务器" cmd /k "cd /d c:\Users\fr189\Desktop\FILE\folder1 && npm run dev"
echo.
echo %GREEN%正在启动开发服务器...%RESET%
echo %GREEN%请等待服务器启动完成后，在浏览器中访问：http://localhost:5174/c/%RESET%
echo %YELLOW%服务器启动日志会显示在新打开的命令窗口中。%RESET%

:end
echo.
echo %YELLOW%按任意键退出...%RESET%
pause >nul