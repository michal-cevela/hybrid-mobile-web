'use strict';

/**
 * @name Angular Directive: <button/>
 * @author Michal Čevela
 * @version 1.0
 */
angular.module('Directive.Button', [])
	// <button type="submit" size="small" />
	.directive('button', function() {
		return {
			restrict: 'E',
			compile: function(element, attribs) {
				element.addClass('btn');

				if (attribs.type === 'submit') {
					element.addClass('btn-primary');
				}

				if (attribs.size) {
					element.addClass('btn-' + attribs.size);
				}
			}
		};
	});
