app.service('restService', ['$http', '$q', '$rootScope', '$location', function ($http, $q, $rootScope, $location) {

    this.get = function (url) {
        var deferred = $q.defer();

        $rootScope.dataLoading = true;

        $http.get(url).then(function (data) {
            $rootScope.dataLoading = false;
            deferred.resolve(data);
        }, function (error, status) {
            $rootScope.dataLoading = false;
            logError(error, status);
            deferred.reject(error);
        });

        return deferred.promise;
    };

    this.post = function (url, data) {
        var deferred = $q.defer();

        $rootScope.dataLoading = true;

        $http.post(url, data).then(function (data) {
            $rootScope.dataLoading = false;
            deferred.resolve(data);
        }, function (error, status) {
            $rootScope.dataLoading = false;
            logError(error, status);
            deferred.reject(error);
        });

        return deferred.promise;
    };

    this.put = function (url, data) {
        var deferred = $q.defer();

        $rootScope.dataLoading = true;

        $http.put(url, data).then(function (data) {
            $rootScope.dataLoading = false;
            deferred.resolve(data);
        }, function (error, status) {
            $rootScope.dataLoading = false;
            logError(error, status);
            deferred.reject(error);
        });

        return deferred.promise;
    };

    this.patch = function (url, data) {
        var deferred = $q.defer();

        $rootScope.dataLoading = true;

        $http.patch(url, data).then(function (data) {
            $rootScope.dataLoading = false;
            deferred.resolve(data);
        }, function (error, status) {
            $rootScope.dataLoading = false;
            logError(error, status);
            deferred.reject(error);
        });

        return deferred.promise;
    };

    this.delete = function (url) {
        var deferred = $q.defer();

        $rootScope.dataLoading = true;

        $http.delete(url).then(function (data) {
            $rootScope.dataLoading = false;
            deferred.resolve(data);
        }, function (error, status) {
            $rootScope.dataLoading = false;
            logError(error, status);
            deferred.reject(error, status);
        });

        return deferred.promise;
    };

    var logError = function (error, status) {
        if (error.data !== null && error.data.message !== null) {
            console.error(error.status + " : " + error.statusText + ".\n" + error.data.message);
        } else {
            console.error(error.status + " : " + error.statusText);
        }
        if (error.status === 403 || error.status === 401) {
            if (error.status === 403) {
                alert("У вас недостаточно привелегий для обращения к ресурсу");
            }
            $location.path('/login');
        }
    };


}]);