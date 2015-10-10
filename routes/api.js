var express = require('express');
var config = require('./../config.js');
var mongoose = require('mongoose');
var route = express.Router();

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
  name: String,
  description: String,
  video_url: String,
  photo: String,
  creator: String,//this will be an embed (oneo to one)
  charities: String//many to many
})

Challenge = mongoose.model('challenges', challengeSchema);
////end challenges model
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
    Challenge.findOne({"name": fullName}, {}, function(err, challenge){
      if(err){console.log(err)};

      res.json(challenge)
    })
  });

  app.get('/api/charities/:name', function(req, res){
    Charity.findOne({name: req.params.name}, function(err, charity){
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

}

mongoose.connect("mongodb://jackconnor:Skateboard1@ds031581.mongolab.com:31581/challenge_maker")
