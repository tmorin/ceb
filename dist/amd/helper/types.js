'use strict';

define(['exports'], function (exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.isFunction = isFunction;
  exports.isUndefined = isUndefined;
  exports.isNull = isNull;
  exports.isString = isString;
  exports.isArray = isArray;

  function isFunction(value) {
    return Object.prototype.toString.call(value) === '[object Function]';
  }

  function isUndefined(value) {
    return value === undefined;
  }

  function isNull(value) {
    return value === null;
  }

  function isString(value) {
    return Object.prototype.toString.call(value) === '[object String]';
  }

  function isArray(value) {
    return Object.prototype.toString.call(value) === '[object Array]';
  }
});