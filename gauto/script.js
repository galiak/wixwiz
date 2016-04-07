$(document).ready(function(){
	var data = {
		platforms: [''],
		searchParams: {
			name: '',
			category: '',
			address:{
				geometry : {
					location:{
						lat: -33.8688,
						lng: 151.2195
					},
					radius: 0
				}
			}
		}
	};

	initForm(data);
	displayRequestData(data);
	searchSocialMedia(data);
});

searchSocialMedia = function(data) {
	$('#search').on('click', function() {
		event.preventDefault();
		$('.navigation').empty();
		$('#content').empty();

		getPlatforms(data);
		shouldAddFilter(data);

		if ($('input[name=search]:checked').val() === 'glocation') {
			getBusinessName(data);
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
			success: function(response){
				parseResults(response);
				$('.loading').hide();
			}
		});
	});
};

searchByUrls = function(urls) {
	event.preventDefault();
	$('#platformResults').find('.box').empty();

	var data = {
		urls: urls,
		requestOrigin: 'onboarding'
	};
	$.ajax({
		type: 'POST',
		url: 'http://wizard.jelly.wixpress.com/api/analyzeplatforms',
		data: JSON.stringify(data),
		contentType: 'application/json; charset=utf-8',
		dataType: 'json',
		success: function(response){
			parsePlatformData(response)
		}
	});
};

initForm = function(data) {
	$('input[name=search]:checked').val() === 'gauto' ? initAutoMap(data) : initRadiusMap(data);

	$('#searchOptions').find('input').on('change', function() {
		var value = $('input[name=search]:checked').val(),
			legend= $('#searchFields').find('legend');

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

shouldAddFilter = function (data) {
	data.searchParams.filter = $('input[name=filter]').is(':checked');
};

getPlatforms = function(data) {
	var platformsArray = [],
		mediaBox = $('#mediaBox');

	if (mediaBox.find('input[name=all]:checked').val() === 'all') {
		platformsArray = ['yelp', 'facebook', 'google_places', 'factual'];
	} else {
		mediaBox.find('input[type=checkbox]').each(function () {
			this.checked ? platformsArray.push($(this).val()) : '';
		});
	}
	data.platforms = platformsArray;
};

getServer = function() {
	return $('#server').val();
};

getBusinessName = function(data) {
	data.searchParams.name = $('#businessName').val();
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

$('.request').on('click',function() {
	$('#requestDisplay').toggle();
});