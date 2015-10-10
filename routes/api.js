var express = require('express');
var config = require('./../config.js');
var mongoose = require('mongoose');
var route = express.Router();

// var User = require('models/user.js')

////temporary home for our models

// User Model
var Schema   = mongoose.Schema;

var userSchema = new Schema({
  name: String,
  email: String,
  location: String
})

User = mongoose.model('users', userSchema);
///end temp Models home

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
    console.log('hi hih ih ih ih ih ih ');
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

}

mongoose.connect("mongodb://jackconnor:Skateboard1@ds031581.mongolab.com:31581/challenge_maker")
