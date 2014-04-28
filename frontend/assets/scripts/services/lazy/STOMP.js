'use strict';

/**
 * @name Angular Service: STOMP
 * @author Michal Čevela
 * @version 1.0
 */
$$util.getProvider('service')
	.factory('STOMP', ['$q', function($q) {
		var _host = 'localhost',
			 _port = 61614,
			 _usr  = 'smx',
			 _pwd  = 'smx',
			 _id   = undefined,
			 _client = undefined,
			_reconnect = true;

		return {
			/**
			 * Connect to a STOMP server over WebSockets
			 * @param host
			 * @param port
			 * @param usr
			 * @param pwd
			 * @param id
			 * @returns {defer.promise}
			 */
			connect: function(host, port, usr, pwd, id, reconnect) {
				var defer = $q.defer();

				_host = host || _host;
				_port = parseInt(port) || _port;
				_reconnect = reconnect || _reconnect;

				if ( (_client === undefined) || (_client.connected === false) ) {
					_client = Stomp.client('ws://' + _host + ':' + _port.toString() + '/stomp');

					_client.connect({ login: usr || _usr, passcode: pwd || _pwd, 'cliend-id': id  || 'stomp_' + new Date().getTime().toString() },
						// onSuccess
						function() {
							$log.debug("services/lazy/STOMP.js: connect() -> connection established!");
							defer.resolve(true);
						},
						// onError
						function() {
							$log.error("services/lazy/STOMP.js: connect() -> connection failed!");
							defer.reject(false);
						}
					);
				} else {
					defer.resolve(true);
				}

				return defer.promise;
			},

			/**
			 * Subscribe to a particular channel (queue|topic)
			 * @param channel
			 * @param onMessageArrived
			 * @param header
			 * @param toJSON
			 */
			subscribe: function(channel, onMessageArrived, header, toJSON) {
				var channel = channel || '/queue/test',
					 header  = header  || {};

				var callbackFn = function(message) {
					$log.debug("services/lazy/STOMP.js: subscribe() -> message received from the '" + channel + "' channel.");

					if (angular.isFunction(onMessageArrived)) {
						if (toJSON) {
							message.body = JSON.parse(message.body);
						}

						onMessageArrived(message);
					}
				};

				if ( (_client.connected === false) && (_reconnect == true) ) {
					this.connect().then(
						// onSuccess
						function(response) {
							_client.subscribe(channel, callbackFn, header);
						}
					);
				} else {
					_client.subscribe(channel, callbackFn, header);
				}
			},

			/**
			 * Unsubscribe from that particular channel (queue|topic)
			 * @param channel
			 */
			unsubscribe: function(channel) {
				if (_client.connected === true) {
					$log.debug("services/lazy/STOMP.js: unsubscribe() -> client unsubscribed from the '" + channel + "' channel.");
					_client.unsubscribe(channel);
				}
			},

			/**
			 * Send a message to a channel (queue|topic)
			 * @param channel
			 * @param header
			 * @param text
			 * @param stringifyJSON
			 */
			sendMessage: function(channel, header, text, stringifyJSON) {
				var channel = channel || '/queue/test',
					 header  = header  || {};

				if ( (_client == undefined) && (_reconnect == true) ) {
					this.connect().then(
						// onSuccess
						function(response) {
							_client.send(channel, header, (stringifyJSON) ? JSON.stringify(text) : text);
						}
					);
				} else {
					_client.send(channel, header, (stringifyJSON) ? JSON.stringify(text) : text);
				}
			},

			/**
			 * Disconnect from the STOMP server
			 * @param callbackFn
			 */
			disconnect: function(callbackFn) {
				if (_client.connected === true) {
					$log.debug("services/lazy/STOMP.js: disconnect() -> connection closed!");

					if (angular.isFunction(callbackFn)) {
						_client.disconnect(callbackFn);
					} else {
						_client.disconnect();
					}
				}
			}
		};
	}]);
