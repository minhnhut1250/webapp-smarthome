async function setLightsData(listDevice) {
    var container = ".list-light"
    if (listDevice.length == 0) {
        $(container).html('<h3>No Device</h3>');
    } else {
        $(container).html('');
        var lights = '';
        listDevice.forEach((data) => {
            var modules = data.modules;
            var module = modules.filter(m => m.type == "LIGHT");
            var checked = module[0].state ? "checked" : "";
            var state = checked ? "ON" : "OFF";
            var text = state == "ON" ? "color:green;" : "color:red;";
            var path = checked ? "light_on.png" : "light_off.png";
            lights += '<ul class="list-group borderless active" data-unit="wash-machine">' +
                '<li class = "list-group-item d-flex pb-0">' +
                '<img style="object-fit: contain; padding: 4px 8px 8px 0px" class="icons-state" src="/img/' + path + '">' +
                '<div><h5>' + data.deviceName + '</h5>' +
                '<h6 class="text-success" style="padding-left:5px">' + getPosition(data.position) + '</h6>' +
                '</div>' +
                '<p id="p' + data._id + '" class="ml-auto status" style=" ' + text + 'padding: 16px 8px 8px 0px">' + state + '</p>' +
                '</li></ul> ';
        });
        await sleep(100);
        $(container).html(lights);
        onLightsData();
    }
};

function onLightsData() {
    socket.on("s2c-change", async function (data) {
        console.log("Response: " + JSON.stringify(data))
        var success = data.success;
        if (success) {
            var device = data.device;
            var id = device._id;
            var module = device.modules.filter(m => m.type == "LIGHT");
            if (module.length == 0) return;
            var state = module[0].state;
            var checked = state ? "ON" : "OFF";
            var text = state ? "color:green;" : "color:red;";
            await sleep(100);
            $("#p" + id).html(checked);
            $("#p" + id).attr('style', text);
        }
    });
}

function setupLights(container, property) {
    loadDevicesProperty(container, property, function (deviceArr) {
        setLightsData(deviceArr, container)
    });
}
setupLights('.list-light', {
    deviceType: 'LIGHT'
});
