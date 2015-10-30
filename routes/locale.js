var express = require('express');

var router = express.Router();


/* GET users listing. */
router.get('/:locale', function (req, res) {
    res.cookie('locale', req.params.locale, {
        maxAge: 9000000, httpOnly: true
    });

    res.redirect(req.header('Referer') || '/');
});

module.exports = router;
