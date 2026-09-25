@echo off
rem ---------------------------------------------------------------------------
rem  Windows wrapper for make-theme-zip.sh
rem
rem  PowerShell and cmd cannot execute a .sh file directly.
rem  Usage:   .\make-theme-zip.cmd
rem ---------------------------------------------------------------------------
setlocal

set "SCRIPT=%~dp0make-theme-zip.sh"

if not exist "%SCRIPT%" (
  echo ERROR: cannot find make-theme-zip.sh next to this wrapper.
  exit /b 1
)

set "BASH="

for %%P in (
  "%ProgramFiles%\Git\bin\bash.exe"
  "%ProgramFiles%\Git\usr\bin\bash.exe"
  "%LOCALAPPDATA%\Programs\Git\bin\bash.exe"
) do (
  if not defined BASH if exist %%P set "BASH=%%~P"
)

if not defined BASH (
  where bash >nul 2>&1
  if not errorlevel 1 set "BASH=bash"
)

if not defined BASH (
  echo ERROR: Could not find bash.exe.
  echo Install Git for Windows from https://git-scm.com/download/win
  exit /b 1
)

"%BASH%" "%SCRIPT%" %*

endlocal
