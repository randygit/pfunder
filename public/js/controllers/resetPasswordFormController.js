 
function ResetPasswordFormController($scope, $http, $location, $window) {

    // init actually works. just like the init of java functions
    // but using real values not variables in the calling view
    $scope.init = function(email, confirmNewUserURL) {
        //console.log("$scope.init ResetPasswordFormController");
        //console.log('Email ' + email);
        //console.log('URL   ' + confirmNewUserURL);

        $scope.email = email;

        //$scope.confirmNewUserURL = confirmNewUserURL;
        //console.log('$scope.email             ' + $scope.email);
        //console.log('$scope.confirmNewUserURL ' + $scope.confirmNewUserURL);
    };

    // initialize $scope.contact
    $scope.form         = {};
    $scope.message      = '';

    
    // how to pass variable from view but not part of the form

    $scope.changePassword = function () {

     
      /*
      console.log("ResetPasswordFormController");
      console.log("Email   : " + $scope.email);
      console.log("Password: " + $scope.reset.password);
      console.log("Verify  : " + $scope.reset.verification);
      //console.log('URL     : ' + $scope.confirmNewUserURL);

      //console.log("User name: " + $scope.user.username + " " + $scope.user.email);
      */

      // must pass $scope.reset and not individual values else error 500
      console.log("about to $http.post /verify/password");

      $http.post('/verify/password/' + $scope.email, $scope.reset)
        .success(function(data) {
            console.log("Success. back from /verify/password");

            $scope.window = $window;
            $scope.window.location = '/login';


          
         

            console.log("after to $scope.$apply");
            // $scope.reset = {};

            
        })
        .error(function(data){
            console.log("error in sending email");
           
            $location.path('/');
            if(!$scope.$$phase) {
              $scope.$apply();
            }
      }); 

    };  // $scope.changePassword
}

