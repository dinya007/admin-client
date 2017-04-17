app.controller('homeController', ['$scope', 'placeService', function ($scope, placeService) {

    $scope.currentPlace = {};
    $scope.modifiedPlace = {};

    var loadPlaces = function (setPlaces) {
        placeService.getAll().then(function (data) {
            $scope.places = data.data;
            setPlaces($scope.places);
        });
    };

    initMap(loadPlaces);

    function initMap(loadPlaces) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var mapOptions = {
                    zoom: 15,
                    center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    disableDefaultUI: true,
                    zoomControl: true,
                    scaleControl: true,
                    rotateControl: true
                    // https://developers.google.com/maps/documentation/javascript/controls#DisablingDefaults
                };
                $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
                $scope.markers = [];

                loadPlaces(setPlaces);
            });
        } else {
            alert("Geolocation is not supported by this browser.");
        }

        var setPlaces = function (places) {
            updateMap(places);
        };

        updateMap = function (places) {
            var infoWindow = new google.maps.InfoWindow();

            var createMarker = function (place) {
                var marker = new google.maps.Marker({
                    map: $scope.map,
                    position: new google.maps.LatLng(place.location.lat, place.location.lon),
                    animation: google.maps.Animation.DROP,
                    title: place.locationName
                });


                if (place.sales !== null) {
                    marker.content = '<ul class="list-group">';
                    for (var i = 0; i < place.sales.length && i < 3; i++) {
                        var sale = place.sales[i];
                        if (sale.active) {
                            marker.content += '<li class="list-group-item">' + sale.description + '</li>'
                        }
                    }
                    marker.content += '</ul>';
                } else {
                    marker.content = '';
                }

                google.maps.event.addListener(marker, 'click', function () {
                    var contentString = '<div class="info-window">' +
                        '<h3 class="text-center">' + marker.title + '</h3>' +
                        '<div class="info-content">' +
                        '<p>' + marker.content + '</p>' +
                        '</div>' +
                        '</div>';
                    infoWindow.setContent(contentString);
                    infoWindow.open($scope.map, marker);
                });

                place.marker = marker;
            };

            for (var i = 0; i < places.length; i++) {
                createMarker(places[i]);
            }

            $scope.currentPlace = places[0];
            google.maps.event.trigger($scope.currentPlace.marker, 'click');
        };

        $scope.openInfoWindow = function (e, place) {
            e.preventDefault();
            $scope.currentPlace = place;
            google.maps.event.trigger(place.marker, 'click');
        };

    }

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
            updateMap($scope.places);
        });
    };

    $scope.unarchiveSale = function (place, sale) {
        sale.active = true;
        placeService.save(place, function () {
            updateMap($scope.places);
        });
    };

    $scope.savePlace = function (place) {
        placeService.save(place);
    };

    $scope.bindSaleText = function (sale) {
        if (sale.active) {
            return sale.description;
        } else return '<del>' + sale.description + '</del>';
    };

    $scope.addNewSale = function (place) {
        var sale = {};
        sale.active = true;
        sale.isNew = true;
        place.sales.unshift(sale);
    };


    $scope.onSaleShow = function (sale, form) {
        if (sale.isNew === true) {
            form.$show();
        }
        return true;
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
                updateMap($scope.places);
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
            updateMap($scope.places);
        });
    };

}]);