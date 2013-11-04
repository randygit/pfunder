 
function ResetPasswordFormController($scope, $http, $location, $window) {

    // init actually works. just like the init of java functions
    // but using real values not variables in the calling view
    // div(ng-controller="ResetPasswordFormController", ng-init="init('#{user.email}','#{confirmNewUserURL}')") 

    $scope.init = function(email, confirmNewUserURL) {
       
        $scope.email = email;

         
    };

    
    $scope.form         = {};
    $scope.message      = '';

    
     
    $scope.changePassword = function () {
  
      // must pass $scope.reset and not individual values else error 500
      console.log("about to $http.post /verify/password");

      $http.post('/verify/password/' + $scope.email, $scope.reset)
          .success(function(data) {
              console.log("Success. back from /verify/password");

              $scope.window = $window;
              $scope.window.location = '/login';

              console.log("after to $scope.$apply");
            
        })
        .error(function(data){
            console.log("error in sending email");

                // should have an error page to redirect
                $scope.window = $window;
                $scope.window.location = '/';
              
      }); 

    };  // $scope.changePassword
}

