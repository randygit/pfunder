angular.module('mean.system').controller('WelcomeController', ['$scope', 'Global', function ($scope, Global) {
    console.log('WelcomeController');
    $scope.global = Global;
}]);
