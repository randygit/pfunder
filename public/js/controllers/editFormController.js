// Error: 10 $digest() iterations reached. Aborting! Watchers fired in the last 5 iterations:
angular.module('mean.system')
    .controller('EditFormController', ['$scope', '$http', '$location', '$window', 'Global', '$parse',
                 function ($scope, $http, $location,  $window , Global, $parse ) { 

    // init actually works. just like the init of java functions
    // but using real values not variables in the calling view

    // passed parameters are from reset.jade
    $scope.init = function( ) {


        console.log("$scope.init EditFormController"); 
        //$scope.global = Global;  
        //$scope.window = $window; 
    

        $http.get('/readtestdata/' + Global.user.email) 
              .success(function(testdata) { 
                console.log("data read from profile");
                $scope.editform = testdata;
                
            })
            .error(function(data){
                console.log("error in getting profile");
                // $scope.window.location = '/';;
                changeLocation('/', false);
        });     

        

    };

    $scope.updateEditform = function () {
        console.log('updateEditForm '+ JSON.stringify($scope.editform));

      var emailFlag = false;
      var usernameFlag = false;

       var emailMessage    = $parse('form.'+'email'+'.$error.serverMessage');
       var usernameMessage = $parse('form.'+'username'+'.$error.serverMessage');

        $http.post('/verify/email' , $scope.editform)
            .success(function(data) { 
                emailFlag = true;
                console.log("Success. back from /verify/email " +emailFlag);
                $scope.form.$setValidity('email', true, $scope.form);
                emailMessage.assign($scope, undefined);

                // check username
                $http.post('/verify/username' , $scope.editform)
                    .success(function(data) {
                        usernameFlag = true;
                        console.log("Success. back from /verify/username " + usernameFlag);
                        $scope.form.$setValidity('username', true, $scope.form);
                        usernameMessage.assign($scope, undefined);
                        console.log('Save Record here!'); 
                        changeLocation('/', false);

                    })
                    .error(function(data){
                        console.log("Error. back from /verify/username");
                        $scope.form.$setValidity('username', false, $scope.form);
                        usernameMessage.assign($scope, 'Username not in record!');
                    }); 
            })
            .error(function(data){
                console.log("Error. back from /verify/email ");
                $scope.form.$setValidity('email', false, $scope.form);
                emailMessage.assign($scope, 'Email not in record!');
            });
 



         
    };
    // from http://www.yearofmoo.com/2012/10/more-angularjs-magic-to-supercharge-your-webapp.html#apply-digest-and-phase
    var changeLocation = function(url, force) {
        //this will mark the URL change
        $location.path(url); //use $location.path(url).replace() if you want to replace the location instead

        $scope = $scope || angular.element(document).scope();
        if(force || !$scope.$$phase) {
            //this will kickstart angular if to notice the change
            $scope.$apply();
        }
    };
    
    /**

    // how to pass variable from view but not part of the form
    var updateRecord = function () {

     
      console.log("editFormController. Inside updateform");
      console.log("Email   : " + $scope.editform.email);
      console.log("Username: " + $scope.editform.username);
 
      // must pass $scope.reset and not individual values else error 500
      console.log("about to $http.post /verify/password");

      $http.post('/updateform' , $scope.editform)
        .success(function(data) {
          console.log("Success. back from /testing/updateform");
          $scope.window.location = '/';
        })
        .error(function(data){
          console.log("error in sending email");
          $scope.window.location = '/#!/editform';
      }); 

    };  

    **/


 }]);


