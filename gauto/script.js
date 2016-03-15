$(document).ready(function(){
	var results = null;
	var data = {
		'platforms': [''],
		'searchParams': {
			'name': '',
			'category': '',
			'address':{
				'geometry' : {
					'location':{
						'lat': -33.8688,
						'lng': 151.2195
					},
					'radius': 0
				}
			}
		}
	};

	initForm(data);
	displayRequestData(data);

	$('#search').on('click', function() {
		event.preventDefault();
		$('.navigation').empty();
		$('#content').empty();
		getPlatforms(data);
		if($('input[name=search]:checked').val() === 'glocation') {
			getName(data);
			getRadius(data);
		}
		displayRequestData(data);
		$('.loading').show();

		$.ajax({
			type: 'POST',
			url: getServer(),
			data: JSON.stringify(data),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			success: function(data){parseResults(data); $('.loading').hide();}
		});
	});
});

searchByUrls = function(urls) {
	event.preventDefault();
	$('#platformResults .box').empty();

	var data = {
		'urls': urls,
		'requestOrigin': 'onboarding'
	};
	$.ajax({
		type: 'POST',
		url: 'http://wizard.jelly.wixpress.com/api/analyzeplatforms',
		data: JSON.stringify(data),
		contentType: 'application/json; charset=utf-8',
		dataType: 'json',
		success: function(data){parsePlatformData(data)}
	});
};

parseUnifiedGeneralInfo = function(generalInfo) {
	var content = '<ul>';
	generalInfo.site_title ? content += '<li>Site Title [' + generalInfo.site_title.source + ']: <samp>' + generalInfo.site_title.value + '</samp></li>' : '';
	generalInfo.category ? content += '<li>Category [' + generalInfo.category.source + ']: <samp>' + generalInfo.category.value + '</samp></li>' : '';
	generalInfo.sub_category ? content += '<li>Sub-Category [' + generalInfo.sub_category.source + ']: <samp>' + parseSubCategory(generalInfo.sub_category.value) + '</samp></li>' : '';
	generalInfo.short_description ? content += '<li>Short Description [' + generalInfo.short_description.source + ']: <samp>' + generalInfo.short_description.value + '</samp></li>' : '';
	generalInfo.long_description ? content += '<li>Long Description [' + generalInfo.long_description.source + ']: <samp>' + generalInfo.long_description.value + '</samp></li>' : '';
	generalInfo.logo ? content += '<li>Logo [' + generalInfo.logo.source + ']: <img src="' + generalInfo.logo.value + '"/>' + '</li>' : '';
	generalInfo.cover_photo ? content += '<li>Cover Photo [' + generalInfo.cover_photo.source + ']: <img src="' + generalInfo.cover_photo.value + '"/>' + '</li>' : '';
	content += '<ul>';

	return content;
};

parseGeneralInfo = function(generalInfo) {
	var content = '<ul>';
	generalInfo.site_title ? content += '<li>Site Title: <samp>' + generalInfo.site_title + '</samp></li>' : '';
	generalInfo.category ? content += '<li>Category: <samp>' + generalInfo.category + '</samp></li>' : '';
	generalInfo.sub_category ? content += '<li>Sub-Category: <samp>' + parseSubCategory(generalInfo.sub_category) + '</samp></li>' : '';
	generalInfo.short_description ? content += '<li>Short Description: <samp>' + generalInfo.short_description + '</samp></li>' : '';
	generalInfo.long_description ? content += '<li>Long Description: <samp>' + generalInfo.long_description + '</samp></li>' : '';
	generalInfo.logo ? content += '<li>Logo: <img src="' + generalInfo.logo + '"/>' + '</li>' : '';
	generalInfo.cover_photo ? content += '<li>Cover Photo: <img src="' + generalInfo.cover_photo + '"/>' + '</li>' : '';
	content += '<ul>';

	return content;
};

