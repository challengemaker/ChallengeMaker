var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var emailSchema = new Schema({
  address: String,
  name: String,
})

module.exports = mongoose.model('Email', emailSchema);
