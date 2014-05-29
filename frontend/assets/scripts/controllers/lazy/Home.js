'use strict';

/**
 * @name Angular Controller: Home
 * @author Michal Čevela
 * @version 1.0
 */
window.$dependencies = {
	constants: [],
	filters: [],
	services: [],
	directives: []
};

window.$ajax = [
	'ajax.json'
];

$$util.getProvider('controller')
	.register('HomeCtrl', ['$scope', 'AJAX',
		function ($scope, AJAX) {
			if (window.device) {
				$scope.device = {
					model   : window.device.model,
					platform: window.device.platform,
					version : window.device.version,
					uuid    : window.device.uuid
				};
			} else {
				$scope.device = {
					model   : navigator.product,
					platform: navigator.platform,
					version : navigator.appVersion,
					uuid    : navigator.buildID
				};
			}

			angular.forEach(AJAX, function(response) {
				$log.debug(response.data.dbObjects[0]);
			});
		}
	]);
