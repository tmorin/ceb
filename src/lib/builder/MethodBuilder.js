import isFunction from 'lodash/lang/isFunction';
import toArray from 'lodash/lang/toArray';

import noop from 'lodash/utility/noop';

import wrap from 'lodash/function/wrap';

export class MethodBuilder {

    constructor(methName) {
        this.data = {methName, invoke: noop, wrappers: []};
    }

    invoke(fn) {
        if (isFunction(fn)) {
            this.data.invoke = fn;
        }
        return this;
    }

    wrap() {
        this.data.wrappers = this.data.wrappers.concat(toArray(arguments));
        return this;
    }

    build(proto, on) {
        var data = this.data;

        proto[data.methName] = function () {
            data.invoke.apply(this, [this].concat(toArray(arguments)));
        };

        on('after:builders').invoke(proto => {
            data.wrappers.forEach(wrapper => {
                data.invoke = wrap(data.invoke, wrapper);
            });
        });
    }
}

export default function (methName) {
    return new MethodBuilder(methName);
}
