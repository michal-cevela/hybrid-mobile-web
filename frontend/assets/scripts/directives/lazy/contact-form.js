'use strict';

/**
 * @name Angular Directive: <contact-form/>
 * @author Michal Čevela
 * @version 1.0
 */
$$util.getProvider('directive')
	// <contact-form contact-list="[...]" template-ref="views/directives/contact-form.html" on-load="$log.debug('...')"/>
	.directive('contactForm', ['$compile', '$templateCache', '$parse',
		function($compile, $templateCache, $parse) {
			return {
				name: 'contactForm',
				restrict: 'E',
				replace: false,
				require: false,
				transclude: false,
				controller: ['$scope', function($scope) {
					// TODO:
				}],
				scope: {
					contactList: '=' || [],
					templateRef: '@' || "",
					onLoad: '&' || function() {
						$log.debug('directives/contact-form.js: The <contact-form/> element loaded.')
					}
				},
				template: function() {
					return '<div class="top-10px">' +
								'<div ng-repeat="contact in contactList">' +
									'{{contact.fullName}}<br/>' +
									'<div ng-repeat="address in contact.address">' +
										'{{address}}' +
									'</div>' +
									'<strong>{{contact.email}}</strong>' +
								'</div>' +
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
				}
			};
		}
	]);
