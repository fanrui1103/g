fruit = 'I am the one,Morpheus'
n = 0
for i in fruit:
    print(n, i)
    n = n + 1
print('finished'）@echo off
cd /d "%~dp0"

:: Check if the dist directory exists
if not exist "dist" (
    echo Error: The 'dist' directory does not exist.
    echo You need to build the project first before previewing.
    echo.
    echo Please run build-project.bat first, then try previewing again.
    pause
    exit /b 1
)

echo Previewing the built project...
"C:\Program Files\nodejs\node.exe" "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js" run preview
echo.
echo To stop the preview server, press Ctrl+C
pause