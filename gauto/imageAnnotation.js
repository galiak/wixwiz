var MAX_RESULTS = 10;

getImageAnnotation = function(elementId, imageUrl) {
    var data = {
        features: [
        {
            type: 'LABEL_DETECTION',
            maxResults: MAX_RESULTS
        },
        {
            type: 'TEXT_DETECTION',
            maxResults: MAX_RESULTS
        },
        {
            type: 'FACE_DETECTION',
            maxResults: 1
        },
        {
            type: 'LOGO_DETECTION',
            maxResults: MAX_RESULTS
        },
        {
            type: 'IMAGE_PROPERTIES',
            maxResults: 10
        }
    ]};

    $.ajax({
        type: 'POST',
        url: 'http://wizard.wix.com/api/getImageAnnotation?url=' + encodeURIComponent(imageUrl),
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
                if (i === 'imagePropertiesAnnotation') {
                    content += parseImageProperties(annotation.dominantColors.colors);
                } else if (i === 'faceAnnotations') {
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

        $('#' + elementId).html(content);


    }
};

parseImageProperties = function(colorProperties) {
    var content = '<ul class="colors">';

    _.forEach(colorProperties, function(property) {
        content += '<li><samp> Red: ' + property.color.red + ', Green: ' + property.color.green + ', Blue: ' + property.color.blue;
        content += '<span class="colorSwatch" style="background-color: rgb(' + property.color.red + ', ' + property.color.green + ', ' + property.color.blue + ');"></span>' + '</samp></li>';
        content += '<li>Pixel fraction: ' + property.pixelFraction + ' (' + Math.round(property.score * 100) + '%)</li>';
    });
    content += '</ul>';

    return content;
};
