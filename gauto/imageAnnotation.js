var MAX_RESULTS = 10;

getImageAnnotation = function(elementId, imageUrl) {
    var data = {
        'features': [
        {
            'type': 'LABEL_DETECTION',
            'maxResults': 10
        },
        {
            'type': 'TEXT_DETECTION',
            'maxResults': 10
        },
        {
            'type': 'FACE_DETECTION',
            'maxResults': 1
        },
        {
            'type': 'LOGO_DETECTION',
            'maxResults': 10
        }
    ]};

    $.ajax({
        type: 'POST',
        url: 'http://wizard.jelly.wixpress.com/api/getImageAnnotation?url=' + encodeURIComponent(imageUrl),
        data: JSON.stringify(data),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: parseAnnotations(elementId)
    });
};

parseAnnotations = function(elementId) {
    return function(annotations) {
        var content = '';

        _.forEach(annotations.responses, function(response) {
            _.forEach(response, function(annotation, i) {
                content += '<li><samp>* ' + i + ': ';
                if (i === 'faceAnnotations') {
                    var label = _.first(annotation);
                    content += 'Detection Confidence: ' + Math.round(label.detectionConfidence * 100) + '% ; Blurred Likelihood: ' + label.blurredLikelihood + '; UnderExposed Likelihood: ' + label.underExposedLikelihood;
                } else {
                    _.forEach(annotation, function(n) {
                        content += n.description + (n.score ? ' (' + Math.round(n.score * 100) + '%); ' : '; ');
                    });
                }
                content += ' *</samp></li>';
            });
        });
        content += '';

        $('#' + elementId).html(content);
    }
};

