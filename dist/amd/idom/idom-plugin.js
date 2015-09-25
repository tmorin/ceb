define(['exports', './idom.js'], function (exports, _idomJs) {
    'use strict';

    Object.defineProperty(exports, '__esModule', {
        value: true
    });
    exports.translate = translate;
    exports.instantiate = instantiate;

    function translate(load) {
        return (0, _idomJs.compile)(load.source).toString();
    }

    function instantiate(load) {
        var factory = new Function(['i'], 'return (' + load.source + '(i));');
        return factory(_idomJs.IncrementalDOM);
    }
});