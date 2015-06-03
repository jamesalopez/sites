app.controller('MainController', ['$scope','$rootScope', function($scope,$rs){
    //Open bio modal
    $scope.openModal = function(event){

        // broadcast event to modal
        $rs.$broadcast('modal:open');

        // stop parent events
        event.preventDefault();
    };

    $rs.finishLoading = false;

    $(window).load(function() {
        setTimeout(function(){
            $rs.finishLoading = true;
            $rs.$apply();
        }, 500);
    });

}]);