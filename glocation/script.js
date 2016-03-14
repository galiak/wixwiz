$(document).ready(function(){			
	var results = null;
	var data = {
			'platforms': [''],
			'searchParams': {
				'name': 'pizza',							
				'category': '',
				'address':{
					'geometry' : {
						'location':{
							'lat': 37.7749295,
							'lng': -122.41941550000001
						},
						'radius': 5000
					}
				}
			}
		}
	
	initForm(data);
	initiMap(data);
	displayRequestData(data);
	
	$('#search').on('click', function() {	
		event.preventDefault();			
		$('.navigation').empty();					
		$('#content').empty();					
		getPlatforms(data);					
		getName(data);					
		getCategory(data);				
		getRadius(data);
		displayRequestData(data);		
		$('.loading').show();
		
		$.ajax({
			type: 'POST',
			url: getServer(),
			data: JSON.stringify(data),
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: function(data){parseResults(data); $('.loading').hide();},
			dataType: 'json'
		});				
	});
});		

initForm = function(data) {
	$('#term').val('pizza');				
	$('#latitude').val(data.searchParams.address.geometry.location.lat);
	$('#longitude').val(data.searchParams.address.geometry.location.lng);
}

displayRequestData = function(data) {
	$('#requestData').html(JSON.stringify(data, undefined, 2));
}

initiMap = function(data) {			
	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 10,
		center: {lat: data.searchParams.address.geometry.location.lat, lng: data.searchParams.address.geometry.location.lng},
		zoomControl: true
	});
	var marker = new google.maps.Marker({
		position: {lat: data.searchParams.address.geometry.location.lat, lng: data.searchParams.address.geometry.location.lng},
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
}

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
}

unifiedPlatforms = function(mergedResults) {				
	var platforms = '';
	
	_(mergedResults).forEach(function(n) { 
		platforms += '<span class="icon ' + n.platform_name + '"></span>';					
	});			
	
	return platforms;
}
organizeMergedResults = function(mergedResults) {
	var content = '';
	
	_.forEach(mergedResults, function(i) { 									
		content += '<ul class="details">';
		content += '<li>Platform: ' + i.platform_name + '</li>';
		content += '<li>Text: ' + i.text + '</li>';
		content += '<li>Category: ' + i.category + '</li>';
		i.address ? content += '<li>Address: ' + i.address.full_addr + '</li>' : '';
		content += '<li>Phone: ' + i.phone + '</li>';
		content += '<li>Url: <a target="_blank" href="' + i.url + '">' + i.url + '</a></li>';
		i.website ? content += '<li>Website: <a target="_blank" href="' + i.website + '">' + i.website + '</a></li>' : '';
		i.image ? content += '<li><img src="' + i.image + '" /></li>' : '';
		content += '</ul>';		
	});
	
	return content;
}	

parseResults = function(results) {		
	if (_.size(results) === 2) {
		$('<h3>There are no results to display...</h3>').appendTo('#content');						
		$('#results').show();
		return;
	}
	
	var defaultImage = 'https://d2eyqiy4n03ve6.cloudfront.net/12345678-1234-1234-1234-1234567890ab/2015/02/26/7b5ccd55-3c11-458a-8ec5-6c3a8f36a5ad.gif';
	var output = '';	
	
	if (results.unified_search) {	
		$('<li class="icon wix" id="unified"><span class="number">' + _.size(results.unified_search) + '</span> Unified results</li>').appendTo('.navigation');
		output += '<div id="unifiedResult">';				
		
		_.forIn(results.unified_search, function(j) { 							
			output += '<dl>';
			
			output += '<dt>';
			output += '<img src="' + (j.image ? j.image : defaultImage) + '" />';
			output += j.text + unifiedPlatforms(j.merged_results);
			output += '<div class="modal">' + organizeMergedResults(j.merged_results) + '</div>';			
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
	$('.navigation li:first-child').addClass('selected');	

	$('.navigation li').on('click', function() {	
		navigateResults(this);
	});

	$('#unifiedResult dt').on('mouseover',function() {			
		$(this).children('.modal').show();	
	});
	$('#unifiedResult dt').on('mouseout',function() {	
		$(this).children('.modal').hide();	
	});
	
	$('#results').show();	
}

navigateResults = function(element) {
	$('.navigation li').removeClass('selected');
	$(element).addClass('selected');
	
	$('#content div').hide();
	$('#' + $(element).attr('id') + 'Result').show();		
}

getPlatforms = function(data) {				
	var platformsArray = [];
	$('#mediaBox input[type=checkbox]').each(function () {
		this.checked ? platformsArray.push(this.name) : '';
	});				
	data.platforms = platformsArray;
}

getServer = function() {
	return $('#server').val();
}

getName = function(data) {				
	data.searchParams.name = $('#term').val();
}

getCategory = function(data) {
	data.searchParams.category = $('#category').val();
}

getLatitude = function(data) {			
	return data.searchParams.address.geometry.location.lat;
}

getLongitude = function(data) {
	return data.searchParams.address.geometry.location.lng;
}

getRadius = function(data) {
	return data.searchParams.address.geometry.radius = Number($('#radius').val());
}
		
formatAddress = function(addressObj) {
	var address = '';
	_.forIn(addressObj, function(i) { 
		adress += addressObj.street + ' ' + addressObj.city + ' ' + addressObj.state + ' ' + addressObj.country + ' ' + addressObj.zipcode;					
	});
	return address;				
}						

$('input[type=radio][name=type]').on('change', function() {				
	this.value == 'address' ? ($('#coordinatesBox').hide(), $('#addressBox').show()) : ($('#addressBox').hide(), $('#coordinatesBox').show());		
});			