import {compile, IncrementalDOM} from './idom.js';

export function translate(load) {
    return compile(load.source).toString();
}

export function instantiate(load) {
    let factory = new Function(['i'], `return (${load.source}(i));`);
    return factory(IncrementalDOM);
}
