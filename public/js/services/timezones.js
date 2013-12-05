angular.module('mean.system').factory("Timezones", ['$http', function($http) { 
    return {
        getData: function() {
            return $http.get('/getdata/timezones').then(function(result) {
                return result.data;
            });
        }
    };
}]);
