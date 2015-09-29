import {compile} from './incomplate.js';

export function translate(load) {
    return compile(load.source).toString();
}

export function instantiate(load) {
    return new Function(['i', 'h'], `return (${load.source}(i, h));`);
}
