var EMPTY_STRING = '';

parseResults = function(results) {
    var output = '',
        resultsBox = $('#results');

    if (_.size(results) === 2) {
        $('<h3>There are no results to display...</h3>').appendTo('#content');
        resultsBox.show();
        return;
    }

    if (results.unified_search) {
        createNavigationTab('wix', _.size(results.unified_search), 'Unified results');
        output += parseUnifiedResults(results.unified_search);
    }

    if (results.yelp_search) {
        createNavigationTab('yelp', _.size(results.yelp_search), 'Yelp');
        output += parseYelpResults(results.yelp_search);
    }

    if (results.factual_search) {
        createNavigationTab('factual', _.size(results.factual_search), 'Factual');
        output += parseFactualResults(results.factual_search);
    }

    if (results.facebook_search) {
        createNavigationTab('facebook', _.size(results.facebook_search), 'Facebook');
        output += parseFacebookResults(results.facebook_search);
    }

    if (results.google_places_search) {
        createNavigationTab('google_places',_.size(results.google_places_search), 'Google Places');
        output += parseGooglePlacesResults(results.google_places_search);
    }

    if (results.google_plus_search) {
        createNavigationTab('google_plus', _.size(results.google_plus_search), 'Google Plus');
        output += parseGooglePlusResults(results.google_plus_search);
    }

    if (results.twitter_search) {
        createNavigationTab('twitter', _.size(results.twitter_search), 'Twitter');
        output += parseTwitterResults(results.twitter_search);
    }

    if (results.youtube_search) {
        createNavigationTab('youtube', _.size(results.youtube_search), 'YouTube');
        output += parseYoutubeResults(results.youtube_search);
    }

    if (results.flickr_search) {
        createNavigationTab('flickr', _.size(results.flickr_search), 'Flickr');
        output += parseFlickrResults(results.flickr_search);
    }

    $(output).appendTo('#content');

    $('.search').on('click', function(e) {
        var platformResult = $('#platformResults');
        platformResult.css('top', e.pageY);
        platformResult.show();
        platformResult.find('.loading').show();
        searchByUrls(($(this).siblings('.platformUrls').html()).split(','));
    });

    $('.close').on('click', function() {
        $('#platformResults').hide();
    });

    $(document).keydown(function(e) {
        if (e.keyCode == 27) {
            hideModals();
        }
    });

    $('.navigation li:first-child').addClass('selected');

    $('.navigation li').on('click', function() {
        navigateResults(this);
    });

    var unifiedResult = $('#unifiedResult');
    unifiedResult.find('.platforms').on('click',function() {
        $(this).siblings('.modal').toggle();
    });

    unifiedResult.show();
    resultsBox.show();
    $('#content').find('div:first-child').show();
};

createNavigationTab = function(icon, resultsSize, name) {
    $('<li class="icon ' + icon + '" id="' + (icon === 'wix' ? 'unified' : icon) + '"><span class="number">' + resultsSize + '</span> ' + name + '</li>').appendTo('.navigation');
};

parseUnifiedResults = function(results) {
    var defaultImage = 'images/wix.png',
        content = '<div id="unifiedResult">';

    _.forIn(results, function(j) {
        content += '<dl>';
        content += '<dt>';
        content += '<img src="' + (j.image ? j.image : defaultImage) + '" />';
        content += j.text + '; Similarity rank: ' + j.name_similarity_rank + '; Distance: ' + parseInt(j.distance) + 'm' + '<ul class="platforms">' + dispalyPlatformIcons(j.merged_results) + '</ul>';
        content += '<span class="icon search"></span>';
        content += '<div class="modal">' + organizeMergedResults(_.sortBy(j.merged_results, 'platform_name')) + '</div>';
        content += '<div class="platformUrls">' + j.urls + '</div>';
        content += '</dt>';

        j.category ? (content += '<dd>' + j.category + '</dd>') : content += EMPTY_STRING;
        j.website ? (content += '<dd class="icon website">' + '<a target="_blank" href="' + j.website + '">' + j.website + '</a></dd>') : content += EMPTY_STRING;
        j.phone ? (content += '<dd class="icon phone">' + j.phone + '</dd>') : content += EMPTY_STRING;
        j.address ? (content += '<dd class="icon location">' + j.address.full_addr + '</dd>') : content += EMPTY_STRING;
        content += '</dl>';
    });
    content += '</div>';

    return content;
};

parseYelpResults = function(results) {
    var content = '<div id="yelpResult">';

    _.forIn(results, function(j) {
        content += '<dl>';
        content += '<dt><img src="' + j.image + '" />' + j.text + '</dt>';
        content += '<dd>' + j.category + '</dd>';
        content += '<dd class="icon web">' + '<a target="_blank" href="' + j.url + '">' + j.url + '</a></dd>';
        content += '<dd class="icon phone">' + j.phone + '</dd>';
        content += '<dd class="icon location">' + j.address.full_addr + '</dd>';
        content += '</dl>';
    });
    content += '</div>';

    return content;
};

parseFactualResults = function(results) {
    var content = '<div id="factualResult">';

    _.forIn(results, function(j) {
        content += '<dl>';
        content += '<dt>' + j.text + '</dt>';
        content += '<dd>' + j.category + '</dd>';
        content += '<dd class="icon web">' + '<a target="_blank" href="' + j.url + '">' + j.url + '</a></dd>';
        j.website ? (content += '<dd class="icon website">' + '<a target="_blank" href="' + j.website + '">' + j.website + '</a></dd>') : content += EMPTY_STRING;
        content += '<dd class="icon email">' + '<a target="_blank" href="' + j.email + '">' + j.email + '</a></dd>';
        content += '<dd class="icon phone">' + j.phone + '</dd>';
        content += '<dd class="icon location">' + j.address.full_addr + '</dd>';
        content += '</dl>';
    });
    content += '</div>';

    return content;
};

