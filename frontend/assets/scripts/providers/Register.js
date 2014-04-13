'use strict';

/**
 * @name Angular Provider: Register
 * @author Michal Čevela
 * @version 1.0
 */
angular.module('Provider.Register', [])
	.provider('Register', [function() {
		var _provider = {};

		return {
			/**
			 * Set a group of providers
			 * @param {JSON} providers
			 */
			setProvider: function(providers) {
				_provider = (angular.isObject(providers)) ? providers : undefined;
			},

			$get: [function() {
				return {
					/**
					 * Get a particular provider or a group of providers
					 * @param {string} name
					 * @return JSON
					 */
					getProvider: function(name) {
						return (name) ? _provider[name] : _provider;
					}
				};
			}]
		};
	}]);
