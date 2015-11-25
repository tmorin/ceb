webpackJsonp([10],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(32);

	__webpack_require__(35);

	__webpack_require__(34);

	__webpack_require__(33);

	var _jquery = __webpack_require__(21);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _loaderStandalone = __webpack_require__(316);

	var _loaderStandalone2 = _interopRequireDefault(_loaderStandalone);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	(0, _jquery2.default)(function () {
	  return (0, _jquery2.default)(_loaderStandalone2.default).appendTo((0, _jquery2.default)('body'));
	});

/***/ },

/***/ 316:
/***/ function(module, exports) {

	module.exports = "<script src=\"dist/standalone/ceb.js\"></script>\n\n<script id=\"ceb-button-template\" type=\"text/html\">\n    <button class=\"btn btn-default\">\n        <div>\n            <span x-ref=\"icon\"></span>\n            <span x-ref=\"label\"></span>\n        </div>\n    </button>\n</script>\n\n<div class=\"container\">\n    <ceb-button></ceb-button>\n</div>\n\n<script>\n    document.body.onload = function () {\n        var tpl = document.getElementById('ceb-button-template').textContent;\n        ceb.element().builders(\n            ceb.template(tpl),\n            ceb.delegate(ceb.attribute('name')).to('button'),\n            ceb.delegate(ceb.attribute('disabled').boolean()).to('button').property(),\n            ceb.delegate(ceb.attribute('label').value('click me')).to('button [x-ref=label]').property('textContent'),\n            ceb.delegate(ceb.attribute('icon').value('X')).to('button [x-ref=icon]').property('textContent'),\n            ceb.on('click button').invoke(function (el) {\n                el.label = (el.label === 'click me' ? 'clicked' : 'click me');\n            })\n        ).register('ceb-button');\n    }\n</script>\n"

/***/ }

});