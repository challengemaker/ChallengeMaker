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
        res.send(err)
      }
      res.json({user: user})
    })
  })

// create a new user - works
  app.post('/api/users', function(req, res){
    var password = req.body.password;
    User.create(req.body, function(err, user){
      res.json(user)
    })
  })

// update a user
  app.post('/api/users/update', function(req, res){
    // var updateAttr = req.updateAttr;
    User.findOne(req.body.search, function(err, user){
      if(err){console.log(err)};
      console.log(user);
      if(req.body.email){
        user.email = req.body.email;
      }
      if(req.body.name){
        user.name = req.body.name;
      }
      user.save(function(){
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
        res.send(err);
      }
      res.json({ message : "successfully deleted"});
    });
  })

  app.post('/api/users/updatepassword', function(req, res){
    User.findOne({name: req.body.name}, function(err, user){
      if(err){console.log(err)}
      else if(user.validPassword(req.body.oldPassword)){
        user.password = user.generateHash( req.body.newPassword )
        user.save(function(data){
          res.json(user)
        })
      } else {
        res.json({notvalid: true});
      }
    })
  })

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
  app.post('/api/challenges/update', function(req, res){
    // var updateAttr = req.updateAttr;
    Challenge.findOne(req.body.search, function(err, challenge){
      if(err){console.log(err)};
      challenge.title = req.body.title
      challenge.description = req.body.description
      challenge.photo = req.body.photo
      challenge.video = req.body.video
      challenge.save(function(){
        res.json(challenge);
      });
    })
  })

// delete a challenge  - works
  app.delete('/api/challenges/:title', function(req, res){
    var title = req.params.title.split('-').join(' ')
    Challenge.remove({
      title: title
    }, function(err, challenge){
      if(err){
        res.send(err)};
      res.json({ message : "challenge successfully deleted", deleted: challenge});
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
    })
  })

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
    console.log(req.body);
    // var updateAttr = req.updateAttr;
    Charity.findOne(req.body.search, function(err, charity){
      if(err){console.log(err)};
      charity.name = req.body.name
      charity.photo = req.body.photo
      charity.url = req.body.url
      charity.description = req.body.description
      charity.save(function(){
        res.json(charity);
      });
    })
  })

