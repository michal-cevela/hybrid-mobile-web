'use strict';

/**
 * @name Angular Controller: Footer
 * @author Michal Čevela
 * @version 1.0
 */
angular.module('Ctrl.Footer', [])
	.controller('FooterCtrl', ['$scope', 'Url', function($scope, Url) {
		$scope.hash = Url.getPrefix();

		$scope.links = [
			{
				text: 'Home',
				path: '/'
			}, {
				text: 'Books',
				path: '/books/menu'
			}, {
				text: 'Contact',
				path: '/contact'
			}
		];
	}])
