app.service('restService', ['$http', '$q', function ($http, $q) {

    this.get = function (url) {
        var deferred = $q.defer();

        $http.get(url).then(function (data) {
            deferred.resolve(data);
        }, function (error, status) {
            logError(error, status);
            deferred.reject(error);
        });

        return deferred.promise;
    };

    this.post = function (url, data) {
        var deferred = $q.defer();

        $http.post(url, data).then(function (data) {
            deferred.resolve(data);
        }, function (error, status) {
            logError(error, status);
            deferred.reject(error);
        });

        return deferred.promise;
    };

    this.put = function (url, data) {
        var deferred = $q.defer();

        $http.put(url, data).then(function (data) {
            deferred.resolve(data.data);
        }, function (error, status) {
            logError(error, status);
            deferred.reject(error);
        });

        return deferred.promise;
    };

    this.delete = function (url) {
        var deferred = $q.defer();

        $http.delete(url).then(function (data) {
            deferred.resolve(data.data);
        }, function (error, status) {
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
    };


}]);