parseFacebookResults = function() {
    var content = '<div id="facebookResult">';

    _.forIn(results.facebook_search, function(j) {
        content += '<dl>';
        content += '<dt><img src="' + j.image + '" />' + j.text + '</dt>';
        content += '<dd>' + j.category + '</dd>';
        j.website ? (content += '<dd class="icon website">' + '<a target="_blank" href="' + j.website + '">' + j.website + '</a></dd>') : content += EMPTY_STRING;
        content += '<dd class="icon facebook">' + '<a target="_blank" href="' + j.url + '">' + j.url + '</a></dd>';
        j.phone ? (content += '<dd class="icon phone">' + j.phone + '</dd>') : content += EMPTY_STRING;
        j.address ? (content += '<dd class="icon location">' + j.address.full_addr + '</dd>') : content += EMPTY_STRING;
        content += '</dl>';
    });
    content += '</div>';

    return content;
};

parseGooglePlacesResults = function(results) {
    var content = '<div id="google_placesResult">';

    _.forIn(results, function(j) {
        content += '<dl>';
        content += '<dt><img src="' + j.image + '" />' + j.text + '</dt>';
        content += '<dd>' + j.category + '</dd>';
        j.website ? (content += '<dd class="icon website">' + '<a target="_blank" href="' + j.website + '">' + j.website + '</a></dd>') : content += EMPTY_STRING;
        content += '<dd class="icon google_places">' + '<a target="_blank" href="' + j.url + '">' + j.url + '</a></dd>';
        content += '<dd class="icon phone">' + j.phone + '</dd>';
        content += '<dd class="icon location">' + j.address.full_addr + '</dd>';
        content += '</dl>';
    });
    content += '</div>';

    return content;
};

parseGooglePlusResults = function (results) {
    var content = '<div id="google_plusResult">';

    _.forIn(results, function(j) {
        content += '<dl>';
        content += '<dt><img src="' + j.image + '" />' + j.text + '</dt>';
        content += '<dd class="icon google_plus">' + '<a target="_blank" href="' + j.url + '">' + j.url + '</a></dd>';
        content += '</dl>';
    });
    content += '</div>';

    return content;
};

parseTwitterResults = function(results) {
    var content = '<div id="twitterResult">';

    _.forIn(results, function(j) {
        content += '<dl>';
        content += '<dt><img src="' + j.image + '" />' + j.text + '</dt>';
        j.category ? (content += '<dd>' + j.category + '</dd>') : content += EMPTY_STRING;
        content += '<dd class="icon twitter">' + '<a target="_blank" href="' + j.url + '">' + j.url + '</a></dd>';
        j.address ? (content += '<dd class="icon location">' + j.address.full_addr + '</dd>') : content += EMPTY_STRING;
        content += '</dl>';
    });
    content += '</div>';
    return content;
};

parseYoutubeResults = function(results) {
    var content = '<div id="youtubeResult">';

    _.forIn(results, function(j) {
        content += '<dl>';
        content += '<dt><img src="' + j.image + '" />' + j.text + '</dt>';
        content += '<dd class="icon youtube">' + '<a target="_blank" href="' + j.url + '">' + j.url + '</a></dd>';
        content += '</dl>';
    });
    content += '</div>';

    return content;
};

parseFlickrResults = function (results) {
    var defaultImage = 'images/flickr.png',
        content = '<div id="flickrResult">';

    _.forIn(results, function(j) {
        content += '<dl>';
        content += '<dt><img src="' + defaultImage + '" />' + j.text + '</dt>';
        content += '<dd class="icon web">' + '<a target="_blank" href="' + j.url + '">' + j.url + '</a></dd>';
        content += '</dl>';
    });
    content += '</div>';

    return content;
};

hideModals = function() {
    $('#platformResults').hide();
    $('.modal').hide();
    $('#responseDisplay').hide();
    $('#requestDisplay').hide();
};

displayRequestData = function(data) {
    $('#requestDisplay').draggable();
    $('#requestData').jsonViewer(data);
};

dispalyPlatformIcons = function(mergedResults) {
    var platforms = '',
        sorted = _.sortBy(mergedResults, 'platform_name');

    _(sorted).forEach(function(n) {
        platforms += '<li><span class="icon ' + n.platform_name + '"></span></li>';
    });

    return platforms;
};

organizeMergedResults = function(mergedResults) {
    var emptyCell = '<td>--/--</td>',
        content = '<table>';

    content += '<tr><th>Platform</th><th>Name</th><th>Category</th><th>Address</th><th>Phone</th><th>Url</th><th>Website</th><th>Image</th></tr>';
    _.forEach(mergedResults, function(i) {

        content += '<tr>';
        content += '<th class="platformCell"><span class="icon ' + i.platform_name + '"></span></th>';
        content += '<td>' + i.text + '</td>';
        content += '<td>' + i.category + '</td>';
        content += i.address ? ('<td>' + i.address.full_addr + '</td>') : emptyCell;
        content += '<td class="phoneCell">' + i.phone + '</td>';
        content += '<td class="urlCol">' + '<a target="_blank" href="' + i.url + '">' + i.url + '</a>' + '</td>';
        content += i.website ? ('<td>' + '<a target="_blank" href="' + i.website + '">' + i.website + '</a>' + '</td>') : emptyCell;
        content += '<td>' + '<img src="' + i.image + '" />' + '</td>';
        content +=	'</tr>';
    });
    content += '</table>';

    return content;
};

navigateResults = function(element) {
    $('.navigation li').removeClass('selected');
    $(element).addClass('selected');

    $('#content').find('div').hide();
    $('#' + $(element).attr('id') + 'Result').show();
};
