/*global require, module*/
var Abstract = require('./abstract.js'),
    util = require('util'),
    i18n = require('i18n');

var NAME = i18n.__('Sample'),

    DESCRIPTION = i18n.__('A fake api device range (0-10)'),

    ICON = '/images/sensors/dice.png';

function Sample(model) {
    'use strict';

    this.NAME = NAME;

    this.DESCRIPTION = DESCRIPTION;

    this.ICON = ICON;

    this.model = model;

    if(this.model) {
        this.FANCY_NAME = util.format(i18n.__('Random number %s %s'), this.model.condition, this.model.trigger);
    }
}

Sample.prototype = new Abstract();

/**
 * Get the value from the remote host
 * @param callback
 */
Sample.prototype.sync = function (callback) {
    'use strict';
    var that = this,
        value = Math.round(Math.random() * 10),
        state = that.getState(value);

    setTimeout(function (){
        that.save({
            value: value,
            state: state
        }, function () {
            callback({
                value: value,
                state: state
            });
        });
    }, 1000);
};

/**
 * Retrieve all the Options to configure the devices
 * @returns {Array}
 */
Sample.prototype.getOptions = function () {
    'use strict';

    return [{
        label: i18n.__('Options 1x'),
        name: 'options1',
        placeholder: i18n.__('fake options1'),
        type: 'text'
    }, {
        label: i18n.__('fake option'),
        name: 'options2',
        placeholder: i18n.__('fake options2'),
        type: 'text'
    }];
};

// export the class
module.exports = Sample;
