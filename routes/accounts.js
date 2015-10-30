var express = require('express'),
    i18n = require('i18n');

var Account = require('../models/account');

var router = express.Router();


/* GET users listing. */
router.get('/', function(req, res) {
  Account
      .find({})
      .sort({
        username: -1 //Sort by Date Added DESC
      })
      .exec(function (err, models) {
        if (err) {
          return console.error(err);
        }

        //res.send(models);
        res.render('accounts', {
          title: i18n.__('Accounts'),
          models: models,
          count: models.length
        });
      });
});

module.exports = router;
