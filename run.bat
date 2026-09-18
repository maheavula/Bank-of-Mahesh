@echo off
echo ====================================================
echo   Bank of AMR — Initializing & Starting Server
echo ====================================================
call npm run install:all
call npm run build
call npm run dev
pause
