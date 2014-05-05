'use strict';

/**
 * @name Angular Controller: Contact
 * @author Michal Čevela
 * @version 1.0
 */
window.$dependencies = {
	constants: [],
	filters: [],
	services: [ 'Contact.js' ],
	directives: [ 'contact-form.js', 'crud-links.js' ]
};

$$util.getProvider('controller')
	.register('ContactCtrl', ['$scope', '$resource', '$stateParams', 'Contact', 'CONFIG', 'ROUTE', 'WS',
		function($scope, $resource, $stateParams, Contact, CONFIG, ROUTE, WS) {
			$scope.error = {
				request: false,
				response: false,
				message: ''
			};

			try {
				var RestUrl = WS.getRestPoint(true) + CONFIG.REST_API[0];

//				Contact.REST(RestUrl + '/contact.jsonp', { callback: 'JSON_CALLBACK' }).get(...);
				Contact.REST(RestUrl + '/contact.json', {}).get(
					// onSuccess
					function(response) {
						$log.debug(response);
						var contacts = [];

						angular.forEach(response.dbObjects, function(dbObject) {
							dbObject.fullName = dbObject.firstName + ' ' + dbObject.lastName;
							contacts.push(dbObject);
						});

						$scope.contacts = contacts;
						$scope.links = response.links;
						$scope.error.response = false;
					},
					// onError
					function(response) {
						$log.error('controllers/Contact.js -> $resource.get(): responseError!');
						$log.debug(response);
						$scope.error.response = true;
						$scope.error.message = response.error;
					}
				);
			} catch (ex) {
				$log.error(ex.message);
				return undefined;
			}
		}
	]);
