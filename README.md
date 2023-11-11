# ibm-eventstreams-hazelcast
This repository describes a pilot about how to build event-driven architecture using Hazelcast

The below architecture overview describes how we can implement the real-time data flow model using Hazelcast and IBM Event Streams




Steps:

The hazelcast application is a SpringBoot Java application that has REST API that will PUT or POST the JSON data
The data is then cached in the hazelcast cache via SpringBoot application
An event is triggered when the cache is updated with data changes
The event is pushed to IBM Event Streams topic
The Event Streams topic is subscribed to the IBM Cloud Code Engine Application
The Nodejs application running in IBM Code engine will consume and process the data and stores in IBM Cloudant NoSQL database
