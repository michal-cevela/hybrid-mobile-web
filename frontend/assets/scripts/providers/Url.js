'use strict';

/**
 * @name Angular Provider: URL
 * @author Michal Čevela
 * @version 1.0
 */
angular.module('Provider.Url', [])
	.provider('Url', [function() {
		var _prefix = '#';

		return {
			/**
			 * Set an URL prefix
			 * @param {Boolean} boolean
			 * @return {undefined}
			 */
			setPrefix: function(prefix) {
				_prefix = prefix;
			},

			$get: ['$location', function($location) {
				return {
					/**
					 * Get the URL prefix
					 * @returns {String}
					 */
					getPrefix: function() {
						return _prefix;
					},

					/**
					 * Redirect to an URL address
					 * @param {String}
					 * @returns undefined
					 */
					redirect: function (url) {
						$location.path(url).replace();
					}
				};
			}]
		};
	}]);
