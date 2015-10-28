/*global require, module*/
var request = require('request'),
    Abstract = require('./abstract.js'),
    util = require('util'),
    url = require('url'),
    i18n = require('i18n');

var NAME = i18n.__('Ping'),

    DESCRIPTION = i18n.__('Check the ping of an url (trigger in ms)'),

    ICON = '/images/sensors/ping.png';

function Ping(model) {
    'use strict';

    this.NAME = NAME;

    this.DESCRIPTION = DESCRIPTION;

    this.ICON = ICON;

    this.model = model;

    if(this.model) {
        this.FANCY_NAME = util.format(i18n.__('Ping %s %s %sms'), url.parse(this.model.options.url).host, this.model.condition, this.model.trigger);
    }
}

Ping.prototype = new Abstract();

/**
 * Get the value from the remote host
 * @param callback
 */
Ping.prototype.sync = function (callback) {
    'use strict';

    var that = this, value, state;

    var time = process.hrtime();
    var start = time[0] * 1e3 + time[1] / 1e6;

    request(this.model.options.url, function (error, response) {
        if (!error && response.statusCode === 200) {

            time = process.hrtime();
            value = value = Math.floor((time[0] * 1e3 + time[1] / 1e6) - start);
            state = that.getState(value);

            that.save({
                value: value,
                state: state
            }, function () {
                callback({
                    value: value,
                    state: state
                });
            });
        } else {
            that.save({
                value: 0,
                state: false
            }, function () {
                callback({
                    value: 0,
                    state: false
                });
            });
        }
    });
};

/**
 * Retrieve all the Options to configure the devices
 * @returns {Array}
 */
Ping.prototype.getOptions = function () {
    'use strict';

    return [{
        label: i18n.__('Url'),
        name: 'url',
        placeholder: i18n.__('http://www.google.fr'),
        type: 'text'
    }];
};

// export the class
module.exports = Ping;
