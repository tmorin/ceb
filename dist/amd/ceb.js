'use strict';

define(['exports', './builder/CustomElementBuilder.js', './builder/PropertyBuilder.js', './builder/AttributeBuilder.js', './builder/DelegateBuilder.js', './builder/MethodBuilder.js', './builder/TemplateBuilder.js', './builder/OnBuilder.js', './builder/Builder.js'], function (exports, _CustomElementBuilder, _PropertyBuilder, _AttributeBuilder, _DelegateBuilder, _MethodBuilder, _TemplateBuilder, _OnBuilder, _Builder) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Builder = undefined;
  exports.ceb = ceb;
  exports.property = property;
  exports.attribute = attribute;
  exports.method = method;
  exports.delegate = delegate;
  exports.template = template;
  exports.on = on;
  var Builder = exports.Builder = _Builder.Builder;

  function ceb() {
    return new _CustomElementBuilder.CustomElementBuilder();
  }

  function property(propName) {
    return new _PropertyBuilder.PropertyBuilder(propName);
  }

  function attribute(attrName) {
    return new _AttributeBuilder.AttributeBuilder(attrName);
  }

  attribute.getAttValue = _AttributeBuilder.getAttValue;
  attribute.setAttValue = _AttributeBuilder.setAttValue;

  function method(methName) {
    return new _MethodBuilder.MethodBuilder(methName);
  }

  function delegate(builder) {
    return new _DelegateBuilder.DelegateBuilder(builder);
  }

  function template(tpl) {
    return new _TemplateBuilder.TemplateBuilder(tpl);
  }

  template.applyTemplate = _TemplateBuilder.applyTemplate;

  function on(events) {
    return new _OnBuilder.OnBuilder(events);
  }
});