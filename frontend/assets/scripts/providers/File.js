'use strict';

/**
 * @name Angular Provider: File
 * @author Michal Čevela
 * @version 1.0
 */
angular.module('Provider.File', [])
	.provider('File', [function() {
		return {
			$get: ['$injector', function($injector) {
				return {
					/**
					 * Get a local file
					 * @param {String} fileUrl
					 * @return {$q.promise}
					 */
					getLocalFile: function(fileUrl) {
						var $q = $injector.get('$q');
						var deferred = $q.defer();

						if (window.FileReader && _$u.isMobile()) {
							window.resolveLocalFileSystemURI(fileUrl /* file:///path/to/file */,
								function(fileEntry) {
									alert(fileEntry);

									fileEntry.file(function(file) {
										var fileReader = new FileReader();

										fileReader.onloadend = function(event) {
											deferred.resolve(event.target.result);
										};

										fileReader.onerror = function(response) {
											deferred.resolve('<strong>Error when loading the file!</strong>');
										};

										fileReader.readAsText(file, 'UTF-8');
									});
								}, function(error) {
									deferred.reject('<div>error:1</div>');
								},
								function(event) {
									alert(event.target.error.code);
									deferred.reject('<div>error:2</div>');
								});
						} else {
							deferred.reject('<strong>FileReader is not supported OR does not run in a mobile browser!</strong>');
						}

						return deferred.promise;
					}
				};
			}]
		};
	}]);
