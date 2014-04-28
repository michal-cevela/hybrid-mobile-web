package cz.angular.cordova.atmosphere;

import java.util.logging.Logger;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.core.MessageListener;
import org.springframework.amqp.support.converter.MessageConversionException;
import org.springframework.amqp.support.converter.SimpleMessageConverter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

//@Component("broadcastQueueConsumer")
public class BroadcastListener implements MessageListener {

//	private final static Logger logger = Logger.getLogger(BroadcastListener.class.getName());

//	@Autowired
//	private SimpleMessageConverter messageAdapter;

//	@Autowired
//	private BroadcastService broadcastService;

	@Override
	public void onMessage(Message message) {
/*
		try {
			String convertedMessage = (String) messageAdapter.fromMessage(message);
			broadcastService.broadcast(convertedMessage);
		} catch (MessageConversionException e) {
			logger.warning("Unable to read message  (err: " + e + ")");
		}
*/
	}
}
