# How to configure the APP
Use `<appRootPath>/server/config/enviroment/sample.config.ts` to configure your application in development environment

# Pre-requisites
The following are required before you configure and run your application.

## Defining the environment variables

APP VARIABLES:
* `webRoot`: Provide the domain name or the IP and port number. 
* `webHost`: Same as web root
* `port`: Provide the port at which the service will run
* `host`: provide the hostname
* `tokenSecret`: To generate and authenticate API End points (Required in all environments)
* 

CLOUDANT VARIABLES:
* `url`: IBM Cloudant instance URL 
* `apiKey`: Get the coludant apiKey from IBM Cloud Cloudant console
* `db`: Database name created in the cloudant instance
