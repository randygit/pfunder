

angular.module('mean.system').controller('AccountFormController', ['$scope', '$http','$location', '$window','Global', 'Languages', 'Timezones', function ($scope, $http, $location, $window, Global, Languages, Timezones  ) {

    $scope.getDefault = function() { 

        // this works using $http('/getData/states')
        // use a factory called States2 to get data from $http
        Languages.getData().then(function(data) {
            $scope.languagesData = data;
        });

        Timezones.getData().then(function(data) {
            $scope.timezonesData = data;
        });
        

       /*
       
        $scope.account = {};

        // read from clients database
        $scope.account.username = "randygit";
        $scope.account.language = "ms";
        $scope.account.timezone = "Pacific-Tarawa";
        */

        // initialize values from mongo
        $http.get('/user/account/' + Global.user.email)
              .success(function(account) {
                  $scope.account = account;
                
            })
            .error(function(data){
                console.log("error in getting account");
                $scope.window.location = '/';
                  
        }); 
  
        $scope.global = Global;  

        $scope.window = $window;
        
    };

    // validate username for uniqueness... directive?
    
      // this code displays the 
    $scope.timeZoneOptions = {
        ajax: {
            url: "http://gomashup.com/json.php?fds=geo/timezone/locations&jsoncallback=?",
            dataType: 'json',
            data: function (term, page) {
                return {};
            },
            results: function (data,page) {
                console.log('timezoneoptions ' + data.results);
                var more = (page * 10) < data.total;
                return {results:data.results, more:more};
            }
        },
        // this thing works! it displays the default value chosen. see above
        initSelection: function(element, callback) {
            callback($(element).data('$ngModelController').$modelValue);
        }
    };  

   
    $scope.updateAccount = function () {
  
        console.log("ng-submit updateMobile");
 
        console.log('Username     : ' + ($scope.account.username)); 
        console.log('Language     : ' + ($scope.account.language));
        console.log('Timezone     : ' + ($scope.account.timezone)); 

        // validation for unique username could also be here
    
       
        // must pass $scope.reset and not individual values else error 500
        console.log("about to $http.post /user/account");
         
        $http.post('/user/account/' + Global.user.email, $scope.account)
            .success(function(data) {
                console.log("Success. back from /user/profile");

                
                $scope.window.location = '/';

                console.log("after to $scope.$apply");
              
          })
          .error(function(data){
              console.log("error in saving profile");

                  
                  $scope.window.location = '/';
                
        }); 
       

    };  // $scope.updateProfile

}]);


