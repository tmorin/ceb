define([
    'handlebarjs',
    '../dist/amd/ceb'
], function (handlebarjs, ceb) {
    var Builder = ceb.Builder;
    var method = ceb.method;
    var template = ceb.template;

    var render = function (el) {
        el._handlea
        return handlebarjs(tpl, el);
    };

    function HandlebarBuilder(tpl) {
        this.build = function () {
        };
    }

    HandlebarBuilder.prototype = Object.create(Builder.prototype);
    HandlebarBuilder.constructor = HandlebarBuilder;

    return function (tpl) {
        return new HandlebarBuilder(tpl);
    };
});
