parseResults = function(results) {
    var defaultImage = 'http://static.wixstatic.com/media/e9e449_0669f883fffe4119bd6e7e48519482a0.png',
        output = '',
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
        platformResult.find('.loading').show();
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

    var unifiedResult = $('#unifiedResult');
    unifiedResult.find('.platforms').on('click',function() {
        $(this).siblings('.modal').toggle();
    });

    unifiedResult.show();
    resultsBox.show();
    $('#content').find('div:first-child').show();
};

displayRequestData = function(data) {
    $('#requestDisplay').draggable();
    $('#requestData').jsonViewer(data);
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

navigateResults = function(element) {
    $('.navigation li').removeClass('selected');
    $(element).addClass('selected');

    $('#content').find('div').hide();
    $('#' + $(element).attr('id') + 'Result').show();
};
