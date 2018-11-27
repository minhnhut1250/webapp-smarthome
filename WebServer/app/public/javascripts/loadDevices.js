function loadDevicesProperty(container, jsonRequest, callback) {
   $.ajax({
      url: url_home + "/devices",
      type: 'post',
      dataType: 'json',
      async: true,
      data: jsonRequest,
   }).done(function(data) {
      callback(data["devices"]);
   });
}