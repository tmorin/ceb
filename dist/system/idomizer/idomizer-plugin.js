System.register(['./idomizer.js'], function (_export) {
    'use strict';

    var compile;

    _export('translate', translate);

    _export('instantiate', instantiate);

    function translate(load) {
        return compile(load.source).toString();
    }

    function instantiate(load) {
        return new Function(['i', 'h'], 'return (' + load.source + '(i, h));');
    }

    return {
        setters: [function (_idomizerJs) {
            compile = _idomizerJs.compile;
        }],
        execute: function () {}
    };
});