@echo off
REM CaddyStats Local Development Startup Script for Windows
REM Manages all services: PostgreSQL, Redis, FastAPI, React, Nginx
REM Usage: dev.cmd [command]

setlocal enabledelayedexpansion

REM Configuration
set PROJECT_NAME=caddystats
set COMPOSE_FILE=docker-compose.yml
set ENV_FILE=.env
set LOG_DIR=logs

REM Colors (using chcp for Windows 10+ ANSI support)
cls

if "%1"=="" goto :cmd_up
if /i "%1"=="up" goto :cmd_up
if /i "%1"=="start" goto :cmd_up
if /i "%1"=="down" goto :cmd_stop
if /i "%1"=="stop" goto :cmd_stop
if /i "%1"=="restart" goto :cmd_restart
if /i "%1"=="remove" goto :cmd_remove
if /i "%1"=="clean" goto :cmd_clean
if /i "%1"=="logs" goto :cmd_logs
if /i "%1"=="status" goto :cmd_status
if /i "%1"=="ps" goto :cmd_status
if /i "%1"=="test" goto :cmd_test
if /i "%1"=="help" goto :cmd_help
if /i "%1"=="-h" goto :cmd_help
if /i "%1"=="--help" goto :cmd_help

echo [ERROR] Unknown command: %1
echo Use "dev.cmd help" for available commands
exit /b 1

:cmd_up
echo ============================================================
echo Checking Prerequisites
echo ============================================================
where docker >nul 2>nul
if errorlevel 1 (
    echo [ERROR] Docker not found. Please install Docker Desktop.
    exit /b 1
)
for /f "tokens=*" %%i in ('docker --version') do set DOCKER_VER=%%i
echo [OK] %DOCKER_VER%

where docker-compose >nul 2>nul
if errorlevel 1 (
    echo [ERROR] Docker Compose not found. Please install Docker Desktop.
    exit /b 1
)
for /f "tokens=*" %%i in ('docker-compose --version') do set COMPOSE_VER=%%i
echo [OK] %COMPOSE_VER%

if not exist "%ENV_FILE%" (
    echo [!] No .env file found. Copying from .env.example...
    copy .env.example "%ENV_FILE%" >nul
    echo [OK] .env file created
) else (
    echo [OK] .env file already exists
)

if not exist "%LOG_DIR%" (
    mkdir "%LOG_DIR%"
    echo [OK] Created logs directory
)

echo.
echo ============================================================
echo Starting CaddyStats Services
echo ============================================================
echo [!] Building images and starting containers...
echo.

docker-compose up --build -d
timeout /t 5 /nobreak

echo.
echo ============================================================
echo Checking Service Health
echo ============================================================
docker-compose ps

goto :show_urls

:cmd_stop
echo ============================================================
echo Stopping CaddyStats Services
echo ============================================================
docker-compose stop
echo [OK] Services stopped
goto :end

:cmd_restart
echo ============================================================
echo Restarting CaddyStats Services
echo ============================================================
docker-compose restart
echo [OK] Services restarted
timeout /t 3 /nobreak
docker-compose ps
goto :show_urls

:cmd_remove
echo ============================================================
echo Removing Services
echo ============================================================
echo [!] This will remove containers and networks (data preserved)
set /p CONFIRM=Continue? (y/n): 
if /i "%CONFIRM%"=="y" (
    docker-compose down
    echo [OK] Services removed
) else (
    echo Cancelled.
)
goto :end

:cmd_clean
echo ============================================================
echo Full Clean
echo ============================================================
echo [!] This will remove everything including data volumes
set /p CONFIRM=Continue? (y/n): 
if /i "%CONFIRM%"=="y" (
    docker-compose down -v
    echo [OK] All services and data removed
) else (
    echo Cancelled.
)
goto :end

:cmd_logs
echo ============================================================
echo Viewing Logs
echo ============================================================
docker-compose logs -f
goto :end

:cmd_status
echo ============================================================
echo Service Status
echo ============================================================
echo.
docker-compose ps
echo.
goto :end

:cmd_test
echo ============================================================
echo Running Tests
echo ============================================================
echo.
set /p TEST_BACKEND=Test backend? (y/n): 
if /i "%TEST_BACKEND%"=="y" (
    echo [*] Running backend tests...
    docker-compose exec api pytest tests/ -v --tb=short
)

set /p TEST_FRONTEND=Test frontend? (y/n): 
if /i "%TEST_FRONTEND%"=="y" (
    echo [*] Running frontend tests...
    docker-compose exec web npm run test
)
goto :end

:cmd_help
echo ============================================================
echo CaddyStats Development Environment Manager
echo ============================================================
echo.
echo Usage: dev.cmd [command]
echo.
echo Commands:
echo   up              Start all services (default)
echo   start           Start all services
echo   stop            Stop all services
echo   restart         Restart all services
echo   remove          Remove containers
echo   clean           Remove everything (including data)
echo   logs            View service logs
echo   status,ps       Show service status
echo   test            Run test suite
echo   help            Show this help
echo.
goto :end

:show_urls
echo.
echo ============================================================
echo Service URLs
echo ============================================================
echo Frontend (Dev)        http://localhost:3000
echo Frontend (Nginx)      http://localhost
echo API Docs              http://localhost:8000/docs
echo GraphQL IDE           http://localhost:8000/graphql
echo Health Check          http://localhost:8000/health
echo.
echo Database              localhost:5432 (User: caddystats)
echo Redis                 localhost:6379
echo.
echo ============================================================
echo Useful Commands
echo ============================================================
echo View logs:
echo   docker-compose logs -f              (all services)
echo   docker-compose logs -f api          (backend only)
echo   docker-compose logs -f web          (frontend only)
echo.
echo Shell access:
echo   docker-compose exec api bash        (backend container)
echo   docker-compose exec web cmd         (frontend container)
echo   docker-compose exec postgres bash   (database container)
echo.
echo Management:
echo   dev.cmd stop                        (stop services)
echo   dev.cmd restart                     (restart services)
echo   dev.cmd logs                        (view logs)
echo   dev.cmd remove                      (remove containers)
echo   dev.cmd clean                       (remove everything)
echo.

:end
endlocal
