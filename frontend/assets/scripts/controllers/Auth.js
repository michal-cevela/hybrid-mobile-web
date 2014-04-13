'use strict';

/**
 * @name Angular Controller: Auth
 * @author Michal Čevela
 * @version 1.0
 */
angular.module('Ctrl.Auth', [])
	.controller('AuthCtrl', ['$scope', '$location', '$route', 'security', 'User', 'CONFIG', 'ROUTE', 'WS',
		function($scope, $location, $route, security, User, CONFIG, ROUTE, WS) {

			$scope.User = User;

			$scope.login = {
				usr: '',
				pwd: ''
			};

			security.promise.then(
				// onSuccess
				function(response) {
					$log.debug('controllers/Auth.js -> security.success');

					ROUTE.getDeferrer().forTemplatePath($location.$$path).promise.then(
						// onSuccess
						function(response) {
							$log.debug('controllers/Auth.js -> templateDefer.success');

							try {
								var routePath = $route.current.$$route.originalPath;
								return $resource(WS.getRestPoint(true) + CONFIG.API_Path + routePath, {});
							} catch (ex) {
								$log.error(ex.message);
								return undefined;
							}
						},
						// onError
						function(response) {
							$log.error('controllers/Auth.js -> templateDefer.error');
							return undefined;
						}
					);
				},
				// onError
				function(response) {
					$log.error('controllers/Auth.js -> security.error');
					return undefined;
				}
			);
		}])
