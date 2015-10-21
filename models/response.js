
var mongoose    = require('mongoose');
var Schema   = mongoose.Schema;

var responseSchema = new Schema({
  videoUrl: String,
  emails: Array,
  challenge: String,//many-to-one
})

module.exports = mongoose.model('Response', responseSchema);
