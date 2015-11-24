'use strict';

System.register(['babel-runtime/core-js/object/get-prototype-of', 'babel-runtime/helpers/classCallCheck', 'babel-runtime/helpers/createClass', 'babel-runtime/helpers/possibleConstructorReturn', 'babel-runtime/helpers/inherits', '../utils.js', './Builder.js', './PropertyBuilder.js'], function (_export) {
    var _Object$getPrototypeOf, _classCallCheck, _createClass, _possibleConstructorReturn, _inherits, isFunction, Builder, PropertyBuilder, counter, OLD_CONTENT_ID_ATTR_NAME, CONTENT_ATTR_REG_EX, CONTENT_NODE_REG_EX, TemplateBuilder;

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
        setters: [function (_babelRuntimeCoreJsObjectGetPrototypeOf) {
            _Object$getPrototypeOf = _babelRuntimeCoreJsObjectGetPrototypeOf.default;
        }, function (_babelRuntimeHelpersClassCallCheck) {
            _classCallCheck = _babelRuntimeHelpersClassCallCheck.default;
        }, function (_babelRuntimeHelpersCreateClass) {
            _createClass = _babelRuntimeHelpersCreateClass.default;
        }, function (_babelRuntimeHelpersPossibleConstructorReturn) {
            _possibleConstructorReturn = _babelRuntimeHelpersPossibleConstructorReturn.default;
        }, function (_babelRuntimeHelpersInherits) {
            _inherits = _babelRuntimeHelpersInherits.default;
        }, function (_utilsJs) {
            isFunction = _utilsJs.isFunction;
        }, function (_BuilderJs) {
            Builder = _BuilderJs.Builder;
        }, function (_PropertyBuilderJs) {
            PropertyBuilder = _PropertyBuilderJs.PropertyBuilder;
        }],
        execute: function () {
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

                    var _this = _possibleConstructorReturn(this, _Object$getPrototypeOf(TemplateBuilder).call(this));

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