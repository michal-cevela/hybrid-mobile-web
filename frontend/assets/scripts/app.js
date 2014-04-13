'use strict';

var app = angular.module('workshop', [
		'ngResource', 'ngRoute', 'ngSanitize', 'ui.router',
		'Constants', 'Controllers', 'Directives', 'Filters', 'Providers', 'Services', 'Settings'
	])
	.config(['$compileProvider', '$locationProvider', '$httpProvider', '$logProvider', 'UrlProvider',
		function($compileProvider, $locationProvider, $httpProvider, $logProvider, UrlProvider) {
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

			// Set up interceptors (AOP)
			$httpProvider.interceptors.push('RouteInterceptor');

			// Enable debugging
			$logProvider.debugEnabled(true);
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
			}

			RegisterProvider.setProvider(providers);
			$$util.setProvider(providers);
		}]
	)
	// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	.config(['$stateProvider', '$urlRouterProvider', '$routeProvider', 'SecurityProvider', 'CONFIG', 'ROUTE',
			function($stateProvider, $urlRouterProvider, $routeProvider, SecurityProvider, CONFIG, ROUTE) {
		// Notice: Interceptors are not visible/accessible inside configuration block!
		// Neither $http nor $resource service can be intercepted within this scope!
		SecurityProvider.setAccess(true);
		SecurityProvider.setAllowedProtocols(['file:', 'http:', 'https:']);

		// CONFIG -> init.js
		// ROUTE -> constants/Route.js
		ROUTE.setConfig(CONFIG);

		// For any unmatched url, redirect to /
		$urlRouterProvider.when('/', '/home');
		$urlRouterProvider.otherwise('/home');

		$stateProvider.state('home', {
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
		.state('home.level1', {
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
		.state('home.level2', {
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
	}])
	// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	.run(['$rootScope', '$http', '$state', '$templateCache', 'CONFIG',
		function($rootScope, $http, $state, $templateCache, CONFIG) {
//			$http.defaults.headers.common['Authentication'] = 'Basic YmVlcDpib29w';
			$http.defaults.cache = (CONFIG.CACHE.enabled !== "true") ? false : true;

			if (!$http.defaults.cache) {
				$log.debug("app.js: Template caching was disabled.");
			} else {
				$log.debug("app.js: Template caching was enabled.");
			}

			$rootScope.$on('$viewContentLoaded', function() {
				$templateCache.removeAll();
			});
		} // end: function()
	]);
