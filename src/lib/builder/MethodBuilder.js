import isFunction from 'lodash/lang/isFunction';
import toArray from 'lodash/lang/toArray';

import noop from 'lodash/utility/noop';

import partial from 'lodash/function/partial';
import flow from 'lodash/function/flow';

import property from './PropertyBuilder';

class MethodBuilder {

    constructor(name) {
        this.data = {name, invoke: noop, wrappers: []};
    }

    invoke(fn) {
        if (isFunction(fn)) {
            this.data.invoke = fn;
        }
        return this;
    }

    wrap(fn) {
        this.wrappers.push(fn);
        return this;
    }

    build(proto, on) {

        property(this.data.name).hidden().value(function () {
            this.data.invoke.apply(this, toArray(arguments));
        }).build(proto, on);

        on('after:build').invoke(proto => {
            /*var args = [this].concat(toArray(arguments));
            var fn = this[this.data.propName];

            this.data.wrappers.forEach(wrapper => {
                fn = flow(fn, wrapper);
            });

            proto[this.data.name] = function () {};*/
        });
    }
}

export function method(name) {
    return new MethodBuilder(name);
}

export default MethodBuilder;