// delete a charity
  app.delete('/api/charities/:id', function(req, res){
    console.log(req.params.id)
    Charity.remove({
      _id: req.params.id
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
    // Response.create(req.body, function(err, response){
    //   if(err){console.log(err)}
    //   res.json({'posted': response});
    // })
  })

  app.delete('/api/responses/:id', function(req, res){
    var elephantId = req.params.id;
    Response.remove({"_id": elephantId}, function(err, response){
      if(err){
        res.send(err)}
      res.json(response)
    });
  });

  app.get('/api/emails', function(req, res){
    Email.find({}, function(err, emails){
      if(err){console.log(err)}
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

  ///////////////////
  ///////email stuff

  ///////post request which sends contact email to us
  app.post('/api/sendemail/contact', function(req, res){
    mandrill_client.messages.send({
      message: {
        from_email: req.body.email
        ,text: req.body.text + "Sent by: " +req.body.email
        ,subject: req.body.subject
        ,to:[{
          email: req.body.sendeeEmail
        }]
      }
    }, function(data){
      res.json(data)
    })
  })

  ///////thank you email for users for contacting us
  app.post('/api/sendemail/contactthankyou', function(req, res){
    mandrill_client.messages.send({
      message: {
        from_email: "contact@ChallengeMaker.com"
        ,text: "Thak you for contacting ChallengeMaker, we'll get back to you soon"
        ,subject: "Challengemaker Contact - Thanks for your Message"
        ,to:[{
          email: req.body.sendeeEmail
        }]
      }
    })
    .then(function(data){
      res.json(data)
    })

  })

  ///////make the automatic email for anyone who responds to a challenge
  app.post('/api/sendemail/challengecomplete', function(req, res){
    mandrill_client.messages.send({
      message: {
        from_email: "ChallengeCompleted@ChallengeMaker.com"
        ,html: "<h1>your impact makes a huge difference to us.</h1>"+
        "<h2>Thank you for completing one of our challenges by uploading your video<h2>"
        ,subject: "You Completed a Challenge on Challengemaker!"
        ,to:[{
          email: req.body.sendeeEmail
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
      message: {
        from_email: "Challenged@ChallengeMaker.com"
        // ,text: "You've been challenged! Follow the link below, it will show you how you can accept this challenge for charity"
        ,html:
          "<div>"+
            "<h2 style='color:#545454'>"+ req.body.responseData.responseCreator+
            " has challenged you to the</h2>"+
            "<p style='font-size:32px; color:#545454; font-weight: bolder'>"+req.body.responseData.charityName+"</p>"+
            "<p style='font-size:32px; color:#545454; font-weight: bolder'>"+req.body.responseData.challenge.split('-').join(' ')+"</p>"+
            "<a style='color:#e70090; font-size: 22px; font-weight: bold' href='https://challengemakerproduction.herokuapp.com/#/youvebeenchallenged/"+req.body.responseData.challenge+"/"+req.body.responseData.video+"/"+req.body.responseData.responseCreator+"'></a>"+
            "<a style='color:#f57801; font-size: 22px; font-weight: bold; margin-left: 30px' href='https://challengemakerproduction.herokuapp.com/#/challenges/"+req.body.responseData.challenge+"'>DETAILS & VIDEO</a>"+
          "</div>"
        ,subject: "You've Been Challenged via ChallengeMaker"
        ,to: req.body.emails
      }
    }, function(data){
      res.json(data)
    })
  })
  ////////end challenge response

  ///////make the automatic email for anyone who responds to a challenge
  app.post('/api/sendemail/donation', function(req, res){
    mandrill_client.messages.send({
      message: {
        from_email: "challenge@challengemaker.com"
        ,text: "Thank you for making such a gracious donaition to <Fill_in_Charity>!"
        ,subject: "ChallengeMaker Is Thrilled About Your Donation"
        ,to:[{
          email: "contact@gmail.com"
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
    environment: braintree.Environment.Production,
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
    var nonce = req.body.payment_method_nonce
    var challenge = req.body.challenge
    console.log(440);
    console.log(challenge);
    console.log(req.body)
    gateway.transaction.sale({
      paymentMethodNonce: nonce
      ,amount: req.body.amount
    },
    function(err, result){
      console.log(448);
      if(err){console.log(err)}
      console.log("result coming next")
      console.log(result)
      var newTran = {
        amount: result.transaction.amount
        ,merchantAccountId: result.transaction.merchantAccountId
        ,challenge: req.body.challenge
        ,id: result.transaction.id
        ,dateCreated: result.transaction.createdAt
      }
      Transaction.create(newTran);
      gateway.transaction.submitForSettlement(result.transaction.id, function (err, settleResult) {
        if(result){console.log(result)}
        console.log(settleResult)
      })
      res.redirect('/#/challenges/'+req.body.challenge+"/paymentreceived")
    })
  })



//////webhook stuff//////
/////////////////////////
app.post('/api/submerchantverified', function(req, res){
  // console.log('kjhsdfkjhsdfkjhsdkjfhsdkjfhsdkjfhsdkjfh')
  sampleNotification = gateway.webhookTesting.sampleNotification(
  braintree.WebhookNotification.Kind.SubMerchantAccountApproved, 'yo yo'
  )
  gateway.webhookNotification.parse(
    sampleNotification.bt_signature,
    sampleNotification.bt_payload,
    function (err, webhookNotification) {
      console.log(webhookNotification)
      console.log();
    }
  )
  // merchantAccountParams = {
  //   individual: {
  //     firstName: braintree.Test.MerchantAccountTest.Approve,
  //     lastName: "Doe",
  //     email: "jane@14ladders.com",
  //     phone: "5553334444",
  //     dateOfBirth: "1981-11-19",
  //     ssn: "456-45-4567",
  //     address: {
  //       streetAddress: "111 Main St",
  //       locality: "Chicago",
  //       region: "IL",
  //       postalCode: "60622"
  //     }
  //   }
  // }
  // gateway.merchantAccount.create(merchantAccountParams, function (err, result) {
  //   if(err)(console.log(err))
  //   console.log('yoyoyoyoyo');
  //   console.log(result.message)
  //   console.log('yoyoyoyoyo');
  // })
})
////end webhook stuff////
/////////////////////////

  ///////////end braintree routing/////////
  /////////////////////////////////////////

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
