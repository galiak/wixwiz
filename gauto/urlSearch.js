var X_OFFSET = 10,
    Y_OFFSET = 30,
    EMPTY_CELL = '<td></td></tr>',
    EMPTY_STRING = '';

parsePlatformData = function(response) {
    var content = '',
        box = $('#platformResults').find('.box');

    _.forEach(response.platforms, function(platform) {
        content += '<table class="details">';

        if (platform.platform_name === 'unified_fields') {
            content += displayUnifiedFields(platform);
        } else {
            content += displayPlatformFields(platform);
        }

        content += '</table>';
    });

    $('.loading').hide();
    box.html(content);
    box.show();

    displayResultData(response);
    imagePreview();
};

displayPlatformFields = function(platformFields) {
    var content = '';

    content += '<caption>' + platformFields.platform_name + '</caption>';
    platformFields.url ? (content += '<caption class="link"><a href="' + platformFields.url + '" target="_blank">' + platformFields.url + '<a></caption>') : EMPTY_STRING;

    content += '<tr><th>General Info</th>';
    content += '<td>' + parseGeneralInfo(platformFields.general_info) + '</td></tr>';

    content += '<tr><th>Contact Details</th>';
    platformFields.contact_details ? content += '<td>' + parseContactDetails(platformFields.contact_details) + '</td></tr>' : content += EMPTY_CELL;

    content += '<tr><th>Reviews</th>';
    platformFields.reviews ? content += '<td>' + parseReviews(platformFields.reviews) + '</td></tr>' : content += EMPTY_CELL;

    content += '<tr><th>Photos</th>';
    platformFields.photos_albums ? (content += '<td>' + (platformFields.platform_name === 'facebook_onboarding' ? (parseFacebookPhotos(platformFields.photos_albums)) : (parsePhotos(_.first(platformFields.photos_albums)))) + '</td></tr>') : (content += EMPTY_CELL);

    return content;
};

displayUnifiedFields = function(unifiedData) {
    var content = '';

    content += '<caption><span class="icon response"></span>' + unifiedData.platform_name + '</caption>';

    content += '<tr><th>General Info</th>';
    unifiedData.general_info ? (content += '<td>' + parseUnifiedGeneralInfo(unifiedData.general_info) + '</td></tr>') : content += EMPTY_CELL;

    content += '<tr><th>Contact Details</th>';
    unifiedData.contact_details ? (content += '<td>' + parseUnifiedContactDetails(unifiedData.contact_details) + '</td></tr>') : content += EMPTY_CELL;

    content += '<tr><th>Official Website Data</th>';
    unifiedData.official_website_data ? (content += '<td>' + parseWebsite(unifiedData.official_website_data) + '</td></tr>') : content += EMPTY_CELL;

    content += '<tr><th>Events</th>';
    unifiedData.events ? (content += '<td>' + parseUnifiedEvents(_.first(unifiedData.events)) + '</td></tr>') : content += EMPTY_CELL;

    content += '<tr><th>Feeds</th>';
    unifiedData.feeds ? (content += '<td>' + parseUnifiedFeeds(_.first(unifiedData.feeds)) + '</td></tr>') : content += EMPTY_CELL;

    content += '<tr><th>Reviews</th>';
    unifiedData.reviews ? (content += '<td>' + parseUnifiedReviews(unifiedData.reviews) + '</td></tr>') : content += EMPTY_CELL;

    content += '<tr><th>Photos</th>';
    unifiedData.photos_albums ? (content += '<td>' + parseUnifiedPhotos(_.first(unifiedData.photos_albums)) + '</td></tr>') : content += EMPTY_CELL;

    content += '<tr><th>Videos</th>';
    unifiedData.videos_albums ? (content += '<td>' + parseUnifiedVideos(_.first(unifiedData.videos_albums)) + '</td></tr>') : content += EMPTY_CELL;

    return content;
};

imagePreview = function(){
    $('.details img').hover(
        function(e){
            $('body').append('<div id="preview"><img src="'+ this.src + '" /></div>');
            $('#preview')
                .css('top',(e.pageY - X_OFFSET) + 'px')
                .css('left',(e.pageX + Y_OFFSET) + 'px')
                .fadeIn('fast');
        },
        function(){
            $('#preview').remove();
        }
    );
};

