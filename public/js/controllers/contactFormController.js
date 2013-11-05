angular.module('mean.system').controller('ContactFormController', ['$scope', '$http','$location', '$window', function ($scope, $http, $location, $window) {

    $scope.init = function( ) {

        console.log("contactFormController.$scope.init");

        $scope.form         = {};
        $scope.message      = '';
  
        $scope.window = $window;
           
    };

    $scope.addContact = function () {
        console.log("contract.js/ContactCtrl.addContact");
        console.log("User: " + $scope.contact.username);
        console.log("Email: " + $scope.contact.email);
        console.log("Message: " + $scope.contact.msg);

        console.log("Sending email " + $scope.contact.email);

        $http.post('/contact/sendemail', $scope.contact)
            .success(function(data) {
                console.log("Success. back from sendmail " + $scope.contact.username);

                // thanks danhunsakes as he commented here https://coderwall.com/p/vcfo4q
                // window is a browser thingee
                // window.location.href is not a method, it's a property that will tell you the current URL location of the browser. 
                // Setting the property to something different will redirect the page

                $scope.window = $window;
                $scope.window.location.href = '/';

                console.log("after to $scope.$apply");
              
              
          })
          .error(function(data){
              console.log("error in sending email");
              // for now. how to simulate error?
              // should have an error page to redirect

              $scope.window = $window;
              $scope.window.location.href = '/';

          }); 
    };
    
}]);

