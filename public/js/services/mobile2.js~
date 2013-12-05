angular.module('mean.system').factory("States2", ['$http', function($http) { 
    return {
        getData: function() {
            return $http.get('/data/states.json').then(function(result) {
                return result.data;
            });
        }
    };
}]);
