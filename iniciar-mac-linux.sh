#!/bin/bash
set -e
cd "$(dirname "$0")"

echo "==============================================="
echo "  IPSOPOL - Dashboard Ejecutivo"
echo "  Iniciando entorno de desarrollo..."
echo "==============================================="
echo

if ! command -v node &> /dev/null; then
    echo "[ERROR] No se encontró Node.js instalado."
    echo "Descárgalo desde: https://nodejs.org/ (versión LTS)"
    exit 1
fi

if [ ! -d "node_modules" ]; then
    echo "Instalando dependencias por primera vez, esto puede tardar unos minutos..."
    npm install
fi

echo
echo "Iniciando servidor de desarrollo..."
echo "Abre manualmente: http://localhost:5173"
echo "Para detener el servidor, presiona Ctrl+C"
echo

# Intenta abrir el navegador automáticamente (macOS / Linux)
( sleep 2 && (open http://localhost:5173 2>/dev/null || xdg-open http://localhost:5173 2>/dev/null) ) &

npm run dev
