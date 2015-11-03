var mongoose    = require('mongoose');
var bcrypt      = require('bcrypt-nodejs');
var Schema      = mongoose.Schema;


// User Model
var userSchema = new Schema({

    name        : {type: String, required: true, unique: true},
    email       : { type: String, required: true, unique: true },
    password    : String,
		local: {
			email: String
		}
})

userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
	console.log("In pass check")
  console.log(password);
  console.log(this.password);
  console.log('were the the same?');
	console.log(bcrypt.compareSync(password, this.password));
  return bcrypt.compareSync(password, this.password)
}

module.exports = mongoose.model('User', userSchema);
