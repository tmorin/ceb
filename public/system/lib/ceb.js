System.register(['./builder/CustomElementBuilder.js', './builder/PropertyBuilder.js', './builder/AttributeBuilder.js', './builder/DelegateBuilder.js', './builder/MethodBuilder.js', './builder/TemplateBuilder.js', './builder/OnBuilder.js', './builder/Builder.js'], function (_export) {

  /**
   * The base builder type
   * @type {Builder} the builder
   */
  'use strict';

  var customElementBuilder, propertyBuilder, attributeBuilder, delegateBuilder, methodBuilder, templateBuilder, onBuilder, BuilderType, Builder;

  /**
   * Get a new custom element builder.
   * @returns {CustomElementBuilder} the custom element builder
   */

  _export('ceb', ceb);

  /**
   * Get a new attribute builder.
   * @param {!string} attrName the name of the attribute
   * @returns {AttributeBuilder} the attribute builder
   */

  _export('property', property);

  /**
   * Get a new method builder.
   * @param {!string} methName the name of the method
   * @returns {MethodBuilder} the method builder
   */

  _export('attribute', attribute);

  /**
   * Get a new delegate builder.
   * @param {!PropertyBuilder|AttributeBuilder} builder the property or attribute builder
   * @returns {DelegateBuilder} the delegate builder
   */

  _export('method', method);

  /**
   * Get a new template builder.
   * @param {!string|Function} tpl the string or function template
   * @returns {TemplateBuilder} the template builder
   */

  _export('delegate', delegate);

  /**
   * Get a new on builder.
   * @param {!string} events a list of tuple 'event target' separated by comas, the target is optional
   * @returns {OnBuilder} the on builder
   */

  _export('template', template);

  _export('on', on);

  /**
   * Get a new custom element builder.
   * @returns {CustomElementBuilder} the custom element builder
   */

  function ceb() {
    return customElementBuilder();
  }

  /**
   * Get a new property builder.
   * @param {!string} propName the name of the property
   * @returns {PropertyBuilder} the property builder
   */

  function property(propName) {
    return propertyBuilder(propName);
  }

  function attribute(attrName) {
    return attributeBuilder(attrName);
  }

  function method(methName) {
    return methodBuilder(methName);
  }

  function delegate(builder) {
    return delegateBuilder(builder);
  }

  function template(tpl) {
    return templateBuilder(tpl);
  }

  function on(events) {
    return onBuilder(events);
  }

  return {
    setters: [function (_builderCustomElementBuilderJs) {
      customElementBuilder = _builderCustomElementBuilderJs['default'];
    }, function (_builderPropertyBuilderJs) {
      propertyBuilder = _builderPropertyBuilderJs['default'];
    }, function (_builderAttributeBuilderJs) {
      attributeBuilder = _builderAttributeBuilderJs['default'];
    }, function (_builderDelegateBuilderJs) {
      delegateBuilder = _builderDelegateBuilderJs['default'];
    }, function (_builderMethodBuilderJs) {
      methodBuilder = _builderMethodBuilderJs['default'];
    }, function (_builderTemplateBuilderJs) {
      templateBuilder = _builderTemplateBuilderJs['default'];
    }, function (_builderOnBuilderJs) {
      onBuilder = _builderOnBuilderJs['default'];
    }, function (_builderBuilderJs) {
      BuilderType = _builderBuilderJs['default'];
    }],
    execute: function () {
      Builder = BuilderType;

      _export('Builder', Builder);

      _export('default', ceb);
    }
  };
});