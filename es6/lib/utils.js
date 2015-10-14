/**
 * @ignore
 */
export function camelCase(value) {
    return value.toLowerCase().split('-').map((part, index) => index ? part.charAt(0).toUpperCase() + part.slice(1) : part).join('');
}

/**
 * @ignore
 */
export function isFunction(i) {
    return Object.prototype.toString.call(i) === '[object Function]';
}

/**
 * @ignore
 */
export function isUndefined(i) {
    return i === undefined;
}

/**
 * @ignore
 */
export function isNull(i) {
    return i === null;
}

/**
 * @ignore
 */
export function isString(i) {
    return Object.prototype.toString.call(i) === '[object String]';
}

/**
 * @ignore
 */
export function isArray(i) {
    return Object.prototype.toString.call(i) === '[object Array]';
}

/**
 * @ignore
 */
export function result(obj, prop) {
    let value = obj[prop];
    return isFunction(value) ? value() : value;
}

/**
 * @ignore
 */
export function assign() {
    return Array.prototype.reduce.call(arguments, function (target, source) {
        return Object.keys(Object(source)).reduce((target, key) => {
            target[key] = source[key];
            return target;
        }, target);
    });
}

/**
 * @ignore
 */
export function toArray(i) {
    return Array.prototype.slice.call(i);
}

/**
 * @ignore
 */
export function flatten(array) {
    return array.reduce((a, b) => isArray(b) ? a.concat(flatten(b)) : a.concat(b), []);
}

/**
 * @ignore
 */
export function invoke() {
    let args = toArray(arguments),
        objects = args.shift(),
        meth = args.shift();
    if (isArray(objects)) {
        objects.filter(obj => isFunction(obj[meth])).forEach(obj => obj[meth].apply(obj, args));
    }
}

/**
 * @ignore
 */
export function partial() {
    let args = toArray(arguments),
        fn = args.shift();
    return function () {
        return fn.apply(this, args.concat(toArray(arguments)));
    };
}

/**
 * @ignore
 */
export function bind(fn, ctx) {
    return function () {
        return fn.apply(ctx, toArray(arguments));
    };
}

/**
 * @ignore
 */
export function noop() {
    return function () {
    };
}

/**
 * @ignore
 */
export function wrap(fn, wrapper) {
    return partial(wrapper, fn);
}

/**
 * @ignore
 */
export function find(array, cb) {
    return array.filter(cb)[0];
}

/**
 * @ignore
 */
export function trigger(el, event, params) {
    var evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(event, params.bubbles, params.cancellable, params.detail);
    return el.dispatchEvent(evt);
}
