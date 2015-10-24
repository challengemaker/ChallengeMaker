var express        = require('express');
var config         = require('./../config.js');
var mongoose       = require('mongoose');
var bcrypt         = require('bcrypt-nodejs');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var route          = express.Router();
var braintree      = require('braintree');
var ignore         = require('./../.gitignore');

////////   ----- Models ------- //////////
/////// This is a "Model" Home  //////////
var User      = require('../models/user.js');//
var Challenge = require('../models/challenge.js');
var Response  = require('../models/response.js');
var Charity   = require('../models/charity.js');
/////////end model imports ///////////////
//////////////////////////////////////////


module.exports = function(app, passport){

  app.get('/api/users', function(req, res){
    User.find({}, function(err, users){
      if(err){
        res.send(err);
      }
      res.json(users)
    });
  })

  app.get('/api/users/:id', function(req, res){
    var id = req.params.id;
    console.log(id);
    User.findOne('ObjectId("'+id+'")', function(err, user){
      if(err){
        res.send(err);
      }
      console.log(user);
      res.json({user: user})
    });
  })

  app.get('/api/challenges', function(req, res){
    Challenge.find({}, function(err, challenges){
      if(err){res.send(err)}
      res.json(challenges)
    });
  });

  app.get('/api/challenges/:name', function(req, res){
    var rawName = req.params.name;
    var fullName = rawName.split('-').join(' ');
    Challenge.findOne({"title": fullName}, {}, function(err, challenge){
      if(err){console.log(err)};

      res.json(challenge)
    })
  });

  app.get('/api/charities/:name', function(req, res){
    var name = req.params.name.split('-').join(' ');
    Charity.findOne({name: name}, function(err, charity){
      if(err){console.log(err)};
      res.json(charity);
    })
  })


  app.get('/api/charities', function(req, res){
    Charity.find({}, function(err, charities){
      if(err){console.log(err)};
      res.json(charities);
    })
  })

  app.post('/api/responses', function(req, res){
    console.log(req.body);
    Response.create(req.body);
    res.json({'posted': req.body});
  })

  app.post('/api/users', function(req, res){
    // if(req.body.emailTest){
    //   User.update("")
    // }
    User.create(req.body);
    res.json({"posted": req.body})
  })
  //
  app.patch('/api/users', function(req, res){
    User.update({email: req.body.email}, {email:'smarty@smarty', name: 'jack the mack'})
    res.json({"posted": "I hope"})
  })

  app.get('/api/responses', function(req, res){
    Response.find({}, function(err, responses){
      if(err){console.log(err)}
      console.log(req.body);
      res.json(responses)
    })

  })

  /////////////////begin braintree routing/////
  ////////////////////////////////////////////
  var gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    merchantId: ignore.merchantId,
    publicKey: ignore.publicKey,
    privateKey: ignore.privateKey
  })

  // console.log(gateway);
  // console.log(ignore.merchantId);
  // console.log(ignore.publicKey);

  app.get("/client_token", function(req, res){
    gateway.clientToken.generate({}, function(err, response){
      console.log(err);
      console.log(response);
      res.json(response.clientToken);
    })
  })

  app.post('/checkout', function(req, res){
    var nonce = req.body.payment_method_nonce;
  });

  ///////////end braintree routing/////////
  /////////////////////////////////////////


  //////begin login and authentication and all that shit
  app.post('/signin', passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signin',
    failureFlash: true
  }));

  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });



  function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
      return next();
    } else {
      res.redirect('/')
    }
  }

};

var db = require('../db.js');
var url = db.url;

mongoose.connect(ignore.dbUrl);
