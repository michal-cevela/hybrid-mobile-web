'use strict';

/**
 * @name Angular Provider: Security
 * @author Michal Čevela
 * @version 1.0
 */
angular.module('Provider.Security', [])
	.provider('Security', [function() {
		var _hasAccess = false;
		var _protocols = [];  // ['file:', 'http:', 'https:']

		return {
			/**
			 * Set an access to the user
			 * @param {Boolean} boolean
			 * @return {undefined}
			 */
			setAccess: function(boolean) {
				_hasAccess = boolean;
			},

			/**
			 * Set an array of allowed protocols
			 * @param {Array} protocols
			 * @returns {undefined}
			 */
			setAllowedProtocols: function(protocols) {
				_protocols = protocols;
			},

			$get: [function() {
				return {
					/**
					 * Check whether or not the user can acces that particular page
					 * @param {$q.defer()} deferred
					 * @return {boolean}
					 */
					hasAccess: function(deferred) {
						if (_hasAccess) {
							if (deferred) {
								$log.debug('services.js: Security.checkCredentials() -> defer.security.resolve(status:200)');
								deferred.resolve({ status: 200 });
							}
							return true;
						} else {
							if (deferred) {
								$log.error('services.js: Security.checkCredentials() -> defer.security.reject(status:401)');
								deferred.reject({ status: 401 });
							}
							return false;
						}
					},

					/**
					 * Get the array of allowed protocols
					 * @returns {Array}
					 */
					getAllowedProtocols: function() {
						return _protocols;
					}
				};
			}]
		};
	}]);
