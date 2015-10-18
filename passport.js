//config/passport.js

var LocalStrategy = require('passport-local').Strategy;

var User = require('./models/user.js');

  console.log('lindsat lohan');
module.exports = function(passport){
  console.log('in here');

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  console.log('in here 2');
  passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
      done(err, user);
    });
  });
  console.log('in here 3');

  //////local signup stuff
  var thisUser = {
    passwordField: 'password',
    passReqToCallback: true
  }

  passport.use('local-signup', new LocalStrategy(thisUser,
  function(req, email, password, done){
    console.log('well at least I got this far');

    process.nextTick(function(){

      User.findOne({ 'local.email': email }, function(err, user){
        if(err){return done(err)}
        else if(user){
          return done(null, false, req.flash('signupmessage', 'that email is already taken'))
        } else {

          var newUser  = new User();

          newUser.local.email  = email;
          newUser.local.password = newUser.generateHash(password);

          newUser.save(function(err){
            if(err){throw err}
            return done(null, newUser)
          });

        }
      });
    }
  );

  }
));
}
