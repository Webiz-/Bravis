var util = require('../../lib/util');

function Abstract(model) {
    'use strict';

    this.model = model;
}

Abstract.prototype.run = function() {
    'use strict';

    return true;
};

/**
 * Retrieve all the Options to configure the devices
 * @returns {Array}
 */
Abstract.prototype.getOptions = function () {
    'use strict';

    return [];
};


module.exports = Abstract;
