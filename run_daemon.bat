@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"
title ANTI-GRAVITY AI: INFINITE GAME STUDIO - HEADLESS DAEMON
echo ==============================================================================
echo   ANTI-GRAVITY AI: INFINITE GAME STUDIO - HEADLESS DAEMON MODE
echo   Low-Power Background Engine: Canvas Suspended, Task Queue & Dual Clock Active
echo ==============================================================================

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
    !PY_CMD! -u engine.py
) else (
    echo [!] Python not found.
)
pause