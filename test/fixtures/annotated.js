(function () {
    'use strict';

    angular.module('app', ['dep1', 'dep2'])
        .run(['$rootScope', '$timeout', function ($rootScope, $timeout) {
            $timeout(function () {
                $rootScope.a = 2;
            });
            $rootScope.b = 2;
        }])
        .service('appService', ['$rootScope', function ($rootScope) {
            this.getA = function getA() {
                return $rootScope.a;
            };
        }])
        .directive('appDirective', ['$rootScope', 'appService', function ($rootScope, appService) {
            return {
                restrict: 'E',
                template: '<h1>a: {{ getA() }}</h1>c: {{ c }}',
                link: function (scope) {
                    scope.getA = appService.getA;
                    scope.c = $rootScope.b;
                },
            };
        }])

        // Initialize a service.
        .run(['appService', _.noop]);
})();
