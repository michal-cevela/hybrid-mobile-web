'use strict';

/**
 * @name Angular Directive: ngFocus
 * @author Michal Čevela
 * @version 1.0
 */
angular.module('Directive.ngFocus', [])
	// <* ng-focus />
	.directive('ngFocus', [function() {
		var FOCUS_CLASS = "ng-focused";

		return {
			restrict: 'A',
			require: 'ngModel',
			link: function(scope, element, attrs, ctrl) {
				ctrl.$focused = false;
				$log.debug(ctrl.$isEmpty);

				element.bind('focus', function(evt) {
					element.addClass(FOCUS_CLASS);

					scope.$apply(function() {
						ctrl.$focused = true;
					});
				}).bind('blur', function(evt) {
					element.removeClass(FOCUS_CLASS);

					scope.$apply(function() {
						ctrl.$focused = false;
					});
				});
			}
		}
	}]);
