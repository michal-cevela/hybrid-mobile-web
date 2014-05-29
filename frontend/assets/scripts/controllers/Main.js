'use strict';

/**
 * @name Angular Controller: Main
 * @author Michal Čevela
 * @version 1.0
 */
angular.module('Ctrl.Main', [])
	.controller('MainCtrl', ['$scope', '$location', '$window', '$filter', 'Url', 'User', 'Security',
		function($scope, $location, $window, $filter, Url, User, Security) {
			$log.debug('controllers/Main.js: The main controller has been initialized.');

			$log.debug('SECURITY:');
			$log.debug(Security);

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
					],

					userRoles = toState.data.userRoles,

					title = params.filter(function(value, index) {
						return (angular.isDefined(value)) ? true : false;
					}).join(": ");

					$window.document.title = $filter('firstUpperCase')(title);
/*
					$log.debug('USER ROLES:');

					if (userRoles.length > 0) {
						$log.debug(userRoles[0]());
						$scope.$broadcast(userRoles);
					} else {
						$log.error("Not allowed");
						event.preventDefault();
					}
*/
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
