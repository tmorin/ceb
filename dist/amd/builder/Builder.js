'use strict';

define(['exports', 'babel-runtime/helpers/classCallCheck', 'babel-runtime/helpers/createClass'], function (exports, _classCallCheck2, _createClass2) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Builder = undefined;

  var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

  var _createClass3 = _interopRequireDefault(_createClass2);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var Builder = exports.Builder = (function () {
    function Builder() {
      (0, _classCallCheck3.default)(this, Builder);
    }

    (0, _createClass3.default)(Builder, [{
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
});