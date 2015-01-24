/*jshint expr:true, strict:false*/
describe('#builtInFeatures.delegate.setup', function() {
    describe('GIVEN a sanitized struct', function() {
        var struct, builder;
        beforeEach(function() {
            builder = {
                intercept: sinon.spy()
            };
            struct = {
                properties: {
                    a1: {
                        propName: 'a1',
                        delegate: {
                            target: 'input'
                        }
                    },
                    a2: {
                        propName: 'a2'
                    }
                },
                methods: {},
                wrappers: {},
                interceptors: {},
                features: []
            };
        });
        describe('WHEN the feature is setup', function() {
            beforeEach(function() {
                ceb._testing.builtInFeatures.delegate.setup(struct, builder);
            });
            it('THEN it should intecept a1', function() {
                expect(builder.intercept.calledOnce).to.eq(true);
                expect(builder.intercept.calledWith('a1')).to.eq(true);
            });
        });
    });
});
