
angular.module('mean.system')
    .controller('EditFormController', ['$scope', '$http','$location', '$window', 'Global',
                 function ($scope, $http, $location, $window , Global ) { 

    // init actually works. just like the init of java functions
    // but using real values not variables in the calling view

    // passed parameters are from reset.jade
    $scope.init = function(email, username) {


        console.log("$scope.init EditFormController"); 
       
        // have to do the next line,else, email is not defined
        $scope.editform = {};

        if (email === '') {
          console.log('email is empty'); 
          $http.get('/readtestdata/' + Global.user.email) 
                .success(function(testdata) { 
                    $scope.editform = testdata;
                  
              })
              .error(function(data){
                  console.log("error in getting profile");
                  $scope.window.location = '/';
                    
          });     
                
        }
        else {
            $scope.editform.email    = email; 
            $scope.editform.username = username; 
          
        }

        $scope.global = Global;  
        $scope.window = $window; 

    };

   
    
    // how to pass variable from view but not part of the form

    $scope.updateform = function () {

     
      console.log("editFormController. Inside updateform");
      console.log("Email   : " + $scope.editform.email);
      console.log("Username: " + $scope.editform.username);
 
      // must pass $scope.reset and not individual values else error 500
      console.log("about to $http.post /verify/password");

      $http.post('/updateform' , $scope.editform)
        .success(function(data) {
          console.log("Success. back from /testing/updateform");

              
          $scope.window.location = '/login';

           
          
        })
        .error(function(data){
          console.log("error in sending email");
         
              
          $scope.window.location = '/editForm';
                    
      }); 

    };  

 }]);


