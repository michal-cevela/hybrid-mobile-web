'use strict';

/**
 * @name Angular Service: Contact
 * @author Michal Čevela
 * @version 1.0
 */
$$util.getProvider('service')
	.factory('Contact', ['$resource', function($resource) {
		return {
			REST: function(url, params) {
				return $resource(url, params, {
					get: {
						method: 'GET',
						params: { action: 'contact' },
						isArray: false
					}
				});
			}
		};
	}
]);
