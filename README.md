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
npm run test:auth
```

### Migrations
Migration file in src/migrations/CreateTable.ts, it runs in src/db/db.config.ts

### Addition
In .env you can set PORT and by CLEAN_DB can clean db tables before start tests

### Autorization
* `Signup` (`auth/signup` route)
    * `POST auth/signup` - send `login` and `password` to create a new `user`
      - Server should answer with `status code` **201** and corresponding message if dto is valid
      - Server should answer with `status code` **400** and corresponding message if dto is invalid (no `login` or `password`, or they are not a `strings`)
* `Login` (`auth/login` route)
    * `POST auth/login` - send `login` and `password` to get Access token and Refresh token (optionally)
      - Server should answer with `status code` **200** and tokens if dto is valid
      - Server should answer with `status code` **400** and corresponding message if dto is invalid (no `login` or `password`, or they are not a `strings`)
      - Server should answer with `status code` **403** and corresponding message if authentication failed (no user with such `login`, `password` doesn't match actual one, etc.)
* `Refresh` (`auth/refresh` route)
    * `POST auth/refresh` - send refresh token in body as `{ refreshToken }` to get new pair of Access token and Refresh token
      - Server should answer with `status code` **200** and tokens in body if dto is valid
      - Server should answer with `status code` **401** and corresponding message if dto is invalid (no `refreshToken` in body)
      - Server should answer with `status code` **403** and corresponding message if authentication failed (Refresh token is invalid or expired)