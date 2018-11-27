async function setCameraData(listDevice, container) {
    if (listDevice.length == 0) {
        $(container).html('<h3>No Device</h3>');
    } else {
        $(container).html('');
        var camera = '';
        listDevice.forEach((data) => {
            var modules = data.modules;
            var module = modules.filter(m => m.type == "CAMERA");
            var checked = "";
            var state = "";
            if (module.length > 0) {
                checked = module[0].state ? "checked" : "";
            }
            state = checked == "checked" ? "ON" : (checked == "" ? "OFF" : checked);
            var text = state == "ON" ? "color:green;" : "color:red;'";
            camera += '<ul class="list-group borderless active" data-unit="wash-machine">' +
                '<li class = "list-group-item d-flex pb-0">' +
                '<img style="object-fit: contain; padding: 4px 8px 8px 0px" src="/img/camera.png">' +
                '<div><h5>' + data.deviceName + '</h5>' +
                '<h6 class="text-success" style="padding-left:5px">' + data.position + '</h6>' +
                '</div>' +
                '<p id="a' + data._id + '" class="ml-auto status" style="' + text + 'padding: 16px 8px 8px 0px">' + state + '</p>' +
                '</li></ul> ';

        });
        await sleep(100);
        $(container).html(camera);
        onCameraData();
    }
};

function onCameraData() {
    socket.on("s2c-change", async function (data) {
        console.log("Response: " + JSON.stringify(data))
        var success = data.success;
        if (success) {
            var device = data.device;
            var id = device._id;
            var module = device.modules.filter(m => m.type == "CAMERA");
            if (module.length == 0) return;
            var state = module[0].state;
            state = checked == "checked" ? "ON" : (checked == "" ? "OFF" : checked);
            var text = state == "ON" ? "color:green;" : "color:red;";
            await sleep(100);
            $("#a" + id).html(checked);
            $("#a" + id).attr('style', text);

        }
    });
}


function setupCamera(container, property) {
    loadDevicesProperty(container, property, (deviceArr) => {
        setCameraData(deviceArr, container);
    });
}

setupCamera('.list-camera', {
    deviceType: 'CAMERA'
});
