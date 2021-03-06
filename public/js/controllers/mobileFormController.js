

angular.module('mean.system').controller('MobileFormController', ['$scope', '$http','$location', '$window','Global', 'Countries', function ($scope, $http, $location, $window, Global, Countries ) {

    $scope.getDefault = function() {
       

        // this works using $http('/getData/states')
        // use a factory called States2 to get data from $http
        Countries.getData().then(function(data) {
            $scope.countryData = data;
        });

         
       
        
        $scope.mobile = {};

        /*
        // read from clients database
        $scope.mobile.country = "AF";
        $scope.mobile.phonenumber = '09175349733';
        $scope.mobile.carrier='sun'; 
        */

        // initialize values from mongo
        $http.get('/user/mobile/' + Global.user.email)
              .success(function(mobile) {
                  $scope.mobile = mobile;
                
            })
            .error(function(data){
                console.log("error in getting profile");
                $scope.window.location = '/';
                  
        });      
  
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
 
        console.log('Country     : ' + ($scope.mobile.country)); 
        console.log('Phone Number: ' + ($scope.mobile.number));
        console.log('Carrier     : ' + ($scope.mobile.carrier));

        
        // must pass $scope.reset and not individual values else error 500
        console.log("about to $http.post /user/mobile");

        $http.post('/user/mobile/' + Global.user.email, $scope.mobile)
            .success(function(data) {
                console.log("Success. back from /user/profile");

                
                $scope.window.location = '/#!/account';

                console.log("after to $scope.$apply");
              
          })
          .error(function(data){
              console.log("error in saving profile");

                  
                  $scope.window.location = '/#!/mobile';
                
        }); 
      

    };  // $scope.updateProfile

    $scope.cancelMobile = function() {
        console.log('Cancel changes');
        $scope.window.location = '/';
    };

}]);


