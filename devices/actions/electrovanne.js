var Abstract = require('./abstract.js'),
    util = require('util');

var NAME = 'TODO Eclecto',

    DESCRIPTION = 'TODO .....';

function Elec(model) {
    'use strict';

    this.NAME = NAME;

    this.DESCRIPTION = DESCRIPTION;

    this.model = model;
}

Elec.prototype = new Abstract();

Elec.prototype.run = function () {
    var that = this;
    console.log('Activated:' + this.model.name);
    setTimeout(function () {
        console.log('Deactivated:' + that.model.name);
    }, this.model.runTime);
};

//    runtime: { type: String },


module.exports = Elec;
