describe("app - Hi Controller", function () {
    beforeEach(module('app'));

    var $controller;

    beforeEach(inject(function (_$controller_) {
        $controller = _$controller_;
    }));


    describe(" - HiController $scope", function () {
        var $scope = {},
        controller;

        beforeEach(function () {
            controller = $controller('HiController', { $scope: $scope });
        });

        it('Say Hi', function(){
            expect($scope.greeting).toEqual('Hi, the app');
        });

    });
});