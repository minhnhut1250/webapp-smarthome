function setDoorData(doors, container) {
   if (doors.length == 0) {
      $(container).html('<h3>No Door</h3>');
   } else {
      $(container).html('');
      doors.forEach(function (data) {
         var checked = data.state ? "checked" : "";
         var door = '<div class="khung col-xs-6 col-sm-4 col-md-3 col-lg-2">' +
            '<div class="child-khung">' +
            '<img src="/img/close_door.png">' +
            '<br>' +
            '<h5 class=" col-md-12">' + data.deviceName + '</h5>' +
            '<label class="switch">' +
            '<input class="door-control" type="checkbox" ' + checked + ' id="' + data._id + '" value="' + data._id + '" />' +
            '<span style="float: left;" class="slider round"></span>' +
            '</label>' +
            '</div>' +
            '</div>';
         $(container).append(door);
      });
   }
};

function emitDoorData(doors) {
   $('.door-control').click(function () {
      var value = $(this).val();
      var state = $(this).prop("checked") ? true : false;
      doors.forEach(function (e) {
         if (e._id == value) {
            var module = e.module;
            module.forEach(m => {
               if (m.type == "SERVO") {
                  m.state = state;
               }
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

function onDoorData(doors) {
   socket.on("s2c-change", function (rs) {
      console.log(rs);
      $("#" + rs._id).prop("checked", rs.state);
   });
}

function setupDoors(container, property) {
   loadDevicesProperty(container, property, function (deviceArr) {
      setDoorData(deviceArr, container)
      emitDoorData(deviceArr);
      onDoorData(deviceArr);
   });
}
var device1 = {
   deviceType: 'DOOR',
   position: 'LIVINGROOM'
};
var device2 = {
   deviceType: 'DOOR',
   position: 'BEDROOM'
};
setupDoors('.door-container-living', device1);
setupDoors('.door-container-bed', device2);