displayResultData = function(data) {
    $('.response').on('click', function(e) {
        $('#responseDisplay')
            .css('top',(e.pageY - X_OFFSET) + 'px')
            .css('left',(e.pageX + Y_OFFSET) + 'px')
            .toggle();
    });
    $('#responseDisplay').draggable();
    $('#resultData').jsonViewer(data);
};

parseContactDetails = function(contactDetails) {
    var content = '<ul>';

    contactDetails.address ? (content += '<li>Address: <samp>' + contactDetails.address.full_addr + '</samp></li>') : EMPTY_STRING;
    contactDetails.phone ? (content += '<li>Phone: <samp>' + contactDetails.phone + '</samp></li>') : EMPTY_STRING;
    contactDetails.email ? (content += '<li>Email: <samp>' + contactDetails.email + '</samp></li>') : EMPTY_STRING;
    contactDetails.website ? (content += '<li>Website: <samp><a href="' + contactDetails.website +'" target="_blank">' + contactDetails.website + '</a></samp></li>') : EMPTY_STRING;
    contactDetails.open_hours ? (content += '<li>Open hours: <samp>' + parseOpenHours(contactDetails.open_hours.days) + '</samp></li>') : EMPTY_STRING;
    content += '</ul>';

    return content;
};

parseWebsite = function(website) {
    var content = '<ul class="websiteData">';

    _(website.social_links).forEach(function(link) {
        content += '<li><a class="icon ' + link.name + '" target="_blank" href="' + link.url + '"></a></li>';
    });
    _(website.photos).forEach(function(photo) {
        content += '<li><img src="' + photo.photo_url + '" /></li>';
    });
    content += '</ul>';

    return content;
};

parseUnifiedFeeds = function(feeds){
    var content = '<h4>' + feeds.source + ': </h4>';

    content += '<ul class="feeds">';
    _(feeds.value).forEach(function(feed) {
        var time = new Date(feed.created_time);

        content += '<li class="item">';
        content += '<span class="icon post"></span>';
        content += ' Created: <samp>' + time + '</samp><br />';
        content += ' From: <samp>' + feed.from + '</samp><br />';
        content += ' Name: <samp>' + feed.name + '</samp><br />';
        content += ' Description: <samp>' + feed.description + '</samp><br />';
        content += ' Message: <samp>' + feed.message + '</samp><br />';
        content += ' <img src="' + feed.picture + '"/>';
        content += '</li>';
    });
    content += '</ul>';

    return content;
};

parseUnifiedEvents = function(events){
    var content = '<h4>' + events.source + ': </h4>';

    content += '<ul class="events">';
    _(events.value).forEach(function(event) {
        content += '<li class="item">';
        content += ' Name: <samp>' + event.name + '</samp><br />';
        content += ' Start Time: <samp>' + event.start_time + '</samp><br />';
        content += ' Description: <samp>' + event.description + '</samp><br />';
        content += event.image_url ? '<img src="' + event.image_url + '"/>' : EMPTY_STRING;
        content += '</li>';
    });
    content += '</ul>';

    return content;
};

parseUnifiedReviews = function(reviews){
    var content = '<h4>' + reviews.source + ': </h4>';

    content += '<ul class="reviews">';
    _(reviews.value).forEach(function(review) {
        var time = new Date(review.time);

        content += '<li class="item">';
        content += ' Text: <samp>' + review.text + '</samp><br />';
        content += ' Created: <samp>' + time + '</samp><br />';
        content += ' Author: <samp>' + review.author_name + '</samp>';
        content += review.author_photo ? ('<img src="https:' + review.author_photo + '" />') : EMPTY_STRING;
        content += '</li>';
    });
    content += '</ul>';

    return content;
};

