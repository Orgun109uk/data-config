/**
 * The error that is raised when trying to create a reference from an invalid
 * field type.
 *
 * @author Orgun109uk <orgun109uk@gmail.com>
 */

'use strict';

module.exports = class EInvalidReferenceType extends Error {
    /**
     * Create the error, and define the error values.
     *
     * @param {string} field The name of the field causing the error.
     * @param {string} type The value type of the field causing the error.
     */
    constructor(field, type) {
        super();

        Error.captureStackTrace(this, this.constructor);
        this.name = 'EInvalidReferenceType';
        this.message = `The value "${field}" can not be used as a reference ` +
            `as it is of type "${type}", and must be an Object.`;

        Object.defineProperties(this, {
            /**
             * The name of the field causing the error.
             *
             * @type {string}
             */
            fieldName: {
                get: function() {
                    return field;
                }
            },
            /**
             * The type of the value of the field causing the error.
             *
             * @type {string}
             */
            fieldValueType: {
                get: function() {
                    return type;
                }
            }
        });
    }
};