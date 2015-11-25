'use strict';

System.register(['./builder/element.js', './builder/property.js', './builder/attribute.js', './builder/delegate.js', './builder/method.js', './builder/template.js', './builder/on.js', './helper/array.js', './helper/converter.js', './helper/function.js', './helper/object.js', './helper/event.js', './helper/type.js'], function (_export) {
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
    }, function (_helperArrayJs) {
      var _exportObj8 = {};
      _exportObj8.flatten = _helperArrayJs.flatten;
      _exportObj8.invoke = _helperArrayJs.invoke;

      _export(_exportObj8);
    }, function (_helperConverterJs) {
      var _exportObj9 = {};
      _exportObj9.toArray = _helperConverterJs.toArray;
      _exportObj9.toCamelCase = _helperConverterJs.toCamelCase;

      _export(_exportObj9);
    }, function (_helperFunctionJs) {
      var _exportObj10 = {};
      _exportObj10.bind = _helperFunctionJs.bind;
      _exportObj10.noop = _helperFunctionJs.noop;
      _exportObj10.partial = _helperFunctionJs.partial;

      _export(_exportObj10);
    }, function (_helperObjectJs) {
      var _exportObj11 = {};
      _exportObj11.assign = _helperObjectJs.assign;
      _exportObj11.result = _helperObjectJs.result;

      _export(_exportObj11);
    }, function (_helperEventJs) {
      var _exportObj12 = {};
      _exportObj12.dispatchCustomEvent = _helperEventJs.dispatchCustomEvent;
      _exportObj12.dispatchMouseEvent = _helperEventJs.dispatchMouseEvent;

      _export(_exportObj12);
    }, function (_helperTypeJs) {
      var _exportObj13 = {};
      _exportObj13.isArray = _helperTypeJs.isArray;
      _exportObj13.isFunction = _helperTypeJs.isFunction;
      _exportObj13.isNull = _helperTypeJs.isNull;
      _exportObj13.isString = _helperTypeJs.isString;
      _exportObj13.isUndefined = _helperTypeJs.isUndefined;

      _export(_exportObj13);
    }],
    execute: function () {}
  };
});