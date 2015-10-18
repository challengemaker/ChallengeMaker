
var mongoose    = require('mongoose');
var Schema   = mongoose.Schema;

var responseSchema = new Schema({
  title: String,
  description: String,
  video_url: String,
  challenge: String,//many-to-one
})

module.exports = mongoose.model('Response', responseSchema);
