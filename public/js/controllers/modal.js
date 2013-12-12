angular.module('mean.system').controller('ModalDemoController', [ '$scope', '$modal', '$log', function($scope, $modal, $log) {
    
    console.log('modalDemoController');

    $scope.user = {
        user: 'name',
        password: null
    }; 

   
    $scope.open = function() {

        console.log('$scope.open');

        $modal.open({
            templateUrl: 'myModalContent.html',
            backdrop: true,
            windowClass: 'modal',
            controller: ModalInstanceCtrl, 
            resolve: {
                user: function() {
                    return $scope.user;
                }
            }
        
        });   // $modal.open
    };   // $scope.open

    var ModalInstanceCtrl = function($scope, $modalInstance, user) {
        $scope.user = user;

        $scope.submit = function() {
            $log.log('Submitting user info');
            $log.log(user);
            $modalInstance.dismiss('cancel');
        };

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };

    };




}]);


