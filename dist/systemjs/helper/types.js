'use strict';

System.register([], function (_export, _context) {
  return {
    setters: [],
    execute: function () {
      function isFunction(value) {
        return Object.prototype.toString.call(value) === '[object Function]';
      }

      _export('isFunction', isFunction);

      function isUndefined(value) {
        return value === undefined;
      }

      _export('isUndefined', isUndefined);

      function isNull(value) {
        return value === null;
      }

      _export('isNull', isNull);

      function isString(value) {
        return Object.prototype.toString.call(value) === '[object String]';
      }

      _export('isString', isString);

      function isArray(value) {
        return Object.prototype.toString.call(value) === '[object Array]';
      }

      _export('isArray', isArray);
    }
  };
});