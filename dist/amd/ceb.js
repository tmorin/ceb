'use strict';

define(['exports', './builder/element.js', './builder/property.js', './builder/attribute.js', './builder/delegate.js', './builder/method.js', './builder/template.js', './builder/on.js', './helper/array.js', './helper/converter.js', './helper/function.js', './helper/object.js', './helper/event.js', './helper/type.js'], function (exports, _element, _property, _attribute, _delegate, _method, _template, _on, _array, _converter, _function, _object, _event, _type) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'element', {
    enumerable: true,
    get: function get() {
      return _element.element;
    }
  });
  Object.defineProperty(exports, 'property', {
    enumerable: true,
    get: function get() {
      return _property.property;
    }
  });
  Object.defineProperty(exports, 'attribute', {
    enumerable: true,
    get: function get() {
      return _attribute.attribute;
    }
  });
  Object.defineProperty(exports, 'getAttValue', {
    enumerable: true,
    get: function get() {
      return _attribute.getAttValue;
    }
  });
  Object.defineProperty(exports, 'setAttValue', {
    enumerable: true,
    get: function get() {
      return _attribute.setAttValue;
    }
  });
  Object.defineProperty(exports, 'delegate', {
    enumerable: true,
    get: function get() {
      return _delegate.delegate;
    }
  });
  Object.defineProperty(exports, 'method', {
    enumerable: true,
    get: function get() {
      return _method.method;
    }
  });
  Object.defineProperty(exports, 'template', {
    enumerable: true,
    get: function get() {
      return _template.template;
    }
  });
  Object.defineProperty(exports, 'applyTemplate', {
    enumerable: true,
    get: function get() {
      return _template.applyTemplate;
    }
  });
  Object.defineProperty(exports, 'on', {
    enumerable: true,
    get: function get() {
      return _on.on;
    }
  });
  Object.defineProperty(exports, 'flatten', {
    enumerable: true,
    get: function get() {
      return _array.flatten;
    }
  });
  Object.defineProperty(exports, 'invoke', {
    enumerable: true,
    get: function get() {
      return _array.invoke;
    }
  });
  Object.defineProperty(exports, 'toArray', {
    enumerable: true,
    get: function get() {
      return _converter.toArray;
    }
  });
  Object.defineProperty(exports, 'toCamelCase', {
    enumerable: true,
    get: function get() {
      return _converter.toCamelCase;
    }
  });
  Object.defineProperty(exports, 'bind', {
    enumerable: true,
    get: function get() {
      return _function.bind;
    }
  });
  Object.defineProperty(exports, 'noop', {
    enumerable: true,
    get: function get() {
      return _function.noop;
    }
  });
  Object.defineProperty(exports, 'partial', {
    enumerable: true,
    get: function get() {
      return _function.partial;
    }
  });
  Object.defineProperty(exports, 'assign', {
    enumerable: true,
    get: function get() {
      return _object.assign;
    }
  });
  Object.defineProperty(exports, 'result', {
    enumerable: true,
    get: function get() {
      return _object.result;
    }
  });
  Object.defineProperty(exports, 'dispatchCustomEvent', {
    enumerable: true,
    get: function get() {
      return _event.dispatchCustomEvent;
    }
  });
  Object.defineProperty(exports, 'dispatchMouseEvent', {
    enumerable: true,
    get: function get() {
      return _event.dispatchMouseEvent;
    }
  });
  Object.defineProperty(exports, 'isArray', {
    enumerable: true,
    get: function get() {
      return _type.isArray;
    }
  });
  Object.defineProperty(exports, 'isFunction', {
    enumerable: true,
    get: function get() {
      return _type.isFunction;
    }
  });
  Object.defineProperty(exports, 'isNull', {
    enumerable: true,
    get: function get() {
      return _type.isNull;
    }
  });
  Object.defineProperty(exports, 'isString', {
    enumerable: true,
    get: function get() {
      return _type.isString;
    }
  });
  Object.defineProperty(exports, 'isUndefined', {
    enumerable: true,
    get: function get() {
      return _type.isUndefined;
    }
  });
});