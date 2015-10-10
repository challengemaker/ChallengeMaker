var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var userSchema = new Schema({
  name: String,
  email: String,
  location: String
})

console.log(userSchema);

module.exports = mongoose.model('users', userSchema);
