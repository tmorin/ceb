(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', './builder/CustomElementBuilder.js', './builder/PropertyBuilder.js', './builder/AttributeBuilder.js', './builder/DelegateBuilder.js', './builder/MethodBuilder.js', './builder/TemplateBuilder.js', './builder/OnBuilder.js', './builder/Builder.js'], factory);
  } else if (typeof exports !== 'undefined') {
    factory(exports, require('./builder/CustomElementBuilder.js'), require('./builder/PropertyBuilder.js'), require('./builder/AttributeBuilder.js'), require('./builder/DelegateBuilder.js'), require('./builder/MethodBuilder.js'), require('./builder/TemplateBuilder.js'), require('./builder/OnBuilder.js'), require('./builder/Builder.js'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.CustomElementBuilder, global.PropertyBuilder, global.AttributeBuilder, global.DelegateBuilder, global.MethodBuilder, global.TemplateBuilder, global.OnBuilder, global.Builder);
    global.ceb = mod.exports;
  }
})(this, function (exports, _builderCustomElementBuilderJs, _builderPropertyBuilderJs, _builderAttributeBuilderJs, _builderDelegateBuilderJs, _builderMethodBuilderJs, _builderTemplateBuilderJs, _builderOnBuilderJs, _builderBuilderJs) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  exports.ceb = ceb;
  exports.property = property;
  exports.attribute = attribute;
  exports.method = method;
  exports.delegate = delegate;
  exports.template = template;
  exports.on = on;

  /**
   * The base builder type
   * @type {Builder} the builder
   */
  var Builder = _builderBuilderJs.Builder;

  exports.Builder = Builder;
  /**
   * Get a new custom element builder.
   * @returns {CustomElementBuilder} the custom element builder
   */

  function ceb() {
    return new _builderCustomElementBuilderJs.CustomElementBuilder();
  }

  /**
   * Get a new property builder.
   * @param {!string} propName the name of the property
   * @returns {PropertyBuilder} the property builder
   */

  function property(propName) {
    return new _builderPropertyBuilderJs.PropertyBuilder(propName);
  }

  /**
   * Get a new attribute builder.
   * @param {!string} attrName the name of the attribute
   * @returns {AttributeBuilder} the attribute builder
   */

  function attribute(attrName) {
    return new _builderAttributeBuilderJs.AttributeBuilder(attrName);
  }

  /**
   * Get a new method builder.
   * @param {!string} methName the name of the method
   * @returns {MethodBuilder} the method builder
   */

  function method(methName) {
    return new _builderMethodBuilderJs.MethodBuilder(methName);
  }

  /**
   * Get a new delegate builder.
   * @param {!PropertyBuilder|AttributeBuilder} builder the property or attribute builder
   * @returns {DelegateBuilder} the delegate builder
   */

  function delegate(builder) {
    return new _builderDelegateBuilderJs.DelegateBuilder(builder);
  }

  /**
   * Get a new template builder.
   * @param {!string|Function} tpl the string or function template
   * @returns {TemplateBuilder} the template builder
   */

  function template(tpl) {
    return new _builderTemplateBuilderJs.TemplateBuilder(tpl);
  }

  /**
   * Get a new on builder.
   * @param {!string} events a list of tuple 'event target' separated by comas, the target is optional
   * @returns {OnBuilder} the on builder
   */

  function on(events) {
    return new _builderOnBuilderJs.OnBuilder(events);
  }
});