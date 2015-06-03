app.controller('ModalController', ['$scope','$rootScope', function($scope, $rs){

	$scope.$el = $scope.$el || angular.element('#modal');

	// show modal
	$scope._show = function(){
		$scope.showModal = true;
	};

	// hide modal
	$scope._hide = function(){
		$scope.showModal = false;
	};

	// on open call
	$rs.$on('modal:open', function(event){
		$scope._show();
	});

	// on cancel call
	$scope.cancel = function($event){
		$rs.$broadcast('modal:canceled');
		$scope._hide();
		$event.preventDefault();
	};

}]);