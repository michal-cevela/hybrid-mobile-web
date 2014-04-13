'use strict';

/**
 * @name Angular Controller: Navigation Bar
 * @author Michal Čevela
 * @version 1.0
 */
angular.module('Ctrl.Navbar', [])
	.controller('NavbarCtrl', ['$scope', '$location', 'Url', 'User',
		function($scope, $location, Url, User) {
			$scope.User = User;
			$scope.hash = Url.getPrefix();

			$scope.links = [
				{
					text: 'Home',
					path: '/'
				}, {
					text: 'List all books',
					path: '/books/list'
				}, {
					text: 'Add a new book',
					path: '/book/new'
				}, {
					text: 'About',
					path: '/about'
				}, {
					text: 'Contact',
					path: '/contact'
				}
			];
/*
			$scope.redirect = function(url) {
				$location.path(url).replace();
			};
*/
		}
	]);
