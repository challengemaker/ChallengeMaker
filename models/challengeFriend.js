var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var challengeFriendSchema = new Schema({
  senderId: String
  ,senderName: String
  ,sendeeEmail: Array
  ,friendVideoUrl: String
  ,challenge: String
})

module.exports = mongoose.model("ChallengeFriend", challengeFriendSchema)
