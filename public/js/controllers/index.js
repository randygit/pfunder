angular.module('mean.system').controller('IndexController', ['$scope', 'Global', function ($scope, Global) {
    $scope.global = Global;
    $rootScope.loggedUser = Global.user.name;
}]);
