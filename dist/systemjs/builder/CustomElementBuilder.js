'use strict';

System.register(['babel-runtime/core-js/object/create', 'babel-runtime/helpers/classCallCheck', 'babel-runtime/helpers/createClass', '../utils.js'], function (_export) {
    var _Object$create, _classCallCheck, _createClass, isString, isFunction, toArray, flatten, invoke, partial, bind, LIFECYCLE_CALLBACKS, LIFECYCLE_EVENTS, CustomElementBuilder;

    function applyLifecycle(context, name) {
        var proto = context.proto,
            original = proto[name],
            beforeFns = context.events['before:' + name],
            afterFns = context.events['after:' + name];

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
        };
    }

    return {
        setters: [function (_babelRuntimeCoreJsObjectCreate) {
            _Object$create = _babelRuntimeCoreJsObjectCreate.default;
        }, function (_babelRuntimeHelpersClassCallCheck) {
            _classCallCheck = _babelRuntimeHelpersClassCallCheck.default;
        }, function (_babelRuntimeHelpersCreateClass) {
            _createClass = _babelRuntimeHelpersCreateClass.default;
        }, function (_utilsJs) {
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
                return ['before:' + name, 'after:' + name];
            }));

            _export('CustomElementBuilder', CustomElementBuilder = (function () {
                function CustomElementBuilder() {
                    _classCallCheck(this, CustomElementBuilder);

                    var proto = _Object$create(HTMLElement.prototype),
                        builders = [],
                        events = LIFECYCLE_EVENTS.reduce(function (a, b) {
                        a[b] = [];
                        return a;
                    }, {
                        'before:builders': [],
                        'after:builders': [],
                        'before:registerElement': [],
                        'after:registerElement': []
                    });

                    this.context = {
                        proto: proto,
                        builders: builders,
                        events: events
                    };
                }

                _createClass(CustomElementBuilder, [{
                    key: 'extend',
                    value: function extend(value) {
                        this.context.extend = value;
                        return this;
                    }
                }, {
                    key: 'proto',
                    value: function proto(value) {
                        this.context.proto = value;
                        return this;
                    }
                }, {
                    key: 'builders',
                    value: function builders() {
                        var _this2 = this;

                        for (var _len = arguments.length, _builders = Array(_len), _key = 0; _key < _len; _key++) {
                            _builders[_key] = arguments[_key];
                        }

                        _builders.forEach(function (builder) {
                            return _this2.context.builders.push(builder);
                        });

                        return this;
                    }
                }, {
                    key: 'on',
                    value: function on(event) {
                        var _this3 = this;

                        var invoke = function invoke(cb) {
                            _this3.context.events[event].push(cb);

                            return _this3;
                        };

                        return {
                            invoke: invoke
                        };
                    }
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
                        var options = {
                            prototype: this.context.proto
                        };

                        if (isString(this.context.extend)) {
                            options.extends = this.context.extend;
                        }

                        this.context.events['before:registerElement'].forEach(function (fn) {
                            return fn(_this4.context);
                        });
                        var CustomElement = document.registerElement(name, options);
                        this.context.events['after:registerElement'].forEach(function (fn) {
                            return fn(CustomElement);
                        });
                        return CustomElement;
                    }
                }]);

                return CustomElementBuilder;
            })());

            _export('CustomElementBuilder', CustomElementBuilder);
        }
    };
});