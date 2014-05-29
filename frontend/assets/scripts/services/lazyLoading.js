'use strict';

/**
 * @name Angular Service: lazyLoading
 * @author Michal Čevela
 * @version 1.0
 */
angular.module('Service.lazyLoading', [])
	.factory('lazyLoading', ['$q', function($q) {
		var defer = $q.defer(),
			 isResolved = false,
			 isRejected = false;

		return {
			getDefer: function() {
				if ( (isResolved === true) || (isRejected === true) ) {
					isResolved = false;
					isResolved = false;
					defer = $q.defer();
				}
				return defer;
			},

			setResolve: function(msg) {
				this.getDefer().resolve(msg || 'Lazy dependencies (ok)');
				isResolved = true;
			},

			setReject: function(msg) {
				this.getDefer().reject(msg || 'Lazy dependencies (error)');
				isRejected = true;
			}
		};
	}]);
