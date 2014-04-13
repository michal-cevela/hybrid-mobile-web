'use strict';

/**
 * @name Angular Controller: Books
 * @author Michal Čevela
 * @version 1.0
 */
angular.module('Ctrl.Books', [])
	.controller('BooksCtrl', ['$scope', '$location', '$route', 'security', 'Books', 'CONFIG', 'ROUTE', 'WS',
		function($scope, $location, $route, security, Books, CONFIG, ROUTE, WS) {

			$scope.menu  = { links: [] };
			$scope.books = [];

			$scope.msg = {
				warning: 'No item found'
			};

			$scope.search = {
				text: '',
				fn: function(book) {
					return new RegExp($scope.search.text, "i").test(book.name);
				}
			};

			security.promise.then(
				// onSuccess
				function(response) {
					$log.debug('controllers/Books.js -> security.success');

					ROUTE.getDeferrer().forTemplatePath($location.$$path).promise.then(
						// onSuccess
						function(response) {
							$log.debug('controllers/Books.js -> templateDefer.success');

							try {
								switch ($route.current.params.action) {
									case 'menu':
										$scope.menu.links = Books.getLinks();
										break;

									case 'list':
										var routePath = $route.current.$$route.originalPath;
										$scope.books = Books.REST(WS.getRestPoint(true) + CONFIG.API_Path + routePath, {}).list({},
											// onSuccess
											function(books) {
												return books;
											},
											// onError
											function(error) {
												$log.error('controllers/Books.js -> templateDefer.success -> Books.REST().list().error');
												return error;
											}
										);
								}
							} catch (ex) {
								$log.error(ex.message);
								return undefined;
							}
						},
						// onError
						function(response) {
							$log.error('controllers/Books.js -> templateDefer.error');
							return undefined;
						}
					);
				},
				// onError
				function(response) {
					$log.error('controllers/Books.js -> security.error');
					return undefined;
				}
			);
		}])
