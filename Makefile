PYTHONPATH=$(PWD)

.PHONY: up down build help

.DEFAULT_GOAL := help

help:
	@echo "Usage: make <command>"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-25s\033[0m %s\n", $$1, $$2}'

install: clean
	pnpm install

setup-dev: install
	docker compose up -d

setup-prod:
	pnpm docker:build
	pnpm docker:run

clean:
	docker compose down
	rm -rf node_modules
