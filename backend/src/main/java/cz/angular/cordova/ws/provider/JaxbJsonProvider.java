package cz.angular.cordova.ws.provider;

import javax.ws.rs.Produces;
import javax.ws.rs.ext.Provider;
import com.fasterxml.jackson.jaxrs.json.JacksonJaxbJsonProvider;
import com.fasterxml.jackson.databind.*;
import com.fasterxml.jackson.annotation.*;

@Provider
@Produces("application/json;charset=UTF-8")
public class JaxbJsonProvider extends JacksonJaxbJsonProvider {

	private static ObjectMapper commonMapper = null;

	public JaxbJsonProvider() {
		if (commonMapper == null) {
			ObjectMapper mapper = new ObjectMapper();

			mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
			mapper.setSerializationInclusion(JsonInclude.Include.NON_DEFAULT);
			mapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
			mapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
			mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

			commonMapper = mapper;
		}
		super.setMapper(commonMapper);
	}

}
