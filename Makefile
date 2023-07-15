COMPOSE=docker-compose

all: up

up: build
	$(COMPOSE) up -d

dev: build
	$(COMPOSE) up


build:
	$(COMPOSE) build --parallel

start:
	$(COMPOSE) start
restart:
	$(COMPOSE) restart
stop:
	$(COMPOSE) stop

down:
	$(COMPOSE) down

ps:
	$(COMPOSE) ps --all

#without docker dev :
alldev: frt bck

frt:
	cd front-end && npm install && npm run dev

bck:
	cd back-end && npm install && npm run start:dev

fclean:
	./docker/fclean_docker.sh
