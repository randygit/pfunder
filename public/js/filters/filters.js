angular.module('mean.system').filter('capitalise', [function () {
    return function(input) {
      if(input) {
        return input.substring(0,1).toUpperCase() + input.substring(1);
      }
    };
}]);


