'use strict';

System.register([], function (_export, _context) {
  "use strict";

  return {
    setters: [],
    execute: function () {
      // obviously close to underscorejs and lodash ;)

      /**
       * Converts value to an array.
       * @param [value] the value to convert
       * @returns {Array} the converted array
       */
      function toArray(value) {
        return Array.prototype.slice.call(value);
      }

      /**
       * Converts string to camel case.
       * @param {string} [string=''] the string to convert
       * @return {string} the camel cased string
       */

      _export('toArray', toArray);

      function toCamelCase() {
        var string = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

        return string.toLowerCase().split('-').map(function (part, index) {
          return index ? part.charAt(0).toUpperCase() + part.slice(1) : part;
        }).join('');
      }

      _export('toCamelCase', toCamelCase);
    }
  };
});