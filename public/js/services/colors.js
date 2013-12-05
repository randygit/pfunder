angular.module('mean.system').factory("Colors", ['$http', function($http) { 
    return {
        getData: function() {
            return $http.get('/getdata/colors').then(function(result) {
                return result.data;
            });
        }
    };
}]);
