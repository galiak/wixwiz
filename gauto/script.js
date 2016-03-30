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
		if ($('input[name=search]:checked').val() === 'glocation') {
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
			success: function(data){
				parseResults(data); $('.loading').hide();
			}
		});
	});
});

searchByUrls = function(urls) {
	event.preventDefault();
	$('#platformResults').find('.box').empty();

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
		success: function(data){
			parsePlatformData(data)
		}
	});
};

parseUnifiedGeneralInfo = function(generalInfo) {
	var content = '<ul>';

	generalInfo.site_title ? content += '<li>Site Title [' + generalInfo.site_title.source + ']: <samp>' + generalInfo.site_title.value + '</samp></li>' : '';
	generalInfo.category ? content += '<li>Category [' + generalInfo.category.source + ']: <samp>' + generalInfo.category.value + '</samp></li>' : '';
	generalInfo.sub_category ? content += '<li>Sub-Category [' + generalInfo.sub_category.source + ']: <samp>' + parseSubCategory(generalInfo.sub_category.value) + '</samp></li>' : '';
	generalInfo.short_description ? content += '<li>Short Description [' + generalInfo.short_description.source + ']: <samp>' + generalInfo.short_description.value + '</samp></li>' : '';
	generalInfo.long_description ? content += '<li>Long Description [' + generalInfo.long_description.source + ']: <samp>' + generalInfo.long_description.value + '</samp></li>' : '';

	generalInfo.general_info ? content += '<li>General [' + generalInfo.general_info.source + ']: <samp>' + generalInfo.general_info.value + '</samp></li>' : '';
	generalInfo.mission ? content += '<li>Mission [' + generalInfo.mission.source + ']: <samp>' + generalInfo.mission.value + '</samp></li>' : '';
	generalInfo.products ? content += '<li>Products [' + generalInfo.products.source + ']: <samp>' + generalInfo.products.value + '</samp></li>' : '';
	generalInfo.company_overview ? content += '<li>Company Overview [' + generalInfo.company_overview.source + ']: <samp>' + generalInfo.company_overview.value + '</samp></li>' : '';
	generalInfo.members ? content += '<li>Members [' + generalInfo.members.source + ']: <samp>' + generalInfo.members.value + '</samp></li>' : '';
	generalInfo.public_transit ? content += '<li>Public Transit [' + generalInfo.public_transit.source + ']: <samp>' + generalInfo.public_transit.value + '</samp></li>' : '';
	generalInfo.start_info ? content += '<li>Start Info [' + generalInfo.start_info.source + ']: <samp>' + generalInfo.start_info.value.type + ' ' + (generalInfo.start_info.value.date ? generalInfo.start_info.value.date.year : 'Unspecified') + '</samp></li>' : '';
	generalInfo.bio ? content += '<li>Bio [' + generalInfo.bio.source + ']: <samp>' + generalInfo.bio.value.type + ' ' + generalInfo.bio.value + '</samp></li>' : '';
	generalInfo.parking ? content += '<li>Parking [' + generalInfo.parking.source + ']: <samp>Lot: ' + generalInfo.parking.value.lot + ' / Street: ' + generalInfo.parking.value.street + ' / Valet: ' + generalInfo.parking.value.valet + '</samp></li>' : '';
	generalInfo.price_range ? content += '<li>Price Range [' + generalInfo.price_range.source + ']: <samp>' + generalInfo.price_range.value + '</samp></li>' : '';

	generalInfo.logo ? content += '<li>Logo [' + generalInfo.logo.source + ']: <img src="' + generalInfo.logo.value + '"/>' + '</li>' : '';
	generalInfo.cover_photo ? content += '<li>Cover Photo [' + generalInfo.cover_photo.source + ']: <img src="' + generalInfo.cover_photo.value + '"/>' + '</li>' : '';
	content += '</ul>';

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
	content += '</ul>';

	return content;
};

