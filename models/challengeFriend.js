var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var challengeFriendSchema = new Schema({
  senderId: String
  ,sendeeEmail: Array
  ,friendVideoUrl: String
})

module.exports = mongoose.model("ChallengeFriend", challengeFriendSchema)
