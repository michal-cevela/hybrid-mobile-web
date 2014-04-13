'use strict';

/**
 * @name Angular Controller: Book
 * @author Michal Čevela
 * @version 1.0
 */
angular.module('Ctrl.Book', [])
	.controller('BookCtrl', ['$scope', '$location', '$route', 'security', 'Book', 'CONFIG', 'ROUTE', 'WS',
		function($scope, $location, $route, security, Book, CONFIG, ROUTE, WS) {

			$scope.book = {
				id: $route.current.params.id,
				detail: {},
				new: {
					name: 'Test book',
					publisher: 'Test publisher',
					release: new Date().getTime(),
					price: 0.0
				},
				updated: {
					name: 'Test book II',
					publisher: 'Test publisher II'
				}
			};

			security.promise.then(
				// onSuccess
				function(response) {
					$log.debug('controllers.js: AuthCtrl -> security.success');

					ROUTE.getDeferrer().forTemplatePath($location.$$path).promise.then(
						function(response) {
							$log.debug('controllers/Book.js -> templateDefer.success');

							try {
								var routePath = $route.current.$$route.originalPath;
								var Book_CRUD = Book.CRUD(WS.getRestPoint(true) + CONFIG.API_Path + routePath, {});

								$scope.CRUD = {
									create: function(newBook) {
										return Book_CRUD.add({}, newBook,
											function(book) {
												$log.debug('controllers/Book.js: CRUD.create() -> A new book has been added to the database...');
												$log.debug(book);
												$location.path(routePath).search({ id: book._id.$oid }).replace();
											},
											function(error) {
												$log.error(error);
												return error;
											}
										);
									},
									read: function(bookId) {
										return Book_CRUD.get({ id: bookId }, null,
											function(book) {
												$log.debug('controllers/Book.js: CRUD.read() -> The following book has been retrieved from the database...');
												$log.debug(book);
												book.release = new Date(book.release).getTime();
												return book;
											},
											function(error) {
												$log.error(error);
												return error;
											}
										);
									},
									update: function(updatedBook) {
										return Book_CRUD.update({ id: $scope.book.id }, updatedBook,
											function(book) {
												$log.debug('controllers/Book.js: CRUD.update() -> The following book has been updated...');
												$log.debug(book);
												return book;
											},
											function(error) {
												$log.error(error);
												return error;
											}
										);
									},
									remove: function(bookId) {
										return Book_CRUD.remove({ id: bookId }, null,
											function(book) {
												$log.debug('controllers/Book.js: CRUD.remove() -> The following book has been deleted...');
												$log.debug(book);
												$location.path('/books/list').search({}).replace();
											},
											function(error) {
												$log.error(error);
												return error;
											}
										);
									}
								};

								switch ($route.current.params.action) {
									case 'detail':
										$scope.book.detail = $scope.CRUD.read($scope.book.id);
										break;

									case 'add':
										break;

									case 'update':
										break;

									case 'remove':
										break;

									default:
								}
							} catch (ex) {
								$log.error(ex.message);
								return undefined;
							}
						},
						function(response) {
							$log.error('controllers/Book.js -> templateDefer.error');
							return undefined;
						}
					);
				},
				// onError
				function(response) {
					$log.error('controllers/Book.js -> security.error');
					return undefined;
				}
			);
		}]);
