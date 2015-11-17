var express        = require('express');
var app            = express();
var http           = require('http');
var mongoose       = require('mongoose');
var dotenv         = require('dotenv').load();
var logger         = require('morgan');
var path           = require('path');
var config         = require('./config');
var passport       = require('passport');
var flash          = require('connect-flash');
var cookieParser   = require('cookie-parser');
var bodyParser     = require('body-parser');
var config         = require('./config.js');
var methodOverride = require('method-override');
var session        = require('express-session');
var jwt            = require('jsonwebtoken');
// var User           = mongoose.model('User')
var User           = require('./models/user');
var ignore         = require('./.gitignore')
// console.log(process.env);
// console.log(process.env.NEW_TEST_VARIABLE);
// console.log('1');
var message = {message: "jack is cool"}
var secret = "punkrock"
console.log(process.env.MYTESTVAR);
console.log(process.env);
//
var token = jwt.sign(message, secret, { expiresInMinutes: 1 });

var detoken = jwt.verify(token, secret, function(err, decoded){
});
console.log('2');

// Begin Middleware
app.use(bodyParser.json());

app.use(logger('dev'));

///////alll authentication stuff goes into here (for now)
////parse those cookies
app.use(cookieParser());
app.use(session({
  secret: 'stephanjanoski',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

console.log('3');

require('./passport.js')(passport);
app.use(flash()); //note: if flash end up being unnecessary, we're pulling that shit out

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
console.log('4');

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(express.static(__dirname + '/public'));


//User signup
//===========================================================
app.post('/signup', function( req, res ) {
	User.findOne( { email: req.body.email }, function(err, user){
		if (err ) {
				res.json( err )
		} else if ( user ) {
			res.redirect( '/login')
		} else {
			var newUser = new User();
			newUser.email = req.body.email
			newUser.password = newUser.generateHash( req.body.password )
      newUser.name = req.body.name
			newUser.local.email = req.body.email
			newUser.save( function( err, user ) {
				if ( err ) { console.log(err) }
				//AUTHENTICATE USER HERE
				res.json(user)
			})
		}
	})

} )
// =================================================================
console.log('5');

app.post( '/login', function( req, res ) {
  var email = req.body.email;
  console.log(req.body);
	User.findOne( { email: req.body.email }, function( err, user) {
		if ( err ) {
			console.log(err)
			res.json( err )
		} else if ( !user ) {
			res.json( "No user found" )
		} else {
			if( user.validPassword( req.body.password )){
        var gift = {user: user, token: token}
        console.log(gift)
        res.json( gift )
      }
			//AUTHENTICATE USER HERE
		}
	} )
})

app.post('/logout', function(req, res){


})

console.log('6');


app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: 'http://reddit.com',
    failureRedirect: 'http://www.google.com',
    failureFlash:    true,
  }))

// define routes
require('./routes/api')(app, passport);


// End MiddleWare
console.log('7');

////setting views directory for express, though all routing will go through Angular

app.set('views', __dirname + 'views/pages');
app.set('view engine', 'ejs');

////route that goes straight to our public/ angular file
app.get('*', function(req, res){

  res.sendFile( __dirname + '/public/index.html')
})

////setting ports for local and remote, and listening
app.set('port', (process.env.PORT || 5555))
console.log('8');

app.listen(app.get('port'), function(){
  console.log("Server running smoother than Barry White");
})
console.log('9');

exports = module.exports = app;

console.log('10');
