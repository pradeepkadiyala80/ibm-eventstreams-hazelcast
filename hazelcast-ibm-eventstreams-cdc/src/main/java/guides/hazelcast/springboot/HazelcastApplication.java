package guides.hazelcast.springboot;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.web.bind.annotation.RestController;


@EnableKafka
@SpringBootApplication
@RestController
public class HazelcastApplication {
    public static void main(String[] args) {
        SpringApplication.run(HazelcastApplication.class, args);
    }
}
