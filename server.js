var express        = require('express');
var app            = express();
var http           = require('http');
var mongoose       = require('mongoose');
var logger         = require('morgan');
var path           = require('path');
var config         = require('./config');
var passport       = require('passport');
var flash          = require('connect-flash');
var bodyParser     = require('body-parser');
var config         = require('./config.js');
var methodOverride = require('method-override');

// Begin Middleware
app.use(bodyParser.json());

app.use(logger('dev'));

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(express.static(__dirname + '/public'));

// define routes
require('./routes/api')(app);

// End MiddleWare

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

exports = module.exports = app;
