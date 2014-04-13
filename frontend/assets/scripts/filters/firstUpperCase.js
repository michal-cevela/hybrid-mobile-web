'use strict';

/**
 * @name Angular Filter: First Upper Case
 * @author Michal Čevela
 * @version 1.0
 */
angular.module('Filter.firstUpperCase', [])
	.filter('firstUpperCase', function() {
		return function(text) {
			if (angular.isString(text)) {
				text = text.toLowerCase();
				return text.charAt(0).toUpperCase() + text.slice(1);
			} else {
				return "";
			}
		};
	});