parseReviews = function(reviews){
    var content = '<ul class="reviews">';

    _(reviews).forEach(function(review) {
        var time = new Date(review.time);

        content += '<li class="item">';
        content += ' Text: <samp>' + review.text + '</samp><br />';
        content += ' Created: <samp>' + time + '</samp><br />';
        content += ' Author: <samp>' + review.author_name + '</samp>';
        content += review.author_photo ? ('<img src="https:' + review.author_photo + '" />') : EMPTY_STRING;
        content += '</li>';
    });
    content += '</ul>';

    return content;
};

parseUnifiedPhotos = function(photos) {
    var content = '<h4>' + photos.source + ': </h4>';

    _(photos.value).forEach(function(photo) {
        content += '<ul class="photos">';
        content += '<li>' + photo.name + '</li>';
        _(photo.photos).forEach(function(i) {
            content += '<li><img src="' + i.photo_url + '" /></li>';
        });
        content += '</ul>';
    });

    return content;
};

parseFacebookPhotos = function(photos) {
    var content = '';

    _(photos).forEach(function(photo) {
        content += '<ul class="photos">';
        content += '<li>' + photo.name + '</li>';
        _(photo.photos).forEach(function(i) {
            content += '<li><img src="' + i.photo_url + '" /></li>';
        });
        content += '</ul>';
    });

    return content;
};

parsePhotos = function(photoAlbums) {
    if (_(photoAlbums.photos)) {
        var content = '<ul class="photos">';

        _(photoAlbums.photos).forEach(function(photo) {
            content += '<li>' + photo.description + '</li>';
            content += '<li><img src="' + photo.photo_url + '" /></li>';
        });
        content += '</ul>';

        return content;
    }
};

parseUnifiedVideos = function(videos){
    var content = '<h4>' + videos.source + ': </h4>';

    _(videos.value).forEach(function(video) {
        content += '<ul class="videos">';
        content += '<li>' + video.description + '</li>';
        _(video.videos).forEach(function(i) {
            content += '<li class="item">';
            content += '<samp>' + i.description + ' <a target="_blank" href="' + i.url + '">' + i.url + '</a></samp>';
            content += '</li>';
        });
        content += '</ul>';
    });

    return content;
};

parseUnifiedGeneralInfo = function(generalInfo) {
    var content = '<ul>';

    generalInfo.site_title ? (content += '<li>Site Title [' + generalInfo.site_title.source + ']: <samp>' + generalInfo.site_title.value + '</samp></li>') : EMPTY_STRING;
    generalInfo.category ? (content += '<li>Category [' + generalInfo.category.source + ']: <samp>' + generalInfo.category.value + '</samp></li>') : EMPTY_STRING;
    generalInfo.sub_category ? (content += '<li>Sub-Category [' + generalInfo.sub_category.source + ']: <samp>' + parseSubCategory(generalInfo.sub_category.value) + '</samp></li>') : EMPTY_STRING;
    generalInfo.short_description ? (content += '<li>Short Description [' + generalInfo.short_description.source + ']: <samp>' + generalInfo.short_description.value + '</samp></li>') : EMPTY_STRING;
    generalInfo.long_description ? (content += '<li>Long Description [' + generalInfo.long_description.source + ']: <samp>' + generalInfo.long_description.value + '</samp></li>') : EMPTY_STRING;

    generalInfo.general_info ? (content += '<li>General [' + generalInfo.general_info.source + ']: <samp>' + generalInfo.general_info.value + '</samp></li>') : EMPTY_STRING;
    generalInfo.mission ? (content += '<li>Mission [' + generalInfo.mission.source + ']: <samp>' + generalInfo.mission.value + '</samp></li>') : EMPTY_STRING;
    generalInfo.products ? (content += '<li>Products [' + generalInfo.products.source + ']: <samp>' + generalInfo.products.value + '</samp></li>') : EMPTY_STRING;
    generalInfo.company_overview ? (content += '<li>Company Overview [' + generalInfo.company_overview.source + ']: <samp>' + generalInfo.company_overview.value + '</samp></li>') : EMPTY_STRING;
    generalInfo.members ? (content += '<li>Members [' + generalInfo.members.source + ']: <samp>' + generalInfo.members.value + '</samp></li>') : EMPTY_STRING;
    generalInfo.public_transit ? (content += '<li>Public Transit [' + generalInfo.public_transit.source + ']: <samp>' + generalInfo.public_transit.value + '</samp></li>') : EMPTY_STRING;
    generalInfo.start_info ? (content += '<li>Start Info [' + generalInfo.start_info.source + ']: <samp>' + generalInfo.start_info.value.type + ' ' + (generalInfo.start_info.value.date ? generalInfo.start_info.value.date.year : 'Unspecified') + '</samp></li>') : EMPTY_STRING;
    generalInfo.bio ? (content += '<li>Bio [' + generalInfo.bio.source + ']: <samp>' + generalInfo.bio.value.type + ' ' + generalInfo.bio.value + '</samp></li>') : EMPTY_STRING;
    generalInfo.parking ? (content += '<li>Parking [' + generalInfo.parking.source + ']: <samp>Lot: ' + generalInfo.parking.value.lot + ' / Street: ' + generalInfo.parking.value.street + ' / Valet: ' + generalInfo.parking.value.valet + '</samp></li>') : EMPTY_STRING;
    generalInfo.price_range ? (content += '<li>Price Range [' + generalInfo.price_range.source + ']: <samp>' + generalInfo.price_range.value + '</samp></li>') : EMPTY_STRING;

    if (generalInfo.logos) {
        content += parseImages(generalInfo.logos, 'logo');
    }
    if (generalInfo.cover_photos) {
        content += parseImages(generalInfo.cover_photos, 'cover');
    }

    content += '</ul>';

    return content;
};

