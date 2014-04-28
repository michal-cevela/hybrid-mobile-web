package cz.angular.cordova.websockets;

import java.io.IOException;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
import javax.websocket.EncodeException;
import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;

/**
 * WebSockets: Controller
 * 
 * @author Michal Čevela
 * @version 1.0
 * @since April 2014
 */
@ServerEndpoint("/websockets/{param1}")
public class Controller {
	
	private static final Set<Session> peers = Collections.synchronizedSet(new HashSet());
	
	@OnOpen
	public void onOpen(Session peer) {
		peers.add(peer);
	}
	
	@OnMessage
	public void onMessage(String message, Session client, @PathParam("param1") String name) throws IOException, EncodeException {
		for (Session peer : peers) {
			peer.getBasicRemote().sendObject(message.toString());
		}
	}
	
	@OnClose
	public void onClose(Session peer) {
		peers.remove(peer);
	}
	
	@OnError
	public void onError() {
	}
}
