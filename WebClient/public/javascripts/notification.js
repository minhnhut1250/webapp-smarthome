var pos = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getDateTimes(dateTime) {
    switch (dateTime) {
        case 2:
            return pos[0];
        case 3:
            return pos[1];
        case 4:
            return pos[2];
        case 5:
            return pos[3];
        case 6:
            return pos[4];
        case 7:
            return pos[5];
        case 8:
            return pos[6];

    }
}

function makeType(device, eventname) {
    var deviceType = device.deviceType;
    var modules = device.modules;
    var type = "STRANGER";
    switch (deviceType) {
        case "LIGHT":
            var module = modules.filter(m => m.type == "LIGHT");
            if (module.length == 0) return;
            type = "LIGHT_" + (module[0].state ? "ON" : "OFF");
            break;
        case "CAMERA":
            var module = modules.filter(m => m.type == "CAMERA");
            if (module.length == 0) return;
            type = "CAMERA_" + (modules[0].state ? "WARNING" : "CAPTURE");
            break;
        case "DOOR":
            modules.forEach((module) => {
                if (eventname == "d2s-sensor") {
                    if (module.type == "SENSOR") {
                        type = "DOOR_" + (module.state ? "OPEN" : "CLOSE");
                        return type;
                    }
                } else if (eventname == "d2s-radar") {
                    if (module.type == "RADAR") {
                        type = "STRANGER";
                        return type;
                    }
                }
            });
            break;
    }
    return type;
}

function makeTitle(device, eventname) {
    var level = makeLevel(device, eventname);
    return level == "NORMAL" ? "Alert" : "Warning";
}

function makeFullName(device) {
    switch (device.deviceType) {
        case "DOOR":
            switch (device.position) {
                case "BEDROOM":
                    return "Bedroom " + device.deviceName;
                case "LIVINGROOM":
                    return "Living Room " + device.deviceName;
                case "GATEWAY":
                case "BACKHOUSE":
                    return "";
                case "BATHROOM":
                    return "Bathroom " + device.deviceName;
                case "DININGROOM":
                    return "Dining Room " + device.deviceName;
                case "FRONTDOORS":
                    return "";
                case "KITCHENROOM":
                    return "Kitchen Room " + device.deviceName;
            }
        case "LIGHT":
            if (device.description == "LAMP") {
                switch (device.position) {
                    case "BEDROOM":
                        return "Bedroom Lamp";
                    case "LIVINGROOM":
                        return "Living Room Lamp";
                    case "GATEWAY":
                    case "BATHROOM":
                    case "BACKHOUSE":
                    case "DININGROOM":
                    case "FRONTDOORS":
                    case "KITCHENROOM":
                        return "";
                }
            } else {
                switch (device.position) {
                    case "BEDROOM":
                        return "Bedroom " + device.deviceName;
                    case "LIVINGROOM":
                        return "Living Room " + device.deviceName;
                    case "GATEWAY":
                        return "Gateway " + device.deviceName;
                    case "BATHROOM":
                        return "Bathroom " + device.deviceName;
                    case "BACKHOUSE":
                        return "Back Door " + device.deviceName;
                    case "DININGROOM":
                        return "Dining Room " + device.deviceName;
                    case "FRONTDOORS":
                        return "";
                    case "KITCHENROOM":
                        return "Kitchen Room " + device.deviceName;
                }
            }
        case "CAMERA":
            switch (device.position) {
                case "GATEWAY":
                    return "Camera at the gate";
                case "BEDROOM":
                case "LIVINGROOM":
                case "BATHROOM":
                case "BACKHOUSE":
                case "DININGROOM":
                case "FRONTDOORS":
                case "KITCHENROOM":
                    return "";
            }
    }
    return "";
}

function makeLevel(device, eventname) {
    switch (eventname) {
        case "d2s-change":
        case "delete-noti":
            return "NORMAL";
        case "d2s-sensor":
            if (device.deviceType == "DOOR") {
                var module = device.modules.filter(m => m.type == "SENSOR")[0];
                if (module != null && module.state) return "WARNING";
            }
        case "d2s-radar":
            if (device.deviceType == "DOOR") {
                var module = device.modules.filter(m => m.type == "RADAR")[0];
                if (module != null && module.state) return "WARNING";
            }
        default:
            return "NORMAL";
    }
}

