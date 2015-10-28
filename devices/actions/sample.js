var Abstract = require('./abstract.js'),
    util = require('util');

var NAME = 'Action sample',

    DESCRIPTION = 'TODO .....';

function Sample(model) {
    'use strict';

    this.NAME = NAME;

    this.DESCRIPTION = DESCRIPTION;

    this.ICON = '/images/actions/tube.png';

    this.model = model;

    if (this.model) {
        this.FANCY_NAME = util.format('Sample run %sms', this.model.options.runTime);
    }
}

Sample.prototype = new Abstract();

Sample.prototype.run = function () {
    'use strict';

    var that = this;

    console.log('Activated:' + this.model.name);
    setTimeout(function () {
        console.log('Deactivated:' + that.model.name);
    }, this.model.options.runTime);
};

//    runtime: { type: String },
/**
 * Retrieve all the Options to configure the devices
 * @returns {Array}
 */
Sample.prototype.getOptions = function () {
    'use strict';

    return [{
        label: 'Run Time',
        name: 'runTime',
        placeholder: '1000 (time in second)',
        type: 'text'
    }];
};

module.exports = Sample;
