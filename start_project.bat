@echo off
setlocal
echo ===================================================
echo   Starting WaterLens Smart Agriculture Platform
echo ===================================================

set "ROOT_DIR=%~dp0"

echo [1/2] Starting Backend (FastAPI on Port 8000)...
cd /d "%ROOT_DIR%backend"
start "WaterLens Backend (FastAPI)" cmd /k "python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000"

echo [2/2] Starting Frontend (Vite on Port 5173)...
cd /d "%ROOT_DIR%frontend"
start "WaterLens Frontend (Vite)" cmd /k "npm run dev -- --host"

echo.
echo ===================================================
echo   WaterLens is booting up!
echo   Desktop & Mobile Web:  http://localhost:5173
echo   Backend Swagger Docs:  http://localhost:8000/docs
echo ===================================================
echo.
pause
