/* NOTES

1. $http.get('/getData/stores') in factory works 
2. use ng-repeat in mobile.jade to use init value
            div.form-group
                      label.col-sm-2.control-label(for="states2") States2:
                      .col-sm-6
                      <pre>Selected: {{mobile.state2|json}}</pre>
                      select(style="width:400px", name="states2", id="states2", ui-select2='ui-select2', ng-model="mobile.state2", data-
                                    placeholder="Choose State2")
                        option
                          option(ng-repeat="state2 in stateData2", value="{{state2.abbreviation}}") {{state2.name}}

4. ui-select2 = "dataJsonOptions" needs detailed info to initialize
 // this works
        $scope.mobile.phoneNumber = {
              "id": 5,
              "text": "Fifth",
              "color": "pink"
        };

5. ui-select2 = "state3JsonOptions" does not work properly. data can't be fetched

wants
1. make ui-select2 = "dataJsonOptions" work with this init $scope.phoneNumber.id = 4
2. make ui-select2 = "state3JsonOptions" fetch data and show init value
3, make remote access of data work
*/

angular.module('mean.system').controller('MobileFormController', ['$scope', '$http','$location', '$window','Global', 'States', 'States2',  function ($scope, $http, $location, $window, Global, States, States2  ) {

    $scope.getDefault = function() {
       
        // this works using $Resource
         $scope.stateData = States.get();   

        // this works using $http('/getData/states')
        // use a factory called States2 to get data from $http
        States2.getData().then(function(data) {
            $scope.stateData2 = data;
        });

       
       
        $scope.mobile = {};

        $scope.mobile.state = "CT";
        $scope.mobile.state2 = "NY";

        
        
        // this does not work
        $scope.mobile.state3 = {
              "name":"Arizona",
              "capital":"Phoenix",
              "abbreviation":"AZ"
        };
         
 
        // this works
        $scope.mobile.phoneNumber = {
              "id": 5,
              "text": "Fifth",
              "color": "pink"
        };
        

        // this one works but ng-init="mobile.carrier={{mobile.carrier}}" is not required
        $scope.mobile.carrier='sun';

        $scope.global = Global;  

        $scope.window = $window;
        
    };


  // this code displays the 
  
    $scope.movieOptions = {
        placeholder: "Search for Country",
        ajax: {
            //url: 'http://api.geonames.org/countryInfoJSON?lang=en&username=randygit',
            url: 'http://ws.geonames.org/searchJSON'
            dataType: 'jsonp',
            data: function(term) {
                return { 
                    query: term
                };
            },
            quietMillis: 500,
            results: function(data ) {
                var results = [];
                $.each(data, function(index, item) {
                    results.push({
                        id: item.geonames.countryCode,
                        text: item.geonames.countryName
                        
                    });
                
                }) ;
                return {
                    results: results
                }
            }
        }
    };  

    // this thing does not work.
    // data is fetched. takes forever
    $scope.state3JsonOptions = {
        ajax: {
            url:"/getData/states",
            dataType: 'json',
            data: function (term, page) {
                return {};
            },
            results: function (data,page) {
                var more = (page * 10) < data.total;
                return {results:data, more:more};
            }
        },
        // this thing works! it displays the default value chosen. see above
        initSelection: function(element, callback) {
            callback($(element).data('$ngModelController').$modelValue);
        }
    };  

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
        console.log('State3      : ' + JSON.stringify($scope.mobile.state3));
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


