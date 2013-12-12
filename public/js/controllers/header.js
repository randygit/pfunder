angular.module('mean.system').controller('HeaderController', ['$scope', 'Global', function ($scope, Global) {
    $scope.global = Global;

    $scope.menu = [
        {
            "title": "Articles",
            "link": "articles"
        }, 
        {
            "title": "Create New Article",
            "link": "articles/create"
        },  
        {
            "title": "Contact Manager",
            "link": "contact"
        },  
        {
            "title": "Modal",
            "link": "modal"
        }, 
        {
            "title": "Welcome",
            "link": "welcome"
        }
    
    ];
}]);
