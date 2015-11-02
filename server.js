var express        = require('express');
var app            = express();
var http           = require('http');
var mongoose       = require('mongoose');
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

var message = {message: "jack is cool"}
var secret = "punkrock"
//
var token = jwt.sign(message, secret, { expiresInMinutes: 1 });
console.log(token);

var detoken = jwt.verify(token, secret, function(err, decoded){
  console.log(decoded);
});
console.log(detoken);

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


require('./passport.js')(passport);
app.use(flash()); //note: if flash end up being unnecessary, we're pulling that shit out

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(express.static(__dirname + '/public'));


//User signup
//===========================================================
app.post('/signup', function( req, res ) {
	console.log( "Starting user check")
  console.log(req.body);
	User.findOne( { email: req.body.email }, function(err, user){
		console.log("Inside user")
		if (err ) {
				console.log("error thrown")
				res.json( err )
		} else if ( user ) {
			console.log(user)
			console.log("There's already somebody names that")
			res.redirect( '/login')
		} else {
			console.log('user being made')
			var newUser = new User();
			newUser.email = req.body.email
			newUser.password = newUser.generateHash( req.body.password )
      newUser.name = req.body.name
			newUser.local.email = req.body.email
			newUser.save( function( err, user ) {
				console.log("inside user save")
				console.log( user)
				if ( err ) { console.log(err) }
				console.log("User saved")
				console.log( user )
				//AUTHENTICATE USER HERE
				res.json(user)
			})
		}
	})

} )
// =================================================================

app.post( '/login', function( req, res ) {
	console.log("In login page")
	console.log(req.body)
  var email = req.body.email;
  console.log(email);
	User.findOne( { email: req.body.email }, function( err, user) {
		console.log( "User is:")
		console.log(user )
		if ( err ) {
			console.log(err)
			res.json( err )
		} else if ( !user ) {
			res.json( "No user found" )
		} else {
			console.log("User found!")
			if( user.validPassword( req.body.password )){
        var gift = {user: user, token: token}
        res.json( gift )
      }
			//AUTHENTICATE USER HERE
		}
	} )
})

app.post('/logout', function(req, res){


})


app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: 'http://reddit.com',
    failureRedirect: 'http://www.google.com',
    failureFlash:    true,
  }))

// define routes
require('./routes/api')(app, passport);


// End MiddleWare

////setting views directory for express, though all routing will go through Angular

app.set('views', __dirname + 'views/pages');
app.set('view engine', 'ejs');

////route that goes straight to our public/ angular file
app.get('*', function(req, res){

  res.sendFile( __dirname + '/public/index.html')
})

////setting ports for local and remote, and listening
app.set('port', (process.env.PORT || 5555))

app.listen(app.get('port'), function(){
  console.log("Server running smoother than Barry White");
})

exports = module.exports = app;
