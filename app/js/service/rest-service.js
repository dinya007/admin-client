app.service('restService', function ($http, $q) {

    this.get = function (url) {
        var deferred = $q.defer();

        $http.get(url).then(function (data) {
            deferred.resolve(data.data);
        }, function (error) {
            deferred.reject(
                logError(error)
            );
        });

        return deferred.promise;
    };

    this.post = function (url, data) {
        var deferred = $q.defer();

        $http.post(url, data).then(function (data) {
            deferred.resolve(data.data);
        }, function (error) {
            deferred.reject(
                logError(error)
            );
        });

        return deferred.promise;
    };

    this.put = function (url, data) {
        var deferred = $q.defer();

        $http.put(url, data).then(function (data) {
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

        $http.delete(url).then(function (data) {
            deferred.resolve(data.data);
        }, function (error) {
            deferred.reject(
                logError(error)
            );
        });

        return deferred.promise;
    };

    var logError = function (error) {
        alert(error.status + " : " + error.statusText + ".\n" + error.data.message);
    };


});