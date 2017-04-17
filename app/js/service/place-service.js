app.service('placeService', ['restService', function (restService) {

    this.getAll = function () {
        return restService.get("/secure/places/all-for-owner");
    };

    this.save = function (place) {
        save(place, null);
    };

    this.save = function (place, callback) {
        var marker = place.marker;
        delete place.marker;
        restService.patch("/secure/place", place)
            .then(function (data) {
                place.marker = marker;
                if (callback) {
                    callback(data);
                }
            });
    };

    this.saveAndUpdateMap = function (place, callback) {
        var marker = place.marker;
        delete place.marker;
        restService.post("/secure/place", place)
            .then(function (data) {
                place.marker = marker;
                if (callback) {
                    callback(data);
                }
            });
    };

    this.create = function (place) {
        return restService.put("/secure/place", place);
    };

    this.delete = function (place) {
        return restService.delete("/secure/place/" + place.id);
    };

}]);
