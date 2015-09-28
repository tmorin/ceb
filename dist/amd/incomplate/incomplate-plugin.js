define(['exports', './incomplate.js'], function (exports, _incomplateJs) {
    'use strict';

    Object.defineProperty(exports, '__esModule', {
        value: true
    });
    exports.translate = translate;
    exports.instantiate = instantiate;

    function translate(load) {
        return (0, _incomplateJs.compile)(load.source).toString();
    }

    function instantiate(load) {
        var factory = new Function(['i'], 'return (' + load.source + '(i));');
        return factory(_incomplateJs.IncrementalDOM);
    }
});