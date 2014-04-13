'use strict';

/**
 * @name Angular Service: User
 * @author Michal Čevela
 * @version 1.0
 */
angular.module('Service.User', [])
	.factory('User', [function() {
		var _signedIn = false;

		return {
			signIn: function() {
				_signedIn = true;
			},

			signOut: function() {
				_signedIn = false;
			},

			isSignedIn: function() {
				return _signedIn;
			}
		};
	}]);
