
var mongoose    = require('mongoose');
var Schema   = mongoose.Schema;

var contactSchema = new Schema({
  emailContact: String,
  subject: String,
  message: String,
  dateContact: Number
})

module.exports = mongoose.model('Contact', contactSchema);
