
function ContactFormController($scope, $http, $location, $window) {
 
  // initialize $scope.contact
  $scope.contact = {};
  $scope.message = '';

  

  $scope.addContact = function () {
    console.log("contract.js/ContactCtrl.addContact");
    console.log("User: " + $scope.contact.username);
    console.log("Email: " + $scope.contact.email);
    console.log("Message: " + $scope.contact.msg);

    console.log("Sending email " + $scope.contact.email);

    $http.post('/contact/sendemail', $scope.contact)
      .success(function(data) {
        console.log("Success. back from sendmail " + $scope.contact.username);


        /* 131104 1758
        this does not redirect        
        $location.path('/login').replace();
        if(!$scope.$$phase )
            $scope.$apply();
        */


        $scope.window = $window;
        $scope.window.location.href = '/login';
        //$window.location.reload();
        

        /*
        // from yearofthemoo
         //be sure to inject $scope and $location somewhere before this
        $location.path('/login').replace();
        var changeLocation = function(url, force) {
          //this will mark the URL change
          $location.path(url); //use $location.path(url).replace() if you want to replace the location instead

          $scope = $scope || angular.element(document).scope();
          if(force || !$scope.$$phase) {
            //this will kickstart angular if to notice the change
            $scope.$apply();
          }
        };
        */


        
        /* does not want to redirect
        $location.path('/');
        $scope = $scope || angular.element(document).scope();
        $scope.$apply();

        if(!$scope.$$phase) {
          console.log("about to $scope.$apply");
          $scope.$apply();
        }
        */

        console.log("after to $scope.$apply");
        // $scope.contact = {};
        
      })
      .error(function(data){
        console.log("error in sending email");
       
        $location.path('/');
        if(!$scope.$$phase) {
          $scope.$apply();
        }
      }); 

     
  };
}

