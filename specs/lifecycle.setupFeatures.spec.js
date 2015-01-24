/*jshint expr:true, strict:false*/
describe('#setupFeatures', function() {
    describe('GIVEN a sanitized structure struct', function() {
        var struct;
        beforeEach(function() {
            struct = {
                features: []
            };
        });
        describe('AND a feature f1 with a setup function AND a feature f2 without a setup function', function() {
            var f1, f2;
            beforeEach(function() {
                f1 = {
                    fn: sinon.spy(),
                    options: {}
                };
                f1.fn.setup = sinon.spy();
                f2 = {
                    fn: sinon.spy()
                };
                struct.features = [f1, f2];
            });
            describe('WHEN the features are setupped', function() {
                beforeEach(function() {
                    ceb._testing.setupFeatures(struct);
                });
                it('THEN f1 setup method is called', function() {
                    expect(f1.fn.setup.getCall(0).args[0]).to.eq(struct);
                    expect(f1.fn.setup.getCall(0).args[1]).to.be.an.instanceof(Object);
                    expect(f1.fn.setup.getCall(0).args[2]).to.equal(f1.options);
                });
            });
        });
    });
});
