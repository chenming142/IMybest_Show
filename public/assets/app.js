var p = 0, q = !1;

!function(win, ng, undefined) {
    ng.module("app", ['ngRoute', 'scene', 'ui.bootstrap', "templates-app", "templates-common", "I18N.MESSAGES", "services.i18nNotifications"]);
    ng.module("app").config(["$routeProvider", function ($routeProvider) {
        //d.theme = "bootstrap";
        $routeProvider.when("/scene/create/:sceneId", {
            templateUrl: "scene/create.tpl.html",
            controller: "CreateSceneCtrl",
            reloadOnSearch: !1,
            resolve: {
                //authenticatedUser: c.requireAuthenticatedUser
            }
        });
    }]);
    ng.module("app").controller("AppCtrl", ["$window", "$scope", "$rootScope", "$location", "$modal", "sceneService", "$routeParams", "$timeout",
        function ($window, $scope, $rootScope, $location, $modal, sceneService, $routeParams, $timeout) {
            $scope.showToolBar = function () {
                return $location.$$path.indexOf("/scene/create") >= 0 ? !1 : !0
            };
            $scope.showPanel = function () {
                $("#helpPanel").stop().animate({right: "0"}, 500)
            };
            $scope.hidePanel = function () {
                $("#helpPanel").stop().animate({right: "-120"}, 500)
            };

            $location.path('/scene/create/2915210');
        }]).filter("fixnum", function () {
        return function (num) {
            var fixnum = num;
            num >= 1e4 && 1e8 > num
                ? fixnum = (num / 1e4).toFixed(1) + "万"
                : num >= 1e8 && (fixnum = (num / 1e8).toFixed(1) + "亿");
            return fixnum;
        }
    });
}(window, window.angular);