@echo off
echo Starting Expense Tracker App...
echo.

cd /d "C:\Users\KRIMA VADODARIYA\Downloads\expenss_tracker"

echo Cleaning project...
C:\flutter\bin\flutter clean

echo Getting dependencies...
C:\flutter\bin\flutter pub get

echo Running app in Chrome...
C:\flutter\bin\flutter run -d chrome

pause