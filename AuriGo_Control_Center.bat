@echo off
title AuriGo Control Center
echo ===================================================
echo           AuriGo - Centro de Operaciones
echo ===================================================
echo Iniciando interfaz grafica de control...
cd /d "%~dp0"
python scripts\control_center.py
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] No se pudo iniciar el Control Center.
    echo Asegurate de tener Python instalado y ejecuta: pip install customtkinter requests
    pause
)
