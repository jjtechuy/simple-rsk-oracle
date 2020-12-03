# Oracle Rate Updater service Deployment guide

This is example for RSK testnet deployment.

## Configuration

The Oracle Rate Updater service needs configuration to work properly. Based on the custom settings you want to configure you either can use:

 1. environmental variables - only some options are available. See overview [here](./README.md#environment-variables-overview).
 2. custom config

For a custom config create JSON file which follows scheme defined [here](./src/definitions.ts).

## Using Docker

The easiest way is to mount the config directly into the Docker container.

```
$ cd ./rate-oracle-updater-service
$ docker build -t rate-oracle-updater-service .
$ docker run -v <path-to-the-config>:/srv/app/config/local.json5 -id rate-oracle-updater-service --config local
```

## UNIX environment

### Prerequisites

 - Node v10 or 12
 - RSKj node to connect to (a.k.a provider)

### Steps

#### 1. Run the Service

**Change path to your Custom Config in following commands**

run the server:

```bash
$ npm run bin -- start --config ./path/to/custom_config
```
