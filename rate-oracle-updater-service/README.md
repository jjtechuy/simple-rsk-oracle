# Rate Oracle updater service

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/feross/standard)

> Service for updating rate in oracle contract

**Warning: This project is in alpha state. **

## Lead Maintainer

[Nazar Duchak](https://github.com/nduchak)

See what "Lead Maintainer" means [here](https://github.com/rsksmart/lead-maintainer).

## Table of Contents

- [Introduction](#introduction)
- [Configuration](#configuration)
    - [Environment variables overview](#environment-variables-overview)
- [Usage](#usage)
- [License](#license)

## Introduction

This is a backend service for updating rate for oracle.
It is build using [FeathersJS](https://www.feathersjs.com)

## Configuration

Required reading: [node-config docs](https://github.com/lorenwest/node-config/wiki/Configuration-Files)

There are several ways how to configure this application:

 1. Using JSON file
 1. Using Environmental variables
 1. Using CLI parameters

To run this service there is minimum configuration needed, which is supported with all the configuration ways mentioned above:

 - Blockchain node

### Environment variables overview

 - `ROS_PORT` (number): port on which the server should listen to
 - `ROS_RATE_UPDATE_THRESHOLD` (number): threshold for rate update (0.5%)
 - `ROS_RATE_UPDATE_INTERVAL` (number): interval for updating rate for oracle
 - `ROS_ORACLE_CONTRACT_ADDRESS` (string): Rate Oracle Contarct address
 - `ROS_ORACLE_PROVIDER_ACCOUNT` (number): Rate Oracle Provider Account (should be whitelisted incontract)
 - `ROS_NODE_URL` (string): Node Url
 - `ROS_NETWORK_ID` (string): Node network id
 - `ROS_RATE_API_URL` (string): Rate API url
 - `ROS_RATE_API_TOKEN` (string): Rate API Token
 - `ROS_RATE_API_POLL_INTERVAL` (number): Rate API polling interval
 - CORS settings ([see more on expressjs documentation](https://expressjs.com/en/resources/middleware/cors.html)):
    - `ROS_CORS_ORIGIN` (boolean | string | regexp): Configures the Access-Control-Allow-Origin CORS header
    - `ROS_CORS_METHODS` (string) Configures the Access-Control-Allow-Methods CORS header
 - Logging related (see bellow):
    - `LOG_LEVEL` (string)
    - `LOG_FILTER` (string)
    - `LOG_PATH` (string)
    - `LOG_NO_COLORS` (boolean) - if set the output won't be colorized

## Usage

```sh-session

// Start the server
$ npm run bin -- start --log info
```

## License

[MIT](./LICENSE)