parseUnifiedContactDetails = function(contactDetails) {
	var content = '<ul>';

	contactDetails.address ? content += '<li>Address: <samp>' + contactDetails.address.full_addr + '</samp></li>' : '';
	contactDetails.phone ? content += '<li>Phone [' + contactDetails.phone.source + ']: <samp>' + contactDetails.phone.value + '</samp></li>' : '';
	contactDetails.email ? content += '<li>Email ['+ contactDetails.email.source + ']: <samp>' + contactDetails.email.value + '</samp></li>' : '';
	contactDetails.website ? content += '<li>Website [' + contactDetails.website.source + ']: <samp><a href="' + contactDetails.website.value + '" target="_blank">' + contactDetails.website.value + '</a></samp></li>' : '';
	contactDetails.open_hours ? content += '<li>Open hours [' + contactDetails.open_hours.source + ']: <samp>' + parseOpenHours(contactDetails.open_hours.value.days) + '</samp></li>' : '';
	content += '</ul>';

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
	content += '</ul>';

	return content;
};

parseWebsite = function(website) {
	var content = '<ul class="websiteData">';

	_(website.social_links).forEach(function(n) {
		content += '<li><a class="icon ' + n.name + '" target="_blank" href="' + n.url + '"></a></li>';
	});
	_(website.photos).forEach(function(n) {
		content += '<li><img src="' + n.photo_url + '" /></li>';
	});
	content += '</ul>';

	return content;
};

parseUnifiedFeeds = function(feeds){
	var content = '<h4>' + feeds.source + ': </h4>';

	content += '<ul class="feeds">';
	_(feeds.value).forEach(function(n) {
		var time = new Date(n.created_time);
		content += '<li class="item"><span class="icon post"></span> Created: <samp>' + time + '</samp><br /> From: <samp>' + n.from + '</samp><br /> Name: <samp>' + n.name + '</samp><br /> Description: <samp>' + n.description + '</samp><br /> Message: <samp>' + n.message + '</samp><br /><img src="' + n.picture + '"/></li>';
	});
	content += '</ul>';

	return content;
};

parseUnifiedEvents = function(events){
	var content = '<h4>' + events.source + ': </h4>';

	content += '<ul class="events">';
	_(events.value).forEach(function(n) {
		content += '<li class="item">Name: <samp>' + n.name + '</samp><br /> Start Time: <samp>' + n.start_time + '</samp><br /> + Description: <samp>' + n.description + '</samp><br /><img src="' + n.image_url + '"/></li>';
	});
	content += '</ul>';

	return content;
};

parseUnifiedReviews = function(reviews){
	var content = '<h4>' + reviews.source + ': </h4>';

	content += '<ul class="reviews">';
	_(reviews.value).forEach(function(n) {
		var time = new Date(n.time);
		content += '<li class="item">Text: <samp>' + n.text + '</samp><br />Created: <samp>' + time + '</samp><br /> Author: <samp>' + n.author_name + '</samp>' + (n.author_photo ? '<img src="https:' + n.author_photo + '" />' : '') + '</li>';
	});
	content += '</ul>';

	return content;
};

parseReviews = function(reviews){
	var content = '<ul class="reviews">';

	_(reviews).forEach(function(n) {
		var time = new Date(n.time);
		content += '<li class="item">Text: <samp>' + n.text + '</samp><br />Created: <samp>' + time + '</samp><br /> Author: <samp>' + n.author_name + '</samp>' + (n.author_photo ? '<img src="https:' + n.author_photo + '" />' : '') + '</li>';
	});
	content += '</ul>';

	return content;
};

parseUnifiedPhotos = function(photos) {
	var content = '<h4>' + photos.source + ': </h4>';

	_(photos.value).forEach(function(n) {
		content += '<ul class="photos">';
		content += '<li>' + n.name + '</li>';
		_(n.photos).forEach(function(i) {
			content += '<li><img src="' + i.photo_url + '" /></li>';
		});
		content += '</ul>';
	});

	return content;
};

parseFacebookPhotos = function(photos) {
	var content = '';

	_(photos).forEach(function(n) {
		content += '<ul class="photos">';
		content += '<li>' + n.name + '</li>';
		_(n.photos).forEach(function(i) {
			content += '<li><img src="' + i.photo_url + '" /></li>';
		});
		content += '</ul>';
	});

	return content;
};

