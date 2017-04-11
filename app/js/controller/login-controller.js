app.controller('loginController', function ($scope, restService) {

    $scope.login = function(credentials) {
        alert("Login: " + credentials.username + " Password: " + credentials.password);
    }

});

