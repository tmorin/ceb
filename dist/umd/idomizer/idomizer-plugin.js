(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', './idomizer.js'], factory);
    } else if (typeof exports !== 'undefined') {
        factory(exports, require('./idomizer.js'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.idomizer);
        global.idomizerPlugin = mod.exports;
    }
})(this, function (exports, _idomizerJs) {
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