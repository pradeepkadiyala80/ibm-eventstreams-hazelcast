# z Event Centric Pattern

This repository describes a pilot about how we can simulate monolith Mainframe Java applications running on z-Systems to be able to respond to the events in real time through event-based model handled by IBM cloud native application and services.

The underlying concept here are being referenced from event driven pattern of [Application Modernization for IBM Z Architecture](https://www.ibm.com/cloud/architecture/architectures/application-modernization-mainframe/patterns)

The genereal idea behind this pilot is to describe real-world use case of handling real-time events of mainframe Java applications running on z-Systems with IBM Cloud Services in secure and compliant environment. [zDIH](https://www.ibm.com/support/z-content-solutions/z-digital-integration-hub/) is the integration component that can be used to cache and trigger the events

## Conceptual Architecture

The below diagram describes a high level overview of how zDIH integrates with cloud services in a hybrid cloud environment

![concept](https://media.github.ibm.com/user/2637/files/d281b88b-93df-40f1-8b20-82d9cd4d4a27)

*z-DIH* - A component on z-Systems that enable cache and integration of real time data from on-prem to IBM Cloud service

*DLDH* - Direct Link Dedicated enable a secure connection between on-prem and IBM Cloud Services

*Kafka* - IBM Event Streams with underlying Kafka technology enable event streams

*Serverless Application* - Runs on IBM Cloud Code Engine, a cloud native platform

All the IBM Cloud services are secure and Financial Service (FS) validated which means they are monitored regularly by Security and Compliance Center for Industry regulatations.

## Architecture Overview 

The below architecture overview describes how we can implement the realtime data flow model that simulates the above conceptual architecture 

Steps:

1. The hazelcast application is a [SpringBoot Java application](https://github.ibm.com/pkadiya/hazelcast-ibm-eventstreams-cdc) that has REST API that will PUT or POST the JSON data
2. The data is then cached in the hazelcast cache via SpringBoot application
3. An event is triggered when the cache is updated with data changes
4. The event is pushed to IBM Event Streams topic
5. The Event Streams topic is subscribed to the [IBM Cloud Code Engine Application](https://github.ibm.com/pkadiya/datapipe-codeengine)
6. The Nodejs application running in IBM Code engine will consume and process the data and stores in IBM Cloudant NoSQL database

![pilot](https://media.github.ibm.com/user/2637/files/f3627a4e-d711-452f-8ed5-f5fbe07dcb7a)

P.S: You can use client to site VPN service on IBM Cloud for secure connection from your local system to IBM Cloud services private end points

## How to Implement?

This repository has the high level architecture overview that describes the CDC pattern. To implement and run the above pilot you need to have the following setup

**IBM Cloud Resources:**

Ensure to have the following cloud services available
1. IBM Cloud Account
2. IBM Event Streams (Preferably lite plan as it has bare minimum cost)
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

