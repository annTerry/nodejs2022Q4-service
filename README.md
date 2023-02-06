# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Downloading

```
git clone https://github.com/annTerry/nodejs2022Q4-service.git
```

## Set correct branch

```
cd nodejs2022Q4-service
git checkout dev
```

## Installing NPM modules

```
npm install
```

## Running application

```
npm start
```

Documentation can be found in /doc/api.yami
Go to https://editor.swagger.io/ and copy or load this file in editor for view documentation

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```
npm run test
```

To run only one of all test suites

```
npm run test -- <path to suite>
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```