parsePhotos = function(photoAlbums) {
	if (_(photoAlbums.photos)) {
		var content = '<ul class="photos">';

		_(photoAlbums.photos).forEach(function(n) {
			content += '<li>' + n.description + '</li>';
			content += '<li><img src="' + n.photo_url + '" /></li>';
		});
		content += '</ul>';

		return content;
	}
};

parseUnifiedVideos = function(videos){
	var content = '<h4>' + videos.source + ': </h4>';

	_(videos.value).forEach(function(n) {
		content += '<ul class="videos">';
		content += '<li>' + n.description + '</li>';
		_(n.videos).forEach(function(i) {
			content += '<li class="item"><samp>' + i.description + ' <a target="_blank" href="' + i.url + '">' + i.url + '</a></samp></li>';
		});
		content += '</ul>';
	});

	return content;
};

parsePlatformData = function(answer) {
	var content = '',
		emptyCell = '<td></td></tr>',
		box = $('#platformResults').find('.box');

	_.forEach(answer.platforms, function(i) {
		content += '<table class="details">';

		if (i.platform_name === 'unified_fields') {
			content += '<caption><span class="icon response"></span>' + i.platform_name + '</caption>';
			content += '<tr><th>General Info</th>';
			i.general_info ? content += '<td>' + parseUnifiedGeneralInfo(i.general_info) + '</td></tr>' : content += emptyCell;
			content += '<tr><th>Contact Details</th>';
			i.contact_details ? content += '<td>' + parseUnifiedContactDetails(i.contact_details) + '</td></tr>' : content += emptyCell;
			content += '<tr><th>Official Website Data</th>';
			i.official_website_data ? content += '<td>' + parseWebsite(i.official_website_data) + '</td></tr>' : content += emptyCell;
			content += '<tr><th>Events</th>';
			i.events ? content += '<td>' + parseUnifiedEvents(_.first(i.events)) + '</td></tr>' : content += emptyCell;
			content += '<tr><th>Feeds</th>';
			i.feeds ? content += '<td>' + parseUnifiedFeeds(_.first(i.feeds)) + '</td></tr>' : content += emptyCell;
			content += '<tr><th>Reviews</th>';
			i.reviews ? content += '<td>' + parseUnifiedReviews(i.reviews) + '</td></tr>' : content += emptyCell;
			content += '<tr><th>Photos</th>';
			i.photos_albums ? content += '<td>' + parseUnifiedPhotos(_.first(i.photos_albums)) + '</td></tr>' : content += emptyCell;
			content += '<tr><th>Videos</th>';
			i.videos_albums ? content += '<td>' + parseUnifiedVideos(_.first(i.videos_albums)) + '</td></tr>' : content += emptyCell;
		} else {
			content += '<caption>' + i.platform_name + '</caption>';
			i.url ? content += '<caption class="link"><a href="' + i.url + '" target="_blank">' + i.url + '<a></caption>' : '';
			content += '<tr><th>General Info</th>';
			content += '<td>' + parseGeneralInfo(i.general_info) + '</td></tr>';
			content += '<tr><th>Contact Details</th>';
			content += '<td>' + parseContactDetails(i.contact_details) + '</td></tr>';
			content += '<tr><th>Reviews</th>';
			i.reviews ? content += '<td>' + parseReviews(i.reviews) + '</td></tr>' : content += emptyCell;
			content += '<tr><th>Photos</th>';
			i.photos_albums ? content += '<td>' + (i.platform_name === 'facebook_onboarding' ? parseFacebookPhotos(i.photos_albums) : parsePhotos(_.first(i.photos_albums))) + '</td></tr>' : content += emptyCell;
		}

		content += '</table>';
	});

	$('.loading').hide();
	box.html(content);
	box.show();

	displayResultData(answer);
	imagePreview();
};

