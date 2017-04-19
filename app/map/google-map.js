function initMap(loadPlaces, $scope) {
    var infoWindow = new google.maps.InfoWindow();

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
        $scope.updateMap(places);
    };

    $scope.updateMap = function (places) {

        var createMarker = function (place) {
            var marker = new google.maps.Marker({
                map: $scope.map,
                position: new google.maps.LatLng(place.location.lat, place.location.lon),
                animation: google.maps.Animation.DROP,
                title: place.locationName
            });

            if (place.sales !== null) {
                marker.content = '<ul class="list-group">';
                var i = 0;
                var j = 0;
                while (i < place.sales.length && j < 3) {
                    var sale = place.sales[i];
                    if (sale.active) {
                        ++j;
                        marker.content += '<li class="list-group-item">' + sale.description + '</li>'
                    }
                    ++i;
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

        if (!$scope.currentPlace) {
            $scope.currentPlace = places[0];
        }
        google.maps.event.trigger($scope.currentPlace.marker, 'click');
    };

    $scope.openInfoWindow = function (e, place) {
        e.preventDefault();
        $scope.currentPlace = place;
        google.maps.event.trigger(place.marker, 'click');
    };

}