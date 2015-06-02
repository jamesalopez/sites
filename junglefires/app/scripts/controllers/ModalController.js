app.controller('ModalController', ['$scope','$rootScope', function($scope, $rs){

	$scope.$el = $scope.$el || angular.element('#modal');

	// show modal
	$scope._show = function(){
		$scope.showModal = true;
		$scope.$el.css('visibility', 'visible');
	};

	// hide modal
	$scope._hide = function(){
		$scope.showModal = false;
		$scope.$el.css('visibility', '');
	};

	// on open call
	$rs.$on('modal:open', function(event){
		$scope._show();
	});

	// on cancel call
	$scope.cancel = function(){
		$rs.$broadcast('modal:canceled');
		$scope._hide();
	};

}]);