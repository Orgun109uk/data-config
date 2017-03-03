/**
 * Provides a helper object which provides some data/eval manipulation.
 *
 * @author Orgun109uk <orgun109uk@gmail.com>
 */

'use strict';

const EInvalidReferenceType = require('./EInvalidReferenceType');

/**
 * The data class allows an easy way to get and set data from an object using
 * a path instead of direct access.
 *
 * @example
 * const data = new Data({hello: {world: true}});
 *
 * data.get('hello.world');
 */
module.exports = class Data {

    /**
     * Construct the data access object, and provide any additional details.
     *
     * @param {Object} [data={}] The data object to manipulate, if null then one
     *   is created.
     * @param {string} [sep='.'] The seperator to use to seperate each xpath
     *   element.
     * @param {Data} [parent] A parent Data object if this is a reference of an
     *   item from the parent.
     * @param {string} [xpath] The xpath of the reference within the parent.
     */
    constructor(data, sep, parent, xpath) {
        let _data = data || {};

        Object.defineProperties(this, {
            /**
             * The parent reference data object, if applicable.
             *
             * @type {Data}
             */
            parent: {
                get: function() {
                    return parent;
                }
            },
            /**
             * The parents reference xpath.
             *
             * @type {string}
             */
            xpath: {
                get: function() {
                    return xpath;
                }
            },
            /**
             * Get the internal data object.
             *
             * @type {Object}
             */
            data: {
                get: function() {
                    return _data;
                }
            },
            /**
             * Get the seperator that is used to seperate the elements in an
             * xpath.
             *
             * @type {string='.'}
             */
            seperator: {
                get: function() {
                    return sep === undefined ? '.' : sep;
                }
            }
        });

        /**
         * Resets the internal data references to the provided data object.
         *
         * @param {Object} data The data object to reset the internal reference.
         * @return {Data} Returns self.
         */
        this.reset = (data) => {
            _data = data;
            return this;
        };
    }

    /**
     * Helper function to convert a property name to an XPath used through eval
     * to get or set a config value.
     *
     * @param {string} name The name of the property.
     * @return {string} The name converted to an eval xpath.
     * @private
     */
    nameToXPath(name) {
        return name.split(this.seperator).join('"]["');
    }

    /**
     * Determines if the provided property exists.
     *
     * @param {string} name The name of the property to check.
     * @return {boolean} Returns true or false.
     */
    has(name) {
        let has = false;

        /* jshint -W061 */
        /* eslint-disable */
        eval('try {\
            has = this.data["' + this.nameToXPath(name) + '"] !== undefined;\
        } catch (err) { has = false; }');
        /* eslint-enable */

        return has;
    }

    /**
     * Get the value of the property, or the default value.
     *
     * @param {string} name The name of the property to get.
     * @param {mixed} [def=null] The default value to return if the property
     *   doesnt exist.
     * @return {mixed} Returns the property value, otherwise the def value.
     */
    get(name, def) {
        if (def === undefined) {
            def = null;
        }

        const n = this.nameToXPath(name);
        let val;

        /* jshint -W061 */
        /* eslint-disable */
        eval('try {\
            val = this.data["' + n + '"] !== undefined ? \
                this.data["' + n + '"] : \
                def;\
        } catch (err) { val = def; }');
        /* eslint-enable */

        return val;
    }

    /**
     * Set the value of a property.
     *
     * @param {string} name The name of the property to set.
     * @param {mixed} value The value to assign, if the value is null then the
     *   field is deleted.
     * @returns {Data} Returns self.
     */
    set(name, value) {
        if (value === null) {
            return this.del(name);
        }

        const ns = name.split(this.seperator);
        let xpath = '';

        for (let i = 0, len = ns.length - 1; i < len; i++) {
            xpath += (i > 0 ? '"]["' : '') + ns[i];

            /* jshint -W061 */
            /* eslint-disable */
            eval('if (this.data["' + xpath + '"] === undefined) {\
                this.data["' + xpath + '"] = {};\
            }');
            /* eslint-enable */
        }

        /* jshint -W061 */
        /* eslint-disable */
        eval('this.data["' + this.nameToXPath(name) + '"] = value;');
        /* eslint-enable */

        if (this.parent) {
            this.parent.set(this.xpath, this.data);
        }

        return this;
    }

    /**
     * Deletes the value of a property.
     *
     * @param {string} name The name of the property to delete.
     * @returns {Data} Returns self.
     */
    del(name) {
        /* jshint -W061 */
        /* eslint-disable */
        eval('delete this.data["' + this.nameToXPath(name) + '"];');
        /* eslint-enable */

        if (this.parent) {
            this.parent.set(this.xpath, this.data);
        }

        return this;
    }

    /**
     * Generate a reference to the specified xpath, this only works if the value
     * is an object. If the value doesnt exist, one is created as an empty
     * object.
     *
     * @param {string} name The name of the property to reference.
     * @param {Object} [def={}] The default value of the object property.
     * @return {Data} The resulting reference.
     * @throws {EInvalidReferenceType} Thrown if the value is anything but an
     *   object.
     */
    ref(name, def) {
        if (this.has(name) === false) {
            this.set(name, def && typeof def === 'object' ? def : {});
        }

        const val = this.get(name);
        if (typeof val !== 'object') {
            throw new EInvalidReferenceType(name, typeof val);
        }

        return new Data(val, this.seperator, this, name);
    }
};