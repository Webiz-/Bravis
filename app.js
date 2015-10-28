var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var mongoose = require('mongoose');
var passport = require('passport');
var menu = require('./helper/menu');
var i18n = require('i18n');


//Auto Load Models
fs.readdirSync(__dirname + '/models').forEach(function (file) {
  if (~file.indexOf('.js')) require(__dirname + '/models/' + file);
});

var Account = mongoose.model('Account');
i18n.configure({
  locales: ['en', 'fr'],
  directory: __dirname + '/locales',
  cookie: 'locale'
});
//init bdd
var dbConnectionString = 'mongodb://127.0.0.1/travis-v2';
console.log('[database] Try to connect:' + dbConnectionString);
mongoose.connect(dbConnectionString);
var db = mongoose.connection;
db.on('error', console.error.bind(console, '[database] Connection error:'));
db.once('open', function (callback) {
  console.log('[database] connected:' + dbConnectionString);

  //load cron
  var Sensor = require('./models/sensor.js'),
      CronJob = require('cron').CronJob;

  Sensor.find({}, function (err, docs) {
    'use strict';

    if(!err){
      docs.forEach(function(doc){

        console.log('CRON INIT:' + doc.name + ' (' + doc.crontime + ')');
        new CronJob({
          cronTime: doc.crontime,
          onTick: function() {
            var DevicesObj = require('./devices/sensors/' + doc.type.toLowerCase() + '.js');

            console.log('[CRON] - Start:' + doc.name);
            new DevicesObj(doc).sync(function (data) {
              console.log('[CRON] - End:' + doc.name, data);
            });
          },
          start: false
        }).start();

      });
    }
  });
});

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
passport.use(Account.createStrategy());
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// init i18n module for this loop
app.use(i18n.init);
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('express-session')({
  secret: '*ùqsd$qs^d^qsd^$fd^$fpqlfkà)*!:,2)àç-_çàè=é"(="é()-_"àç-"',
  resave: false,
  saveUninitialized: false
}));

// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());

//Make sure this comes before your routes.
app.use(function(req, res, next) {
  i18n.setLocale(req.getLocale());
  res.locals.url = req.url;
  next();
});

//Make sure this comes before your routes.
app.use(function(req, res, next) {
  if(!req.user && ['/login', '/register'].indexOf(req.url) === -1) {
    res.redirect('/login');
  } else {
    next();
  }
  console.log('URL:', req.url);


});

//...
app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
});

//...
app.use(function(req, res, next) {
  res.locals.menu = menu;
  next();
});

//Auto Load Models
/*
fs.readdirSync(__dirname + '/models').forEach(function (file) {
  if (~file.indexOf('.js')) require(__dirname + '/models/' + file);
});*/


//Auto Load Routes
fs.readdirSync(__dirname + '/routes').forEach(function (file) {
  if (~file.indexOf('.js')) {
    var route = require(__dirname + '/routes/' + file),
        routeName = file.replace('.js', '');

    if (routeName === 'index') {
      app.use('/', route);
    } else {
      app.use('/' + routeName, route);
    }
  }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
