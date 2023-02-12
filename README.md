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
git checkout docker
```

## Docker

### Install and run
```
docker-compose build
dockerdocker-compose up
```

 Please wait for application full start
 Then you can test application on localhost:{PORT} (default PORT is 4004)

### Docker hub
You can pull images from docker-hub

```
docker pull alattery/nodejs2022:db
docker pull alattery/nodejs2022:app
```

### Size
Application image size is 410Mb

### Script for vulnerabilities scanning
```
npm run docker:scan
```
### Notes
Docker was made and tested on Win11 with WSL2 option and it renew and restart after change in src.