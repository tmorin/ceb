'use strict';

(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', 'babel-runtime/core-js/object/get-prototype-of', 'babel-runtime/helpers/classCallCheck', 'babel-runtime/helpers/createClass', 'babel-runtime/helpers/possibleConstructorReturn', 'babel-runtime/helpers/inherits', '../utils.js', './Builder.js', './PropertyBuilder.js'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('babel-runtime/core-js/object/get-prototype-of'), require('babel-runtime/helpers/classCallCheck'), require('babel-runtime/helpers/createClass'), require('babel-runtime/helpers/possibleConstructorReturn'), require('babel-runtime/helpers/inherits'), require('../utils.js'), require('./Builder.js'), require('./PropertyBuilder.js'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.getPrototypeOf, global.classCallCheck, global.createClass, global.possibleConstructorReturn, global.inherits, global.utils, global.Builder, global.PropertyBuilder);
        global.TemplateBuilder = mod.exports;
    }
})(this, function (exports, _getPrototypeOf, _classCallCheck2, _createClass2, _possibleConstructorReturn2, _inherits2, _utils, _Builder2, _PropertyBuilder) {
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.TemplateBuilder = undefined;
    exports.applyTemplate = applyTemplate;

    var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

    var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

    var _createClass3 = _interopRequireDefault(_createClass2);

    var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

    var _inherits3 = _interopRequireDefault(_inherits2);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var counter = 0;
    var OLD_CONTENT_ID_ATTR_NAME = 'ceb-old-content-id';
    var CONTENT_ATTR_REG_EX = /ceb\-content/im;
    var CONTENT_NODE_REG_EX = /<content><\/content>/im;

    function hasContent(html) {
        return html.search(CONTENT_ATTR_REG_EX) !== -1 || html.search(CONTENT_NODE_REG_EX) !== -1;
    }

    function replaceContent(html, newCebContentId) {
        return html.replace('<content></content>', '<ceb-lightdom ceb-content></ceb-lightdom>').replace('ceb-content', newCebContentId);
    }

    function findContentNode(el) {
        if (!el) {
            return;
        }

        var oldCebContentId = el.getAttribute(OLD_CONTENT_ID_ATTR_NAME);

        if (oldCebContentId) {
            return findContentNode(el.querySelector('[' + oldCebContentId + ']')) || el;
        }

        return el;
    }

    function cleanOldContentNode(el) {
        var oldContentNode = el.lightDom,
            lightFrag = document.createDocumentFragment();

        while (oldContentNode.childNodes.length > 0) {
            lightFrag.appendChild(oldContentNode.removeChild(oldContentNode.childNodes[0]));
        }

        return lightFrag;
    }

    function fillNewContentNode(el, lightFrag) {
        el.lightDom.appendChild(lightFrag);
    }

    function applyTemplate(el, tpl) {
        var lightFrag = [],
            handleContentNode = hasContent(tpl);

        if (handleContentNode) {
            var newCebContentId = 'ceb-content-' + counter++;
            lightFrag = cleanOldContentNode(el);
            tpl = replaceContent(tpl, newCebContentId);
            el.setAttribute(OLD_CONTENT_ID_ATTR_NAME, newCebContentId);
        }

        el.innerHTML = tpl;

        if (handleContentNode) {
            fillNewContentNode(el, lightFrag);
        }
    }

    var TemplateBuilder = exports.TemplateBuilder = (function (_Builder) {
        (0, _inherits3.default)(TemplateBuilder, _Builder);

        /**
         * @param {!string|function(el: HTMLElement)} tpl the template as a string or a function
         */

        function TemplateBuilder(tpl) {
            (0, _classCallCheck3.default)(this, TemplateBuilder);

            /**
             * @ignore
             */

            var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(TemplateBuilder).call(this));

            _this.data = { tpl: tpl };
            return _this;
        }

        /**
         * @ignore
         */

        (0, _createClass3.default)(TemplateBuilder, [{
            key: 'build',
            value: function build(proto, on) {
                var data = this.data;

                new _PropertyBuilder.PropertyBuilder('lightDom').getter(function (el) {
                    return findContentNode(el);
                }).build(proto, on);

                on('before:createdCallback').invoke(function (el) {
                    applyTemplate(el, (0, _utils.isFunction)(data.tpl) ? data.tpl(el) : data.tpl);
                });
            }
        }]);
        return TemplateBuilder;
    })(_Builder2.Builder);
});