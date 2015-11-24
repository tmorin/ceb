'use strict';

System.register(['babel-runtime/helpers/classCallCheck', 'babel-runtime/helpers/createClass'], function (_export) {
  var _classCallCheck, _createClass, Builder;

  return {
    setters: [function (_babelRuntimeHelpersClassCallCheck) {
      _classCallCheck = _babelRuntimeHelpersClassCallCheck.default;
    }, function (_babelRuntimeHelpersCreateClass) {
      _createClass = _babelRuntimeHelpersCreateClass.default;
    }],
    execute: function () {
      _export('Builder', Builder = (function () {
        function Builder() {
          _classCallCheck(this, Builder);
        }

        _createClass(Builder, [{
          key: 'build',
          value: function build() {
            throw new Error('not implemented');
          }
        }]);

        return Builder;
      })());

      _export('Builder', Builder);
    }
  };
});