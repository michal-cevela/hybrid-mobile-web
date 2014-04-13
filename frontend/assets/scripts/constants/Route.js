'use strict';

/**
 * @name Angular Constant: ROUTE
 * @author Michal Čevela
 * @version 1.0
 */
angular.module('Constant.Route', [])
	.constant('ROUTE', (function() {
		var _config = {},
			 _routes = {
				controllers: []
			 };

		return {
			/**
			 * Set the application's configuration
			 * @param {Object} config
			 * @returns {null}
			 */
			setConfig: function(config) {
				_config = config;
			},

			/**
			 * Get the application's configuration
			 * @returns {Object}
			 */
			getConfig: function() {
				return _config;
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
			 * Load the given HTML template
			 * @param {String} tplPath
			 * @returns {String}
			 */
			loadTemplate: function(tplPath) {
				var $this = this;

				return this.getTemplate(tplPath).then(
					// onSuccess
					function (response) {
						return response.data;
					},
					// onError
					function (response) {
						var url = response.config.url;

						switch (response.status) {
							case 404:
								return '<div class="top-10px red bold">404: Page not found</div>';
//								return '<div class="top-10px red bold">404: Template ' + url + ' was not found on the server</div>';
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
			 * Get an HTML template
			 * @param {String} tplFile
			 * @returns {defer.promise}
			 */
			getTemplate: function(tplFile) {
				var $http = this.getService('$http'),
					 $templateCache = this.getService('$templateCache'),
					 defer = this.getService('$q').defer(),
					 config = this.getConfig(),
					 tplDir = config.DIR.angular.templates,
					 options = { params: { '_': new Date().getTime() } };

				if (config.CACHE.enabled === true) {
					options['cache'] = $templateCache;
				}

				$http.get(tplDir + '/' + tplFile, { params: { '_': new Date().getTime() } }).then(
					// onSuccess
					function (response) {
						$log.debug('constants/Route.js -> getTemplate(): ' + tplDir + '/' + tplFile + ' (ok)');
						defer.resolve(response);
					},
					// onError
					function (response) {
						$log.error('constants/Route.js -> getTemplate(): ' + tplDir + '/' + tplFile + ' (failed)');
						defer.reject(response);
					}
				);

				return defer.promise;
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

				lazyLoading: ['$q', '$stateParams', '$filter', '$state', 'CONFIG',
					function($q, $stateParams, $filter, $state, CONFIG) {
						var defer = $q.defer(),
							 ctrl = {
								 dir: CONFIG.DIR.js + '/' + CONFIG.DIR.angular.controllers,
								 file: ''
							 },
							 params = {};

						if ($$util.isEmpty($stateParams['level1'])) {
							ctrl.file = 'Home.js';
						} else {
							ctrl.file = $filter('firstUpperCase')($stateParams['level1']) + '.js';
						}

						$$util.loadJScripts({
							dirs: [ ctrl.dir + '/lazy' ],
							files: [
								[ ctrl.file ]
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

						return defer.promise;
					} // end: function(...)
				] // end: lazyController
			}
		}
	})());
