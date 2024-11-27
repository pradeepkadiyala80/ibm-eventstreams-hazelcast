FROM openjdk:8-jdk-alpine
ARG JAR_FILE=target/hazelcast-embedded-springboot-0.1.jar
COPY ${JAR_FILE} hazelcast-embedded-springboot-0.1.jar
ENTRYPOINT ["java","-jar", "-Dserver.port=9090", "/hazelcast-embedded-springboot-0.1.jar"]