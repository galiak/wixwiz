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
            i.contact_details ? content += '<td>' + parseContactDetails(i.contact_details) + '</td></tr>' : content += emptyCell;
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