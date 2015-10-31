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
    User.findOne({name: name}, function(err, user){
      if(err){
        res.send(err);
      }
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
    var password = req.body.password;
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
        user.local.email = req.body.email;
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
      res.json(responses)
    })
  })


  app.post('/api/responses', function(req, res){
    // Response.create(req.body, function(err, response){
    //   if(err){console.log(err)}
    //   res.json({'posted': response});
    // });
  })

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

  app.get('/api/challengefriends', function(req, res){
    ChallengeFriend.find({}, function(err, friendChallenges){
      if(err){console.log(err)}
      res.json(friendChallenges);
    })
  })

  app.post('/api/challengefriends', function(req, res){
    ChallengeFriend.create(req.body, function(err, friendChallenges){
      if(err){console.log(err)}
      res.json(friendChallenges);
    })
  })

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

  app.post('/api/password', function(req, res){
    if(req.body.password == "kickflip"){
      res.json({valid: true})
    } else {
      res.json({valid: false})
    }
  })

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
    })
  })

  app.post('/checkout', function(req, res){
    var nonce = req.body.payment_method_nonce;
    gateway.transaction.sale({
      paymentMethodNonce: nonce
      ,amount: req.body.amount
    },
    function(err, result){
      var newTran = {amount: result.transaction.amount, merchantAccountId: result.transaction.merchantAccountId, challenge: req.body.challenge, id: result.transaction.id, dateCreated: result.transaction.createdAt}
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
