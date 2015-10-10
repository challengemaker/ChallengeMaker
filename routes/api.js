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

////end challenges model
var challengeSchema = new Schema({
  name: String,
  description: String,
  video_url: String,
  photo: String,
  creator: String,//this will be an embed (oneo to one)
  charities: String//many to many
})

Challenge = mongoose.model('challenges', challengeSchema);
///end temp Models home
///////////////////////

module.exports = function(app){

  app.get('/api/users', function(req, res){
    User.find({}, function(err, users){
      // console.log(users);
      if(err){
        res.send(err);
      }
      res.json(users)
    });
  })

  app.get('/api/users/:name', function(req, res){
    var name = req.params.name;
    console.log(name);
    User.findOne({"name":name}, function(err, user){
      // console.log(user);
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

  app.get('/api/challenges/:id', function(req, res){
    var id = req.params.id;
    console.log(id);
    Challenge.findOne(id, function(err, challenge){
      if(err){console.log(err)}
      console.log(challenge);
      res.json(challenge);
    })
  });

}

mongoose.connect("mongodb://jackconnor:Skateboard1@ds031581.mongolab.com:31581/challenge_maker")
