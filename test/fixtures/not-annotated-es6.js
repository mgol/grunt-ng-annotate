(function () {
    "use strict";

    angular.module("app", ["dep1", "dep2"])
        .run(function ($rootScope, $timeout) {
            const uselessConstant = 2;
            {
                const uselessConstant = 3;
            }
            $timeout(function () {
                $rootScope.a = 2;
            });
            $rootScope.b = 2;
        })
        .service("appService", function ($rootScope) {
            this.getA = function getA() {
                return $rootScope.a;
            };
        })
        .run(["appService", _.noop]);

    var matchedMod = angular.module("app2", []);
    var nonMatchedMod = angular.module("app3", []);

    matchedMod.service("appService", function ($rootScope) {
        this.getA = function getA() {
            return $rootScope.a;
        };
    });


    nonMatchedMod.service("appService", function ($rootScope) {
        this.getA = function getA() {
            return $rootScope.a;
        };
    });
})();
