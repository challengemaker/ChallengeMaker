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

  app.get('/api/users', function(req, res){
    User.find({}, function(err, users){
      if(err){
        res.send(err);
      }
      res.json(users)
    });
  });

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

  app.post('/api/users', function(req, res){
    console.log(req.body);
    var password = req.body.password;
    console.log(password);
    User.create(req.body, function(err, user){
      console.log(err);
      res.json(user)
    });
  });

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

// not finished!!
  // app.post('/api/challenges', function(req, res){
  //   Challenge.create(req.body, function(err, user){
  //     res.json(challenge)
  //   });
  // });

// not finished!!!
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

  // not finished!!! error on line 130 :name
  app.delete('/api/challenges/:name', function(req, res){
    Challenge.remove({
      name: req.params.name
    }, function(err, challenge){
      if(err){
        res.send(err)}
      res.json(challenge)
    });
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

  app.delete('/api/charities/:name', function(req, res){
    Charity.remove({
      name: req.params.name
    }, function(err, charity){
      if(err){
        res.send(err)}
      res.json(charity)
    });
  });


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

// user :name or _id? can I use response, or is it a protected word?
  app.delete('/api/responses/:name', function(req, res){
    Responses.remove({
      name: req.params.name
    }, function(err, response){
      if(err){
        res.send(err)}
      res.json(response)
    });
  });

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

  app.post('/api/password', function(req, res){
    if(req.body.password == "kickflip"){
      res.json({valid: true})
    } else {
      res.json({valid: false})
    }
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
      res.json(response.clientToken);
    })
  })

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
    })
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
