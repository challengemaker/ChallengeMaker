var mongoose = require('mongoose')
var Schema   = mongoose.Schema

var userSchema = new Schema({
  name: String,
  email: String,
  location: String,
  videosWatched: Array
})

module.exports('userschema', userSchema);