imagePreview = function(){
	var xOffset = 10,
			yOffset = 30;

	$('.details img').hover(
		function(e){
			$('body').append('<div id="preview"><img src="'+ this.src + '" /></div>');
			$('#preview')
				.css('top',(e.pageY - xOffset) + 'px')
				.css('left',(e.pageX + yOffset) + 'px')
				.fadeIn('fast');
		},
		function(){
			$('#preview').remove();
		}
	);
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

displayRequestData = function(data) {
	$('#requestDisplay').draggable();
	$('#requestData').jsonViewer(data);
};

displayResultData = function(data) {
	var xOffset = 10,
		yOffset = 30;

	$('.response').on('click', function(e) {
		$('#responseDisplay')
			.css('top',(e.pageY - xOffset) + 'px')
			.css('left',(e.pageX + yOffset) + 'px')
			.toggle();
	});
	$('#responseDisplay').draggable();
	$('#resultData').jsonViewer(data);
};

unifiedPlatforms = function(mergedResults) {
	var platforms = '',
		sorted = _.sortBy(mergedResults, 'platform_name');

	_(sorted).forEach(function(n) {
		platforms += '<li><span class="icon ' + n.platform_name + '"></span></li>';
	});

	return platforms;
};

organizeMergedResults = function(mergedResults) {
	var content = '<table>';

	content += '<tr><th>Platform</th><th>Name</th><th>Category</th><th>Address</th><th>Phone</th><th>Url</th><th>Website</th><th>Image</th></tr>';
	_.forEach(mergedResults, function(i) {

		content += '<tr>';
		content += '<th class="platformCell"><span class="icon ' + i.platform_name + '"></span></th>';
		content += '<td>' + i.text + '</td>';
		content += '<td>' + i.category + '</td>';
		content += i.address ? '<td>' + i.address.full_addr + '</td>': '<td>--/--</td>';
		content += '<td class="phoneCell">' + i.phone + '</td>';
		content += '<td class="urlCol">' + '<a target="_blank" href="' + i.url + '">' + i.url + '</a>' + '</td>';
		content += i.website ? '<td>' + '<a target="_blank" href="' + i.website + '">' + i.website + '</a>' + '</td>' : '<td>--/--</td>';
		content += '<td>' + '<img src="' + i.image + '" />' + '</td>';
		content +=	'</tr>';
	});
	content += '</table>';

	return content;
};

parseResults = function(results) {
	var defaultImage = 'http://static.wixstatic.com/media/e9e449_0669f883fffe4119bd6e7e48519482a0.png',
		output = '',
		unifiedResult = $('#unifiedResult'),
		resultsBox = $('#results');

	if (_.size(results) === 2) {
		$('<h3>There are no results to display...</h3>').appendTo('#content');
		resultsBox.show();
		return;
	}

	if (results.unified_search) {
		$('<li class="icon wix" id="unified"><span class="number">' + _.size(results.unified_search) + '</span> Unified results</li>').appendTo('.navigation');
		output += '<div id="unifiedResult">';

		_.forIn(results.unified_search, function(j) {
			output += '<dl>';
			output += '<dt>';
			output += '<img src="' + (j.image ? j.image : defaultImage) + '" />';
			output += j.text + '; Similarity rank: ' + j.name_similarity_rank + '; Distance: ' + parseInt(j.distance) + 'm' + '<ul class="platforms">' + unifiedPlatforms(j.merged_results) + '</ul>';
			output += '<span class="icon search"></span>';
			output += '<div class="modal">' + organizeMergedResults(_.sortBy(j.merged_results, 'platform_name')) + '</div>';
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
		var platformResult = $('#platformResults');
		platformResult.css('top', e.pageY);
		platformResult.show();
		$('#platformResults').find('.loading').show();
		searchByUrls(($(this).siblings('.platformUrls').html()).split(','));
	});

	$('.close').on('click', function() {
		$('#platformResults').hide();
	});

	$(document).keydown(function(e) {
		if (e.keyCode == 27) {
			$('#platformResults').hide();
			$('.modal').hide();
			$('#responseDisplay').hide();
			$('#requestDisplay').hide();
		}
	});

	$('.navigation li:first-child').addClass('selected');

	$('.navigation li').on('click', function() {
		navigateResults(this);
	});

	unifiedResult.find('.platforms').on('click',function() {
		$(this).siblings('.modal').toggle();
	});

	unifiedResult.show();
	resultsBox.show();
	$('#content').find('div:first-child').show();
};

navigateResults = function(element) {
	$('.navigation li').removeClass('selected');
	$(element).addClass('selected');

	$('#content').find('div').hide();
	$('#' + $(element).attr('id') + 'Result').show();
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

$('.request').on('click',function() {
	$('#requestDisplay').toggle();
});