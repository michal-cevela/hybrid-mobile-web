package cz.angular.cordova.atmosphere;

import org.atmosphere.config.managed.Encoder;
import org.codehaus.jackson.map.ObjectMapper;

import java.io.IOException;

/**
 * Encode an Object into a String
 */
public class JacksonEncoder implements Encoder<Object, String> {

    private final ObjectMapper mapper = new ObjectMapper();

    @Override
    public String encode(Object m) {
        try {
            return mapper.writeValueAsString(m);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}