'use strict';

System.register(['./builder/element.js', './builder/property.js', './builder/attribute.js', './builder/delegate.js', './builder/method.js', './builder/template.js', './builder/on.js', './helper/arrays.js', './helper/converters.js', './helper/functions.js', './helper/objects.js', './helper/events.js', './helper/types.js'], function (_export, _context) {
  "use strict";

  return {
    setters: [function (_builderElementJs) {
      var _exportObj = {};
      _exportObj.element = _builderElementJs.element;

      _export(_exportObj);
    }, function (_builderPropertyJs) {
      var _exportObj2 = {};
      _exportObj2.property = _builderPropertyJs.property;

      _export(_exportObj2);
    }, function (_builderAttributeJs) {
      var _exportObj3 = {};
      _exportObj3.attribute = _builderAttributeJs.attribute;
      _exportObj3.getAttValue = _builderAttributeJs.getAttValue;
      _exportObj3.setAttValue = _builderAttributeJs.setAttValue;

      _export(_exportObj3);
    }, function (_builderDelegateJs) {
      var _exportObj4 = {};
      _exportObj4.delegate = _builderDelegateJs.delegate;

      _export(_exportObj4);
    }, function (_builderMethodJs) {
      var _exportObj5 = {};
      _exportObj5.method = _builderMethodJs.method;

      _export(_exportObj5);
    }, function (_builderTemplateJs) {
      var _exportObj6 = {};
      _exportObj6.template = _builderTemplateJs.template;
      _exportObj6.applyTemplate = _builderTemplateJs.applyTemplate;

      _export(_exportObj6);
    }, function (_builderOnJs) {
      var _exportObj7 = {};
      _exportObj7.on = _builderOnJs.on;

      _export(_exportObj7);
    }, function (_helperArraysJs) {
      var _exportObj8 = {};
      _exportObj8.flatten = _helperArraysJs.flatten;
      _exportObj8.invoke = _helperArraysJs.invoke;

      _export(_exportObj8);
    }, function (_helperConvertersJs) {
      var _exportObj9 = {};
      _exportObj9.toArray = _helperConvertersJs.toArray;
      _exportObj9.toCamelCase = _helperConvertersJs.toCamelCase;

      _export(_exportObj9);
    }, function (_helperFunctionsJs) {
      var _exportObj10 = {};
      _exportObj10.bind = _helperFunctionsJs.bind;
      _exportObj10.noop = _helperFunctionsJs.noop;
      _exportObj10.partial = _helperFunctionsJs.partial;

      _export(_exportObj10);
    }, function (_helperObjectsJs) {
      var _exportObj11 = {};
      _exportObj11.assign = _helperObjectsJs.assign;
      _exportObj11.result = _helperObjectsJs.result;

      _export(_exportObj11);
    }, function (_helperEventsJs) {
      var _exportObj12 = {};
      _exportObj12.dispatchCustomEvent = _helperEventsJs.dispatchCustomEvent;
      _exportObj12.dispatchMouseEvent = _helperEventsJs.dispatchMouseEvent;
      _exportObj12.dispatchHtmlEvent = _helperEventsJs.dispatchHtmlEvent;

      _export(_exportObj12);
    }, function (_helperTypesJs) {
      var _exportObj13 = {};
      _exportObj13.isArray = _helperTypesJs.isArray;
      _exportObj13.isFunction = _helperTypesJs.isFunction;
      _exportObj13.isNull = _helperTypesJs.isNull;
      _exportObj13.isString = _helperTypesJs.isString;
      _exportObj13.isUndefined = _helperTypesJs.isUndefined;

      _export(_exportObj13);
    }],
    execute: function () {}
  };
});