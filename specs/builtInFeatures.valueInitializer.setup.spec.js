/*jshint expr:true, strict:false*/
describe('#builtInFeatures.valueInitializer.setup', function() {
    describe('GIVEN a sanitized struct', function() {
        var struct, builder;
        beforeEach(function() {
            builder = {
                wrap: sinon.spy()
            };
            struct = {
                properties: {},
                methods: {
                    methods: {
                        createdCallback: sinon.spy(),
                        attributeChangedCallback: sinon.spy()
                    }
                },
                wrappers: {},
                interceptors: {},
                features: []
            };
        });
        describe('WHEN the feature is setup', function() {
            beforeEach(function() {
                ceb._testing.builtInFeatures.valueInitializer.setup(struct, builder);
            });
            it('THEN it should wrap createdCallback', function() {
                expect(builder.wrap.firstCall.calledWith('createdCallback')).to.eq(true);
            });
            it('THEN it should wrap attributeChangedCallback', function() {
                expect(builder.wrap.secondCall.calledWith('attributeChangedCallback')).to.eq(true);
            });
        });
    });
});
