app.controller('homeController', ['$scope', 'placeService','$rootScope', function ($scope, placeService,$rootScope) {

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
    }

    $scope.openInfoWindow = function (e, place) {
        e.preventDefault();
        $scope.currentPlace = place;
        google.maps.event.trigger(place.marker, 'click');
    };

}]);