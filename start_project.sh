#!/usr/bin/env bash
# WaterLens Startup Script for macOS & Linux

echo "==================================================="
echo "  Starting WaterLens Smart Agriculture Platform"
echo "==================================================="

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Function to cleanup background processes on exit
cleanup() {
    echo ""
    echo "Stopping WaterLens services..."
    kill $(jobs -p) 2>/dev/null
    exit
}
trap cleanup SIGINT SIGTERM

echo "[1/2] Starting Backend (FastAPI on Port 8000)..."
cd "$SCRIPT_DIR/backend"
python3 -m uvicorn main:app --reload --host 0.0.0.0 --port 8000 &

echo "[2/2] Starting Frontend (Vite on Port 5173)..."
cd "$SCRIPT_DIR/frontend"
npm run dev -- --host &

echo ""
echo "==================================================="
echo "  WaterLens is running!"
echo "  Desktop & Mobile Web:  http://localhost:5173"
echo "  Backend Swagger Docs:  http://localhost:8000/docs"
echo "==================================================="
echo "Press Ctrl+C to stop all servers."
echo ""

wait
