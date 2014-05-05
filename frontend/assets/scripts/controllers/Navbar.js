'use strict';

/**
 * @name Angular Controller: Navigation Bar
 * @author Michal Čevela
 * @version 1.0
 */
angular.module('Ctrl.Navbar', [])
	.controller('NavbarCtrl', ['$scope', 'User',
		function($scope, $location, User) {
			$scope.User = User;

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
		}
	]);
