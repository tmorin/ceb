/*jshint expr:true, strict:false*/
describe('#builtInFeatures.valueInitializer.createdCallbackWrapper', function() {
    describe('GIVEN a sanitized struct', function() {
        var next, el, struct, defaultValue;
        beforeEach(function() {
            defaultValue = 'value1';
            next = sinon.spy();
            el = {
                hasAttribute: sinon.stub(),
                setAttribute: sinon.stub(),
                removeAttribute: sinon.stub(),
                getAttribute: sinon.stub()
            };
            struct = {
                accessors: {
                    prop1: {
                        propName: 'prop1'
                    }
                }
            };
        });

        describe('AND a property bound to an attribute', function() {
            beforeEach(function() {
                struct.accessors.prop1.attName = 'prop1';
                struct.accessors.prop1.attribute = {};
            });
            describe('AND an attribute value already set', function() {
                var attValue = 'value2';
                beforeEach(function() {
                    el.hasAttribute.returns(true);
                    el.getAttribute.returns(attValue);
                });
                describe('WHEN the callback is called', function() {
                    beforeEach(function() {
                        ceb._testing.builtInFeatures.valueInitializer.createdCallbackWrapper(struct, next, el);
                    });
                    it('THEN prop1 equals to attribute value', function() {
                        expect(el[struct.accessors.prop1.propName]).to.eq(attValue);
                    });
                    it('AND attribute value is not updated', function() {
                        expect(el.setAttribute.called).to.eq(false);
                    });
                });
            });
            describe('AND an attribute boolean value already set', function() {
                var attValue = true;
                beforeEach(function() {
                    struct.accessors.prop1.attribute = {
                        boolean: true
                    };
                    el.hasAttribute.returns(true);
                    el.getAttribute.returns(attValue);
                });
                describe('WHEN the callback is called', function() {
                    beforeEach(function() {
                        ceb._testing.builtInFeatures.valueInitializer.createdCallbackWrapper(struct, next, el);
                    });
                    it('THEN prop1 equals to attribute value', function() {
                        expect(el[struct.accessors.prop1.propName]).to.eq(attValue);
                    });
                    it('AND attribute value is not updated', function() {
                        expect(el.setAttribute.called).to.eq(false);
                    });
                });
            });
            describe('AND a default string value', function() {
                beforeEach(function() {
                    struct.accessors.prop1.value = defaultValue;
                });
                describe('WHEN the callback is called', function() {
                    beforeEach(function() {
                        ceb._testing.builtInFeatures.valueInitializer.createdCallbackWrapper(struct, next, el);
                    });
                    it('THEN prop1 equals to undefined', function() {
                        expect(el[struct.accessors.prop1.propName]).to.eq(undefined);
                    });
                    it('AND attribute value is updated', function() {
                        expect(el.setAttribute.called).to.eq(true);
                    });
                });
            });
        });
        // property
        // -- writable value
        // -- no writable value
        describe('AND a property not bound to an attribute', function() {
            beforeEach(function() {
            });
            describe('AND a value writable', function() {
                beforeEach(function() {
                    struct.accessors.prop1.value = defaultValue;
                    struct.accessors.prop1.writable = true;
                });
                describe('WHEN the callback is called', function() {
                    beforeEach(function() {
                        ceb._testing.builtInFeatures.valueInitializer.createdCallbackWrapper(struct, next, el);
                    });
                    it('THEN prop1 equals to default value', function() {
                        expect(el[struct.accessors.prop1.propName]).to.eq(defaultValue);
                    });
                    it('AND attribute value is not updated', function() {
                        expect(el.setAttribute.called).to.eq(false);
                    });
                });
            });
            describe('AND no value', function() {
                beforeEach(function() {
                });
                describe('WHEN the callback is called', function() {
                    beforeEach(function() {
                        ceb._testing.builtInFeatures.valueInitializer.createdCallbackWrapper(struct, next, el);
                    });
                    it('THEN prop1 equals to undefined', function() {
                        expect(el[struct.accessors.prop1.propName]).to.eq(undefined);
                    });
                    it('AND attribute value is not updated', function() {
                        expect(el.setAttribute.called).to.eq(false);
                    });
                });
            });
        });
    });
});
