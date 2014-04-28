'use strict';

/**
 * @name Angular Provider: WS
 * @author Michal Čevela
 * @version 1.0
 */
angular.module('Provider.WS', [])
	.provider('WS', [function() {
		return {
			configBaseUrl: function(CONFIG) {
				var protocol = window.location.protocol,
					 host, REST;

				if (protocol == 'file:') {
					host = 'http://' + CONFIG.HOST.IP + ':' + CONFIG.HOST.port;
				} else {
					host = protocol + '//' + CONFIG.HOST.alias;
				}

				return (host + CONFIG.WS.context + CONFIG.WS.REST);
			},

			$get: ['Security', 'CONFIG', function(Security, CONFIG) {
				var allowedProtocols = Security.getAllowedProtocols();

				return {
					/**
					 * Get the REST point defined in the configuration file
					 * @param {boolean} escape
					 * @return {String}
					 */
					getRestPoint: function(escape) {
						var protocol = window.location.protocol;

						if (allowedProtocols.indexOf(protocol) > -1) {
							var host, REST;

							if (protocol == 'file:') {
								host = 'http://' + CONFIG.HOST.IP + ':' + CONFIG.HOST.port;
							} else {
								host = protocol + '//' + CONFIG.HOST.alias;
							}

							REST = host + CONFIG.WS.context + CONFIG.WS.REST;
							return (escape) ? REST.replace(/:/g, "\\:") : REST;
						} else {
							var error = "The '" + protocol + "' protocol is not supported!";
							throw error;
						}
					},

					/**
					 * Get the SOAP point defined in the configuration file
					 * @param {boolean} escape
					 * @return {String}
					 */
					getSoapPoint: function(escape) {
						var protocol = window.location.protocol;

						if (allowedProtocols.indexOf(protocol) > -1) {
							var host, SOAP;

							if (protocol == 'file:') {
								host = 'http://' + CONFIG.HOST.IP + ':' + CONFIG.HOST.port;
							} else {
								host = protocol + '//' + CONFIG.HOST.alias;
							}

							SOAP = host + CONFIG.WS.context + CONFIG.WS.REST;
							return (escape) ? SOAP.replace(/:/g, "\\:") : SOAP;
						} else {
							var error = "The '" + protocol + "' protocol is not supported!";
							throw error;
						}
					}
				};
			}]
		};
	}]);
