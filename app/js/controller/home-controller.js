app.controller('homeController', ['$scope', 'placeService', function ($scope, placeService) {

    $scope.currentPlace = {};

    initMap(function () {
        placeService.getAll().then(function (data) {
            $scope.places = data.data;
            updateMap($scope.places);
        });
    });

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
                loadPlaces();
            });
        } else {
            alert("Geolocation is not supported by this browser.");
        }

    }

    function updateMap(places) {
        var infoWindow = new google.maps.InfoWindow();

        var createMarker = function (place) {
            var marker = new google.maps.Marker({
                map: $scope.map,
                position: new google.maps.LatLng(place.location.lat, place.location.lon),
                animation: google.maps.Animation.DROP,
                title: place.locationName
            });
            marker.content = '<div class="infoWindowContent">' + place.description + '</div>';

            google.maps.event.addListener(marker, 'click', function () {
                var contentString = '<div class="info-window">' +
                    '<h3>' + marker.title + '</h3>' +
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
    }

    $scope.openInfoWindow = function (e, place) {
        e.preventDefault();
        $scope.currentPlace = place;
        google.maps.event.trigger(place.marker, 'click');
    };

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

    $scope.archiveSale = function (place, sale) {
        sale.active = false;
        placeService.save(place);
    };

    $scope.unarchiveSale = function (place, sale) {
        sale.active = true;
        placeService.save(place);
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
        sale.description = "Ваша новая скидка";
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
        if (name === '') {
            alert('Введите, пожалуйста, название заведения');
            return;
        }

        if (address === '') {
            alert('Введите, пожалуйста, адрес заведения');
            return;
        }

        if (description === '') {
            alert('Введите, пожалуйста, описание заведения');
            return;
        }

        var newPlace = {};

        newPlace.name = name;
        newPlace.address = address;
        newPlace.description = description;

        placeService.create(newPlace)
            .then(function (data) {
                initMap();
            });

    }

}]);