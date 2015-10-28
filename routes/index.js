var express = require('express');
var router = express.Router();
var Account = require('../models/account');
var passport = require('passport');



/* GET home page. */
router.get('/', function(req, res) {
  if(!req.user) {
    res.redirect('/login');
  } else {
    res.render('index');
  }
});

router.get('/register', function(req, res) {
  res.render('register', {title: 'Create an account'});
});


router.post('/register', function(req, res) {
  Account.register(new Account({ username : req.body.username }), req.body.password, function(err) {
    if (err) {
      return res.render('register', {info: 'Sorry. That username already exists. Try again.'});
    }

    passport.authenticate('local')(req, res, function () {
      res.redirect('/');
    });
  });
});


router.get('/login', function(req, res) {
  res.render('login', {
    title: 'Login'
  });
});

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user) {
    if (err) { return next(err); }

    if (!user) {
      return res.render('login', {
        success: false,
        error: 'Username and password you entered do not match.',
        username: req.body.username
      });
    }

    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.redirect('/');
    });
  })(req, res, next);
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

router.get('/test', function(req, res) {

  res.send('azezae');
});
module.exports = router;
