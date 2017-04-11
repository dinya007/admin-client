var app = angular.module('app', ['ngRoute']);

app.config(function ($routeProvider) {
    $routeProvider.when('/', {
        controller: 'loginController',
        templateUrl: 'app/view/login.html'
    })
        .when('/login', {
            controller: 'loginController',
            templateUrl: 'app/view/login.html'
        })
        .otherwise({
            redirectTo: '/'
        });
});

