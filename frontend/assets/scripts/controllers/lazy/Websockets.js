'use strict';

/**
 * @name Angular Controller: WebSockets
 * @author Michal Čevela
 * @version 1.0
 */
window.$dependencies = {
	constants: [],
	filters: [],
	services: [ 'MQTT.js', 'STOMP.js' ],
	directives: []
};

$$util.getProvider('controller')
	.register('WebsocketsCtrl', ['$scope', '$q', 'CONFIG', 'MQTT', 'STOMP',
		function ($scope, $q, CONFIG, MQTT, STOMP) {
			$log.debug("controllers/lazy/Websockets.js: loaded!");

			$scope.msg = {
				send: "",
				received: ""
			};

			$scope.STOMP = {
				connect: function() {
					STOMP.connect(CONFIG.HOST.IP, 61614, 'smx', 'smx', null, null).then(
						// onSuccess
						function(response) {
							STOMP.subscribe('/topic/test', function(a_message) {
								var content = a_message.body;
//								$log.debug(content);

								$scope.$apply(function() {
									$scope.msg.received += content.data + '\n';
								});
								// { priority: 9, ack: 'client', 'selector': "location = 'Europe'" }
							} , { priority: 1 }, true);
						},
						// onError
						function(response) {
							// TODO:
						}
					);
				},
				sendMessage: function() {
					STOMP.sendMessage('/topic/test', {}, { data: $scope.msg.send }, true);
					$scope.msg.send = "";
				},
				disconnect: STOMP.disconnect
			}
/*
			MQTT.connect(CONFIG.HOST.IP, 61614, null, 5, true,
				// onSuccess
				function() {
					MQTT.subscribe('/workshop/#', 2);

					window.setTimeout(function() {
						MQTT.sendMessage('Test', '/workshop/test', 2);
					}, 3000);

					window.setTimeout(function() {
						MQTT.disconnect();
					}, 5000);
				},

				// onFailure
				function(response) {
					//	$log.error(response);
				},

				// onMessageArrived
				function(a_message) {
					$log.debug(a_message);
				},

				// onConnectionLost
				function(response) {
					//	$log.error(response);
				}
			);
*/
		}
	]);
