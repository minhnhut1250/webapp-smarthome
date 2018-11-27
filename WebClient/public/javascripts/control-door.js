async function setDoorData(listDevice, container) {
    if (listDevice.length == 0) {
        $(container).html('<h4 class="text-success">No Door</h4>');
    } else {
        $(container).html('');
        var door = '';
        listDevice.forEach((data) => {
            var module = data.modules.filter(m => m.type == "SENSOR");
            var checked = "";
            var state = "";
            var connected = "";
            if (module.length > 0) {
                checked = module[0].state ? "checked" : "";
                connected = module[0].connect ? "Connected" : "Disconnect";
            }
            state = checked == "checked" ? "OPEN" : (checked == "" ? "CLOSE" : checked);
            var hidenn = connected == "Connected" ? "display:block;" : "display:none;";
            var path = checked ? "door-opened.png" : "door-close.png";
            var connect = module.connect ? "Connected" : "Diconnected";
            door += '<div class="col-xs-6 col-sm-12 col-md-6 col-xl-4">' +
                '<div class="card" data-unit="switch-light-1">' +
                '<div class="card-body d-flex flex-row justify-content-start">' +
                '<img class="icon-state" src="/img/' + path + '">' +
                '<h5>' + data.deviceName + '</h5>' +
                '<label class="switch" style="' + hidenn + '">' +
                '<input class="door-control" type="checkbox" ' + checked + ' id="' + data._id + '" value="' + data._id + '" />' +
                '<span style="float: left;" class="slider round"></span>' +
                '</label>' +
                '</div>' +
                '<hr class="my-0">' +
                '<ul class="list-group borderless px-1">' +
                '<li class="list-group-item">' +
                '<p class="specs">Position</p>' +
                '<p class="ml-auto mb-0 text-success">' + getPosition(data.position) + '</p>' + '</li>' +
                '<li class="list-group-item pt-0">' +
                '<p class="specs">Connect</p>' +
                '<p class="ml-auto mb-0 text-success">' + connected +
                '</ul>' +
                '</div>' +
                '</div>';

        })
        await sleep(100);
        $(container).html(door);
        emitDoorData(listDevice);
        onDoorData();
    }
}


function emitDoorData(data) {
    $('.door-control').click(function () {
        var value = $(this).val();
        var state = $(this).prop("checked") ? true : false;
        var path = !state ? "door-opend.png" : "door-close.png";
        $(this).prop("checked", !state);
        $(this).parents(".icon-state").find("img").attr("src", "/img/" + path);
        var device = data.filter(d => d._id == value)[0];
        if (device != undefined) {
            var module = device.modules.filter(m => m.type == "SERVO");
            if (module.length == 0) return;
            module[0].state = state;
            socket.emit("c2s-change", device);
            console.log("Send: " + module[0].state);
        }
    });
}

function onDoorData() {
    socket.on("s2c-change", async function (data) {
        console.log("Response: " + JSON.stringify(data))
        var success = data.success;
        if (success) {
            var device = data.device;
            var id = device._id;
            var module = device.modules.filter(m => m.type == "SENSOR");
            if (module.length == 0) return;
            var state = module[0].state;
            var path = state ? "door-opened.png" : "door-close.png";
            await sleep(100);
            $("#" + id).prop("checked", state);
            $("#" + id).parent().siblings(".icon-state").attr("src", "/img/" + path);
        }
    })
}

function setupDoor(container, property) {
    var devices;
    loadDevicesProperty(container, property, function (deviceArr) {
        devices = deviceArr;
        setDoorData(deviceArr, container)
    });

}

setupDoor('#doors-detail', {
    deviceType: 'DOOR'
});
