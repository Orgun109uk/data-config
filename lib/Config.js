/**
 * Provides the Config class allowing access to the config.
 *
 * @author Orgun109uk <orgun109uk@gmail.com>
 */

'use strict';

const fs = require('fs');
const Data = require('./Data');

/**
 * The Config class providing methods to access the config options.
 *
 * @extends {Data}
 */
module.exports = class Config extends Data {

    /**
     * Construct and setup the config, and optionally load it from file.
     *
     * @param {string} filename The filename of the config file.
     * @param {boolean} [load=false] Automatically loads the config file.
     */
    constructor(filename, load) {
        super(null, '.');

        Object.defineProperties(this, {
            /**
             * Get the configs filename.
             *
             * @type {string}
             * @final
             */
            filename: {
                get: function() {
                    return filename;
                }
            }
        });

        if (load === true) {
            this.loadSync();
        }
    }

    /**
     * Saves the config file.
     *
     * @param {Function} done The done callback.
     *
     * @async
     */
    save(done) {
        fs.writeFile(this.filename, JSON.stringify(this.data), done);
    }

    /**
     * Saves the config file.
     *
     * @return {Config} Returns self.
     */
    saveSync() {
        fs.writeFileSync(this.filename, JSON.stringify(this.data));
        return this;
    }

    /**
     * Loads the config file.
     *
     * @param {Function} done The done callback.
     *
     * @async
     */
    load(done) {
        fs.access(this.filename, fs.constants.R_OK, (err) => {
            if (err) {
                this.reset({});
                return done(err);
            }

            fs.readFile(this.filename, (err, data) => {
                try {
                    this.reset(JSON.parse(data));
                } catch (parseErr) {
                    err = parseErr;
                }

                done(err);
            });
        });
    }

    /**
     * Restores the config object from the config file.
     *
     * @return {Config} Returns self.
     */
    loadSync() {
        if (fs.existsSync(this.filename) === false) {
            this.reset({});
        } else {
            const data = fs.readFileSync(this.filename);
            try {
                this.reset(JSON.parse(data));
            } catch (err) {
                throw err;
            }
        }

        return this;
    }
};