parseUnifiedContactDetails = function(contactDetails) {
	var content = '<ul>';
	contactDetails.address ? content += '<li>Address: <samp>' + contactDetails.address.full_addr + '</samp></li>' : '';
	contactDetails.phone ? content += '<li>Phone [' + contactDetails.phone.source + ']: <samp>' + contactDetails.phone.value + '</samp></li>' : '';
	contactDetails.email ? content += '<li>Email ['+ contactDetails.email.source + ']: <samp>' + contactDetails.email.value + '</samp></li>' : '';
	contactDetails.website ? content += '<li>Website [' + contactDetails.website.source + ']: <samp><a href="' + contactDetails.website.value + '" target="_blank">' + contactDetails.website.value + '</a></samp></li>' : '';
	contactDetails.open_hours ? content += '<li>Open hours [' + contactDetails.open_hours.source + ']: <samp>' + parseOpenHours(contactDetails.open_hours.value.days) + '</samp></li>' : '';
	content += '<ul>';

	return content;
};

parseOpenHours = function(openHours) {
	var content = '<ul class="hours">';

	_.forEach(openHours, function(i) {
		content += '<li>* ' + i.day + ': ' + i.from_hour + '-' + i.to_hour + ' *</li>';
	});
	content += '</ul>';
	return content;
};

parseSubCategory= function(subCategory) {
	var content = '<ul class="category">';

	_.forEach(subCategory, function(i) {
		content += '<li>* ' + i.name + ' *</li>';
	});
	content += '</ul>';
	return content;
};

parseContactDetails = function(contactDetails) {
	var content = '<ul>';
	contactDetails.address ? content += '<li>Address: <samp>' + contactDetails.address.full_addr + '</samp></li>' : '';
	contactDetails.phone ? content += '<li>Phone: <samp>' + contactDetails.phone + '</samp></li>' : '';
	contactDetails.email ? content += '<li>Email: <samp>' + contactDetails.email + '</samp></li>' : '';
	contactDetails.website ? content += '<li>Website: <samp><a href="' + contactDetails.website +'" target="_blank">' + contactDetails.website + '</a></samp></li>' : '';
	contactDetails.open_hours ? content += '<li>Open hours: <samp>' + parseOpenHours(contactDetails.open_hours.days) + '</samp></li>' : '';
	content += '<ul>';

	return content;
};

parsePlatformData = function(answer) {
	var content = '';

	_.forEach(answer.platforms, function(i) {
		content += '<table class="details">';
		if(i.platform_name === 'unified_fields') {
			content += '<caption>' + i.platform_name + '</caption>';
			content += '<tr><th>General Info</th>';
			content += '<td>' + parseUnifiedGeneralInfo(i.general_info) + '</td></tr>';
			content += '<tr><th>Contact Details</th>';
			content += '<td>' + parseUnifiedContactDetails(i.contact_details) + '</td></tr>';
		} else {
			content += '<caption>' + i.platform_name + '</caption>';
			i.url ? content += '<caption class="link"><a href="' + i.url + '" target="_blank">' + i.url + '<a></caption>' : '';
			content += '<tr><th>General Info</th>';
			content += '<td>' + parseGeneralInfo(i.general_info) + '</td></tr>';
			content += '<tr><th>Contact Details</th>';
			content += '<td>' + parseContactDetails(i.contact_details) + '</td></tr>';
		}

		content += '<table>';
	});

	$('#platformResults .box').html(content);
	$('#platformResults .loading').hide();
	$('#platformResults .box').show();
};


initForm = function(data) {
	$('input[name=search]:checked').val() === 'gauto' ? initAutoMap(data) : initRadiusMap(data);

	$('#searchOptions input').on('change', function() {
		var value = $('input[name=search]:checked').val(),
				legend= $('#searchFields legend');

		if (value === 'gauto') {
			legend.html('Search by Business Name and Location (Google autocomplete)');
			$('#floating-panel').hide();
			$('#pac-input').show();
			$('#type-selector').show();
			initAutoMap(data);
		}
		if (value === 'glocation') {
			legend.html('Search by Business Name, Location and Radius');
			$('#pac-input').hide();
			$('#type-selector').hide();
			$('#floating-panel').show();
			initRadiusMap(data)
		}
	});
};

