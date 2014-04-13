'use strict';

/**
 * @name Angular Directive: <crud-links/>
 * @author Michal Čevela
 * @version 1.0
 */
$$util.getProvider('directive')
	// <crud-links link-list="[...]" template-ref="views/directives/crud-links.html" on-load="$log.debug('...')"/>
	.directive('crudLinks', ['$compile', '$templateCache', '$parse', '$location',
		function($compile, $templateCache, $parse, $location) {
			return {
				name: 'crudLinks',
				restrict: 'E',
				replace: false,
				require: false,
				transclude: false,
				controller: ['$scope', function($scope) {
					// TODO:
				}],
				scope: {
					linkList: '=' || [],
					templateRef: '@' || "",
					onLoad: '&' || function() {
						$log.debug('directives/crud-links.js: The <crud-links/> element loaded.')
					}
				},
				template: function() {
					return '<div class="top-5px">' +
								'<button type="button" class="btn-info right-5px" ng-click="redirect(link.url);"' +
								'        ng-repeat="link in linkList[0]" ng-switch="link.action == \'CREATE\'">' +
									'<span ng-switch-when="true">Add</span>' +
									'<span ng-switch-when="false">{{link.action.toLowerCase() | firstUpperCase}}</span>' +
								'</button>' +
								'' +
							 '</div>';
				},
				link: function(scope, element, attrs) {
//					var load = $parse(attrs.onLoad);

					attrs.$observe('templateRef', function(newTpl, oldTpl) {
						if ( angular.isString(newTpl) && (newTpl.length > 0) ) {
							var newForm = $compile($templateCache.get(newTpl).trim())(scope);
							element.html('').append(newForm[0]);
						}
					});

					element.on('load', function () {
						scope.onLoad();
//						load(scope);
					});

					scope.redirect = function(path) {
						$location.path(path).replace();
					};
				}
			};
		}
	]);
