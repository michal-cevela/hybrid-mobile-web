'use strict';

/**
 * @name Angular Controller: Auth
 * @author Michal Čevela
 * @version 1.0
 */
window.$dependencies = {
	constants: [],
	filters: [],
	services: [],
	directives: []
};

$$util.getProvider('controller')
	.register('AuthCtrl', ['$scope', '$stateParams', 'CONFIG', 'ROUTE', 'WS',
		function($scope, $stateParams, CONFIG, ROUTE, WS) {
			$scope.login = {
				usr: '',
				pwd: ''
			};

			try {
				$log.debug($stateParams);
				var RestUrl = WS.getRestPoint(true) + CONFIG.REST_API[0];
			} catch (ex) {
				$log.error(ex.message);
				return undefined;
			}
		}
	]);
