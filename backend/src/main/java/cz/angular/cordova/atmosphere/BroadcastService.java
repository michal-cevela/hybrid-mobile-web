package cz.angular.cordova.atmosphere;

//import java.util.Map;
//import java.util.concurrent.ConcurrentHashMap;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.ws.rs.core.Context;
import org.atmosphere.config.service.AtmosphereService;
import org.atmosphere.cpr.Broadcaster;
import org.atmosphere.cpr.BroadcasterFactory;
import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.stereotype.Service;

@Service
@Configurable
public class BroadcastService {

	private final static Logger logger = Logger.getLogger(BroadcastService.class.getName());
	
	private final BroadcasterFactory broadcasterFactory = BroadcasterFactory.getDefault();
//	private final Map<String, Broadcaster> broadcastTokens = new ConcurrentHashMap<>();

//	@Context
//	BroadcasterFactory broadcasterFactory;
	
	public void broadcast(String message) {
//		BroadcasterFactory broadcasterFactory = BroadcasterFactory.getDefault();
		logger.log(Level.INFO, "Broadcaster factory: {0}", broadcasterFactory);
		
//		for (Object token : broadcasterFactory.lookupAll().toArray()) {
//			((Broadcaster) token).broadcast(message);
//			logger.log(Level.INFO, "Broadcasting message: {0}", message);
//		}
/*		
		for (Broadcaster token : broadcastTokens.values()) {
			token.broadcast(message);
			logger.log(Level.INFO, "Broadcasting message: {0}", message);
		}
*/
	}

	public void addBroadcastToken(String channel, Broadcaster token) {
		broadcasterFactory.add(token, channel);
//		broadcastTokens.put(channel, token);
	}

	public void destroyBroadcastToken(String channel) {
		Broadcaster token = broadcasterFactory.get(channel);
//		Broadcaster token = broadcastTokens.get(channel);
		
		if (token != null) {
			token.destroy();
			broadcasterFactory.remove(channel);
//			broadcastTokens.remove(channel);
		}
	}
}
