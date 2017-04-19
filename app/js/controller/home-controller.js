app.controller('homeController', ['$scope', 'placeService', function ($scope, placeService) {

    $scope.currentPlace = undefined;
    $scope.modifiedPlace = {};

    var loadPlaces = function (setPlaces) {
        placeService.getAll().then(function (data) {
            $scope.places = data.data;
            setPlaces($scope.places);
        });
    };

    initMap(loadPlaces, $scope);

    $scope.deleteSale = function (place, sale) {

        bootbox.confirm({
            message: "<h4 class='text-center'>Удалить скидку?</h4><strong>" + sale.description + '<strong>',
            buttons: {
                confirm: {
                    label: 'Да',
                    className: 'btn-success'
                },
                cancel: {
                    label: 'Нет',
                    className: 'btn-danger'
                }
            },
            callback: function (result) {
                if (result) {
                    var index = place.sales.indexOf(sale);

                    if (index > -1) {
                        place.sales.splice(index, 1);
                        placeService.save(place);
                    }
                }
            }
        });

    };

    $scope.deletePlace = function () {
        var place = $scope.places[$scope.modifiedPlaceIndex];
        bootbox.confirm({
            message: "<h4 class='text-center'>Удалить заведение?</h4><strong>" + place.address + '<strong>',
            buttons: {
                confirm: {
                    label: 'Да',
                    className: 'btn-success'
                },
                cancel: {
                    label: 'Нет',
                    className: 'btn-danger'
                }
            },
            callback: function (result) {
                if (result) {
                    placeService.delete(place)
                        .then(function (data) {
                            $scope.places.splice($scope.modifiedPlaceIndex, 1);

                        });
                }
            }
        });

    };

    $scope.archiveSale = function (place, sale) {
        sale.active = false;
        placeService.save(place, function () {
            $scope.updateMap($scope.places);
        });
    };

    $scope.unarchiveSale = function (place, sale) {
        sale.active = true;
        placeService.save(place, function () {
            $scope.updateMap($scope.places);
        });
    };

    $scope.savePlace = function (place) {
        placeService.save(place);
    };

    $scope.addNewSale = function (place) {
        var sale = {};
        sale.active = true;
        sale.isNew = true;
        if (!place.sales) {
            place.sales = [];
        }
        place.sales.unshift(sale);
    };

    $scope.onSaleShow = function (sale, form) {
        if (sale.isNew === true) {
            form.$show();
        }
        return true;
    };

    $scope.saveNewSale = function (place) {
        placeService.save(place, function (data) {
            $scope.updateMap($scope.places);
        });
    };

    $scope.removeNewSale = function (place, sale) {
        if (sale.isNew) {
            var index = place.sales.indexOf(sale);

            if (index > -1) {
                place.sales.splice(index, 1);
            }
        }
    };

    $scope.removeIsNewAttribute = function (sale) {
        if (sale.isNew) {
            delete sale.isNew;
        }
    };

    $scope.createPlace = function (name, address, description) {
        var newPlace = {};

        newPlace.name = name;
        newPlace.address = address;
        newPlace.description = description;

        placeService.create(newPlace)
            .then(function (data) {
                $scope.places.push(data.data);
                $scope.updateMap($scope.places);
            });

    };

    $scope.startModifyingPlace = function (index) {
        var place = $scope.places[index];
        $scope.modifiedPlace.locationName = place.locationName;
        $scope.modifiedPlace.address = place.address;
        $scope.modifiedPlace.description = place.description;
        $scope.modifiedPlaceIndex = index;
    };

    $scope.updatePlace = function () {
        var place = $scope.places[$scope.modifiedPlaceIndex];
        place.locationName = $scope.modifiedPlace.locationName;
        place.address = $scope.modifiedPlace.address;
        place.description = $scope.modifiedPlace.description;
        var oldMarker = place.marker;
        placeService.saveAndUpdateMap(place, function (data) {
            oldMarker.setMap(null);
            $scope.places[$scope.modifiedPlaceIndex] = data.data;
            $scope.updateMap($scope.places);
        });
    };

}]);