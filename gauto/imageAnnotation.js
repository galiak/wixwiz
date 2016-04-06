var MAX_RESULTS = 10;

getImageAnnotation = function(imageUrl) {
    var data = {
        'features': [
        {
            'type': 'LABEL_DETECTION',
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
            return parseLabelAnnotations(response)
        }
    });
};

parseLabelAnnotations = function(annotations) {
    var content = '';

    _.forEach(annotations.responses, function(annotation) {
        content += _.keys(annotation)[0] + ': ';

        _.forEach(annotation, function(i) {
            _.forEach(i, function(n) {
                content += n.description + ' (' + Math.round(n.score * 100) + '%); ';
            });
        });
    });
    $('.annotation').html(content);
};