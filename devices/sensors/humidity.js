/*global require, module*/
var Abstract = require('./abstract.js'),
    util = require('util'),
    i18n = require('i18n');

var NAME = i18n.__('Humidity'),

    DESCRIPTION = i18n.__('TODO .....'),

    ICON = '/images/sensors/water.png';

function Humidity(model) {
    'use strict';

    this.NAME = NAME;

    this.DESCRIPTION = DESCRIPTION;

    this.ICON = ICON;

    this.model = model;

    if(this.model) {
        this.FANCY_NAME = util.format(i18n.__('Humidity %s %s'), this.model.condition, this.model.trigger);
    }
}

Humidity.prototype = new Abstract();

/**
 * Retrieve all the Options to configure the devices
 * @returns {Array}
 */
Humidity.prototype.getOptions = function () {
    'use strict';

    return [{
        label: i18n.__('Secret Key'),
        name: 'secretKey',
        placeholder: i18n.__('secretKey'),
        type: 'text'
    }, {
        label: i18n.__('Bluetooth Id'),
        name: 'bluetoothId',
        placeholder: i18n.__('dddddd'),
        type: 'text'
    }];
};

// export the class
module.exports = Humidity;
