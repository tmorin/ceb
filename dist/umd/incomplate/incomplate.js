(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', 'htmlparser2', './../utils.js'], factory);
    } else if (typeof exports !== 'undefined') {
        factory(exports, require('htmlparser2'), require('./../utils.js'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.htmlparser2, global.utils);
        global.incomplate = mod.exports;
    }
})(this, function (exports, _htmlparser2, _utilsJs) {
    'use strict';

    Object.defineProperty(exports, '__esModule', {
        value: true
    });

    var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

    exports.evaluate = evaluate;
    exports.varArgsToJs = varArgsToJs;
    exports.staticsToJs = staticsToJs;
    exports.compile = compile;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _htmlparser22 = _interopRequireDefault(_htmlparser2);

    var OPTIONS = {
        pretty: true,
        evaluation: /\{\{([\s\S]+?)}}/gm,
        attributeKey: 'tpl-key',
        attributePlaceholder: 'tpl-placeholder',
        varDataName: 'data',
        varHelpersName: 'helpers',
        elements: {
            'tpl-logger': {
                onopentag: function onopentag(name, attrs, key, statics, varArgs, options) {
                    var level = statics.level || varArgs.level || 'log',
                        content = statics.content || varArgs.content || '';
                    return 'console.' + level + '(' + content + ');';
                }
            },
            'tpl-each': {
                onopentag: function onopentag(name, attrs, key, statics, varArgs, options) {
                    var itemsName = statics.items || varArgs.items || '\'items\'',
                        itemName = statics.item || varArgs.item || '\'item\'',
                        indexName = statics.index || varArgs.index || 'index';
                    return '(' + itemsName + ' || []).forEach(function (' + itemName + ', ' + indexName + ') {';
                },
                onclosetag: function onclosetag(name, attrs, statics, varArgs, options) {
                    return '});';
                }
            },
            'tpl-text': {
                onopentag: function onopentag(name, attrs, key, statics, varArgs, options) {
                    return 't(' + (statics.value || varArgs.value) + ');';
                }
            },
            'tpl-call': {
                onopentag: function onopentag(name, attrs, key, statics, varArgs, options) {
                    var helperName = statics.name || varArgs.name;
                    return options.varHelpersName + '.' + helperName + '(' + options.varDataName + ');';
                }
            }
        },
        // http://www.w3.org/TR/html5/syntax.html#void-elements
        selfClosingElements: ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr']
    };

    exports.OPTIONS = OPTIONS;
    function stringify() {
        var value = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

        return value.replace(/'/gim, '\\\'').replace(/\n/gi, '\\n');
    }

    function isSelfClosing() {
        var name = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
        var options = arguments.length <= 1 || arguments[1] === undefined ? OPTIONS : arguments[1];

        return options.selfClosingElements.indexOf(name) > -1;
    }

    function getFunctionName() {
        var name = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
        var placeholder = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
        var options = arguments.length <= 2 || arguments[2] === undefined ? OPTIONS : arguments[2];

        return placeholder ? 'ph' : isSelfClosing(name, options) ? 'v' : 'o';
    }

    function append() {
        var body = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
        var line = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];
        var options = arguments.length <= 2 || arguments[2] === undefined ? OPTIONS : arguments[2];

        return body + (options.pretty ? '\n' : '') + line;
    }

    var stringEvaluator = {
        appender: ' + ',
        toText: function toText(text) {
            return '\'' + stringify(text) + '\'';
        },
        toJs: function toJs(clause) {
            return '(' + clause + ')';
        }
    };

    var inlineEvaluator = {
        appender: ' ',
        toText: function toText(text) {
            return 't(\'' + stringify(text) + '\');';
        },
        toJs: function toJs(clause) {
            return '' + clause;
        }
    };

    /**
     * Evaluate the string to return a JavaScript compliant syntax.
     * @param {!string} value the value
     * @param {*} options the options
     * @param {*} conf the evaluator's configuration
     * @returns {string} the JavaScript compliant syntax
     */

    function evaluate() {
        var value = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
        var options = arguments.length <= 1 || arguments[1] === undefined ? OPTIONS : arguments[1];
        var conf = arguments.length <= 2 || arguments[2] === undefined ? stringEvaluator : arguments[2];

        var js = [];
        var result = undefined;
        var lastIndex = 0;
        while ((result = options.evaluation.exec(value)) !== null) {
            var full = result[0];
            var group = result[1];
            var index = result.index;
            var before = value.substring(lastIndex, index);
            if (before) {
                js.push(conf.toText(before));
            }
            js.push(conf.toJs(group));
            lastIndex = index + full.length;
        }
        var after = value.substring(lastIndex, value.length);
        if (after) {
            js.push(conf.toText(after));
        }
        return js.join(conf.appender);
    }

    function parseAttributes() {
        var attrs = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
        var options = arguments.length <= 1 || arguments[1] === undefined ? OPTIONS : arguments[1];

        var statics = {},
            varArgs = {},
            key = undefined,
            placeholder = attrs[options.attributePlaceholder] !== null && attrs[options.attributePlaceholder] !== undefined;
        Object.keys(attrs).filter(function (key) {
            return [options.attributePlaceholder].indexOf(key) < 0;
        }).forEach(function (key) {
            var value = attrs[key];
            if (value.search(options.evaluation) > -1) {
                varArgs[key] = evaluate(value, options);
            } else {
                statics[key] = value;
            }
        });
        key = statics[options.attributeKey] || varArgs[options.attributeKey];
        delete statics[options.attributeKey];
        delete varArgs[options.attributeKey];
        return [statics, varArgs, key, placeholder];
    }

    /**
     * Helper to transform a map of variables attributes into a JavaScript compliant syntax.
     * @param {*} varArgs the variables arguments
     * @returns {string} the JavaScript
     */

    function varArgsToJs() {
        var varArgs = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        var keys = Object.keys(varArgs);
        return keys.length > 0 ? keys.map(function (key) {
            return '\'' + key + '\', ' + varArgs[key];
        }).join(', ') : 'null';
    }

    /**
     * Helper to transform a map of statics attributes into a JavaScript compliant syntax.
     * @param {*} statics the statics
     * @returns {string} the JavaScript
     */

    function staticsToJs() {
        var statics = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        var keys = Object.keys(statics);
        return keys.length > 0 ? '[' + keys.map(function (key) {
            return '\'' + key + '\', \'' + stringify(statics[key]) + '\'';
        }).join(', ') + ']' : 'null';
    }

    /**
     * Compile the given HTML template into a function factory.
     *
     * If the incrementalDOM argument is provided, this function will return a render function.
     * The render function is used with IncrementalDOM.patch.
     *
     * If the incrementalDOM argument is not provided, this function will return a factory function.
     * The factory function requires the IncrementalDOM library as argument and return the render function..
     *
     * Basically, when the template is compiled at build time, the IncrementalDOM should not be given.
     * When the template is compiled at runtime, the IncrementalDOM should be given.
     *
     * @param {!string} html the template
     * @param {Object} [options] the options
     * @returns {function(i: !IncrementalDOM, h: *)} the function factory
     */

    function compile() {
        var html = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
        var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        options = (0, _utilsJs.assign)({}, OPTIONS, options);

        var fnBody = '';
        var skipClosing = undefined;
        var parser = new _htmlparser22['default'].Parser({
            onopentag: function onopentag(name, attrs) {
                var _parseAttributes = parseAttributes(attrs, options);

                var _parseAttributes2 = _slicedToArray(_parseAttributes, 4);

                var statics = _parseAttributes2[0];
                var varArgs = _parseAttributes2[1];
                var key = _parseAttributes2[2];
                var placeholder = _parseAttributes2[3];

                skipClosing = placeholder;
                if (options.elements[name]) {
                    var element = options.elements[name];
                    if (typeof element.onopentag === 'function') {
                        fnBody = append(fnBody, element.onopentag(name, attrs, key, statics, varArgs, options), options);
                    }
                } else {
                    var fn = getFunctionName(name, placeholder, options);
                    fnBody = append(fnBody, fn + '(\'' + name + '\', ' + (key ? '' + key : 'null') + ', ' + staticsToJs(statics) + ', ' + varArgsToJs(varArgs) + ');', options);
                }
            },
            onclosetag: function onclosetag(name) {
                if (options.elements[name]) {
                    var element = options.elements[name];
                    if (typeof element.onclosetag === 'function') {
                        fnBody = append(fnBody, element.onclosetag(name, options), options);
                    }
                } else if (!isSelfClosing(name, options) && !skipClosing) {
                    fnBody = append(fnBody, 'c(\'' + name + '\');', options);
                }
                skipClosing = false;
            },
            ontext: function ontext(text) {
                if (text.search(options.evaluation) > -1) {
                    fnBody = append(fnBody, evaluate(text, options, inlineEvaluator) + ';', options);
                } else {
                    fnBody = append(fnBody, 't(\'' + stringify(text) + '\');', options);
                }
            }
        }, {
            xmlMode: false,
            decodeEntities: true,
            lowerCaseTags: false,
            lowerCaseAttributeNames: false,
            recognizeSelfClosing: true
        });

        parser.parseComplete(html);

        var fnWrapper = '\n        var o = i.elementOpen,\n            c = i.elementClose,\n            v = i.elementVoid,\n            t = i.text,\n            ph = i.elementPlaceholder;\n        return function (_data_) {\n            var ' + (options.varHelpersName || 'helpers') + ' = h || {},\n                ' + (options.varDataName || 'data') + ' = _data_ || {};\n            ' + fnBody + '\n        };\n    ';
        var factory = new Function(['i', 'h'], fnWrapper);

        return factory;
    }
});