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
var ChallengeFriend = require('../models/challengeFriend.js');
/////////end model imports ///////////////
//////////////////////////////////////////


module.exports = function(app, passport){

// USERS
// get all users
  app.get('/api/users', function(req, res){
    User.find({}, function(err, users){
      if(err){
        res.send(err);
      }
      res.json(users);
    });
  });

// show one user
  app.get('/api/users/:name', function(req, res){
    var name = req.params.name;
    console.log(name);
    User.findOne({name: name}, function(err, user){
      if(err){
        res.send(err);
      }
      console.log(user);
      res.json({user: user});
    });
  });

// create a new user
  app.post('/api/users', function(req, res){
    console.log(req.body);
    var password = req.body.password;
    console.log(password);
    User.create(req.body, function(err, user){
      console.log(err);
      res.json(user);
    });
  });

// update a user
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
    });
  });

  // delete a user
    app.delete('/api/users/:user_id', function(req, res){
      User.remove({
        _id: req.params.user_id
      }, function(err, user){
        if(err){
          console.log(err);
          res.send(err);
        }
        console.log("right BEFORE res.json message");
        res.json({ message : "successfully deleted"});
        console.log("right AFTER res.json message");
      });
    });

// CHALLENGES
// get all challenges
  app.get('/api/challenges', function(req, res){
    Challenge.find({}, function(err, challenges){
      if(err){res.send(err)}
      res.json(challenges)
    });
  });

// show one challenge
  app.get('/api/challenges/:name', function(req, res){
    var rawName = req.params.name;
    var fullName = rawName.split('-').join(' ');
    Challenge.findOne({"title": fullName}, {}, function(err, challenge){
      if(err){console.log(err)};

      res.json(challenge)
    })
  });

// create a new challenge not finished!!!
  app.post('/api/challenges', function(req, res){

      var challenge = new Challenge();

      challenge.sponsor = req.body.sponsor;
      challenge.sponsorIcon = req.body.sponsorIcon;
      challenge.title = req.body.title;
      challenge.description = req.body.description;
      challenge.video_url = req.body.video_url;
      challenge.photo = req.body.photo;
      challenge.creator = req.body.creator;
      challenge.charity = req.body.charity;
      challenge.responses = req.body.responses;
      challenge.goal = req.body.goal;
      challenge.total_raised = req.body.total_raised;

      challenge.save(function(err, user) {
    if (err) {
      res.send(err);
    }
      res.json(challenge);
    });
  });

// update a challenge not finished!!!
  // app.post('/api/challenges/:name', function(req, res){
  //   // var updateAttr = req.updateAttr;
  //   Challenge.findOne(req.body.search, function(err, user){
  //     if(err){console.log(err)};
  //     if(req.body.email){
  //       user.email = req.body.email;
  //     }
  //     if(req.body.name){
  //       user.name = req.body.name;
  //     }
  //     user.save(function(challenge){
  //       res.json(challenge);
  //     });
  //   })
  // })

// delete a challenge not tested!!!
  app.delete('/api/challenges/:title', function(req, res){
    Challenge.remove({
      title: req.params.title
    }, function(err, challenge){
      if(err){
        res.send(err)};
      res.json({ message : "challenge successfully deleted"});
    });
  });

// CHARITIES
// get all charities
    app.get('/api/charities', function(req, res){
      Charity.find({}, function(err, charities){
        if(err){console.log(err)};
        res.json(charities);
      });
    });

// show one charity
  app.get('/api/charities/:name', function(req, res){
    var name = req.params.name.split('-').join(' ');
    Charity.findOne({name: name}, function(err, charity){
      if(err){console.log(err)};
      res.json(charity);
    });
  });

// create a new charity
    app.post('/api/charities', function(req, res){

        var charity = new Charity();

        charity.name = req.body.name;
        charity.description = req.body.description;
        charity.url = req.body.url;
        charity.photo = req.body.photo;
        charity.challenges = req.body.challenges;

        charity.save(function(err, user) {
      if (err) {
        res.send(err);
      }
        res.json(charity);
      });
    });

// update a charity
      // app.post('/api/users/update', function(req, res){
      //   // var updateAttr = req.updateAttr;
      //   User.findOne(req.body.search, function(err, user){
      //     if(err){console.log(err)};
      //     if(req.body.email){
      //       user.email = req.body.email;
      //     }
      //     if(req.body.name){
      //       user.name = req.body.name;
      //     }
      //     user.save(function(data){
      //       res.json(data);
      //     });
      //   })
      // })

// delete a charity
  app.delete('/api/charities/:name', function(req, res){
    Charity.remove({
      name: req.params.name
    }, function(err, charity){
      if(err){
        res.send(err)}
      res.json(charity)
    });
  });

// RESPONSES
// get all responses
  app.get('/api/responses', function(req, res){
    Response.find({}, function(err, responses){
      if(err){console.log(err)}
      console.log(req.body);
      res.json(responses)
    })
  })

// create a new response
  app.post('/api/responses', function(req, res){
    console.log(req.body);
    Response.create(req.body, function(err, response){
      if(err){console.log(err)}
      console.log(response);
      res.json({'posted': response});
    });
  });

// delete a response
  app.delete('/api/responses/:name', function(req, res){
    Responses.remove({
      name: req.params.name
    }, function(err, response){
      if(err){
        res.send(err)}
      res.json(response)
    });
  });


// CHALLENGEFRIENDS
// get all challengefriends
  app.get('/api/challengefriends', function(req, res){
    ChallengeFriend.find({}, function(err, friendChallenges){
      if(err){console.log(err)}
      res.json(friendChallenges);
    });
  });

// create a new challengefriend
  app.post('/api/challengefriends', function(req, res){
    console.log(req.body);
    ChallengeFriend.create(req.body, function(err, friendChallenges){
      if(err){console.log(err)}
      res.json(friendChallenges);
    });
  });

// EMAILHACK & CMS PASSWORD
  app.post('/api/password', function(req, res){
    if(req.body.password == "kickflip"){
      res.json({valid: true})
    } else {
      res.json({valid: false})
    };
  });

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
      res.json(response.clientToken);
    });
  });

  app.post('/checkout', function(req, res){
    console.log(req.body);
    var nonce = req.body.payment_method_nonce;
    console.log('hiihihi');
    console.log(nonce);
    console.log('hohihihih');
    // res.json(nonce)
    gateway.transaction.sale({
      amount: '1.00'
      ,paymentMethodNonce: nonce
    }, function(err, result){
      console.log(err);
      console.log(result);
      res.json(result)
    });
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
  });

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