displayRequestData = function(data) {
	$('#requestData').html(JSON.stringify(data, undefined, 2));
};

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

	function doThis(data) {
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

	autocomplete.addListener('place_changed', doThis.bind(null, data), false);

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
	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 10,
		center: {
			lat: typeof(data.searchParams.address.geometry.location.lat) === 'function' ? data.searchParams.address.geometry.location.lat() : data.searchParams.address.geometry.location.lat,
			lng: typeof(data.searchParams.address.geometry.location.lng) === 'function' ? data.searchParams.address.geometry.location.lng() : data.searchParams.address.geometry.location.lng
		},
		zoomControl: true
	});
	var marker = new google.maps.Marker({
		position: {
			lat: typeof(data.searchParams.address.geometry.location.lat) === 'function' ? data.searchParams.address.geometry.location.lat() : data.searchParams.address.geometry.location.lat,
			lng: typeof(data.searchParams.address.geometry.location.lng) === 'function' ? data.searchParams.address.geometry.location.lng() : data.searchParams.address.geometry.location.lng
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

unifiedPlatforms = function(mergedResults) {
	var platforms = '';

	_(mergedResults).forEach(function(n) {
		platforms += '<li><span class="icon ' + n.platform_name + '"></span></li>';
	});

	return platforms;
};

organizeMergedResults = function(mergedResults) {
	var content = '';
	content += '<table>';
	content += '<tr><th>Platform</th><th>Name</th><th>Category</th><th>Address</th><th>Phone</th><th>Url</th><th>Website</th><th>Image</th></tr>';
	_.forEach(mergedResults, function(i) {

		content += '<tr>';
		content +=	'<th>' + i.platform_name + '</th>';
		content += '<td>' + i.text + '</td>';
		content += '<td>' + i.category + '</td>';
		content += i.address ? '<td>' + i.address.full_addr + '</td>': '<td>--/--</td>';
		content += '<td>' + i.phone + '</td>';
		content += '<td>' + '<a target="_blank" href="' + i.url + '">' + i.url + '</a>' + '</td>';
		content += i.website ? '<td>' + '<a target="_blank" href="' + i.website + '">' + i.website + '</a>' + '</td>' : '<td>--/--</td>';
		content += '<td>' + '<img src="' + i.image + '" />' + '</td>';
		content +=	'</tr>';
	});
	content += '</table>';
	return content;
};

parseResults = function(results) {
	if (_.size(results) === 2) {
		$('<h3>There are no results to display...</h3>').appendTo('#content');
		$('#results').show();
		return;
	}

	var defaultImage = 'http://static.wixstatic.com/media/e9e449_0669f883fffe4119bd6e7e48519482a0.png';
	var output = '';

	if (results.unified_search) {
		$('<li class="icon wix" id="unified"><span class="number">' + _.size(results.unified_search) + '</span> Unified results</li>').appendTo('.navigation');
		output += '<div id="unifiedResult">';

		_.forIn(results.unified_search, function(j) {
			output += '<dl>';
			output += '<dt>';
			output += '<img src="' + (j.image ? j.image : defaultImage) + '" />';
			output += j.text + '; Similarity rank: ' + j.name_similarity_rank + '; Distance: ' + parseInt(j.distance) + 'm' + '<ul class="platforms">' + unifiedPlatforms(j.merged_results) + '</ul>';
			output += '<span class="icon search"></span>';
			output += '<div class="modal">' + organizeMergedResults(j.merged_results) + '</div>';
			output += '<div class="platformUrls">' + j.urls + '</div>';
			output += '</dt>';

			j.category ? output += '<dd>' + j.category + '</dd>' : output += '';
			j.website ? output += '<dd class="icon website">' + '<a target="_blank" href="' + j.website + '">' + j.website + '</a></dd>' : output += '';
			j.phone ? output += '<dd class="icon phone">' + j.phone + '</dd>' : output += '';
			j.address ? output += '<dd class="icon location">' + j.address.full_addr + '</dd>' : output += '';
			output += '</dl>';
		});

		output += '</div>';
	}

	if (results.yelp_search) {
		$('<li class="icon yelp" id="yelp"><span class="number">' + _.size(results.yelp_search) + '</span> Yelp</li>').appendTo('.navigation');
		output += '<div id="yelpResult">';

		_.forIn(results.yelp_search, function(j) {
			output += '<dl>';
			output += '<dt><img src="' + j.image + '" />' + j.text + '</dt>';
			output += '<dd>' + j.category + '</dd>';
			output += '<dd class="icon web">' + '<a target="_blank" href="' + j.url + '">' + j.url + '</a></dd>';
			output += '<dd class="icon phone">' + j.phone + '</dd>';
			output += '<dd class="icon location">' + j.address.full_addr + '</dd>';
			output += '</dl>';
		});

		output += '</div>';
	}

	if (results.factual_search) {
		$('<li class="icon factual" id="factual"><span class="number">' + _.size(results.factual_search) + '</span> Factual</li>').appendTo('.navigation');
		output += '<div id="factualResult">';

		_.forIn(results.factual_search, function(j) {
			output += '<dl>';
			output += '<dt>' + j.text + '</dt>';
			output += '<dd>' + j.category + '</dd>';
			output += '<dd class="icon web">' + '<a target="_blank" href="' + j.url + '">' + j.url + '</a></dd>';
			j.website ? output += '<dd class="icon website">' + '<a target="_blank" href="' + j.website + '">' + j.website + '</a></dd>': output += '';
			output += '<dd class="icon email">' + '<a target="_blank" href="' + j.email + '">' + j.email + '</a></dd>';
			output += '<dd class="icon phone">' + j.phone + '</dd>';
			output += '<dd class="icon location">' + j.address.full_addr + '</dd>';
			output += '</dl>';
		});

		output += '</div>';
	}

	if (results.facebook_search) {
		$('<li class="icon facebook" id="facebook"><span class="number">' + _.size(results.facebook_search) + '</span> Facebook</li>').appendTo('.navigation');
		output += '<div id="facebookResult">';

		_.forIn(results.facebook_search, function(j) {
			output += '<dl>';
			output += '<dt><img src="' + j.image + '" />' + j.text + '</dt>';
			output += '<dd>' + j.category + '</dd>';
			j.website ? output += '<dd class="icon website">' + '<a target="_blank" href="' + j.website + '">' + j.website + '</a></dd>': output += '';
			output += '<dd class="icon facebook">' + '<a target="_blank" href="' + j.url + '">' + j.url + '</a></dd>';
			j.phone ? output += '<dd class="icon phone">' + j.phone + '</dd>' : output += '';
			j.address ? output += '<dd class="icon location">' + j.address.full_addr + '</dd>' : output += '';
			output += '</dl>';
		});

		output += '</div>';
	}

	if (results.google_places_search) {
		$('<li class="icon google_places" id="google_places"><span class="number">' + _.size(results.google_places_search) + '</span> Google Places</li>').appendTo('.navigation');
		output += '<div id="google_placesResult">';

		_.forIn(results.google_places_search, function(j) {
			output += '<dl>';
			output += '<dt><img src="' + j.image + '" />' + j.text + '</dt>';
			output += '<dd>' + j.category + '</dd>';
			j.website ? output += '<dd class="icon website">' + '<a target="_blank" href="' + j.website + '">' + j.website + '</a></dd>': output += '';
			output += '<dd class="icon google_places">' + '<a target="_blank" href="' + j.url + '">' + j.url + '</a></dd>';
			output += '<dd class="icon phone">' + j.phone + '</dd>';
			output += '<dd class="icon location">' + j.address.full_addr + '</dd>';
			output += '</dl>';
		});

		output += '</div>';
	}

	if (results.google_plus_search) {
		$('<li class="icon google_plus" id="google_plus"><span class="number">' + _.size(results.google_plus_search) + '</span> Google Plus</li>').appendTo('.navigation');
		output += '<div id="google_plusResult">';

		_.forIn(results.google_plus_search, function(j) {
			output += '<dl>';
			output += '<dt><img src="' + j.image + '" />' + j.text + '</dt>';
			output += '<dd class="icon google_plus">' + '<a target="_blank" href="' + j.url + '">' + j.url + '</a></dd>';
			output += '</dl>';
		});

		output += '</div>';
	}

	if (results.twitter_search) {
		$('<li class="icon twitter" id="twitter"><span class="number">' + _.size(results.twitter_search) + '</span> Twitter</li>').appendTo('.navigation');
		output += '<div id="twitterResult">';

		_.forIn(results.twitter_search, function(j) {
			output += '<dl>';
			output += '<dt><img src="' + j.image + '" />' + j.text + '</dt>';
			j.category ? output += '<dd>' + j.category + '</dd>' : output += '';
			output += '<dd class="icon twitter">' + '<a target="_blank" href="' + j.url + '">' + j.url + '</a></dd>';
			j.address ? output += '<dd class="icon location">' + j.address.full_addr + '</dd>' : output += '';
			output += '</dl>';
		});

		output += '</div>';
	}

	if (results.youtube_search) {
		$('<li class="icon youtube" id="youtube"><span class="number">' + _.size(results.youtube_search) + '</span> YouTube</li>').appendTo('.navigation');
		output += '<div id="youtubeResult">';

		_.forIn(results.youtube_search, function(j) {
			output += '<dl>';
			output += '<dt><img src="' + j.image + '" />' + j.text + '</dt>';
			output += '<dd class="icon youtube">' + '<a target="_blank" href="' + j.url + '">' + j.url + '</a></dd>';
			output += '</dl>';
		});

		output += '</div>';
	}

	if (results.flickr_search) {
		$('<li class="icon flickr" id="flickr"><span class="number">' + _.size(results.flickr_search) + '</span> Flickr</li>').appendTo('.navigation');
		output += '<div id="flickrResult">';

		_.forIn(results.flickr_search, function(j) {
			output += '<dl>';
			output += '<dt><img src="http://storage.ubertor.com/rodandrhea.myubertor.com/content/image/9954.png" />' + j.text + '</dt>';
			output += '<dd class="icon web">' + '<a target="_blank" href="' + j.url + '">' + j.url + '</a></dd>';
			output += '</dl>';
		});

		output += '</div>';
	}

	$(output).appendTo('#content');

	$('.search').on('click', function(e) {
		$('#platformResults').css('top', e.pageY);
		$('#platformResults').show();
		$('#platformResults .loading').show();
		searchByUrls(($(this).siblings('.platformUrls').html()).split(','));
	});

	$('.close').on('click', function() {
		$('#platformResults').hide();
	});

	$(document).keydown(function(e) {
		if (e.keyCode == 27) {
			$('#platformResults').hide();
		}
	});

	$('.navigation li:first-child').addClass('selected');


	$('.navigation li').on('click', function() {
		navigateResults(this);
	});

	$('#unifiedResult .platforms').on('click',function() {
		$(this).siblings('.modal').toggle();
	});

	$('#unifiedResult').show();
	$('#results').show();
	$('#content div:first-child').show();
};

navigateResults = function(element) {
	$('.navigation li').removeClass('selected');
	$(element).addClass('selected');

	$('#content div').hide();
	$('#' + $(element).attr('id') + 'Result').show();
};

getPlatforms = function(data) {
	var platformsArray = [];
	if($('#mediaBox input[name=all]:checked').val() !== 'all') {
		$('#mediaBox input[type=checkbox]').each(function () {
			this.checked ? platformsArray.push($(this).val()) : '';
		});
	}
	data.platforms = platformsArray;
};

getServer = function() {
	return $('#server').val();
};

getName = function(data) {
	data.searchParams.name = $('#term').val();
};

getLatitude = function(data) {
	return data.searchParams.address.geometry.location.lat;
};

getLongitude = function(data) {
	return data.searchParams.address.geometry.location.lng;
};

getRadius = function(data) {
	return data.searchParams.address.geometry.radius = Number($('#radius').val());
};

formatAddress = function(addressObj) {
	var address = '';
	_.forIn(addressObj, function(i) {
		adress += addressObj.street + ' ' + addressObj.city + ' ' + addressObj.state + ' ' + addressObj.country + ' ' + addressObj.zipcode;
	});
	return address;
};

$('.request').on('click',function() {
	$('#dataDisplay').toggle();
});