function makeMessage(device, eventname) {
    var level = makeLevel(device, eventname);
    if (level == "NORMAL") {
        var title = makeFullName(device) + " is ";
        switch (device.deviceType) {
            case "CAMERA":
                break;
            case "LIGHT":
                var module = device.modules.filter(m => m.type == "LIGHT")[0];
                var state = module.state;
                title += state ? "on" : "off";
                return title;
            case "DOOR":
                var module = device.modules.filter(m => m.type == "SENSOR")[0];
                var state = module.state;
                title += state ? "opened" : "closed";
                return title;
            default:
                break;
        }
    } else if (level == "WARNING") {
        switch (device.deviceType) {
            case "CAMERA":
                break;
            case "LIGHT":
                break;
            case "DOOR":
                if (eventname == "d2s-sensor") {
                    var module = device.modules.filter(m => m.type == "SENSOR")[0];
                    var state = module.state;
                    var title = makeFullName(device) + " is ";
                    title += state ? "opened" : "closed";
                    return title;
                } else if (eventname == "d2s-radar") {
                    var module = device.modules.filter(m => m.type == "RADAR")[0];
                    var state = module.state;
                    if (state) {
                        var title = "Detect strangers in the " + makeFullName(device);
                        return title;
                    }
                }
            default:
                break;
        }
    }
    return "";
}

function makeNotification(device, eventname) {
    var title = makeTitle(device, eventname);
    var message = makeMessage(device, eventname);
    var type = makeType(device, eventname);
    var level = makeLevel(device, eventname);
    var notification = {
        title: title,
        message: message,
        type: type,
        level: level
    }
    return notification;
}

async function setNotiData(notify) {
    var container = "#noti";
    if (notify.length == 0) {
        $(container).html('<h4 class="text-success">No Notification</h4>');
    } else {
        $(container).html('');
        var posNotify = ["light_on.png", "light_off.png", "door-opened.png", "door-close.png", "stranger.png", "stranger.png", "stranger.png"];

        function loadthongbao(type) {
            switch (type) {
                case "LIGHT_ON":
                    return posNotify[0];
                case "LIGHT_OFF":
                    return posNotify[1];
                case "DOOR_OPEN":
                    return posNotify[2];
                case "DOOR_CLOSE":
                    return posNotify[3];
                case "STRANGER":
                    return posNotify[4];
                case "CAMERA_WARNING":
                    return posNotify[5];
                case "CAMERA_CAPTURE":
                    return posNotify[5];

            }
        }
        var lights = '';
        notify.forEach((data) => {
            var message = data.message;
            var type = data.type;
            var day = getDateTimes(new Date(data.createdAt).getDay());
            var month = new Date(data.createdAt).getMonth();
            var date = new Date(data.createdAt).getDate();
            var year = new Date(data.createdAt).getFullYear();
            var h = new Date(data.createdAt).getHours();
            var m = new Date(data.createdAt).getMinutes();
            var s = new Date(data.createdAt).getSeconds();

            lights +=
                '<div class = "alert alert-danger alert-dismissible fade show border-0" role = "alert" style="background-color:#edf2fa; color:#000000; width:100%;"> ' +
                '<button value="' + data._id + '"type="button"  class="btn-delete close">' +
                '<span aria-hidden="true">&times;</span>' +
                '</button>' +
                '<p class="ml-auto mb-0 text-success">' +
                '</p>' +
                '<img  style="float:left; padding:25px 0 10px 0;" src="/img/' + loadthongbao(type) + '"><p>' + '<br>' + message + '</p>' +
                '<img class="icons-state" style="padding-right:5px; padding-bottom:3px;" src="/img/time.png">' +
                '<span  style="color:green">' + h + ':' + m + ':' + s + ' - ' + (month + 1) + '/' + date + '/' +
                year + '</span>' +
                '</div>';
        });
        await sleep(100);
        $(container).html(lights);
        onNotiData();

        deleteNotify();
        countNotify();
    }
};

