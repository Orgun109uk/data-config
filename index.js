/**
 * Provides two simple classes, one for manipulating data, and the other is for
 * storing the data in as a file.
 *
 * @author Orgun109uk <orgun109uk@gmail.com>
 */

'use strict';

const pkg = require('./package.json');

module.exports = {
    /** Exports the version of the package. */
    version: pkg.version,

    /** Exports the available classes. */
    Data: require('./lib/Data'),
    Config: require('./lib/Config'),

    /** Exports the available error classes. */
    EInvalidReferenceType: require('./lib/EInvalidReferenceType')
};