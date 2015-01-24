/*globals console:false */
(function(g) {

    'use strict';

    g.demoFeature = function demoFeature(el) {
        console.log('demoFeature', el.tagName);
    };
    g.demoFeature.setup = function setup(struct, builder) {
        builder.wrap('createdCallback', function(next, el) {
            console.log(el.tagName, 'createdCallback - wrapper - before');
            var r = next();
            console.log(el.tagName, 'createdCallback - wrapper - after', r);
            return r;
        });
        builder.methods({
            demoMethod: function(el, arg1, arg2) {
                console.log('demoMethod', el.tagName, arg1, arg2);
            }
        });
        builder.properties({
            demoAccessor: {
                attribute: true
            }
        });

    };
}(this));

(function(g) {

    'use strict';

    // RC-ACTION-BUTTON
    var properties = {
        label: {
            attribute: true,
            delegate: {
                target: 'button',
                property: 'textContent'
            }
        },
        disabled: {
            attribute: {
                boolean: true
            },
            delegate: {
                target: 'button'
            },
            value: false
        },
        number1: {
            attribute: true,
            delegate: {
                target: 'button'
            },
            value: 2
        },
        prop1: {
            value: 1,
            set: function(el, val) {
                el._prop1 = val;
                console.log(this.tagName, 'prop1', 'set', val);
            },
            get: function(el) {
                console.log(this.tagName, 'prop1', 'get', el._prop1);
                return el._prop1;
            }
        },
        prop2: {
            value: 'value2',
            writable: false
        }
    };

    var methods = {
        createdCallback: function demoCreatedCallback(el) {
            console.log('demoCreatedCallback');
            el.innerHTML = '<button type="button"></button>';
        },
        execute: function(el, arg1, arg2, arg3) {
            console.log(el.tagName, 'execute', arg1, arg2, arg3);
            return arg1 + arg2 + arg3;
        }
    };

    var builder = ceb().start('rc-action-button');

    builder.feature(g.demoFeature, {
        key1: 'demo feature option'
    }, 1);

    builder.properties(properties).methods(methods);

    builder.intercept('prop1', function(next, el, value) {
        console.log(el.tagName, 'prop1 1 - interceptor - before', value);
        next(value + 1);
        console.log(el.tagName, 'prop1 1 - interceptor - after');
    }, function(next, el) {
        console.log(el.tagName, 'prop1 1 - interceptor - before');
        var r = next() - 1;
        console.log(el.tagName, 'prop1 1 - interceptor - after', r);
        return r;
    }, 1);

    builder.intercept('prop1', function(next, el, value) {
        console.log(el.tagName, 'prop1 2 - interceptor - before', value);
        next(value + 1);
        console.log(el.tagName, 'prop1 2 - interceptor - after');
    }, function(next, el) {
        console.log(el.tagName, 'prop1 2 - interceptor - before');
        var r = next() - 1;
        console.log(el.tagName, 'prop1 2 - interceptor - after', r);
        return r;
    }, 2);

    builder.wrap('execute', function(next, el, arg1, arg2, arg3) {
        console.log(el.tagName, 'execute1 - wrapper - before', arg1, arg2, arg3);
        var r = next(arguments);
        console.log(el.tagName, 'execute1 - wrapper - after', r);
        return r;
    });

    builder.wrap('execute', function(next, el, arg1, arg2, arg3) {
        console.log(el.tagName, 'execute2 - wrapper - before', arg1, arg2, arg3);
        var r = next(arguments) * 2;
        console.log(el.tagName, 'execute2 - wrapper - after', r);
        return r;
    });

    g.MyElement = builder.register();

}(this));
