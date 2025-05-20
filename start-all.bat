@echo off
REM ─────────────── Backend Node.js ───────────────
start cmd /k "cd server && npm start"

REM ─────────────── Frontend React ────────────────
start cmd /k "cd client && npm run dev"

REM ──────── Aspect Service Python (FastAPI) ────────
start cmd /k "cd aspect_service && venv\Scripts\activate.bat && uvicorn main:app --host 0.0.0.0 --port 8001"
