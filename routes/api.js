var express = require('express');
var config = require('./../config.js');
var route = express.Router();
var User = require('./../models/user.js');

module.exports = function(app){

  app.get('/api/users', function(req, res){
    // User.find(function(err, users){
    //   if(err){
    //     res.send(err);
    //   }
    //
    //   res.json(users)
    // });
    res.json({
      name: 'jack'
    })

  })

}
