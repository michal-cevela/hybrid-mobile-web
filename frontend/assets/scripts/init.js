'use strict';

var $log;

if ($$util) {
	var $http = $$util.getService('$http');
	    $log  = $$util.getService('$log');

	$http.get('scripts/config.json', { params: { '_': new Date().getTime() }}).then(
		// onSuccess
		function(response) {
			var CONFIG = response.data;
			angular.module('Settings', []).constant('CONFIG', CONFIG);

			$$util.loadJScripts(CONFIG.SCRIPTS.common).then(
				// onSuccess
				function(response) {
					$log.debug("init.js: Common JavaScript files loaded!");
					$log.debug($$util.getStatus(response));

					if ($$util.isMobile()) {
						// is mobile platform
						$$util.loadJScripts(CONFIG.SCRIPTS.mobile).then(
							// onSuccess
							function(response) {
								$log.debug("init.js: Mobile-related JavaScript files loaded!");
								$log.debug($$util.getStatus(response));

								$$util.deviceReady().then(
									// device (DOM) is ready
									function() {
										$log.debug('init.js: Mobile browser is ready...');

										$$util.bootstrap(CONFIG.APP.name).then(
											// onSuccess
											function() {
												$log.debug("** init.js: The app was successfully bootstrapped! **");

//												window.setTimeout(function() {
//													window.location.replace('#/home');
//													$location.path('/home').replace();
//												}, 0);
											},
											// onError
											function() {
												$log.error('init.js: An error occured while the app was bootstrapping!');
											}
										);
									}
								);
							},
							// onError
							function() {
								$log.error('init.js: Loading mobile-related JavaScript files failed!');
							}
						);
					} else {
						// desktop browser (DOM) is ready
						$$util.loadJScripts(CONFIG.SCRIPTS.desktop).then(
							// onSuccess
							function(response) {
								$log.debug("init.js: Desktop-related JavaScript files loaded!");
								$log.debug($$util.getStatus(response));
								
								$$util.deviceReady().then(function() {
									$log.debug('init.js: Desktop browser is ready...');
									
									$$util.bootstrap(CONFIG.APP.name).then(
										// onSuccess
										function() {
											$log.debug("** init.js: The app was successfully bootstrapped! **");
										},
										// onError
										function() {
											$log.error('init.js: An error occured while the app was bootstrapping!');
										}
									);
								});
							},
							// onError
							function() {
								$log.error('init.js: Loading desktop-related JavaScript files failed!');
							}
						);
					}
				},
				// onError
				function() {
					$log.error('init.js: Loading common JavaScript files failed!');
				}
			);
		},
		// onError
		function(error) {
			$log.error('init.js: Loading the config.json file failed!');
		}
	);
} else {
	$log.error("init.js: The utility.js file has not beet initialized!");
}
