var express = require("express");
var app = express();
var path = require('path');
var http = require("http").Server(app);
var colors = require("colors");
var port = process.env.PORT || 3000;
var bodyParser = require("body-parser");
var socketioJwt = require('socketio-jwt');

var io = require("socket.io")(http);

var logger = require('./helpers/logger');
var config = require('./config/config');


http.listen(port, function () {
   logger.info("Server listening at port: %s", port);
});
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(function (req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
});

app.use(bodyParser.urlencoded({
   extended: false
}));
app.use(bodyParser.json());

require("./app/routes/user.routes")(app);
require("./app/routes/device.routes")(app);
require('./app/routes/admin.routes')(app);
//configuring the client
var authorizationSocket = require("./app/socket.io/authorization.socket");
var deviceSocket = require("./app/socket.io/device.socket");

// Configuring the database
var mongoose = require("mongoose");
global.sockets = {};

mongoose.Promise = global.Promise;

mongoose.connect(config.url);

mongoose.connection.on("error", function () {
   logger.error("Could not connect to the database. Exiting now...");
   process.exit();
});
mongoose.connection.once("open", function () {
   logger.info("Successfully connected to the database");
   io.on("connection", function (socket) {
      sockets[socket.id] = {};
      var clientIp = socket.request.connection.remoteAddress;
      sockets[socket.id].address = clientIp.split("::ffff:")[1];
      logger.info(socket.id.magenta + " - " + sockets[socket.id].address + " is trying connect");
      //call listen
      authorizationSocket(socket);
      deviceSocket(socket);
      socket.on("disconnect", () => {
         delete sockets[socket.id];
         logger.warn("Client disconnected:  %s.", socket.id);
         console.log("Total clients connected : ".grey, Object.keys(sockets).length);
      });
   });
});