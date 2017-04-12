app.controller('loginController', ['$scope', '$rootScope', '$location', 'authenticationService', function ($scope, $rootScope, $location, authenticationService) {
    // reset login status
    authenticationService.logout();

    $scope.login = function () {
        $scope.dataLoading = true;
        authenticationService.login($scope.username, $scope.password, function (response) {
            if (response.status === 200) {
                authenticationService.setCredentials($scope.username, $scope.password);
                $location.path('/');
            } else {
                var data = response.data;
                if (data !== null ){
                    var message = data.message;
                    if (message !== null) {
                        $scope.error = message;
                    }
                }
                $scope.dataLoading = false;
            }
        });
    };
}]);