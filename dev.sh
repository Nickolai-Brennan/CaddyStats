#!/bin/bash
# CaddyStats Local Development Startup Script
# Manages all services: PostgreSQL, Redis, FastAPI, React, Nginx
# Usage: ./dev.sh [command]

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="caddystats"
COMPOSE_FILE="docker-compose.yml"
ENV_FILE=".env"
LOG_DIR="logs"

# Functions
print_header() {
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

print_info() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}!${NC} $1"
}

check_prerequisites() {
    print_header "Checking Prerequisites"
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker not found. Please install Docker."
        exit 1
    fi
    print_info "Docker installed: $(docker --version)"
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose not found. Please install Docker Compose."
        exit 1
    fi
    print_info "Docker Compose installed: $(docker-compose --version)"
}

setup_env() {
    print_header "Setting Up Environment"
    
    if [ ! -f "$ENV_FILE" ]; then
        print_warning "No .env file found. Copying from .env.example..."
        cp .env.example "$ENV_FILE"
        print_info ".env file created"
    else
        print_info ".env file already exists"
    fi
}

create_log_dir() {
    if [ ! -d "$LOG_DIR" ]; then
        mkdir -p "$LOG_DIR"
        print_info "Created logs directory"
    fi
}

start_services() {
    print_header "Starting CaddyStats Services"
    print_warning "Building images and starting containers..."
    echo ""
    
    docker-compose up --build -d
    
    sleep 5
    
    print_header "Checking Service Health"
    check_health
}

stop_services() {
    print_header "Stopping CaddyStats Services"
    docker-compose stop
    print_info "Services stopped"
}

restart_services() {
    print_header "Restarting CaddyStats Services"
    docker-compose restart
    print_info "Services restarted"
    sleep 3
    check_health
}

remove_services() {
    print_header "Removing Services"
    print_warning "This will remove containers and networks (data preserved)"
    read -p "Continue? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker-compose down
        print_info "Services removed"
    fi
}

clean_all() {
    print_header "Full Clean"
    print_warning "This will remove everything including data volumes"
    read -p "Continue? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker-compose down -v
        print_info "All services and data removed"
    fi
}

check_health() {
    echo ""
    print_info "PostgreSQL: " && docker-compose ps postgres | grep -q "healthy" && echo "✓ Healthy" || echo "⏳ Starting..."
    print_info "Redis: " && docker-compose ps redis | grep -q "healthy" && echo "✓ Healthy" || echo "⏳ Starting..."
    print_info "API: " && docker-compose ps api | grep -q "healthy" && echo "✓ Healthy" || echo "⏳ Starting..."
    echo ""
}

wait_for_services() {
    print_header "Waiting for Services to be Healthy"
    
    local max_attempts=30
    local attempt=0
    local all_healthy=false
    
    while [ $attempt -lt $max_attempts ] && [ "$all_healthy" = false ]; do
        attempt=$((attempt + 1))
        echo -n "Checking services... ($attempt/$max_attempts)"
        
        if docker-compose ps | grep -q "Exit"; then
            print_error "Container exited. Checking logs..."
            docker-compose logs --tail=20
            exit 1
        fi
        
        # Check if all services are running
        if docker-compose ps | grep -E "(postgres|redis|api)" | grep -q "Up"; then
            all_healthy=true
            echo -e "\r${GREEN}✓${NC} All services healthy!                    "
        else
            echo -ne "\r⏳ Waiting... ($attempt/$max_attempts)         "
            sleep 2
        fi
    done
    
    if [ "$all_healthy" = false ]; then
        print_error "Services did not start. Check logs:"
        docker-compose logs --tail=50
        exit 1
    fi
}

show_urls() {
    print_header "Service URLs"
    echo -e "${GREEN}Frontend (Dev)${NC}        http://localhost:3000"
    echo -e "${GREEN}Frontend (Nginx)${NC}      http://localhost"
    echo -e "${GREEN}API Docs${NC}              http://localhost:8000/docs"
    echo -e "${GREEN}GraphQL IDE${NC}           http://localhost:8000/graphql"
    echo -e "${GREEN}Health Check${NC}          http://localhost:8000/health"
    echo ""
    echo -e "${YELLOW}Database${NC}              localhost:5432 (User: caddystats)"
    echo -e "${YELLOW}Redis${NC}                 localhost:6379"
    echo ""
}

show_commands() {
    print_header "Useful Commands"
    echo "View logs:"
    echo "  docker-compose logs -f              (all services)"
    echo "  docker-compose logs -f api          (backend only)"
    echo "  docker-compose logs -f web          (frontend only)"
    echo ""
    echo "Shell access:"
    echo "  docker-compose exec api bash        (backend container)"
    echo "  docker-compose exec web sh          (frontend container)"
    echo "  docker-compose exec postgres bash   (database container)"
    echo ""
    echo "Management:"
    echo "  ./dev.sh stop                       (stop services)"
    echo "  ./dev.sh restart                    (restart services)"
    echo "  ./dev.sh logs                       (view logs)"
    echo "  ./dev.sh remove                     (remove containers)"
    echo "  ./dev.sh clean                      (remove everything)"
    echo ""
}

view_logs() {
    print_header "Viewing Logs"
    docker-compose logs -f
}

run_tests() {
    print_header "Running Tests"
    echo ""
    
    read -p "Test backend? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_info "Running backend tests..."
        docker-compose exec api pytest tests/ -v --tb=short
    fi
    
    read -p "Test frontend? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_info "Running frontend tests..."
        docker-compose exec web npm run test
    fi
}

show_status() {
    print_header "Service Status"
    echo ""
    docker-compose ps
    echo ""
}

# Main command dispatcher
case "${1:-up}" in
    up|start)
        check_prerequisites
        setup_env
        create_log_dir
        start_services
        wait_for_services
        show_urls
        show_commands
        ;;
    down|stop)
        stop_services
        ;;
    restart)
        restart_services
        show_urls
        ;;
    remove)
        remove_services
        ;;
    clean)
        clean_all
        ;;
    logs)
        view_logs
        ;;
    status|ps)
        show_status
        ;;
    test)
        run_tests
        ;;
    help|--help|-h)
        print_header "CaddyStats Development Environment Manager"
        echo ""
        echo "Usage: ./dev.sh [command]"
        echo ""
        echo "Commands:"
        echo "  up              Start all services (default)"
        echo "  start           Start all services"
        echo "  stop            Stop all services"
        echo "  restart         Restart all services"
        echo "  remove          Remove containers"
        echo "  clean           Remove everything (including data)"
        echo "  logs            View service logs"
        echo "  status|ps       Show service status"
        echo "  test            Run test suite"
        echo "  help            Show this help"
        echo ""
        ;;
    *)
        print_error "Unknown command: $1"
        echo "Use './dev.sh help' for available commands"
        exit 1
        ;;
esac
