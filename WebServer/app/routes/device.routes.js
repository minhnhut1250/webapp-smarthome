module.exports = function (app) {
   var devices = require('../controllers/device.controller');
   // Create a new Device
   app.post('/device/create', devices.createDevice);
   // Retrieve all Devices
   app.post('/devices/', devices.getDevicesProperty);
   // Update a Device with userId
   app.put('/device/:deviceId', devices.updateDeviceById);
   app.put('/device/:deviceName', devices.updateDeviceByName);
   // Delete a Device with userId
   app.delete('/device/:deviceId', devices.deleteDeviceById);
   app.delete('/devices', devices.deleteDevices);
}