angular.module('mean.system').controller('HeaderController', ['$scope', 'Global', function ($scope, Global) {
    $scope.global = Global;

    $scope.menu = [
        {
            "title": "Contact Manager",
            "link": "contact"
        },  
        {
            "title": "Modal",
            "link": "modal"
        }, 
        {
            "title": "Account",
            "link": "account"
        },
        {
            "title": "Profile",
            "link": "profile"
        },
        {
            "title": "Password",
            "link": "password"
        },
        {
            "title": "Mobile",
            "link": "mobile"
        }
    
    ];
}]);
