System.register(['./idom.js'], function (_export) {
    'use strict';

    var compile, IncrementalDOM;

    _export('translate', translate);

    _export('instantiate', instantiate);

    function translate(load) {
        return compile(load.source).toString();
    }

    function instantiate(load) {
        var factory = new Function(['i'], 'return (' + load.source + '(i));');
        return factory(IncrementalDOM);
    }

    return {
        setters: [function (_idomJs) {
            compile = _idomJs.compile;
            IncrementalDOM = _idomJs.IncrementalDOM;
        }],
        execute: function () {}
    };
});