'use strict';

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

define(['exports', '../utils.js', './Builder.js', './PropertyBuilder.js'], function (exports, _utils, _Builder2, _PropertyBuilder) {
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.TemplateBuilder = undefined;
    exports.applyTemplate = applyTemplate;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = (function () {
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
    })();

    function _possibleConstructorReturn(self, call) {
        if (!self) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return call && ((typeof call === 'undefined' ? 'undefined' : _typeof(call)) === "object" || typeof call === "function") ? call : self;
    }

    function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
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
        _inherits(TemplateBuilder, _Builder);

        /**
         * @param {!string|function(el: HTMLElement)} tpl the template as a string or a function
         */

        function TemplateBuilder(tpl) {
            _classCallCheck(this, TemplateBuilder);

            /**
             * @ignore
             */

            var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(TemplateBuilder).call(this));

            _this.data = { tpl: tpl };
            return _this;
        }

        /**
         * @ignore
         */

        _createClass(TemplateBuilder, [{
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