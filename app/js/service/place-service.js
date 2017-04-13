app.service('placeService', ['restService', function (restService) {

    this.getAll = function () {
        return restService.get("/secure/places/all-for-owner");
    }

}]);
