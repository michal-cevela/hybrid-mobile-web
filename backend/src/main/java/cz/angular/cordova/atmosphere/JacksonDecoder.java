package cz.angular.cordova.atmosphere;

import org.atmosphere.config.managed.Decoder;
import org.codehaus.jackson.map.ObjectMapper;

import java.io.IOException;

/**
 * Decode a String into an Object
 */
public class JacksonDecoder implements Decoder<String, Object> {

    private final ObjectMapper mapper = new ObjectMapper();

    @Override
    public Object decode(String s) {
        try {
            return mapper.readValue(s, Object.class);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}