System.register([], function (_export) {
  /**
   * A builder is defined by a build method.
   * @abstract
   */
  'use strict';

  var Builder;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  return {
    setters: [],
    execute: function () {
      Builder = (function () {
        function Builder() {
          _classCallCheck(this, Builder);
        }

        _createClass(Builder, [{
          key: 'build',

          /**
           * To specify the logic of the builder.
           * @param {!CustomElementBuilder.context.proto} proto the prototype
           * @param {!CustomElementBuilder.on} on the method on
           */
          value: function build() {
            throw new Error('not implemented');
          }
        }]);

        return Builder;
      })();

      _export('Builder', Builder);
    }
  };
});