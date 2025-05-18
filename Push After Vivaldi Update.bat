:: Author: debiedowner

@echo off

REM make current directory work when run as administrator
cd "%~dp0"

set installPath="C:\Program Files\Vivaldi\Application\7.3.3635.14\resources\vivaldi"
echo Searching at: %installPath%
for /f "tokens=*" %%a in ('dir /a:-d /b /s %installPath%') do (
	if "%%~nxa"=="window.html" set latestVersionFolder=%%~dpa
)

if "%latestVersionFolder%"=="" (
	pause & exit
) else (
	echo Found latest version folder: "%latestVersionFolder%"
)

if not exist "%latestVersionFolder%\window.bak.html" (
	echo Creating a backup of your original window.html file.
	copy "%latestVersionFolder%\window.html" "%latestVersionFolder%\window.bak.html"
)

echo copying js files to custom.js
type *.js > "%latestVersionFolder%\custom.js"

echo patching window.html file
type "%latestVersionFolder%\window.bak.html" | findstr /v "</body>" | findstr /v "</html>" > "%latestVersionFolder%\window.html"
echo     ^<script src="custom.js"^>^</script^> >> "%latestVersionFolder%\window.html"
echo   ^</body^> >> "%latestVersionFolder%\window.html"
echo ^</html^> >> "%latestVersionFolder%\window.html"

pause