/**
 * @name Utility
 * @author Michal Čevela
 * @version 1.0
 */
var $$util = (function() {
	var _provider = {};

	return {
		/**
		 * Get the Angular service ($q, $log, $http, $timeout, $rootScope) by calling an injector service
		 * @param {String} name
		 * @returns {Object}
		 */
		getService: function(name) {
			return angular.injector(['ng']).get(name);
		},

		/**
		 * Set a group of Angular providers
		 * @param providers
		 */
		setProvider: function(providers) {
			_provider = (angular.isObject(providers)) ? providers : undefined;
		},

		/**
		 * Get the Angular provider
		 * @param name
		 * @returns {Object}
		 */
		getProvider: function(name) {
			return _provider[name];
		},

		/**
		 * Is the app running on a mobile device?
		 * @returns {boolean}
		 */
		isMobile: function() {
			return (/^file:\/{3}[^\/]/i).test(window.location.href) &&
				(/ios|iphone|ipod|ipad|android|mobile/i).test(navigator.userAgent);
		},

		isEmpty: function(value) {
			if (value == undefined) {
				return true;
			} else {
				return (value.length == 0);
			}
		},

		/**
		 * Device ready
		 * @param {$scope} $scope
		 * @returns {$q.promise}
		 */
		deviceReady: function($scope) {
			var $q = this.getService('$q'),
				defer = $q.defer();

			if (window.cordova) {
				document.addEventListener('deviceready', function() {
					if ($scope) {
						$scope.$apply(function() {
							defer.resolve('Mobile device is ready...');
						});
					} else {
						defer.resolve('Mobile device is ready...');
					}
				}, false);
			} else {
				angular.element(document).ready(function() {
					if ($scope) {
						$scope.$apply(function() {
							defer.resolve('Desktop browser is ready...');
						});
					} else {
						defer.resolve('Desktop browser is ready...');
					}
				});
			}

			return defer.promise;
		},

		/**
		 * Bootstrap the whole application
		 * @param {String} appName
		 * @returns {$q.promise}
		 */
		bootstrap: function(appName) {
			return this.getService('$q').when(angular.bootstrap(document, [appName]));
		},

		/**
		 * Get the status from the given HTTP response
		 * @param response
		 * @returns {Array}
		 */
		getStatus: function(response) {
			var status = [];

			if (angular.isArray(response)) {
				angular.forEach(response, function(item) {

					if (angular.isArray(item)) {
						angular.forEach(item, function(subItem) {
							status.push(subItem.config.url + ' (status:' + subItem.status + ')');
						});
					} else {
						status.push(item.config.url + ' (status:' + item.status + ')');
					}
				});
			} else {
				status.push(response.config.url + ' (status:' + response.status + ')');
			}

			return status;
		},

		/**
		 * Load a bunch of JavaScript files
		 * @param {Array|Object} JScripts
		 * @returns {$q.promise}
		 */
		loadJScripts: function(JScripts) {
			var $q    = this.getService('$q'),
				$http = this.getService('$http'),
				scripts = [];

			angular.forEach(JScripts.dirs, function(jsDir, indexDir) {
				angular.forEach(JScripts.files[indexDir], function(jsFile, indexFile) {
					var url = jsDir + '/' + jsFile;

					scripts.push($http.get(url, {
						params: { '_': new Date().getTime() },
						transformResponse: function(response, headersGetter, status) {
							try {
								// evaluate the given script on the global (window) scope
								eval.call(window, response);
							} catch (ex) {
								$log.error('util.js -> loadJScripts(): ' + ex.message + ' (exception)');
							}
							return response;
						}
					}));
				});
			});

			return $q.all(scripts);
		}
	}
}());
