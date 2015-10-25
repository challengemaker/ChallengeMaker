
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var messageSchema = new Schema({
  sender: String
  ,receiver: String
  ,messageContent: String
  ,isChallenge: Boolean
  ,associatedChallenge: String
})

module.exports = mongoose.model('Message', messageSchema);
