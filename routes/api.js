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
var User            = require('../models/user.js');//
var Challenge       = require('../models/challenge.js');
var Response        = require('../models/response.js');
var Charity         = require('../models/charity.js');
var Message         = require('../models/messages.js');
var ChallengeFriend = require('../models/ChallengeFriend.js');
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

  app.get('/api/users/:name', function(req, res){
    var name = req.params.name;
    console.log(name);
    User.findOne({name: name}, function(err, user){
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

  app.get('/api/users', function(req, res){
    User.find({}, function(err, users){
      if(err){console.log(err)};
      res.json(users);
    });
  })

  app.post('/api/users', function(req, res){
    console.log(req.body);
    var password = req.body.password;
    console.log(password);
    User.create(req.body, function(err, user){
      console.log(err);
      res.json(user)
    });
  })

  //
  app.post('/api/users/update', function(req, res){
    // var updateAttr = req.updateAttr;
    User.findOne(req.body.search, function(err, user){
      if(err){console.log(err)};
      if(req.body.email){
        user.email = req.body.email;
      }
      if(req.body.name){
        user.name = req.body.name;
      }
      user.save(function(data){
        res.json(data);
      });
    })
  })

  app.get('/api/responses', function(req, res){
    Response.find({}, function(err, responses){
      if(err){console.log(err)}
      console.log(req.body);
      res.json(responses)
    })
  })


  app.post('/api/responses', function(req, res){
    console.log(req.body);
    Response.create(req.body, function(err, response){
      if(err){console.log(err)}
      console.log(response);
      res.json({'posted': response});
    });
  })

  app.get('/api/challengefriends', function(req, res){
    ChallengeFriend.find({}, function(err, friendChallenges){
      if(err){console.log(err)}
      res.json(friendChallenges);
    })
  })

  app.post('/api/challengefriends', function(req, res){
    console.log(req.body);
    ChallengeFriend.create(req.body, function(err, friendChallenges){
      if(err){console.log(err)}
      res.json(friendChallenges);
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
  app.post('/signup', passport.authenticate('local-signup', function(data){
    console.log(data);
    res.json(data);
    })
  );

  app.post("/login", function(req, res){
    console.log(req);
    // User.find({email: req.body.data.email})
    res.json({message: "success", token: "user", sessionUser: "Dildo"})
  })

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
