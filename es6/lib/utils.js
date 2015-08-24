export function camelCase(value) {
    return value.split(/(?=[A-Z])/).map(part => part.charAt(0).toLowerCase() + part.slice(1)).join('-');
}

export function isFunction(i) {
    return Object.prototype.toString.call(i) === '[object Function]';
}

export function isUndefined(i) {
    return i === undefined;
}

export function isNull(i) {
    return i === null;
}

export function isString(i) {
    return Object.prototype.toString.call(i) === '[object String]';
}

export function isArray(i) {
    return Object.prototype.toString.call(i) === '[object Array]';
}

export function result(obj, prop) {
    let value = obj[prop];
    return isFunction(value) ? value() : value;
}
export function assign() {
    return Array.prototype.reduce.call(arguments, function (target, source) {
        return Object.keys(Object(source)).reduce((target, key) => {
            target[key] = source[key];
            return target;
        }, target);
    });
}
export function toArray(i) {
    return Array.prototype.slice.call(i);
}

export function flatten(array) {
    return array.reduce((a, b) => isArray(b) ? a.concat(flatten(b)) : a.concat(b), []);
}

export function invoke() {
    let args = toArray(arguments),
        objects = args.shift(),
        meth = args.shift();
    if (isArray(objects)) {
        objects.filter(obj => isFunction(obj[meth])).forEach(obj => obj[meth].apply(obj, args));
    }
}

export function partial() {
    let args = toArray(arguments),
        fn = args.shift();
    return function () {
        return fn.apply(this, args.concat(toArray(arguments)));
    };
}

export function bind(fn, ctx) {
    return function () {
        return fn.apply(ctx, toArray(arguments));
    };
}

export function noop() {
    return function () {
    };
}

export function wrap(fn, wrapper) {
    return function () {
        let args = toArray(arguments),
            next = isFunction(fn) ? fn : noop();
        return wrapper.apply(this, [bind(next, this)].concat(args));
    };
}

export function find(array, cb) {
    return array.filter(cb)[0];
}
