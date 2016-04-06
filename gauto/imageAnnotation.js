var MAX_RESULTS = 10;

getImageAnnotation = function(imageUrl) {
    var data = {
        'features': [
        {
            'type': 'LABEL_DETECTION',
            'maxResults': 10
        },
        {
            'type': 'TEXT_DETECTION',
            'maxResults': 10
        }
    ]};

    $.ajax({
        type: 'POST',
        url: 'http://wizard.jelly.wixpress.com/api/getImageAnnotation?url=' + encodeURIComponent(imageUrl),
        data: JSON.stringify(data),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function(response){
            parseAnnotations(response)
        }
    });
};

parseAnnotations = function(annotations) {
    var content = '<ul class="annotations">';

    _.forEach(annotations.responses, function(response) {
        _.forEach(response, function(annotation, i) {
            content += '<li>* ' + i + ': ';
            _.forEach(annotation, function(n) {
                content += n.description + (n.score ? ' (' + Math.round(n.score * 100) + '%); ' : '; ');
            });
            content += ' *</li>';
        });
    });
    content += '</ul>';

    $('.annotation').html(content);
};