parseImages = function(photos, type) {
    var content = '';

    _.forEach(photos, function(photo, i) {
        content += '<li>';
        content += type;
        content += ' [' + photo.source + ']: <img src="' + photo.value + '"/>';
        content += ' <ul id="' + type + i + '" class="annotations"></ul>';
        content += '</li>';
        getImageAnnotation(type + i, photo.value);
    });

    return content;
};

parseGeneralInfo = function(generalInfo) {
    var content = '<ul>';

    generalInfo.site_title ? (content += '<li>Site Title: <samp>' + generalInfo.site_title + '</samp></li>') : EMPTY_STRING;
    generalInfo.category ? (content += '<li>Category: <samp>' + generalInfo.category + '</samp></li>') : EMPTY_STRING;
    generalInfo.sub_category ? (content += '<li>Sub-Category: <samp>' + parseSubCategory(generalInfo.sub_category) + '</samp></li>') : EMPTY_STRING;
    generalInfo.short_description ? (content += '<li>Short Description: <samp>' + generalInfo.short_description + '</samp></li>') : EMPTY_STRING;
    generalInfo.long_description ? (content += '<li>Long Description: <samp>' + generalInfo.long_description + '</samp></li>') : EMPTY_STRING;
    generalInfo.logo ? (content += '<li>Logo: <img src="' + generalInfo.logo + '"/>' + '</li>') : EMPTY_STRING;
    generalInfo.cover_photo ? (content += '<li>Cover Photo: <img src="' + generalInfo.cover_photo + '"/>' + '</li>') : EMPTY_STRING;
    content += '</ul>';

    return content;
};

parseUnifiedContactDetails = function(contactDetails) {
    var content = '<ul>';

    contactDetails.address ? (content += '<li>Address: <samp>' + contactDetails.address.full_addr + '</samp></li>') : EMPTY_STRING;
    contactDetails.phone ? (content += '<li>Phone [' + contactDetails.phone.source + ']: <samp>' + contactDetails.phone.value + '</samp></li>') : EMPTY_STRING;
    contactDetails.email ? (content += '<li>Email ['+ contactDetails.email.source + ']: <samp>' + contactDetails.email.value + '</samp></li>') : EMPTY_STRING;
    contactDetails.website ? (content += '<li>Website [' + contactDetails.website.source + ']: <samp><a href="' + contactDetails.website.value + '" target="_blank">' + contactDetails.website.value + '</a></samp></li>') : EMPTY_STRING;
    contactDetails.open_hours ? (content += '<li>Open hours [' + contactDetails.open_hours.source + ']: <samp>' + parseOpenHours(contactDetails.open_hours.value.days) + '</samp></li>') : EMPTY_STRING;
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