function onNotiData() {
    socket.on("s2c-change", async function (data) {
        console.log("Response: " + JSON.stringify(data))
        var success = data.success;
        if (success) {
            await sleep(100);
            setupNoti('#noti', {
                read: false
            });
            countNotify();

        }
    });
    socket.on("delete-noti", async function (data) {
        console.log("Response: " + JSON.stringify(data))
        var success = data.success;
        if (success) {
            await sleep(100);
            setupNoti('#noti', {
                read: false
            });
            countNotify();

        }
    });
    socket.on("s2c-radar", async function (data) {
        console.log("Response: " + JSON.stringify(data))
        var success = data.success;
        if (success) {
            var device = data.device;
            var notification = makeNotification(device, "s2c-radar");
            var noti = '<div class = "alert alert-danger alert-dismissible fade show border-0" role = "alert" style="background-color:#edf2fa; color:#000000; width:100%;"> ' +
                '<button value="' + data._id + '"type="button"  class="btn-delete close">' +
                '<span aria-hidden="true">&times;</span>' +
                '</button>' +
                '<p class="ml-auto mb-0 text-success">' +
                '</p>' +
                '<img  style="float:left; padding:20px 0 10px 0;" src="/img/' + loadthongbao(type) + '"><p>' + '<br>' + notification.message + '</p>' +
                '<img class="icons-state" style="padding-right:5px; padding-bottom:3px;" src="/img/time.png">' +
                '<span  style="color:green">' + h + ':' + m + ':' + s + ' - ' + (month + 1) + '/' + date + '/' +
                year + '</span>' +
                '</div>';
            $("#noti-warning").html(noti);
            $("#warningModal").show();
            countNotify();
        }
    });
    socket.on("s2c-capture", async function (data) {
        console.log("Response: " + JSON.stringify(data))
        var success = data.success;
        if (success) {
            var notification = data.data;
            var createdAt = notification.createdAt;
            var day = getDateTimes(new Date(createdAt).getDay());
            var month = new Date(createdAt).getMonth();
            var date = new Date(createdAt).getDate();
            var year = new Date(createdAt).getFullYear();
            var h = new Date(createdAt).getHours();
            var m = new Date(createdAt).getMinutes();
            var s = new Date(createdAt).getSeconds();
            var notiCam = '<div class = "alert alert-danger alert-dismissible fade show border-0" role = "alert" style="background-color:#edf2fa; color:#000000; width:100%;"> ' +
                '<button value="' + notification._id + '"type="button"  class="btn-delete close">' +
                '<span aria-hidden="true">&times;</span>' +
                '</button>' + '<img  style="float:left; padding:20px 0 10px 0;" src="/img/' + loadthongbao(notification.type) + '"><p>' + '<br>' + notification.message + '</p>' +
                '<img class="icons-state" style="padding-right:5px; padding-bottom:3px;" src="/img/time.png">' +
                '<span  style="color:green">' + h + ':' + m + ':' + s + ' - ' + (month + 1) + '/' + date + '/' +
                year + '</span>' +
                '</div>';
            $("#noti-warning").html(notiCam);
            $("#cameraNotify").show();
            countNotify();

        }
    });
}

function loadNotify(container, jsonRequest, callback) {
    $.ajax({
        url: url_home + "/notifications",
        type: 'post',
        dataType: 'json',
        async: true,
        tryCount: 0,
        retryLimit: 3,
        data: jsonRequest,
    }).done(function (data) {
        var notify = data["notifications"];
        countNotify();
        callback(notify);


    });
}

function countNotify() {
    $.ajax({
        url: url_home + "/notification/count",
        type: 'post',
        dataType: 'json',
        async: true,
        tryCount: 0,
        retryLimit: 3,
        data: {
            read: false
        },
    }).done(function (data) {
        if (data.success) {
            if (data.count > 0) {
                $("#numberOfNotify").html(data.count);
            } else {
                $("#numberOfNotify").hide();
            }
        }
    });
}

function deleteNotify() {
    $(".btn-delete").click(function () {
        var val = $(this).val();
        var parent = $(this).parent();
        $.ajax({
            url: url_home + "/notification/delete/",
            type: 'POST',
            dataType: 'json',
            async: true,
            data: {
                notificationId: val
            }
        }).done(function (data) {
            console.log(data);
            if (data.success) {
                socket.emit("delete-noti");
                parent.hide(500, function () {
                    parent.remove();
                });
                countNotify();
            }
        });
    })
}

function setupNoti(container, property) {
    loadNotify(container, property, function (deviceArr) {
        setNotiData(deviceArr);
    });
}
setupNoti('#noti', {
    read: false
});
