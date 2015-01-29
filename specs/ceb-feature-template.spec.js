describe('ceb-feature-template', function () {
    'use strict';

    var sandbox = document.createElement('div'),
        counter = 0,
        tagName, ce, clonedCe,
        tpl,
        div,
        timeout = 10;

    beforeEach(function (done) {
        div = document.body.appendChild(sandbox).appendChild(document.createElement('div'));
        tagName = 'tag-ceb-feature-template-' + (counter++);
        tpl = [
            '<button class="child" ceb-ref="button"></button>',
            '<div class="child content" ceb-content></div>',
            '<footer class="child" ceb-ref="footer"></footer>'
        ].join('');
        setTimeout(done, timeout);
    });

    describe('A created custom element having a simple template', function () {
        beforeEach(function (done) {
            ceb().name(tagName).feature(cebFeatureTemplate, {
                template: tpl
            }).register();
            div.innerHTML = '<' + tagName + '><span class="lightDOM"></span></' + tagName + '>';
            ce = div.querySelector(tagName);
            setTimeout(done, timeout);
        });
        it('should contains the templated nodes', function () {
            expect(ce.querySelector('button.child')).to.exist();
            expect(ce.querySelector('div.child.content')).to.exist();
            expect(ce.querySelector('footer.child')).to.exist();
        });
        it('should contains the initial light DOM', function () {
            expect(ce.querySelector('div.child.content > span.lightDOM')).to.exist();
        });
        it('should have the linked nodes', function () {
            expect(cebFeatureTemplate(ce).button).to.exist();
            expect(cebFeatureTemplate(ce).footer).to.exist();
        });
        describe('when the custom element is deeply cloned', function () {
            beforeEach(function (done) {
                clonedCe = ce.cloneNode(true);
                div.appendChild(clonedCe);
                setTimeout(done, timeout);
            });
            it('should contains the templated nodes', function () {
                expect(clonedCe.querySelector('button.child')).to.exist();
                expect(clonedCe.querySelector('div.child.content')).to.exist();
                expect(clonedCe.querySelector('footer.child')).to.exist();
            });
            it('should contains the initial light DOM', function () {
                expect(clonedCe.querySelector('div.child.content > span.lightDOM')).to.exist();
                expect(clonedCe.querySelector('div.child.content > span.lightDOM').children.length).to.be.eq(0);
            });
        });
    });

    describe('A created custom element having a complex template', function () {
        beforeEach(function (done) {
            ceb().name(tagName).feature(cebFeatureTemplate, {
                template: tpl
            }).register();
            div.innerHTML = '<' + tagName + '><' + tagName + ' class="lightDOM"><span class="lightDOM"></span></' + tagName + '></' + tagName + '>';
            ce = div.querySelector(tagName);
            setTimeout(done, timeout);
        });
        it('should contains the templated nodes', function () {
            expect(ce.querySelector('button.child')).to.exist();
            expect(ce.querySelector('div.child.content')).to.exist();
            expect(ce.querySelector('footer.child')).to.exist();
        });
        it('should contains the initial light DOM', function () {
            expect(ce.querySelector('div.child.content > ' + tagName + '.lightDOM')).to.exist();
        });
        it('should have the linked nodes', function () {
            expect(cebFeatureTemplate(ce).button).to.exist();
            expect(cebFeatureTemplate(ce).footer).to.exist();
        });
        describe('when the custom element is deeply cloned', function () {
            beforeEach(function (done) {
                clonedCe = ce.cloneNode(true);
                div.appendChild(clonedCe);
                setTimeout(done, timeout);
            });
            it('should contains the templated nodes', function () {
                expect(clonedCe.querySelector('button.child')).to.exist();
                expect(clonedCe.querySelector('div.child.content')).to.exist();
                expect(clonedCe.querySelector('footer.child')).to.exist();
            });
            it('should contains the initial light DOM', function () {
                expect(clonedCe.querySelector('div.child.content > ' + tagName + '.lightDOM > div.child.content > span.lightDOM')).to.exist();
            });
        });
    });

    describe('A created custom element having an empty template', function () {
        beforeEach(function (done) {
            ceb().name(tagName).feature(cebFeatureTemplate).register();
            div.innerHTML = '<' + tagName + '><span class="lightDOM"></span></' + tagName + '>';
            ce = div.querySelector(tagName);
            setTimeout(done, timeout);
        });
        it('should contains light DOM', function () {
            expect(ce.querySelector('span.lightDOM')).to.not.exist();
        });
    });

});
