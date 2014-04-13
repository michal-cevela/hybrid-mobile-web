package cz.angular.cordova.ws.provider;

import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.GenericEntity;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;
import org.springframework.stereotype.Component;

/**
 * Exception: ExceptionHandler for RESTful & SOAP services
 *
 * Used within /WEB-INF/spring/cxf-ws.xml
 *
 * @author Michal Čevela
 * @version 1.0
 * @since March 2014
 */
@Component("ExceptionHandler")
@Provider
public class ExceptionHandler implements ExceptionMapper<Exception> {
	
	private static final Logger log = Logger.getLogger(ExceptionHandler.class.getName());
	
	@Override
	public Response toResponse(Exception e) {
		log.log(Level.INFO, "Error: {0}", e.getMessage());
		
		final Response.Status status;
		
		String jsonError = "{ \"error\": \"" + e.getMessage() + "\", \"cause\": \"" + e.getCause() + "\" }";
//		String jsonError = new ObjectMapper().writeValueAsString(e);
		
		if (e instanceof WebApplicationException) {
			status = Response.Status.NOT_FOUND;
		} else if (e instanceof IOException) {
			status = Response.Status.NO_CONTENT;
		} else {
			status = Response.Status.INTERNAL_SERVER_ERROR;
		}
		
		return Response.status(status)
				  .entity(new GenericEntity<String>(jsonError) {})
				  .build();
	}
}
