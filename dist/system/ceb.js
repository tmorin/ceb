System.register(['./builder/CustomElementBuilder.js', './builder/PropertyBuilder.js', './builder/AttributeBuilder.js', './builder/DelegateBuilder.js', './builder/MethodBuilder.js', './builder/TemplateBuilder.js', './builder/OnBuilder.js', './builder/Builder.js'], function (_export) {

  /**
   * The base builder type
   * @type {Builder} the builder
   */
  'use strict';

  var CustomElementBuilder, PropertyBuilder, AttributeBuilder, getAttValue, setAttValue, DelegateBuilder, MethodBuilder, TemplateBuilder, applyTemplate, OnBuilder, BuilderType, Builder;

  /**
   * Get a new property builder.
   * @param {!string} propName the name of the property
   * @returns {PropertyBuilder} the property builder
   */

  _export('ceb', ceb);

  /**
   * Get a new attribute builder.
   * @param {!string} attrName the name of the attribute
   * @returns {AttributeBuilder} the attribute builder
   */

  _export('property', property);

  _export('attribute', attribute);

  /**
   * Get a new delegate builder.
   * @param {!PropertyBuilder|AttributeBuilder|MethodBuilder} builder a property, attribute or method builder
   * @returns {DelegateBuilder} the delegate builder
   */

  _export('method', method);

  /**
   * Get a new template builder.
   * @param {!string|Function} tpl the string or function template
   * @returns {TemplateBuilder} the template builder
   */

  _export('delegate', delegate);

  _export('template', template);

  _export('on', on);

  /**
   * Get a new custom element builder.
   * @returns {CustomElementBuilder} the custom element builder
   */

  function ceb() {
    return new CustomElementBuilder();
  }

  function property(propName) {
    return new PropertyBuilder(propName);
  }

  function attribute(attrName) {
    return new AttributeBuilder(attrName);
  }

  /**
   * Get a new method builder.
   * @param {!string} methName the name of the method
   * @returns {MethodBuilder} the method builder
   */

  function method(methName) {
    return new MethodBuilder(methName);
  }

  function delegate(builder) {
    return new DelegateBuilder(builder);
  }

  function template(tpl) {
    return new TemplateBuilder(tpl);
  }

  /**
   * Get a new on builder.
   * @param {!string} events a list of tuple 'event target' separated by comas, the target is optional
   * @returns {OnBuilder} the on builder
   */

  function on(events) {
    return new OnBuilder(events);
  }

  return {
    setters: [function (_builderCustomElementBuilderJs) {
      CustomElementBuilder = _builderCustomElementBuilderJs.CustomElementBuilder;
    }, function (_builderPropertyBuilderJs) {
      PropertyBuilder = _builderPropertyBuilderJs.PropertyBuilder;
    }, function (_builderAttributeBuilderJs) {
      AttributeBuilder = _builderAttributeBuilderJs.AttributeBuilder;
      getAttValue = _builderAttributeBuilderJs.getAttValue;
      setAttValue = _builderAttributeBuilderJs.setAttValue;
    }, function (_builderDelegateBuilderJs) {
      DelegateBuilder = _builderDelegateBuilderJs.DelegateBuilder;
    }, function (_builderMethodBuilderJs) {
      MethodBuilder = _builderMethodBuilderJs.MethodBuilder;
    }, function (_builderTemplateBuilderJs) {
      TemplateBuilder = _builderTemplateBuilderJs.TemplateBuilder;
      applyTemplate = _builderTemplateBuilderJs.applyTemplate;
    }, function (_builderOnBuilderJs) {
      OnBuilder = _builderOnBuilderJs.OnBuilder;
    }, function (_builderBuilderJs) {
      BuilderType = _builderBuilderJs.Builder;
    }],
    execute: function () {
      Builder = BuilderType;

      _export('Builder', Builder);

      attribute.getAttValue = getAttValue;
      attribute.setAttValue = setAttValue;
      template.applyTemplate = applyTemplate;
    }
  };
});