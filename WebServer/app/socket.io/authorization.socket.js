var Device = require("../models/device.model");
var md5 = require("md5");
var user_token = "avenger@chuna";
var hash_user_token = md5(user_token);


module.exports = function (socket) {
   var clientIp = socket.request.connection.remoteAddress.split("::ffff:")[1];
   sockets[socket.id].auth = false;
   socket.on("authorization", function (data) {
      sockets[socket.id].auth = data.token == hash_user_token;
      if (sockets[socket.id].auth) {
         console.log(socket.id + ' is authenticated');
         socket.emit("authenticated", sockets[socket.id]);
      } else {
         console.log(socket.id + ' is disconnecting the socket');
         socket.emit("authenticated", sockets[socket.id]);
         socket.disconnect();
      }
   });
}