var Device = require("../models/device.model");

module.exports = function(socket) {
   socket.on("stream", function(data) {
      socket.broadcast.emit("stream", data);
   });
}