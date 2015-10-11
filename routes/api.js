var express        = require('express');
var config         = require('./../config.js');
var mongoose       = require('mongoose');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var route          = express.Router();


// var User = require('models/user.js')

/////////////////////////////////
////temporary home for our models
var Schema   = mongoose.Schema;

// User Model
var userSchema = new Schema({
  name: String,
  email: String,
  location: String
})

User = mongoose.model('users', userSchema);
///end user model
///begin challenges model
var challengeSchema = new Schema({
  sponsor: String,
  sponsorIcon: String,
  title: String,
  description: String,
  video_url: String,
  photo: String,
  creator: String,//One to one
  charity: Array,//One to One
  responses: Array,//One to many
  goal: Number,
  total_raised: Number
})

Challenge = mongoose.model('challenges', challengeSchema);
////end challenges model
////begin responses model
var responseSchema = new Schema({
  title: String,
  description: String,
  video_url: String,
  challenge: String,//many-to-one
})

Response = mongoose.model('responses', responseSchema);
// console.log(Response);
////end responses model
////begin Charities model
var charitySchema = new Schema({
  name: String,
  description: String,
  url: String,
  photo: String,
  challenges: String
})

Charity = mongoose.model('charities', charitySchema);
///end Charities model
///end temp Models home
///////////////////////

module.exports = function(app){

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
    User.findOne({"name":name}, function(err, user){
      if(err){
        res.send(err);
      }
      res.json(user)
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
      console.log(charity);;
      res.json(charity);
    })
  })


  app.get('/api/charities', function(req, res){
    Charity.find({}, function(err, charities){
      if(err){console.log(err)};
      res.json(charities);
    })
  });

  app.post('/api/responses', function(req, res){
    console.log(Response);
    console.log(req.body);
    Response.create(req.body);
    res.json({'posted': req.body});
  })

}

mongoose.connect("mongodb://jackconnor:Skateboard1@ds031581.mongolab.com:31581/challenge_maker")
