describe('ceb-feature-template', function () {
    'use strict';

    var sandbox = document.createElement('div'),
        counter = 0,
        tagName1, tagName2, tagName3, ce, clonedCe,
        tpl,
        div,
        timeout = 0;

    beforeEach(function (done) {
        div = document.body.appendChild(sandbox).appendChild(document.createElement('div'));
        tagName1 = 'tag-ceb-feature-template-1-' + (counter++);
        tagName2 = 'tag-ceb-feature-template-2-' + (counter++);
        tagName3 = 'tag-ceb-feature-template-3-' + (counter++);
        tpl = [
            '<button class="child" ceb-ref="button"></button>',
            '<div class="child content" ceb-content></div>',
            '<footer class="child" ceb-ref="footer"></footer>'
        ].join('');
        setTimeout(done, timeout);
    });

    describe('A created custom element having a simple template', function () {
        beforeEach(function (done) {
            ceb().name(tagName1).feature(cebFeatureTemplate, {
                template: tpl
            }).register();
            div.innerHTML = '<' + tagName1 + '><span class="lightDOM"></span></' + tagName1 + '>';
            ce = div.querySelector(tagName1);
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
            ceb().name(tagName1).feature(cebFeatureTemplate, {
                template: '<ul class="tag1"> <li>tag1</li> <li class="content">content <' + tagName2 + ' ceb-content class="tag1"></' + tagName2 + '> </li> </ul>'
            }).register();

            ceb().name(tagName2).feature(cebFeatureTemplate, {
                template: '<ul class="tag2"> <li>tag2</li> <li class="content">content <div ceb-content  class="tag2"></div> </li> </ul>'
            }).register();

            ceb().name(tagName3).feature(cebFeatureTemplate, {
                template: '<ul class="tag3"> <li>tag3</li> <li class="content">content <div ceb-content  class="tag3"></div> </li> </ul>'
            }).register();

            div.innerHTML = '<' + tagName1 + '><' + tagName3 + '><span class="lightDOM">embedded</span></' + tagName3 + '></' + tagName1 + '>';
            ce = div.querySelector(tagName1);
            setTimeout(done, timeout);
        });
        it('should contains the templated nodes', function () {
            expect(ce.querySelector('ul.tag1 > li.content >' + tagName2 + ' > ul.tag2 > li.content > div')).to.exist();
        });
        it('should contains the initial light DOM', function () {
            expect(ce.querySelector('ul.tag1 > li.content >' + tagName2 + ' > ul.tag2 > li.content > div > ' + tagName3 + ' > ul.tag3 > li.content > div > .lightDOM')).to.exist();
        });
        describe('when the custom element is deeply cloned', function () {
            beforeEach(function (done) {
                clonedCe = ce.cloneNode(true);
                div.appendChild(clonedCe);
                setTimeout(done, timeout);
            });
            it('should contains the templated nodes', function () {
                expect(clonedCe.querySelector('ul.tag1 > li.content > ' + tagName2 + ' > ul.tag2 > li.content > div')).to.exist();
            });
            it('should contains the initial light DOM', function () {
                expect(clonedCe.querySelector('ul.tag1 > li.content > ' + tagName2 + ' > ul.tag2 > li.content > div >' + tagName3 + ' > ul.tag3 > li.content > div > .lightDOM')).to.exist();
            });
        });
    });

    describe('A created custom element having an empty template', function () {
        beforeEach(function (done) {
            ceb().name(tagName1).feature(cebFeatureTemplate).register();
            div.innerHTML = '<' + tagName1 + '><span class="lightDOM"></span></' + tagName1 + '>';
            ce = div.querySelector(tagName1);
            setTimeout(done, timeout);
        });
        it('should contains light DOM', function () {
            expect(ce.querySelector('span.lightDOM')).to.not.exist();
        });
    });

});
