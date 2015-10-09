var express        = require('express');
var app            = express();
var mongoose       = require('mongoose');
var morgan         = require('mongoose');
var path           = require('path');
var config         = require('./config')
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');


app.use(express.static(__dirname + '/public'));

////setting views directory for express, though all routing will go through Angular

app.set('views', __dirname + 'views/pages');
app.set('view engine', 'ejs');

app.get('*', function(req, res){
  res.sendFile('./public/index.html')
})

////setting ports for local and remote, and listening
app.set('port', (process.env.PORT || 5555))

app.listen(app.get('port'), function(){
  console.log("Server running smoother than Barry White");
})
