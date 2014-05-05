'use strict';

/**
 * @name Angular Constant: ROUTE
 * @author Michal Čevela
 * @version 1.0
 */
angular.module('Constant.Route', [])
	.constant('ROUTE', (function() {
		var _CONFIG = {},
			 _routes = {
				controllers: []
			 };

		return {
			/**
			 * Set the application's CONFIGuration
			 * @param {Object} CONFIG
			 * @returns {null}
			 */
			setConfig: function(CONFIG) {
				_CONFIG = CONFIG;
			},

			/**
			 * Get the application's CONFIGuration
			 * @returns {Object}
			 */
			getConfig: function() {
				return _CONFIG;
			},

			/**
			 * Get a service ($q, $log, $http, $timeout, $rootScope) by calling an internal injector
			 * @param {String} name
			 * @returns {angular.$service}
			 */
			getService: function(name) {
				return angular.injector(['ng']).get(name);
			},

			/**
			 * Check whether a lazy controller has been already initialized
			 * @param ctrlName
			 * @returns {boolean}
			 */
			hasLazyController: function(ctrlName) {
				return (_routes.controllers.indexOf(ctrlName) > -1) ? true : false;
			},

			/**
			 * Get the given HTML template
			 * @param {String} tplFile
			 * @returns {String}
			 */
			getTemplate: function(tplFile) {
				var $http   = this.getService('$http'),
					 tplDir  = this.getConfig().DIR.angular.templates,
					 options = {
						params: { '_': new Date().getTime() }
					 };

				return $http.get(tplDir + '/' + tplFile, options).then(
					// onSuccess
					function (response) {
						$log.debug('constants/Route.js -> getTemplate(): ' + tplDir + '/' + tplFile + ' (ok)');
						return response.data;
					},
					// onError
					function (response) {
						$log.error('constants/Route.js -> getTemplate(): ' + tplDir + '/' + tplFile + ' (failed)');
						var url = response.CONFIG.url;

						switch (response.status) {
							case 404:
								return '<div class="top-10px red bold">404: Page not found</div>';
/*
								return $this.getTemplate('404.html').then(
									// onSuccess
									function (response) {
										return response.data;
									},
									// onError
									function (response) {
										return '<div class="top-10px red bold">404: Page not found</div>';
									}
								);
*/
								break

							default:
								return '<div class="top-10px red bold">Error status: ' + response.status + '</div>';
						}
					}
				);
			},

			/**
			 * Set a functionality for the Resolve block that is applicable within a route definition
			 */
			resolve: {
				// Notice: HTTP requests using angular's $http or $resource service CAN be intercepted within this scope!
				security: ['$q', '$location', 'Security',
					function($q, $location, Security) {
						var defer = $q.defer(),
							 routePath = $location.$$path;

						Security.hasAccess(defer);
						return defer.promise;
					}
				],

				lazyLoading: ['$q', '$stateParams', '$filter', '$state', 'CONFIG', 'ROUTE',
					function($q, $stateParams, $filter, $state, CONFIG, ROUTE) {
						var defer = $q.defer(),
							 ctrl = {
								 dir: CONFIG.DIR.js + '/' + CONFIG.DIR.angular.controllers,
								 file: ''
							 },
							 params = {};

						if ($$util.isEmpty($stateParams['level1'])) {
							ctrl.file = 'Home';
						} else {
							ctrl.file = $filter('firstUpperCase')($stateParams['level1']);
						}

						if (ROUTE.hasLazyController(ctrl.file) == true) {
							defer.resolve('OK');
						} else {
							$$util.loadJScripts({
								dirs: [ ctrl.dir + '/lazy' ],
								files: [
									[ ctrl.file + '.js' ]
								]
							}).then(
								// Success
								function(response) {
									$log.debug('constants/Route.js: A lazy controller loaded...');
									$log.debug($$util.getStatus(response));

									_routes.controllers.push(ctrl.file);

									if (window.$dependencies) {
										var promises = [];

										for (var dependency in window.$dependencies) {
											if (window.$dependencies[dependency].length > 0) {
												promises.push(
													$$util.loadJScripts({
														dirs: [ CONFIG.DIR.js + '/' + CONFIG.DIR.angular[dependency] + '/lazy' ],
														files: [
															window.$dependencies[dependency]
														]
													})
												);
											}
										}

										$q.all(promises).then(
											function(response) {
												$log.debug("constants/Route.js: Lazy controller's dependencies loaded...");
												$log.debug($$util.getStatus(response));
												defer.resolve(response);
											},
											function(response) {
												$log.error("constants/Route.js: One of the controller's dependencies failed...");
												$log.error($$util.getStatus(response));
												defer.reject(response);
											}
										)
										delete window.$dependencies;
									} else {
										defer.resolve(response);
									}
								},
								// Error
								function(response) {
									$log.error('constants/Route.js: Controller failed');
									$log.error($$util.getStatus(response));
									defer.reject(response);
								}
							)
						}

						return defer.promise;
					} // end: function(...)
				] // end: lazyController
			}
		}
	})());
