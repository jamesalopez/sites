app.controller('MainController', ['$scope','$rootScope', function($scope,$rs){
	//Open bio modal
    $scope.openModal = function(){

        // broadcast event to modal
        $rs.$broadcast('modal:open');

        // stop parent events
        event.stopPropagation();
    };
}]);