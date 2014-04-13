'use strict';

/**
 * @name Angular Service: Books
 * @author Michal Čevela
 * @version 1.0
 */
angular.module('Service.Books', [])
	.factory('Books', ['$resource', function($resource) {
		return {
			REST: function(url, params) {
				return $resource(url, params, {
					list: {
						method: 'GET',
						params: { action: 'list' },
						isArray: true
					}
				});
			},
			getLinks: function() {
				return [{
					url : '#/books/list',
					text: 'List all books'
				},{
					url : '#/book/new',
					text: 'Add a new book'
				}];
			}
		};
	}]);
