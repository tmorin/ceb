describe('ceb-feature-bind', function () {
    'use strict';

    function insertCeAndGet(targName) {
        var ce = document.createElement(targName);
        sandbox.appendChild(ce);
        return sandbox.querySelector(targName);
    }

    var timeout = 20,
        sandbox = document.createElement('div'),
        counter = 0,
        tagName1,
        tagName2,
        tpl1 = '',
        tpl2 = '',
        ce1,
        lis;

    beforeEach(function () {
        document.body.appendChild(sandbox);

        tagName1 = 'tag-ceb-feature-bind-1-' + (counter++);
        tagName2 = 'tag-ceb-feature-bind-2-' + (counter++);

        lis = [];
        for (var i = 0; i < 1; i++) {
            lis.push({
                code: 'code' + i,
                name: 'name' + i
            });
        }

        tpl1 += '<ul>';
        tpl1 += '<li>tag1</li>';
        tpl1 += '<ul>';
        // tpl1 += '<li bd-each-li="lis">{{li.code}}</li>';
        tpl1 += '<' + tagName2 + ' bd-each-li="lis" bd-code="li.code">';
        tpl1 += '{{li.name}}';
        tpl1 += '</' + tagName2 + '>';
        tpl1 += '</ul>';
        tpl1 += '</ul>';
        ceb().name(tagName1).properties({
            lis: {
                value: lis,
                bound: true
            }
        }).feature(cebFeatureTemplate, {
            template: tpl1
        }).feature(cebFeatureBind).register();

        tpl2 += '<li>';
        tpl2 += 'tag2 [{{code}}] [{{li.name}}] <span bd-stop ceb-content></span>';
        tpl2 += '</li>';
        ceb().name(tagName2).properties({
            code: {
                attribute: true,
                bound: true
            }
        }).feature(cebFeatureTemplate, {
            template: tpl2
        }).feature(cebFeatureBind).register();

    });

    describe('A custom element', function () {

        describe('having template', function () {
            beforeEach(function (done) {
                ce1 = insertCeAndGet(tagName1);
                setTimeout(done, timeout);
            });
            it('should be have an observer', function () {});
        });

    });

});
