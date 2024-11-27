package guides.hazelcast.springboot;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.util.Properties;

@Component
public class EventStreamConsumer {
    @Autowired
    private Properties props;


    @KafkaListener(topics = "#{'${topic}'}")
    public void processMessage(String content){
        System.out.println("Message received: " + content);
    }
}
