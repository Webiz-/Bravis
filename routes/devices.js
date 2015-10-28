var express = require('express');
var router = express.Router();
var util = require('../lib/util.js');


router.get('/action/:id', function (req, res) {
    var devicesName = req.params.id,
        DevicesObj = util.getAction(devicesName);

    res.render('devices/index', {
        options: new DevicesObj().getOptions()
    });

});

router.get('/:id', function (req, res) {
  var devicesName = req.params.id,
      DevicesObj = util.getSensor(devicesName);

  res.render('devices/index', {
    options: new DevicesObj().getOptions()
  });

});

module.exports = router;
