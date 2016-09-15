/**
 * Provides two simple classes, one for manipulating data, and the other is for
 * storing the data in as a file.
 *
 * @author Orgun109uk <orgun109uk@gmail.com>
 */

const pkg = require('./package.json');

module.exports = {
  /** Exports the version of the package. */
  version: pkg.version,

  /** Exports the available classes. */
  Data: require('./lib/Data'),
  Config: require('./lib/Config')
};
