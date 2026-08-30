@echo off
title IPSOPOL Dashboard - Inicio automatico
cd /d "%~dp0"

echo ===============================================
echo   IPSOPOL - Dashboard Ejecutivo
echo   Iniciando entorno de desarrollo...
echo ===============================================
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] No se encontro Node.js instalado.
    echo Descargalo desde: https://nodejs.org/  ^(version LTS^)
    echo Luego vuelve a ejecutar este archivo.
    pause
    exit /b 1
)

if not exist "node_modules" (
    echo Instalando dependencias por primera vez, esto puede tardar unos minutos...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Fallo la instalacion de dependencias.
        pause
        exit /b 1
    )
)

echo.
echo Iniciando servidor de desarrollo...
echo Se abrira automaticamente en http://localhost:5173
echo Para detener el servidor, cierra esta ventana o presiona Ctrl+C
echo.

start "" http://localhost:5173
call npm run dev

pause
