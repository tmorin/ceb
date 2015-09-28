System.register(['./incomplate.js'], function (_export) {
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
        setters: [function (_incomplateJs) {
            compile = _incomplateJs.compile;
            IncrementalDOM = _incomplateJs.IncrementalDOM;
        }],
        execute: function () {}
    };
});