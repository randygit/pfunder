angular.module('mean.system').controller('MobileFormController', ['$scope', '$http','$location', '$window','Global', 'States', 'States2', function ($scope, $http, $location, $window, Global, States, States2 ) {

    $scope.getDefault = function() {
        /*
        $http.get('data.json').success(function(response) {
            $scope.items = response;
        });
        */
        

        /*
        dataJsonFactory.getDataAsync(function(results) {
            console.log('getDataAsync' + results);
            $scope.items = results;
        });
        */

        /*
        dataJsonFactory.getDataAsync({
            id: '0'
        }).then(function(response){
            $scope.items = results;
        });
        */

        // this works using $Resource
        $scope.stateData = States.get(); 

        // this works using $http
        States2.getData().then(function(data) {
            $scope.stateData2 = data;
        });
 
        $scope.global = Global;  

        $scope.window = $window;
        
    };

    // data.json is in /public. works!
    $scope.dataJsonOptions = {
        minimumInputLength: 1,
        ajax: {
            url: "data.json",
            data: function (term, page) {
                return {};
            },
            results: function (data,page) {
                return {results:data};
            }
        }
    };     

    // using factories
    $scope.dataFactoryOptions = function() {
        /*
        dataJsonFactory.getDataSync(function(results) {
            $scope.items = results.data;
        });
        */
        $scope.items = dataJsonFactory.get().then(function(results) {
            $scope.items = results.data;
        });
    };

    $scope.groupSelectOptions = {
        minimumInputLength: 3,
        ajax: {
            //url: "data.json",
            url: "http://api.rottentomatoes.com/api/public/v1.0/movies.json",
            dataType: 'jsonp',
            data: function (term, page) {
                return {
                    q: term,
                    page_limit: 10,
                    page: page,
                    apikey: "ju6z9mjyajq2djue3gbvv26t"
                };
            },
            results: function (data,page) {
                var more = (page * 10) < data.total;
                return {results:data.movies, more:more};
            }
        }
    };
     
    $scope.updateMobile = function () {
  
        console.log("ng-submit updateMobile");

        console.log('State       : ' + JSON.stringify($scope.mobile.state));
        console.log('State2      : ' + JSON.stringify($scope.mobile.state2));
        console.log('Phone Number: ' + JSON.stringify($scope.mobile.phoneNumber));
        console.log('Carrier     : ' + JSON.stringify($scope.mobile.carrier));

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

