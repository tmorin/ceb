(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', './builder/element.js', './builder/property.js', './builder/attribute.js', './builder/delegate.js', './builder/method.js', './builder/template.js', './builder/on.js', './helper/arrays.js', './helper/converters.js', './helper/functions.js', './helper/objects.js', './helper/events.js', './helper/types.js'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('./builder/element.js'), require('./builder/property.js'), require('./builder/attribute.js'), require('./builder/delegate.js'), require('./builder/method.js'), require('./builder/template.js'), require('./builder/on.js'), require('./helper/arrays.js'), require('./helper/converters.js'), require('./helper/functions.js'), require('./helper/objects.js'), require('./helper/events.js'), require('./helper/types.js'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.element, global.property, global.attribute, global.delegate, global.method, global.template, global.on, global.arrays, global.converters, global.functions, global.objects, global.events, global.types);
    global.ceb = mod.exports;
  }
})(this, function (exports, _element, _property, _attribute, _delegate, _method, _template, _on, _arrays, _converters, _functions, _objects, _events, _types) {
  'use strict';

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
      return _arrays.flatten;
    }
  });
  Object.defineProperty(exports, 'invoke', {
    enumerable: true,
    get: function get() {
      return _arrays.invoke;
    }
  });
  Object.defineProperty(exports, 'toArray', {
    enumerable: true,
    get: function get() {
      return _converters.toArray;
    }
  });
  Object.defineProperty(exports, 'toCamelCase', {
    enumerable: true,
    get: function get() {
      return _converters.toCamelCase;
    }
  });
  Object.defineProperty(exports, 'bind', {
    enumerable: true,
    get: function get() {
      return _functions.bind;
    }
  });
  Object.defineProperty(exports, 'noop', {
    enumerable: true,
    get: function get() {
      return _functions.noop;
    }
  });
  Object.defineProperty(exports, 'partial', {
    enumerable: true,
    get: function get() {
      return _functions.partial;
    }
  });
  Object.defineProperty(exports, 'assign', {
    enumerable: true,
    get: function get() {
      return _objects.assign;
    }
  });
  Object.defineProperty(exports, 'result', {
    enumerable: true,
    get: function get() {
      return _objects.result;
    }
  });
  Object.defineProperty(exports, 'dispatchCustomEvent', {
    enumerable: true,
    get: function get() {
      return _events.dispatchCustomEvent;
    }
  });
  Object.defineProperty(exports, 'dispatchMouseEvent', {
    enumerable: true,
    get: function get() {
      return _events.dispatchMouseEvent;
    }
  });
  Object.defineProperty(exports, 'dispatchHtmlEvent', {
    enumerable: true,
    get: function get() {
      return _events.dispatchHtmlEvent;
    }
  });
  Object.defineProperty(exports, 'isArray', {
    enumerable: true,
    get: function get() {
      return _types.isArray;
    }
  });
  Object.defineProperty(exports, 'isFunction', {
    enumerable: true,
    get: function get() {
      return _types.isFunction;
    }
  });
  Object.defineProperty(exports, 'isNull', {
    enumerable: true,
    get: function get() {
      return _types.isNull;
    }
  });
  Object.defineProperty(exports, 'isString', {
    enumerable: true,
    get: function get() {
      return _types.isString;
    }
  });
  Object.defineProperty(exports, 'isUndefined', {
    enumerable: true,
    get: function get() {
      return _types.isUndefined;
    }
  });
});