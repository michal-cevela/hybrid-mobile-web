'use strict';

/**
 * @name Angular Service: Route Interceptor
 * @author Michal Čevela
 * @version 1.0
 */
angular.module('Service.RouteInterceptor', [])
	.factory('RouteInterceptor', ['$q', '$injector', function($q, $injector) {
		return {
			request: function(config) {
//				$log.debug('services/RouteInterceptor.js: request -> ' + config.url);

				// set the request header to 'X-CSRF-Token'
				// TODO: setRequestHeader('X-CSRF-Token', 'Basic YmVlcDpib29w');
				return config || $q.when(config);
			},

			requestError: function(config) {
				$log.error('services/RouteInterceptor.js: requestError');
//				$log.error(config);
				return $q.reject(config);
			},

			response: function(response) {
				$log.debug('services/RouteInterceptor.js: response -> ' + response.config.url);
				$log.debug(response);
//				$log.debug('pending requests: ' + $http.pendingRequests.length);

				// check the response header for X-Content-Type-Options: nosniff
				// TODO: delete getResponseHeader('X-Content-Type-Options');

				// set the response header 'X-(i)frame-Options' to DENY
				// TODO: setResponseHeader('X-(i)frame-Options', 'DENY');
				return response || $q.when(response);
			},

			responseError: function(response) {
				$log.error('services/RouteInterceptor.js: responseError -> ' + response.config.url);
//				$log.error(response);
//				var $http = $injector.get('$http');

				switch (response.status) {
					case 404:
						response.error = '404: ' + response.config.url + ' was not found on the server';
						break;
				}

				return $q.reject(response);
			}
		};
	}]);
