var mongoose    = require('mongoose');
var Schema   = mongoose.Schema;
var challengeSchema = new Schema({
  sponsor: String,
  sponsorIcon: String,
  title: String,
  description: String,
  video_url: String,
  photo: String,
  creator: String,//One to one
  charity: Array,//One to One
  responses: Array,//One to many
  goal: Number,
  total_raised: Number
})

module.exports = mongoose.model('Challenge', challengeSchema);
