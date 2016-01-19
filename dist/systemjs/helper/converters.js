'use strict';

System.register([], function (_export, _context) {
  return {
    setters: [],
    execute: function () {
      function toArray(value) {
        return Array.prototype.slice.call(value);
      }

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