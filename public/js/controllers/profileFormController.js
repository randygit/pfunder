angular.module('mean.system').controller('ProfileFormController', ['$scope', '$http','$location', '$window','Global', '$fileUploader', function ($scope, $http, $location, $window, Global, $fileUploader) {

    // ng-init
    $scope.getProfile = function() {

        console.log("ng-init getProfile");
         
        console.log("Global" + Global.user.name + " " + Global.user.username + " " + Global.user.email);

        $scope.global = Global;  

        $scope.window = $window;


        $scope.dateOptions = {
            changeYear: true,
            changeMonth: true,
            yearRange: '1900:-0'
        };


        
        
        
        // initialize values from mongo
        $http.get('/user/profile/' + Global.user.email)
              .success(function(profile) {
                  $scope.profile = profile;
                  // profile.date is a string???
                  //console.log('type of profile.birthdate1 ' + typeof $scope.profile.birthdate ); 

                  // have to do this to make sure profile.date is a Date object, else ui-date wont show initial value
                  $scope.profile.birthdate = new Date($scope.profile.birthdate);
                  // console.log('type of profile.birthdate2 ' + typeof $scope.profile.birthdate ); 
                
            })
            .error(function(data){
                console.log("error in getting profile");
                $scope.window.location = '/';
                  
          }); 
 
 
    };
    
   
     
     
    $scope.updateProfile = function () {
  
        console.log("ng-submit updateProfile");

        // must pass $scope.reset and not individual values else error 500
        console.log("about to $http.post /user/profile "); 
       
        $http.post('/user/profile/' + Global.user.email, $scope.profile)
            .success(function(data) {
                console.log("Success. back from /user/profile");
                $scope.window.location = '/#!/password';

          })
          .error(function(data){
              console.log("error in saving profile");
              //$scope.window.location = '/';
              $scope.window.location = '/#!/profile';
        }); 
       

    };  // $scope.updateProfile

    $scope.cancelProfile = function() {
        console.log('Cancel changes');
        $scope.window.location = '/';
    };
}]);

