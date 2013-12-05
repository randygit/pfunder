

angular.module('mean.system').controller('MobileFormController', ['$scope', '$http','$location', '$window','Global', 'States2', 'Colors', function ($scope, $http, $location, $window, Global, States2, Colors  ) {

    $scope.getDefault = function() {
       
        $scope.dateOptions = {
            changeYear: true,
            changeMonth: true,
            yearRange: '1900:-0'
        };


        // this works using $http('/getData/states')
        // use a factory called States2 to get data from $http
        States2.getData().then(function(data) {
            $scope.stateData2 = data;
        });

        Colors.getData().then(function(data) {
            $scope.colors = data;
        });
        

       
       
        $scope.mobile = {};

        // read from clients database
        $scope.mobile.state2 = "NY";
        $scope.mobile.phoneNumber = '5';
        $scope.mobile.carrier='sun';
        $scope.mobile.birthdate = new Date('1958/07/08');

        /*
        // saved as string
        var birthDate =  '1958/07/08';
        $scope.mobile.birthdate = birthDate;
        */
  
        $scope.global = Global;  

        $scope.window = $window;
        
    };


    
    // giving up on ui-select='dataJsonOptions' for the meantime
    // this code displays the 
    $scope.dataJsonOptions = {
        ajax: {
            url: "/getData/colors",
            dataType: 'json',
            data: function (term, page) {
                return {};
            },
            results: function (data,page) { 
                return {results:data };
            }
        },
        // this thing works! it displays the default value chosen. see above
        initSelection: function(element, callback) {
            callback($(element).data('$ngModelController').$modelValue);
        }
    };  

   

   
    $scope.updateMobile = function () {
  
        console.log("ng-submit updateMobile");
 
        console.log('State2      : ' + ($scope.mobile.state2)); 
        console.log('Phone Number: ' + ($scope.mobile.phoneNumber));
        console.log('Carrier     : ' + ($scope.mobile.carrier));
        console.log('Birthdate   : ' + ($scope.mobile.birthdate));

        /*
        // must pass $scope.reset and not individual values else error 500
        console.log("about to $http.post /user/profile");

        $http.post('/user/profile/' + Global.user.email, $scope.mobile)
            .success(function(data) {
                console.log("Success. back from /user/profile");

                
                $scope.window.location = '/';

                console.log("after to $scope.$apply");
              
          })
          .error(function(data){
              console.log("error in saving profile");

                  
                  $scope.window.location = '/';
                
        }); 
        */

    };  // $scope.updateProfile

}]);


