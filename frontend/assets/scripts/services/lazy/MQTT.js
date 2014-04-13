'use strict';

/**
 * @name Angular Service: MQTT
 * @author Michal Čevela
 * @version 1.0
 */
$$util.getProvider('service')
	.factory('MQTT', [function() {
		var _host    = 'localhost',
			 _port    = 61614,
			 _timeout = 5,
			 _id      = undefined,
			 _client  = undefined,
			 _reconnect = true;

		return {
			// Connect to the server (MQTT message broker) and set up a connection listener
			connect: function(host, port, id, timeout, reconnect, onSuccess, onFailure, onMessageArrived, onConnectionLost) {
				_host = host || _host;
				_port = parseInt(port) || _port;
				_id   = id || 'mqtt_' + new Date().getTime().toString();
				_timeout = parseInt(timeout) || _timeout;

				if ( (_client === undefined) && (_reconnect == true) ) {
					$log.error("services/lazy/MQTT.js: connect() -> MQTT client has not been initialized yet!");

					_client = new Messaging.Client(_host, _port, _id);
					_client.startTrace();
				}

				if (_client !== undefined) {
					_client.connect({
						onSuccess: function() {
							$log.debug("services/lazy/MQTT.js: connect() -> connection established!");

							if (angular.isFunction(onSuccess)) {
								onSuccess();
							}
						},

						onFailure: function(response) {
							$log.error("services/lazy/MQTT.js: connect() -> connection failed!");

							if (angular.isFunction(onFailure)) {
								onFailure(response);
							}
						}
					});

					_client.onMessageArrived = function(a_message) {
						$log.debug("services/lazy/MQTT.js: onMessageArrived() -> message received from the '" + a_message.destinationName + "' topic!");

						if (angular.isFunction(onMessageArrived)) {
							onMessageArrived(a_message);
						}
					};

					_client.onConnectionLost = function(response) {
						$log.error("services/lazy/MQTT.js: onConnectionLost() -> connection lost!");

						if (angular.isFunction(onConnectionLost)) {
							onConnectionLost(response);
						}
					};
				}
			},

			// Subscribe to a topic
			subscribe: function(topic, QoS) {
				$log.debug("services/lazy/MQTT.js: subscribe() -> subscribing to the '" + topic + "' topic...");
				_client.subscribe(topic, { qos: QoS });
			},

			// Send a message
			sendMessage: function(text, topic, QoS) {
				var message = new Messaging.Message(text);
				message.destinationName = topic;
				message.qos = QoS;

				$log.debug("services/lazy/MQTT.js: sendMessage() -> sending a message to the '" + topic + "' topic...");
				_client.send(message);
			},

			// Close the connection to the server
			disconnect: function() {
				$log.debug("services/lazy/MQTT.js: disconnect() -> connection closed!");
				_client.disconnect();
			}
		};
	}]);
