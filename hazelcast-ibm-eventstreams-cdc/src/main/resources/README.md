
## Application Properties

These properties need to be defined before running your application

|  Name | Value  | Description  |
|---|---|---|
|  bootstrap.servers | *broker-url-1,broker-url-2...*  | Get the list of IBM EventStream brokers. [IBM Documentation](https://cloud.ibm.com/docs/EventStreams?topic=EventStreams-connecting)  |
| sasl.jaas.config | org.apache.kafka.common.security.plain.PlainLoginModule required username="token" password="*PWD*" | Get password from IBM Event Stream Console under Service Credentials. |
| topic | *topic name* | Use the topic name that you created in IBM Event Streams |

*Note: The values in Italics are represented as placeholders and need to be replaced with real values*

The rest of the properties in the sample file will remain with already defined values and does not require any changes
