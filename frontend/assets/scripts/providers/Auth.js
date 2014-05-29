'use strict';

/**
 * @name Angular Provider: Auth
 * @author Michal Čevela
 * @version 1.0
 */
angular.module('Provider.Auth', [])
	.provider('Auth', [function() {
		return {
			$get: [function() {
				return {
					EVENTS: {
						loginSuccess: 'auth-login-success',
						loginFailed: 'auth-login-failed',
						logoutSuccess: 'auth-logout-success',
						sessionTimeout: 'auth-session-timeout',
						notAuthenticated: 'auth-not-authenticated',
						notAuthorized: 'auth-not-authorized'
					}
				}
			}]
		}
	}]);

