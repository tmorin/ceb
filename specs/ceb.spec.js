/*jshint expr:true, strict:false*/
describe('#ceb', function() {
    describe('GIVEN a tagname', function() {
        var tagName;
        beforeEach(function() {
            tagName = 'a-tag-name';
        });
        describe('WHEN ceb is called', function() {
            var builder;
            beforeEach(function() {
                builder = ceb().start(tagName);
            });
            it('THEN the builder should be created', function() {
                expect(builder).to.be.exist;
            });
        });
    });
});
