'use strict';

angular.module('Ctrl.GPS')
	.controller('GpsCtrl', ['$scope', '$location', function($scope, $location) {

		var intervalId = setInterval(function () {
			geolocation.getCurrentPosition(function (position) {
				$scope.position = position;
			});
		}, 100);

		$scope.$on('$destroy', function() {
			// window.clearInterval(intervalId);
			console.log('HomeCtrl destroyed');
		});
	}]);
