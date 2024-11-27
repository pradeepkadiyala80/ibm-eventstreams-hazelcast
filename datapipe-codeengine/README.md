# Real Time Data Processing on IBM code Engine
Real Time Data processing is a sample code to demostrate how the change data capture (CDC) events are being processed in realtime using serverless IBM Code Engine.


## Running the application
Pre-requisite:
- Install node 15 
- Make sure you have latest Openssl on you local machine

Steps:
- RUN `npm ci`
- Create development.ts file in config folder. Follow the [instructions here](server/config/README.md)
- Run `export NODE_ENV=development`
- RUN `export LOCAL=true`
- Finally RUN `ts-node app.ts`

## Running application in a Docker container
Pre-requisite:
- You need to install  docker on you local environment
- For Mac https://docs.docker.com/docker-for-mac/install/
- For Windows https://docs.docker.com/docker-for-windows/install/

### Build docker image
This service has three different docker builds for each environment.
1. Development - Dockerfile.development
2. Stage - Dockerfile.stage
3. Production Dockerfile.production

Here are steps to perform docker builds for Development environment

1. export ARTIFACTORY_LOGIN=<username:password>
2. RUN `docker build --build-arg ARTIFACTORY_LOGIN=$ARTIFACTORY_LOGIN -t micro-service -f Dockerfile.development .` (micro-service is the name of the docker image you are creating)

This will create a docker image for you

### RUN Docker image on your local machine
Once you build docker image you can run docker from local environment

`docker run -p 3000:3000 micro-service:latest`


### Deploy the code in IBM Cloud Code Engine
To deploy please follow the [documentation](https://cloud.ibm.com/docs/codeengine?topic=codeengine-deploy-app-tutorial) provided in IBM Cloud
