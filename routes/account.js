var express = require('express');
var Account = require('../models/account'),
    i18n = require('i18n');

var router = express.Router();


/* GET users listing. */
router.get('/', function (req, res) {
    Account
        .findById(req.user.id, function (err, model) {
            if (err) {
                return console.error(err);
            }

            //res.send(models);
            res.render('account', {
                title: i18n.__('Your account'),
                model: model
            });
        });
});

router.post('/', function (req, res) {
    Account
        .findById(req.user.id, function (err, model) {
            if (err) {
                return console.error(err);
            }

            res.redirect('/account');
        });
});

module.exports = router;
