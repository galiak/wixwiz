initAutoMap = function(data) {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -33.8688, lng: 151.2195},
        zoom: 13
    });

    if(!document.getElementById('pac-input')) {
        var text = '<input id="pac-input" class="controls" type="text" placeholder="Enter location">';
        text += '<div id="type-selector" class="controls">';
        text +=	'<input type="radio" name="type" id="changetype-all" checked="checked">';
        text +=	'<label class="shortLabel" for="changetype-all">All</label>';
        text +=	'<input type="radio" name="type" id="changetype-establishment">';
        text +=	'<label class="shortLabel" for="changetype-establishment">Establishments</label>';
        text +=	'<input type="radio" name="type" id="changetype-address">';
        text +=	'<label class="shortLabel" for="changetype-address">Addresses</label>';
        text +=	'<input type="radio" name="type" id="changetype-geocode">';
        text +=	'<label class="shortLabel" for="changetype-geocode">Geocodes</label>';
        text +=	'</div>	';
        $(text).appendTo($('.mapContainer'));
    }

    var input = document.getElementById('pac-input');

    var types = document.getElementById('type-selector');
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(types);

    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);

    var infowindow = new google.maps.InfoWindow();
    var marker = new google.maps.Marker({
        map: map,
        anchorPoint: new google.maps.Point(0, -29)
    });

    function geoChange(data) {
        infowindow.close();
        marker.setVisible(false);
        var place = autocomplete.getPlace();
        if (!place.geometry) {
            window.alert("Autocomplete's returned place contains no geometry");
            return;
        }

        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);  // Why 17? Because it looks good.
        }

        marker.setPosition(place.geometry.location);
        marker.setVisible(true);

        var address = '';
        if (place.address_components) {
            address = [
                (place.address_components[0] && place.address_components[0].short_name || ''),
                (place.address_components[1] && place.address_components[1].short_name || ''),
                (place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ');
        }

        infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
        infowindow.open(map, marker);
        data.searchParams.address = place;
        data.searchParams.name = place.name;
    }

    autocomplete.addListener('place_changed', geoChange.bind(null, data), false);

    // Sets a listener on a radio button to change the filter type on Places
    // Autocomplete.
    function setupClickListener(id, types) {
        var radioButton = document.getElementById(id);
        radioButton.addEventListener('click', function() {
            autocomplete.setTypes(types);
        });
    }

    setupClickListener('changetype-all', []);
    setupClickListener('changetype-address', ['address']);
    setupClickListener('changetype-establishment', ['establishment']);
    setupClickListener('changetype-geocode', ['geocode']);
};

initRadiusMap = function(data) {
    var lat = typeof(data.searchParams.address.geometry.location.lat) === 'function' ? data.searchParams.address.geometry.location.lat() : data.searchParams.address.geometry.location.lat,
        lng = typeof(data.searchParams.address.geometry.location.lng) === 'function' ? data.searchParams.address.geometry.location.lng() : data.searchParams.address.geometry.location.lng;

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: {
            lat: lat,
            lng: lng
        },
        zoomControl: true
    });
    var marker = new google.maps.Marker({
        position: {
            lat: lat,
            lng: lng
        },
        map: map
    });
    var circle = new google.maps.Circle({
        map: map,
        radius: data.searchParams.address.geometry.radius,
        fillColor: '#2E86C1',
        strokeColor: '#2E86C1',
        strokeWeight: 1
    });
    circle.bindTo('center', marker, 'position');

    var geocoder = new google.maps.Geocoder();
    document.getElementById('submit').addEventListener('click', function() {
        geocodeAddress(geocoder, map, data);
    });
};

geocodeAddress = function(geocoder, resultsMap, data) {
    var address = document.getElementById('address').value;
    geocoder.geocode({'address': address}, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            data.searchParams.address = results[0];
            data.searchParams.address.geometry.radius = getRadius(data);
            resultsMap.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
                map: resultsMap,
                position: results[0].geometry.location
            });
            var circle = new google.maps.Circle({
                map: resultsMap,
                radius: data.searchParams.address.geometry.radius,
                fillColor: '#2E86C1',
                strokeColor: '#2E86C1',
                strokeWeight: 1
            });
            circle.bindTo('center', marker, 'position');
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
};