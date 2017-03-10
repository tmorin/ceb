"use strict";

System.register([], function (_export, _context) {
  "use strict";

  var _createClass, Builder;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [],
    execute: function () {
      _createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      }();

      Builder = function () {
        function Builder() {
          _classCallCheck(this, Builder);
        }

        /**
         * Build execute the business logic of the builder.
         * @param {!Object} proto the builders
         * @param {!function} on the builders
         */


        _createClass(Builder, [{
          key: "build",
          value: function build(proto, on) {}
        }]);

        return Builder;
      }();

      _export("default", Builder);
    }
  };
});