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

			$get: [function() {
				return {
					/**
					 * Get the URL prefix
					 * @returns {String}
					 */
					getPrefix: function() {
						return _prefix;
					}
				};
			}]
		};
	}]);
