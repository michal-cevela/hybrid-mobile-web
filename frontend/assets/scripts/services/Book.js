'use strict';

/**
 * @name Angular Service: Book
 * @author Michal Čevela
 * @version 1.0
 */
angular.module('Service.Book', [])
	.factory('Book', ['$resource', function($resource) {
		return {
			CRUD: function(url, params) {
				return $resource(url, params, {
					get: {
						method: 'GET',
						params: { action: 'detail' }
					},
					add: {
						method: 'POST',
						params: { action: 'new' }
					},
					update: {
						method: 'PUT',
						params: { action: 'update' }
					},
					remove: {
						method: 'DELETE',
						params: { action: 'delete' }
					}
				});
			}
		};
	}]);
