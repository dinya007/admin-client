var app = angular.module('app', [
    'ngRoute',
    'ngCookies',
    'ngSanitize',
    'xeditable'
]);

app.config(['$routeProvider', function ($routeProvider) {

    $routeProvider
        .when('/login', {
            controller: 'loginController',
            templateUrl: 'app/view/login.html',
            hideMenus: true
        })
        .when('/', {
            controller: 'homeController',
            templateUrl: 'app/view/home.html'
        })
        .otherwise({redirectTo: '/login'});
}]);

app.run(['$rootScope', '$location', '$cookieStore', '$http', 'editableOptions', function ($rootScope, $location, $cookieStore, $http, editableOptions) {
    // keep user logged in after page refresh
    $rootScope.globals = $cookieStore.get('globals') || {};
    if ($rootScope.globals.currentUser) {
        $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
    }

    $rootScope.$on('$locationChangeStart', function (event, next, current) {
        // redirect to login page if not logged in
        if ($location.path() !== '/login' && !$rootScope.globals.currentUser) {
            $location.path('/login');
        }
    });

    editableOptions.theme = 'bs3';
}]);

app.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.withCredentials = true;
}]);
