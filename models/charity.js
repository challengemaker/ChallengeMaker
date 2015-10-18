
var mongoose = require('mongoose')
var Schema   = mongoose.Schema;

var charitySchema = new Schema({
  name: String,
  description: String,
  url: String,
  photo: String,
  challenges: String
})

module.exports = mongoose.model('Charity', charitySchema);
