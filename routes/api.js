var express        = require('express');
var config         = require('./../config.js');
var mongoose       = require('mongoose');
var bcrypt         = require('bcrypt-nodejs');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var route          = express.Router();
var braintree      = require('braintree');
var ignore         = require('./../.gitignore');
var mandrill = require('mandrill-api/mandrill')

var mandrill_client = new mandrill.Mandrill('peYat9DNVGXpYcy2o6bypw');

////////   ----- Models ------- //////////
/////// This is a "Model" Home  //////////
var User            = require('../models/user.js');//
var Challenge       = require('../models/challenge.js');
var Response        = require('../models/response.js');
var Charity         = require('../models/charity.js');
var Message         = require('../models/messages.js');
var Email           = require('../models/email.js');
var Transaction     = require('../models/transactions.js');
var ChallengeFriend = require('../models/challengeFriend.js');
/////////end model imports ///////////////
//////////////////////////////////////////


module.exports = function(app, passport){

// USERS
// get all users - works
  app.get('/api/users', function(req, res){
    User.find({}, function(err, users){
      if(err){
        res.send(err);
      }
      res.json(users);
    });
  });

// show one user - works
  app.get('/api/users/:name', function(req, res){
    var name = req.params.name;
    User.findOne({name: name}, function(err, user){
      if(err){
        res.send(err);
      }
      console.log(user);
      res.json({user: user});
    });
  });

// create a new user - works
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
    console.log(req.body);
    // var updateAttr = req.updateAttr;
    User.findOne(req.body.search, function(err, user){
      if(err){console.log(err)};
      console.log("70 line");
      console.log(user);
      if(req.body.email){
        user.email = req.body.email;
      }
      if(req.body.name){
        console.log('hit the name if');
        user.name = req.body.name;
      }
      user.save(function(){
        console.log('in the callback');
        res.json(user);
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

// create a new challenge - works
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

// update a challenge - works
  app.post('/api/challenges/:name', function(req, res){
    console.log(req.body);
    console.log('148');
    // var updateAttr = req.updateAttr;
    Challenge.findOne(req.body.search, function(err, challenge){
      if(err){console.log(err)};
      console.log(challenge);
      challenge.title = req.body.title;
      challenge.save(function(){
        res.json(challenge);
      });
    })
  })

// delete a challenge  - works
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
      console.log(charities);
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
      app.post('/api/charities/update', function(req, res){
        // var updateAttr = req.updateAttr;
        Charity.findOne(req.body.search, function(err, charity){
          if(err){console.log(err)};
          if(req.body.name){
            charity.name = req.body.name;
          }
          charity.save(function(){
            res.json(charity);
          });
        })
      })

// delete a charity
  app.delete('/api/charities/:name', function(req, res){
    var name = req.params.name.split('-').join(' ')
    Charity.remove({
      name: name
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
      res.json(responses)
    })
  })

// create a new response
  app.post('/api/responses', function(req, res){
    Response.create(req.body, function(err, response){
      if(err){console.log(err)}
      res.json({'posted': response});
    });
  })

  app.delete('/api/responses/:id', function(req, res){
    var elephantId = req.params.id;
    console.log(elephantId);
    Response.remove({"_id": elephantId}, function(err, response){
      if(err){
        res.send(err)}
      res.json(response)
    });
  });

  app.get('/api/emails', function(req, res){
    Email.find({}, function(err, emails){
      if(err){console.log(err)}
      console.log(emails);
      res.json(emails)
    })
  })

  app.post('/api/emails', function(req, res){
    Email.create(req.body, function(err, email){
      if(err){console.log(err)}
      res.json(email)
    })
  })

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
    ChallengeFriend.create(req.body, function(err, friendChallenges){
      if(err){console.log(err)}
      res.json(friendChallenges);
    });
  });

  app.get('/api/messages', function(req, res){
    Message.find({}, function(err, messages){
      if(err){console.log(err)}
      res.json(messages)
    })
  })

  app.get('/api/messages/:name', function(req, res){
    var receiver = req.params.name;
    Message.find({receiver: receiver}, function(err, messages){
      res.json(messages)
    })
  })

  app.post('/api/messages', function(req, res){
    Message.create(req.body, function(err, message){
      res.json(message)
    })
  })

// EMAILHACK & CMS PASSWORD
  app.post('/api/password', function(req, res){
    if(req.body.password == "kickflip"){
      res.json({valid: true})
    } else {
      res.json({valid: false})
    };
  });

  ///////email stuff
  app.post('/api/sendemail/contact', function(req, res){
    console.log(req.body);
    mandrill_client.messages.send({
      "message": {
        "from_email": req.body.email
        ,"text": req.body.text + "Sent by: " +req.body.email
        ,"subject": req.body.subject
        ,"to":[{
          "email": req.body.sendeeEmail
        }]
      }
    }, function(data){
      res.json(data)
    })
  })

  ///////make the automatic email for anyone who responds to a challenge
  app.post('/api/sendemail/challengecomplete', function(req, res){
    console.log(req.body);
    mandrill_client.messages.send({
      "message": {
        "from_email": "challenge@challengemaker.com"
        ,"text": "Thank you for accepting one of the challengeaker challenges!"
        ,"subject": "Jack is Stoked you accepted a challenge"
        ,"to":[{
          "email": req.body.sendeeEmail
        }]
      }
    }, function(data){
      res.json(data)
    })
  })

  //////email that will automatically challenge the people who friends challenge in their response videos
  app.post('/api/sendemail/challengefriends', function(req, res){
    console.log(req.body);
    mandrill_client.messages.send({
      "message": {
        "from_email": "challenge@challengemaker.com"
        ,"text": "You've been challenged! Follow the link below, it will show you how you can accept this chalelnge for charity"
        ,"subject": "You've Been Challenged - ChallengeMaker"
        ,"to": req.body
      }
    }, function(data){
      res.json(data)
    })
  })
  ////////end challenge response

  ///////make the automatic email for anyone who responds to a challenge
  app.post('/api/sendemail/donation', function(req, res){
    console.log(req.body);
    mandrill_client.messages.send({
      "message": {
        "from_email": "challenge@challengemaker.com"
        ,"text": "Thank you for making such a gracious donaition to <Fill_in_Charity>!"
        ,"subject": "ChallengeMaker Is Thrilled About Your Donation"
        ,"to":[{
          "email": "contact@gmail.com"
        }]
      }
    }, function(data){
      res.json(data)
    })
  })
  /////////////end donation thank you email

  //////end emails
  ////////////////

  /////////////////begin braintree routing/////
  ////////////////////////////////////////////
  var gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    merchantId: ignore.merchantId,
    publicKey: ignore.publicKey,
    privateKey: ignore.privateKey
  })

  app.get("/client_token", function(req, res){
    gateway.clientToken.generate({}, function(err, response){
      if(err){res.json(err)}
      res.json(response.clientToken);
    });
  });

  app.post('/checkout', function(req, res){
    var nonce = req.body.payment_method_nonce;
    gateway.transaction.sale({
      paymentMethodNonce: nonce
      ,amount: req.body.amount
    },
    function(err, result){
      var newTran = {
        amount: result.transaction.amount
        ,merchantAccountId: result.transaction.merchantAccountId
        ,challenge: req.body.challenge
        ,id: result.transaction.id
        ,dateCreated: result.transaction.createdAt
      }
      Transaction.create(newTran);
      // res.json(result.transaction);
      res.redirect('/#/challenges/'+req.body.challenge)
    })
  });

  ///////////end braintree routing/////////
  /////////////////////////////////////////


  //////begin login and authentication and all that shit
  app.post('/signup', passport.authenticate('local-signup', function(data){
    res.json(data);
    })
  );

  app.post("/login", function(req, res){
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
