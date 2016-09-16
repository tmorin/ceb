'use strict';

System.register([], function (_export, _context) {
  "use strict";

  // obviously close to underscorejs and lodash ;)

  /**
   * Checks if value is a Function object.
   * @param [value] the value to check
   * @return {boolean} true if value is a function, else false.
   */
  function isFunction(value) {
    return Object.prototype.toString.call(value) === '[object Function]';
  }

  /**
   * Checks if value is undefined.
   * @param [value] the value to check
   * @return {boolean} true if value is undefined, else false.
   */

  _export('isFunction', isFunction);

  function isUndefined(value) {
    return value === undefined;
  }

  /**
   * Checks if value is null.
   * @param [value] the value to check
   * @return {boolean} true if value is null, else false.
   */

  _export('isUndefined', isUndefined);

  function isNull(value) {
    return value === null;
  }

  /**
   * Checks if value is a string.
   * @param [value] the value to check
   * @return {boolean} true if value is a string, else false.
   */

  _export('isNull', isNull);

  function isString(value) {
    return Object.prototype.toString.call(value) === '[object String]';
  }

  /**
   * Checks if value is an array.
   * @param [value] the value to check
   * @return {boolean} true if value is an array, else false.
   */

  _export('isString', isString);

  function isArray(value) {
    return Object.prototype.toString.call(value) === '[object Array]';
  }
  _export('isArray', isArray);

  return {
    setters: [],
    execute: function () {}
  };
});