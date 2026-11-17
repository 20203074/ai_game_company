@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"
title ANTI-GRAVITY AI: INFINITE GAME STUDIO ENGINE
echo ==============================================================================
echo    ANTI-GRAVITY AI: INFINITE GAME STUDIO SIMULATION ENGINE
echo ==============================================================================
echo [*] Starting AI Company Simulation Engine...

set "PY_CMD="

python --version >nul 2>&1
if !errorlevel! equ 0 set "PY_CMD=python"

if not defined PY_CMD (
    py --version >nul 2>&1
    if !errorlevel! equ 0 set "PY_CMD=py"
)

if not defined PY_CMD (
    if exist "%LocalAppData%\Programs\Python\Python311\python.exe" (
        set "PY_CMD=%LocalAppData%\Programs\Python\Python311\python.exe"
    )
)

if defined PY_CMD (
    echo [*] Python runtime detected: !PY_CMD!
    echo [*] Launching Dual Runtime Server and Web UI...
    !PY_CMD! -u server.py
) else (
    echo [!] Python not found. Launching standalone Browser UI...
    start "" "index.html"
)

if !errorlevel! neq 0 (
    echo [!] Server exited. Opening standalone GUI directly...
    start "" "index.html"
)
pause