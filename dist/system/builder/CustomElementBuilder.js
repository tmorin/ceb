System.register(['../utils.js'], function (_export) {
    'use strict';

    var isString, isFunction, toArray, flatten, invoke, partial, bind, LIFECYCLE_CALLBACKS, LIFECYCLE_EVENTS, CustomElementBuilder;

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    function applyLifecycle(context, name) {
        var proto = context.proto,
            original = proto[name],
            beforeFns = context.events['before:' + name],
            afterFns = context.events['after:' + name],
            readyFns = context.events['ready:' + name];

        proto[name] = function () {
            var _this = this;

            var args = [this].concat(toArray(arguments));

            beforeFns.forEach(function (fn) {
                return fn.apply(_this, args);
            });

            if (isFunction(original)) {
                original.apply(this, args);
            }

            afterFns.forEach(function (fn) {
                return fn.apply(_this, args);
            });

            readyFns.forEach(function (fn) {
                return fn.apply(_this, args);
            });
        };
    }

    /**
     * The custom element builder.
     * Its goal is to provide a user friendly way to do it by some else (i.e. dedicated builders).
     */
    return {
        setters: [function (_utilsJs) {
            isString = _utilsJs.isString;
            isFunction = _utilsJs.isFunction;
            toArray = _utilsJs.toArray;
            flatten = _utilsJs.flatten;
            invoke = _utilsJs.invoke;
            partial = _utilsJs.partial;
            bind = _utilsJs.bind;
        }],
        execute: function () {
            LIFECYCLE_CALLBACKS = ['createdCallback', 'attachedCallback', 'detachedCallback', 'attributeChangedCallback'];
            LIFECYCLE_EVENTS = flatten(LIFECYCLE_CALLBACKS.map(function (name) {
                return ['before:' + name, 'after:' + name, 'ready:' + name];
            }));

            CustomElementBuilder = (function () {

                /**
                 */

                function CustomElementBuilder() {
                    _classCallCheck(this, CustomElementBuilder);

                    var proto = Object.create(HTMLElement.prototype),
                        builders = [],
                        events = LIFECYCLE_EVENTS.reduce(function (a, b) {
                        a[b] = [];
                        return a;
                    }, {
                        'before:builders': [],
                        'after:builders': [],
                        'ready:builders': [],
                        'before:registerElement': [],
                        'after:registerElement': [],
                        'ready:registerElement': []
                    });
                    /**
                     * @type {Object}
                     * @property {!Object} proto - the prototype
                     * @property {!string} extends - the name of a native element
                     * @desc the context of the builder
                     */
                    this.context = { proto: proto, builders: builders, events: events };
                }

                /**
                 * To extend a native element.
                 * @param {!string} value the name of the element
                 * @returns {CustomElementBuilder} the builder
                 */

                _createClass(CustomElementBuilder, [{
                    key: 'extends',
                    value: function _extends(value) {
                        this.context['extends'] = value;
                        return this;
                    }

                    /**
                     * To override the default prototype.
                     * @param {!Object} value the prototype
                     * @returns {CustomElementBuilder} the builder
                     */
                }, {
                    key: 'proto',
                    value: function proto(value) {
                        this.context.proto = value;
                        return this;
                    }

                    /**
                     * To apply the given builders during the build process.
                     * @param {...Builder} builders the builders
                     * @returns {CustomElementBuilder} the builder
                     */
                }, {
                    key: 'augment',
                    value: function augment() {
                        var _this2 = this;

                        for (var _len = arguments.length, builders = Array(_len), _key = 0; _key < _len; _key++) {
                            builders[_key] = arguments[_key];
                        }

                        builders.forEach(function (builder) {
                            return _this2.context.builders.push(builder);
                        });
                        return this;
                    }

                    /**
                     * To register call back on events.
                     * @param {!string} event the event name
                     * @returns {Object} the on builder.
                     * @property {function(callback: function)} invoke - to register the callback
                     */
                }, {
                    key: 'on',
                    value: function on(event) {
                        var _this3 = this;

                        var invoke = function invoke(cb) {
                            _this3.context.events[event].push(cb);
                            return _this3;
                        };
                        return { invoke: invoke };
                    }

                    /**
                     * To register the custom element.
                     * @param {!string} name the name of the cutsom element
                     * @returns {Element} the custom element Type
                     */
                }, {
                    key: 'register',
                    value: function register(name) {
                        var _this4 = this;

                        this.context.events['before:builders'].forEach(function (fn) {
                            return fn(_this4.context);
                        });

                        invoke(this.context.builders, 'build', this.context.proto, bind(this.on, this));

                        this.context.events['after:builders'].forEach(function (fn) {
                            return fn(_this4.context);
                        });

                        LIFECYCLE_CALLBACKS.forEach(partial(applyLifecycle, this.context));

                        var options = { prototype: this.context.proto };

                        if (isString(this.context['extends'])) {
                            options['extends'] = this.context['extends'];
                        }

                        this.context.events['before:registerElement'].forEach(function (fn) {
                            return fn(_this4.context);
                        });

                        var CustomElement = document.registerElement(name, options);

                        this.context.events['after:registerElement'].forEach(function (fn) {
                            return fn(CustomElement);
                        });

                        this.context.events['ready:registerElement'].forEach(function (fn) {
                            return fn(CustomElement);
                        });

                        return CustomElement;
                    }
                }]);

                return CustomElementBuilder;
            })();

            _export('CustomElementBuilder', CustomElementBuilder);
        }
    };
});