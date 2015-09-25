(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', './idom.js'], factory);
    } else if (typeof exports !== 'undefined') {
        factory(exports, require('./idom.js'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.idom);
        global.idomPlugin = mod.exports;
    }
})(this, function (exports, _idomJs) {
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