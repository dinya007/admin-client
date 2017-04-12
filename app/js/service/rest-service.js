app.service('restService', ['$http', '$q', '$cookieStore', function ($http, $q,  $cookieStore) {

    var applicationUrl = "http://127.0.0.1:8081";

    this.get = function (url) {
        var deferred = $q.defer();

        $http.get(applicationUrl + url).then(function (data) {
            deferred.resolve(data);
        }, function (error) {
            logError(error);
            deferred.reject(error);
        });

        return deferred.promise;
    };

    this.post = function (url, data) {
        var deferred = $q.defer();

        var request = {
            method: 'POST',
            url: applicationUrl + url,
            headers: {
                'Content-Type': 'text/plain'
            },
            data: data
        };

        $http(request).then(function (data) {
            deferred.resolve(data);
        }, function (error) {
            logError(error);
            deferred.reject(error);
        });

        return deferred.promise;
    };

    this.put = function (url, data) {
        var deferred = $q.defer();

        $http.put(applicationUrl + url, data).then(function (data) {
            deferred.resolve(data.data);
        }, function (error) {
            deferred.reject(
                logError(error)
            );
        });

        return deferred.promise;
    };

    this.delete = function (url) {
        var deferred = $q.defer();

        $http.delete(applicationUrl + url).then(function (data) {
            deferred.resolve(data.data);
        }, function (error) {
            deferred.reject(
                logError(error)
            );
        });

        return deferred.promise;
    };

    var logError = function (error) {
        if (error.data !== null && error.data.message !== null) {
            console.error(error.status + " : " + error.statusText + ".\n" + error.data.message);
        } else {
            console.error(error.status + " : " + error.statusText);
        }
    };


}]);