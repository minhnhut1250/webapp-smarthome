function setLightData(listDevice, container) {
   if (listDevice.length == 0) {
      $(container).html('<h3>No Device</h3>');
   } else {
      $(container).html('');
      listDevice.forEach(function (data) {
         var checked = data.state ? "checked" : "";
         var light = '<div class="khung col-xs-6 col-sm-4 col-md-3 col-lg-2">' +
            '<div class="child-khung">' +
            '<img src="/img/light.png">' +
            '<br>' +
            '<h5>' + data.deviceName + '</h5>' +
            '<label class="switch">' +
            '<input class="light-control" type="checkbox" ' + checked + ' id="' + data._id + '" value="' + data._id + '" />' +
            '<span style="float: left;" class="slider round"></span>' +
            '</label>' +
            '</div>' +
            '</div>';
         $(container).append(light);
      });
   }
};

function emitLightData(data) {
   $('.light-control').click(function () {
      var value = $(this).val();
      var state = $(this).prop("checked") ? true : false;
      data.forEach(function (e) {
         if (e._id == value) {
            var module = e.module;
            module.forEach(m => {
               m.state = state;
            })
            var object = {};
            object._id = e._id;
            object.module = module;
            console.log(object);
            socket.emit("c2s-change", module);
         }
      })
   });
}

function onLightData(data) {
   socket.on("s2c-change", function (rs) {
      $("#" + rs._id).prop("checked", rs.state);
   });
}

function setupLights(container, property) {
   loadDevicesProperty(container, property, function (deviceArr) {
      setLightData(deviceArr, container)
      emitLightData(deviceArr);
      onLightData(deviceArr);
   });
}
var device = {
   deviceType: 'LIGHT'
};
setupLights('.light-container', device);