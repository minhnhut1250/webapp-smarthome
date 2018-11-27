var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
   username: {
      type: String,
      unique: true,
      required: true
   },
   password: {
      type: String,
      required: true
   },
   fullname: {
      type: String,
      required: true
   },
   email: String,
   phone: String,
   location: String,
   avatar: [Buffer]
}, {
   versionKey: false
});

module.exports = mongoose.model('User', UserSchema);