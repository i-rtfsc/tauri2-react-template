.PHONY: help install dev build clean status
.DEFAULT_GOAL := help

DESKTOP_DIR := apps/desktop

help:
	@echo "======================================"
	@echo "  Tauri 2 + React Template"
	@echo "======================================"
	@echo "Commands:"
	@echo "  make install   - Install dependencies"
	@echo "  make dev     - Start development"
	@echo "  make build   - Build production"
	@echo "  make clean   - Deep clean (dist/target/node_modules)"
	@echo "  make status  - Show versions"

install:
	@echo "📦 Installing dependencies..."
	cd $(DESKTOP_DIR) && npm install --legacy-peer-deps
	@echo "✅ Done!"

dev:
	@echo "🚀 Starting development..."
	cd $(DESKTOP_DIR) && npm run tauri:dev

build:
	@echo "📦 Building..."
	cd $(DESKTOP_DIR) && npm run tauri:build

clean:
	@echo "🧹 Cleaning project (dist, target, node_modules, lock files)..."
	rm -rf $(DESKTOP_DIR)/dist $(DESKTOP_DIR)/src-tauri/target
	find . -name "node_modules" -type d -prune -exec rm -rf {} + 2>/dev/null || true
	find . -name "package-lock.json" -type f -delete 2>/dev/null || true
	@echo "✅ Clean complete"

status:
	@echo "📊 Project Status"
	@echo "Node: $$(node --version)"
	@echo "Rust: $$(rustc --version)"
	@echo "npm:  $$(npm --version)"