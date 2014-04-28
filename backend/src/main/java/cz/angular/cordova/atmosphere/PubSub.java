package cz.angular.cordova.atmosphere;

import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import org.atmosphere.cache.UUIDBroadcasterCache;
import org.atmosphere.client.TrackMessageSizeInterceptor;
import org.atmosphere.config.service.AtmosphereHandlerService;
import org.atmosphere.config.service.Disconnect;
import org.atmosphere.config.service.ManagedService;
import org.atmosphere.config.service.Message;
import org.atmosphere.config.service.Ready;
import org.atmosphere.config.service.Singleton;
import org.atmosphere.cpr.AtmosphereHandler;
import org.atmosphere.cpr.AtmosphereRequest;
import org.atmosphere.cpr.AtmosphereResource;
import org.atmosphere.cpr.AtmosphereResourceEvent;
import org.atmosphere.cpr.AtmosphereResponse;
import org.atmosphere.cpr.Broadcaster;
import org.atmosphere.cpr.BroadcasterFactory;
import org.atmosphere.handler.OnMessage;
import org.atmosphere.interceptor.AtmosphereResourceLifecycleInterceptor;
import org.atmosphere.interceptor.BroadcastOnPostAtmosphereInterceptor;
import org.atmosphere.interceptor.HeartbeatInterceptor;
import org.codehaus.jackson.io.JsonStringEncoder;
import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.stereotype.Service;

/**
 * Atmosphere: Publish-Subscribe
 * 
 * @author Michal Čevela
 * @version 1.0
 * @since April 2014
 */

@AtmosphereHandlerService(
	path = "/atmosphere/pub-sub/{topic}/broadcast/{message}",
//	path = "/atmosphere/pub-sub",
	broadcasterCache = UUIDBroadcasterCache.class,
	interceptors = {
		AtmosphereResourceLifecycleInterceptor.class,
		BroadcastOnPostAtmosphereInterceptor.class,
		TrackMessageSizeInterceptor.class,
		HeartbeatInterceptor.class
	}
)
@Singleton
//@Configurable
@Service("PubSub-API")
//@ManagedService(path = "/atmosphere/pub-sub/{topic}/broadcast/{message}")
@Path("/pub-sub/{topic}")
@Produces({"application/json"})
public class PubSub /* extends OnMessage<String> */ implements AtmosphereHandler {

	private final static Logger logger = Logger.getLogger(BroadcastService.class.getName());

	private static final ObjectMapper mapper = new ObjectMapper();
	
	@Context
	private HttpServletRequest httpRequest;
	
	@PathParam("topic")
	private String topic;
	
	@Autowired
	private BroadcastService broadcastService;
//	private AtmosphereResource resource;
/*	
	@Ready
	public void onReady(final AtmosphereResource resource) {
		logger.log(Level.INFO, "ATMOSPHERE RESOURCE (READY): {0}", resource);
	}

	@Disconnect
	public void onDisconnect(AtmosphereResourceEvent event) {
		if (event.isCancelled()) {
			logger.log(Level.INFO, "Atmosphere resource: {0}", event.getResource());
		} else if (event.isClosedByClient()) {
			logger.log(Level.INFO, "Atmosphere resource: {0}", event.getResource());
		}
	}
*/
	@GET
	@Path("/broadcast/{message}")
	@Message(
//		encoders = { JacksonEncoder.class },
//		decoders = { JacksonDecoder.class }
	)
//	public void onMessage(AtmosphereResponse response, String message) throws IOException {
	public String onMessage(String message) {
//		logger.log(Level.INFO, "Atmosphere response: {0}", resource);
		logger.log(Level.INFO, "Broadcasting message: {0}", message);
		return "[]";
	}

/*	
	@GET
	@Path("/broadcast/{message}")
//	public void onMessage(AtmosphereResponse response, String message) throws IOException {
	public String broadcast(@PathParam("message") String message) throws IOException {
		AtmosphereResource resource = (AtmosphereResource) request.getAttribute("org.atmosphere.cpr.AtmosphereResource");
//		resource.setBroadcaster(BroadcasterFactory.getDefault().lookup("/broadcast")).suspend();
		
		logger.log(Level.INFO, "HTTP request: {0}", request);
		logger.log(Level.INFO, "Atmosphere resource: {0}", resource);
		logger.log(Level.INFO, "Broadcast service: {0}", broadcastService);
		logger.log(Level.INFO, "Broadcasting topic: {0}", topic);
		logger.log(Level.INFO, "Broadcasting message: {0}", message);
		
//		broadcastService.broadcast(message);
//		response.write(mapper.writeValueAsString(message));
		return "[ " + topic + ", " + message +" ]";
	}
*/

	@Override
	public void onRequest(AtmosphereResource resource) throws IOException {
		logger.log(Level.INFO, "Atmosphere resource: {0}", resource);
		
	 	AtmosphereRequest request = resource.getRequest();
		logger.log(Level.INFO, "Atmosphere request: {0}", request);

		// First, tell Atmosphere to allow bi-directional communication by suspending.
		if (request.getMethod().equalsIgnoreCase("GET")) {
			// We are using HTTP long-polling with an invite timeout
			logger.log(Level.INFO, "Atmosphere GET");
			resource.suspend();
			// Second, broadcast message to all connected users.
		} else if (request.getMethod().equalsIgnoreCase("POST")) {
			logger.log(Level.INFO, "Atmosphere POST");
			resource.getBroadcaster().broadcast(request.getReader().readLine().trim());
		}
	}

	@Override
	public void onStateChange(AtmosphereResourceEvent event) throws IOException {
		logger.log(Level.INFO, "Atmosphere event: {0}", event);
		
		AtmosphereResource resource = event.getResource();
		AtmosphereResponse response = resource.getResponse();
		
		logger.log(Level.INFO, "Atmosphere resource: {0}", resource);
		logger.log(Level.INFO, "Atmosphere response: {0}", response);
		
		if (resource.isSuspended()) {
			String body = event.getMessage().toString();

			// Simple JSON -- Use Jackson for more complex structure
			// Message looks like { "author" : "foo", "message" : "bar" }
//			String author = body.substring(body.indexOf(":") + 2, body.indexOf(",") - 1);
//			String message = body.substring(body.lastIndexOf(":") + 2, body.length() - 2);

			response.getWriter().write("Hello World!");
			
			switch (resource.transport()) {
				case JSONP:
				case LONG_POLLING:
					event.getResource().resume();
					break;
				case WEBSOCKET:
				case STREAMING:
					response.getWriter().flush();
					break;
			}
		} else if (!event.isResuming()) {
			event.broadcaster().broadcast("Bood bye!");
		}
	}

	@Override
	public void destroy() {
		// TODO:
	}
}
