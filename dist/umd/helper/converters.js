(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.converters = mod.exports;
  }
})(this, function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.toArray = toArray;
  exports.toCamelCase = toCamelCase;

  function toArray(value) {
    return Array.prototype.slice.call(value);
  }

  function toCamelCase() {
    var string = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
    return string.toLowerCase().split('-').map(function (part, index) {
      return index ? part.charAt(0).toUpperCase() + part.slice(1) : part;
    }).join('');
  }
});