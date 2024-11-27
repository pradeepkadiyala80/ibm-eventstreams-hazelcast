# Event Centric Pattern

This repository describes a pilot about how we can simulate monolith Java applications to be able to respond to the events in real-time through an event-based model handled by IBM cloud-native applications and services.

The genereal idea behind this pilot is to describe real-world use case of handling real-time events of Java applications with IBM Cloud Services in a secure and compliant environment.

## Architecture Overview 

The below architecture overview describes how we can implement the realtime data flow model

Steps:

1. The hazelcast application is a [SpringBoot Java application](/hazelcast-ibm-eventstreams-cdc) that has REST API that will PUT or POST the JSON data
2. The data is then cached in the hazelcast cache via SpringBoot application
3. An event is triggered when the cache is updated with data changes
4. The event is pushed to IBM Event Streams (Kafka) topic
5. The Event Streams topic is subscribed to the [IBM Cloud Code Engine Application](https://github.ibm.com/pkadiya/datapipe-codeengine)
6. The Nodejs application running in IBM Code engine will consume and process the data and stores in IBM Cloudant NoSQL database


## How to Implement?

This repository has the high level architecture overview that describes the event-driven pattern. To implement and run the above pilot you need to have the following setup

**IBM Cloud Resources:**

Ensure to have the following cloud services available
1. IBM Cloud Account
2. IBM Event Streams or Kafka (Preferably lite plan as it has bare minimum cost)
3. IBM Code Engine (Since its pay as you go it has very low cost)
4. Cloudant (Store the processed data in NoSQL database)


**Local Machine resources:**

1. Clone the repo for processing the data in [IBM Cloud Code Engine](https://github.ibm.com/pkadiya/datapipe-codeengine) and follow the instructions to deploy in IBM Cloud Code Engine
2. Clone the repo for [hazelcast cache](https://github.ibm.com/pkadiya/hazelcast-ibm-eventstreams-cdc) and follow the instructions to run hazelcast




## Resources

| Repository Name  | Git Repository URL | Description |
|---|---|---|
| hazelcast-ibm-eventstreams-cdc   | https://github.ibm.com/pkadiya/hazelcast-ibm-eventstreams-cdc   |   |
| datapipe-codeengine  | https://github.ibm.com/pkadiya/datapipe-codeengine  |   |

