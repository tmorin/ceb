'use strict';

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

System.register(['../utils.js', './Builder.js', './PropertyBuilder.js'], function (_export) {
    var isFunction, Builder, PropertyBuilder, _createClass, counter, OLD_CONTENT_ID_ATTR_NAME, CONTENT_ATTR_REG_EX, CONTENT_NODE_REG_EX, TemplateBuilder;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

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

    return {
        setters: [function (_utilsJs) {
            isFunction = _utilsJs.isFunction;
        }, function (_BuilderJs) {
            Builder = _BuilderJs.Builder;
        }, function (_PropertyBuilderJs) {
            PropertyBuilder = _PropertyBuilderJs.PropertyBuilder;
        }],
        execute: function () {
            _createClass = (function () {
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

            counter = 0;
            OLD_CONTENT_ID_ATTR_NAME = 'ceb-old-content-id';
            CONTENT_ATTR_REG_EX = /ceb\-content/im;
            CONTENT_NODE_REG_EX = /<content><\/content>/im;

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

            _export('applyTemplate', applyTemplate);

            _export('TemplateBuilder', TemplateBuilder = (function (_Builder) {
                _inherits(TemplateBuilder, _Builder);

                function TemplateBuilder(tpl) {
                    _classCallCheck(this, TemplateBuilder);

                    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(TemplateBuilder).call(this));

                    _this.data = {
                        tpl: tpl
                    };
                    return _this;
                }

                _createClass(TemplateBuilder, [{
                    key: 'build',
                    value: function build(proto, on) {
                        var data = this.data;
                        new PropertyBuilder('lightDom').getter(function (el) {
                            return findContentNode(el);
                        }).build(proto, on);
                        on('before:createdCallback').invoke(function (el) {
                            applyTemplate(el, isFunction(data.tpl) ? data.tpl(el) : data.tpl);
                        });
                    }
                }]);

                return TemplateBuilder;
            })(Builder));

            _export('TemplateBuilder', TemplateBuilder);
        }
    };
});