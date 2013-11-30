
//Articles service used for articles REST endpoint
angular.module('mean.system').factory("States", ['$resource', function($resource) {
    return $resource('states.json', {}, {
        get: {method: 'GET', isArray:true}
    });
}]);


