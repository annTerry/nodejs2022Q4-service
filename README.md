# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.
- Docker - [Download & Install Docker](https://www.docker.com//)

## Downloading

```
git clone https://github.com/annTerry/nodejs2022Q4-service.git
```

## Set correct branch

```
cd nodejs2022Q4-service
git checkout postgre
```

## Docker

### Install and run
```
docker-compose build
docker-compose up
```

 Please wait for application full start
 Then you can test application on localhost:{PORT} (default PORT is 4000)

### Docker hub
You can pull images from docker-hub (they were private, but set public for check)

```
docker pull alattery/nodejs2022:db
docker pull alattery/nodejs2022:app
```

### Size
Application image size is ~450Mb

### Script for vulnerabilities scanning
```
npm run docker:scan
```
### Notes
Docker was made and tested on Win11 with WSL2 option and it renew and restart after change in src.

# TEST POSTGRES DB
In running container with app (it names nodejs2022q4-service app) run tests with this command
```
npm run test
```
### Migrations
Migration file in src/migrations/CreateTable.ts, it runs in src/db/db.config.ts

### Addition
In .env you can set PORT and by CLEAN_DB can clean db tables before start tests