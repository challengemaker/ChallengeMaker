var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var transactionSchema = new Schema({
  merchantAccountId: String,
  id: String,
  dateCreated: String,
  amount: String
})

module.exports = mongoose.model('Transaction', transactionSchema);
