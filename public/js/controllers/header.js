angular.module('mean.system').controller('HeaderController', ['$scope', 'Global', '$window', function ($scope, Global, $window) {
    $scope.global = Global;
    $scope.window = $window;

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

    if(Global.user) {
        console.log('Header Controller ' + Global.user.name);
        $scope.window.location = '/#!/welcome';
    }
    else {
        console.log('User is not logged in');
    }
    
}]);
