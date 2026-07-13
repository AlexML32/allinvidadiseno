@echo off
title ALLINVIDA SALUD
color 0A

echo.
echo  ==========================================
echo        ALLINVIDA SALUD
echo  ==========================================
echo.

echo Limpiando puertos anteriores...
powershell -NoProfile -Command "$p8=(netstat -ano|Select-String ':8000.*LISTENING')-replace '.*\s+(\d+)$','$1'; $p5=(netstat -ano|Select-String ':5173.*LISTENING')-replace '.*\s+(\d+)$','$1'; ($p8+$p5)|ForEach-Object{Stop-Process -Id $_ -Force -EA SilentlyContinue}; Start-Sleep 2"

echo [1/2] Iniciando Backend...
start "ALLINVIDA - Backend" cmd /k "cd /d C:\allinvida\backend && venv\Scripts\uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

echo Esperando Backend (5 segundos)...
timeout /t 5 /nobreak >nul

echo [2/2] Iniciando Frontend...
start "ALLINVIDA - Frontend" cmd /k "cd /d C:\allinvida\frontend && npm run dev"

echo Esperando Frontend (7 segundos)...
timeout /t 7 /nobreak >nul

echo Abriendo navegador...
start "" "http://localhost:5173"

echo.
echo  ==========================================
echo   Listo! La pagina ya esta abierta.
echo   NO cierres las dos ventanas negras.
echo  ==========================================
echo.
pause >nul
