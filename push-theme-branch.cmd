@echo off
rem ---------------------------------------------------------------------------
rem  Windows wrapper for push-theme-branch.sh
rem
rem  PowerShell and cmd cannot execute a .sh file directly — running
rem  ".\push-theme-branch.sh" there does nothing and prints no output.
rem  This wrapper finds Git's bash and delegates to the real script.
rem
rem  Usage:   .\push-theme-branch.cmd
rem ---------------------------------------------------------------------------
setlocal

set "SCRIPT=%~dp0push-theme-branch.sh"

if not exist "%SCRIPT%" (
  echo ERROR: cannot find push-theme-branch.sh next to this wrapper.
  exit /b 1
)

set "BASH="

rem Prefer Git for Windows over any WSL bash on PATH.
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

echo Using: %BASH%
"%BASH%" "%SCRIPT%" %*

endlocal
