# Variables
IMAGE_NAME=llm-evaluator
IMAGE_URI=885807555562.dkr.ecr.us-west-2.amazonaws.com/$(IMAGE_NAME)

# Default target
.PHONY: help
help:
	@echo "Makefile commands:"
	@echo "  make build       - Build the Docker image"
	@echo "  make push        - Push the Docker image to ECR"
	@echo "  make pull        - Pull the Docker image from ECR"
	@echo "  make up          - Start the Docker Compose services"
	@echo "  make down        - Stop the Docker Compose services"
	@echo "  make login       - Log in to ECR"
	@echo "  make clean       - Remove dangling Docker images"

# Build the Docker image
.PHONY: build
build:
	docker build --platform linux/amd64 -t $(IMAGE_NAME):latest . 
	docker tag $(IMAGE_NAME):latest $(IMAGE_URI):latest

# Push the Docker image to ECR
.PHONY: push
push: login
	docker push $(IMAGE_URI):latest

# Pull the Docker image from ECR
.PHONY: pull
pull: login
	docker pull $(IMAGE_URI):latest

# Start the Docker Compose services
.PHONY: up
up:
	docker compose up -d

# Stop the Docker Compose services
.PHONY: down
down:
	docker compose down

# Log in to ECR
.PHONY: login
login:
	aws ecr get-login-password --region us-west-2 | docker login --username AWS --password-stdin $(IMAGE_URI)

# Clean up dangling Docker images
.PHONY: clean
clean:
	docker image prune -f
