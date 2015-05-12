"use strict";

(function () {
    "use strict";

    angular.module("app", ["dep1", "dep2"]).run(["$rootScope", "$timeout", function ($rootScope, $timeout) {
        var uselessConstant = 2;
        {
            var _uselessConstant = 3;
        }
        $timeout(function () {
            $rootScope.a = 2;
        });
        $rootScope.b = 2;
    }]).service("appService", ["$rootScope", function ($rootScope) {
        this.getA = function getA() {
            return $rootScope.a;
        };
    }]).run(["appService", _.noop]);

    var matchedMod = angular.module("app2", []);
    var nonMatchedMod = angular.module("app3", []);

    matchedMod.service("appService", ["$rootScope", function ($rootScope) {
        this.getA = function getA() {
            return $rootScope.a;
        };
    }]);

    nonMatchedMod.service("appService", ["$rootScope", function ($rootScope) {
        this.getA = function getA() {
            return $rootScope.a;
        };
    }]);
})();
