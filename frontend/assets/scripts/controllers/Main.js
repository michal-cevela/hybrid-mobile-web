'use strict';

/**
 * @name Angular Controller: Main
 * @author Michal Čevela
 * @version 1.0
 */
angular.module('Ctrl.Main', [])
	.controller('MainCtrl', ['$scope', '$location', '$window', '$filter', 'Url', 'User',
		function($scope, $location, $window, $filter, Url, User) {
			$log.debug('controllers/Main.js: The main controller has been initialized.');

			$scope.User = User;
			$scope.Url  = Url;

			$scope.$on('$stateChangeStart',
				function(event, toState, toParams, fromState, fromParams) {
/*
					 $log.debug('Main.js: STATE CHANGE START');
					 $log.debug($location);
					 $log.debug(toState);
					 $log.debug(toParams);
*/
					var params = [
						toParams.level1,
						toParams.level2,
						toParams.level3
					];

					var title = params.filter(function(value, index) {
						return (angular.isDefined(value)) ? true : false;
					}).join(": ");

					$window.document.title = $filter('firstUpperCase')(title);
				}
			);

			$scope.$on('$stateChangeError',
				function(event, state, toState, fromState) {
					$log.debug('controllers/Main.js: STATE CHANGE ERROR');
/*
					 $log.debug('Main.js: stateChangeError...');
					 $log.debug($location);
					 $log.debug(event);
					 $log.debug(state);
					 $log.debug(fromState);
					 $log.debug(toState);
*/
					event.preventDefault();
//					$location.path('/404.html').replace();
				}
			);
/*
			$scope.$on('$routeChangeError', function(event, current, previous, rejection) {
				$log.debug('controllers/Main.js: ROUTE CHANGE ERROR');
				event.preventDefault();
			});

			$scope.$on('$locationChangeStart', function(event, next, current) {
			});

			$scope.$on('$routeChangeStart', function(event, current, previous) {
			});

			$scope.$on('$routeChangeSuccess', function(event, current, previous) {
			});
*/
		}
	]);
