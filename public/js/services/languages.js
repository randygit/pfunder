angular.module('mean.system').factory("Languages", ['$http', function($http) { 
    return {
        getData: function() {
            // return $http.get('/data/states.json').then(function(result) {
            return $http.get('/getdata/languages').then(function(result) {
                return result.data;
            });
        }
    };
}]);
