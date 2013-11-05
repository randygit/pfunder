angular.module('mean.system').controller('AboutController', ['$scope', 'Global', function ($scope, Global) {
    console.log('AboutController');
    $scope.global = Global;
}]);
