//Articles service used for articles REST endpoint
angular.module('mean.system').factory("dataJsonFactory", [function($http) {
    return {
        /*
        getDataAsync: function(callback) {
            $http.get('states.json').success(callback);            
        }*/
       
        getDataAsync: function() {
            // return promise directly
            return $http.get('states.json')
                .then(function(result) {
                    return result.data;
                });
        }
      
        /*
        get: function(params) {
            return $http.get('states.json', {
                params: params
            });
        }
        */

    };
}]);

