function loadDevicesProperty(container, jsonRequest, callback) {
    $.ajax({
        url: url_home + "/devices",
        type: 'post',
        dataType: 'json',
        async: true,
        tryCount: 0,
        retryLimit: 3,
        data: jsonRequest,
    }).done(function (data) {
        callback(data["devices"]);
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
var POSITION = ["Living Room", "Dining Room", "Bath Room", "Bed Room"];

function getPosition(position) {
    switch (position) {
        case 'LIVINGROOM':
            return POSITION[0];
        case 'DININGROOM':
            return POSITION[1];
        case 'BATHROOM':
            return POSITION[2];
        case 'BEDROOM':
            return POSITION[3];
    }
}
