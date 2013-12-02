angular.module('mean.system').controller('ProfileFormController', ['$scope', '$http','$location', '$window','Global', function ($scope, $http, $location, $window, Global) {

    // ng-init
    $scope.getProfile = function() {

        console.log("ng-init getProfile");
         
        console.log("Global" + Global.user.name + " " + Global.user.username + " " + Global.user.email);

        $scope.global = Global;  

        $scope.window = $window;

       
        // initialize values from mongo
        $http.get('/user/profile/' + Global.user.email)
              .success(function(profile) {
                  $scope.profile = profile;
                
            })
            .error(function(data){
                console.log("error in getting profile");
                $scope.window.location = '/';
                  
          }); 
    };
    
    
     
    $scope.updateProfile = function () {
  
        console.log("ng-submit updateProfile");

        // must pass $scope.reset and not individual values else error 500
        console.log("about to $http.post /user/profile");

        $http.post('/user/profile/' + Global.user.email, $scope.profile)
            .success(function(data) {
                console.log("Success. back from /user/profile");

                
                $scope.window.location = '/';

                console.log("after to $scope.$apply");
              
          })
          .error(function(data){
              console.log("error in saving profile");

                  
                  $scope.window.location = '/';
                
        }); 

    };  // $scope.updateProfile

}]);

