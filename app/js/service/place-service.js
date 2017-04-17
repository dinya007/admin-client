app.service('placeService', ['restService', function (restService) {

    this.getAll = function () {
        return restService.get("/secure/places/all-for-owner");
    }

    this.save = function (place) {
        var marker = place.marker;
        delete place.marker;
        restService.post("/secure/place", place)
            .then(function (data) {
                place.marker = marker;
            });
    };

    this.create = function (place) {
        return restService.put("/secure/place", place);
    };

}]);
