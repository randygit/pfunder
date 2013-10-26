
function ContactCtrl($scope, $http, $location) {
 
  // initialize $scope.contact
  $scope.contact = {};

  

  $scope.addContact = function () {
    console.log("contract.js/ContactCtrl.addContact");
    console.log("User: " + $scope.contact.username);
    console.log("Email: " + $scope.contact.email);
    console.log("Message: " + $scope.contact.msg);

    $http.post('/api/contact', $scope.contact).
      success(function(data) {
        console.log("Success");
        $location.path('/');
        if(!$scope.$$phase) {
          $scope.$apply();
        }
             
      });
  };
}

