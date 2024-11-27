package guides.hazelcast.springboot;

import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.Producer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.common.header.Header;
import org.apache.kafka.common.header.internals.RecordHeader;
import org.springframework.core.env.Environment;

import java.io.IOException;
import java.io.InputStream;
import java.text.MessageFormat;
import java.util.Arrays;
import java.util.List;
import java.util.Properties;

public class EventStreamProducer {

    private Properties props;
    private Producer producer;
    private final List<Header> headers = Arrays.asList(new RecordHeader("content-type", "application/json".getBytes()));

    private final String SASL_JAAS_CONF =
            MessageFormat.format("org.apache.kafka.common.security.plain.PlainLoginModule required username=\"token\" password=\"{0}\";",
                    System.getenv().get("KAFKA_PWD"));

    EventStreamProducer() {
        try (InputStream input = HazelcastApplication.class.getClassLoader().getResourceAsStream("application.properties")) {
            props = new Properties();

            if (input == null) {
                System.out.println("Sorry, unable to find application.properties");
                return;
            }

            //load a properties file from class path, inside static method
            props.load(input);
            //Override servers and config with environment variables
            //Sensitive properties
            props.setProperty("bootstrap.servers", System.getenv().get("BOOTSTRAP_SERVERS"));
            props.setProperty("sasl.jaas.config", SASL_JAAS_CONF);
            producer = new KafkaProducer(props);
        } catch (IOException ex) {
            ex.printStackTrace();
        }
    }

    public void sendMessage(String key, String message) {
        ProducerRecord record = new ProducerRecord(props.getProperty("topic"), null, key, message, headers);
        this.producer.send(record);
    }
}
