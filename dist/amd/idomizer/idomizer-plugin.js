define(['exports', './idomizer.js'], function (exports, _idomizerJs) {
    'use strict';

    Object.defineProperty(exports, '__esModule', {
        value: true
    });
    exports.translate = translate;
    exports.instantiate = instantiate;

    function translate(load) {
        return (0, _idomizerJs.compile)(load.source).toString();
    }

    function instantiate(load) {
        return new Function(['i', 'h'], 'return (' + load.source + '(i, h));');
    }
});