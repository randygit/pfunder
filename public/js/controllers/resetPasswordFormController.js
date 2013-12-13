

angular.module('mean.system')
    .controller('ResetPasswordFormController', ['$scope', '$http','$location','$route','$window','Global',  function ($scope, $http, $route, $location, $window, Global ) {

        $scope.getDefault = function() { 
            console.log('Inside ResetFormController.getdefault');
      
            $scope.global = Global;  

            $scope.window = $window;
            
        };

                
        $scope.changePassword = function () {
      
            console.log(" updatePassport");
     
            console.log('Current password  : ' + ($scope.reset.currentpassword)); 
            console.log('New Password      : ' + ($scope.reset.newpassword)); 
            // validation for unique username could also be here
        
           
            // must pass $scope.reset and not individual values else error 500
            console.log("about to $http.post /validate/password");
             
            
            $http.post('/user/password/' + Global.user.email, $scope.reset)
                .success(function(data) {
                    console.log("Success. back from /user/profile");

                    
                    $scope.window.location = '/#!/mobile'; 
            
                  
              })
              // could not reload current page /password
              // used directive validate-password instead
              .error(function(data){
                  console.log("error in saving profile"); 
                    
              
                  //$scope.window.location = '/#!/password';
                  //$route.reload();

                  var lastRoute = $route.current; 
                  $scope.$on('$locationChangeSuccess', function(event) {
                      console.log('locationChangeSuccess');
                      $route.current = lastRoute;
                  });
                    
            }); 
           
            

        };  // $scope.updateProfile

        $scope.cancelPassword = function() {
            console.log('Cancel changes');
            $scope.window.location = '/';
        }

    }])
    
    .directive('validatePassword', ['$http', 'Global', function($http, Global) {  
        return {
          require: 'ngModel',
          link: function(scope, elem, attrs, ctrl) {
            scope.busy = false;
            scope.$watch(attrs.ngModel, function(value) {
              
              // hide old error messages
              ctrl.$setValidity('isTaken', false);
              ctrl.$setValidity('invalidChars', true);
              
              if (!value) {
                // don't send undefined to the server during dirty check
                // empty username is caught by required directive
                return;
              }
              
              console.log('inside uniqueUsername directive ' + value + ' email: ' + Global.user.email);
              scope.busy = true;
              $http.post('/validate/password/' + Global.user.email, {password: value})
                .success(function(data) {
                    console.log('Success. password ' + value + ' is CORRECT'); 
                    scope.busy = false;
                })
                .error(function(data) {
                    console.log('ERROR. password ' + value + ' is NOT correct');
                    ctrl.$setValidity('isTaken', true);
                    scope.busy = false;
                });
            });
          }
        };
    }]);
    



