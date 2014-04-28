'use strict';

var app = angular.module('workshop', [
		'ngResource', 'ngRoute', 'ngSanitize', 'ui.router', 'restangular',
		'Constants', 'Controllers', 'Directives', 'Filters', 'Providers', 'Services', 'Settings'
	])
	.config(['$compileProvider', '$locationProvider', '$httpProvider', '$logProvider', '$interpolateProvider', 'UrlProvider',
		function($compileProvider, $locationProvider, $httpProvider, $logProvider, $interpolateProvider, UrlProvider) {
			$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
			$locationProvider.html5Mode(false);
			UrlProvider.setPrefix('#');

			$httpProvider.defaults.useXDomain = true; // enable CORS (Cross-Origin Resource Sharing)
			$httpProvider.defaults.withCredentials = true;
//			$httpProvider.defaults.headers.common['X-XSRF-Token']  = 'Basic YmVlcDpib29w'; // Cross-Site Request Forgery
//			$httpProvider.defaults.headers.common['Authorization'] = 'Basic YmVlcDpib29w';
//			$httpProvider.defaults.headers.common['project-name']  = 'Cordova Workshop';
//			$httpProvider.defaults.headers.post['Content-Type']    = 'application/x-www-form-urlencoded';

			// As of version 1.2.x., these workarounds are no longer needed
//			$compileProvider.urlSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
//			delete $httpProvider.defaults.headers.common['X-Requested-With'];

			// Set up $http interceptors (AOP)
			$httpProvider.interceptors.push('RouteInterceptor');

			// Enable debugging
			$logProvider.debugEnabled(true);

			// Set up the starting and/or ending interpolating symbols
//			$interpolateProvider.startSymbol('__');
//			$interpolateProvider.endSymbol('__');
		}
	])
	// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	.config(['$controllerProvider', '$compileProvider', '$filterProvider', '$httpProvider', '$stateProvider', '$provide', 'RegisterProvider',
		function($controllerProvider, $compileProvider, $filterProvider, $httpProvider, $stateProvider, $provide, RegisterProvider) {
			var providers = {
				'controller': $controllerProvider, // .register,
				'directive' : $compileProvider,    // .directive,
				'filter' : $filterProvider,        // .register,
				'factory': $provide,               // .factory,
				'service': $provide,               // .service,
				'$httpProvider' : $httpProvider,
				'$stateProvider': $stateProvider
			};

			RegisterProvider.setProvider(providers);
			$$util.setProvider(providers);
		}]
	)
	// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	.config(['$stateProvider', '$urlRouterProvider', '$routeProvider', 'RestangularProvider', 'SecurityProvider', 'WSProvider', 'CONFIG', 'ROUTE',
		function($stateProvider, $urlRouterProvider, $routeProvider, RestangularProvider, SecurityProvider, WSProvider, CONFIG, ROUTE) {
			// Notice: Interceptors are not visible/accessible inside configuration block!
			// Neither $http nor $resource service can be intercepted within this scope!
			SecurityProvider.setAccess(true);
			SecurityProvider.setAllowedProtocols(['file:', 'http:', 'https:']);

			// CONFIG -> init.js
			// ROUTE -> constants/Route.js
			ROUTE.setConfig(CONFIG);

			// Set the base URL to handle REST APIs
			RestangularProvider.setBaseUrl(WSProvider.configBaseUrl(CONFIG));

			// Set the self-reference link
			RestangularProvider.setRestangularFields({
				selfLink: 'self.href'
			});

			// For any unmatched url, redirect to /
			$urlRouterProvider.when('/', '/home');
			$urlRouterProvider.otherwise('/home');

			$stateProvider.state('main', {
				abstract: true,
				url: '',
				views: {
					'navbar@': {
						templateProvider: [function() {
							return ROUTE.loadTemplate('navbar.html');
						}]
					},
					'content@': {
						template: '<div ui-view></div>'
					},
					'footer@': {
						templateProvider: [function() {
							return ROUTE.loadTemplate('footer.html');
						}]
					}
/*
					'@stateName.child': {
						templateUrl: 'path/to/template.html',
						controller: ['$scope', '$state', '$stateParams', function($scope, $state, $stateParams) {
							$scope.done = function() {
								$state.go('^');
							}
						}]
					}
*/
				}
			})
			.state('main.level1', {
				url: '/:level1',
				controllerProvider: ['$stateParams', '$filter', 'ROUTE',
					function($stateParams, $filter, ROUTE) {
						var param1 = $stateParams.level1,
							 ctrlName = ($$util.isEmpty(param1)) ? 'Home' : $filter('firstUpperCase')(param1);

						if (ROUTE.hasLazyController(ctrlName + '.js') == true) {
							return ctrlName + 'Ctrl';
						}
					}
				],
				templateProvider: ['$stateParams', 'ROUTE',
					function($stateParams, ROUTE) {
						// Notice: HTTP requests using $http or $resource service CANNOT be intercepted within this scope!
						var param1 = $stateParams.level1,
							 tplFile = ($$util.isEmpty(param1)) ? 'home.html' : param1.toLowerCase() + '.html';

						return ROUTE.loadTemplate(tplFile);
					}
				],
				resolve: {
					lazyLoading: ROUTE.resolve.lazyLoading
				}
			})
			.state('main.level2', {
				url: '/:level1/:level2',
				controllerProvider: ['$stateParams', '$filter', 'ROUTE',
					function($stateParams, $filter, ROUTE) {
						var param1 = $stateParams.level1,
							 ctrlName = ($$util.isEmpty(param1)) ? 'Home' : $filter('firstUpperCase')(param1);

						if (ROUTE.hasLazyController(ctrlName + '.js') == true) {
							return ctrlName + 'Ctrl';
						}
					}
				],
				templateProvider: ['$stateParams', 'ROUTE',
					function($stateParams, ROUTE) {
						// Notice: HTTP requests using $http or $resource service CANNOT be intercepted within this scope!
						var param1  = $stateParams.level1,
							 param2  = $stateParams.level2,
							 tplFile = ($$util.isEmpty(param1) || $$util.isEmpty(param2)) ? 'home.html' : param1.toLowerCase() + '-' + param2.toLowerCase() + '.html';

						return ROUTE.loadTemplate(tplFile);
					}
				],
				resolve: {
					lazyLoading: ROUTE.resolve.lazyLoading
				}
			});
		}
	])
	// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	.run(['$rootScope', '$http', '$state', '$templateCache', 'Restangular', 'CONFIG',
		function($rootScope, $http, $state, $templateCache, Restangular, CONFIG) {
//			$http.defaults.headers.common['Authentication'] = 'Basic YmVlcDpib29w';
			$http.defaults.cache = (CONFIG.CACHE.enabled !== "true") ? false : true;

			if (!$http.defaults.cache) {
				$log.debug("app.js: Template caching was disabled.");

				$rootScope.$on('$viewContentLoaded', function() {
					$templateCache.removeAll();
				});
			} else {
				$log.debug("app.js: Template caching was enabled.");
			}
/*
			Restangular.setRestangularFields({
				id: '_id.$oid'
			});

			Restangular.setResponseInterceptor(function(data, operation, what) {
				stopLoading();
				if (operation == 'getList') {
					return data[what];
				}
				return data;
			});

			Restangular.setRequestInterceptor(function(elem) {
				startLoading();
				delete elem.extraInfo;
				return elem;
			});

			Restangular.setMethodOverriders(['put', 'delete']);

			Restangular.setRequestSuffix('.json');

			Restangular.setErrorInterceptor(function(response) {
				stopLoading();
				displayError();
			});

			Restangular.withConfig(function(RestangularConfigurer) {
				RestangularConfigurer.setDefaultHeaders({'X-Auth': 'James Bond'})
			});
*/
		} // end: function()
	]);
