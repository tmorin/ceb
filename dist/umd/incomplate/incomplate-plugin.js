(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', './incomplate.js'], factory);
    } else if (typeof exports !== 'undefined') {
        factory(exports, require('./incomplate.js'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.incomplate);
        global.incomplatePlugin = mod.exports;
    }
})(this, function (exports, _incomplateJs) {
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