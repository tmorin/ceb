'use strict';

System.register(['./builder/CustomElementBuilder.js', './builder/PropertyBuilder.js', './builder/AttributeBuilder.js', './builder/DelegateBuilder.js', './builder/MethodBuilder.js', './builder/TemplateBuilder.js', './builder/OnBuilder.js', './builder/Builder.js'], function (_export) {
  var CustomElementBuilder, PropertyBuilder, AttributeBuilder, getAttValue, setAttValue, DelegateBuilder, MethodBuilder, TemplateBuilder, applyTemplate, OnBuilder, BuilderType, Builder;
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
      _export('Builder', Builder = BuilderType);

      _export('Builder', Builder);

      function ceb() {
        return new CustomElementBuilder();
      }

      _export('ceb', ceb);

      function property(propName) {
        return new PropertyBuilder(propName);
      }

      _export('property', property);

      function attribute(attrName) {
        return new AttributeBuilder(attrName);
      }

      _export('attribute', attribute);

      attribute.getAttValue = getAttValue;
      attribute.setAttValue = setAttValue;

      function method(methName) {
        return new MethodBuilder(methName);
      }

      _export('method', method);

      function delegate(builder) {
        return new DelegateBuilder(builder);
      }

      _export('delegate', delegate);

      function template(tpl) {
        return new TemplateBuilder(tpl);
      }

      _export('template', template);

      template.applyTemplate = applyTemplate;

      function on(events) {
        return new OnBuilder(events);
      }

      _export('on', on);
    }
  };
});