/*jshint expr:true, strict:false*/
describe('#builtInFeatures.valueInitializer.attributeChangedCallbackWrapper', function() {
    describe('GIVEN a sanitized struct', function() {
        var next, el, attName, oldVal, newVal, struct;
        beforeEach(function() {
            next = sinon.spy();
            el = {};
            attName = 'attName';
            oldVal = 'oldVal';
            newVal = 'newVal';
            struct = {
                attributes: {}
            };
        });
        describe('AND a property bound to an attribute', function() {
            beforeEach(function() {
                struct.attributes.attName = {
                    propName: 'propName',
                    attribute: {}
                };
            });
            describe('WHEN the callback is called', function() {
                beforeEach(function() {
                    ceb._testing.builtInFeatures.valueInitializer.attributeChangedCallbackWrapper(struct, next, el, attName, oldVal, newVal);
                });
                it('THEN the property propName is set', function() {
                    expect(el.propName).to.eq(newVal);
                });
            });
            describe('AND the property is a boolean', function() {
                beforeEach(function() {
                    struct.attributes.attName.attribute.boolean = true;
                });
                describe('WHEN the callback is called with a null value', function() {
                    beforeEach(function() {
                        ceb._testing.builtInFeatures.valueInitializer.attributeChangedCallbackWrapper(struct, next, el, attName, oldVal, null);
                    });
                    it('THEN the property propName is false', function() {
                        expect(el.propName).to.eq(false);
                    });
                });
                describe('WHEN the callback is called with a a string value', function() {
                    beforeEach(function() {
                        ceb._testing.builtInFeatures.valueInitializer.attributeChangedCallbackWrapper(struct, next, el, attName, oldVal, newVal);
                    });
                    it('THEN the property propName is true', function() {
                        expect(el.propName).to.eq(true);
                    });
                });
            });
        });
        describe('AND a property not bound to an attribute', function() {
            describe('WHEN the callback is called', function() {
                beforeEach(function() {
                    ceb._testing.builtInFeatures.valueInitializer.attributeChangedCallbackWrapper(struct, next, el, attName, oldVal, newVal);
                });
                it('THEN nohting append', function() {
                    expect(el.propName).to.eq(undefined);
                });
            });
        });
    });
});
