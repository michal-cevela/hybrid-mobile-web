'use strict';

/**
 * @name Angular Service: User
 * @author Michal Čevela
 * @version 1.0
 */
angular.module('Service.Parser', [])
	.factory('Parser', ['$interpolate', function($interpolate) {
		var _signedIn = false;

		return {
			/**
			 * Parse an HTML template
			 * @param text = <div>From: {{email.from}}</div><div>To: {{email.to}}</div>
			 * @param context = {
			 * 	'email.from': $scope.email.from,
			 * 	'email.to': $scope.email.to
			 * }
			 * @returns {*}
			 */
			parseHtml: function(text, context) {
				return $interpolate(text)(context);
			}
		};
	}]);
