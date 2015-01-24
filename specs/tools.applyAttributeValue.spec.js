/*jshint expr:true, strict:false*/
describe('#applyAttributeValue', function() {
    describe('GIVEN an element el and an attribute name attName', function() {
        var el, attName, isBoolean;
        beforeEach(function() {
            el = {
                hasAttribute: sinon.stub(),
                getAttribute: sinon.stub(),
                setAttribute: sinon.spy(),
                removeAttribute: sinon.spy()
            };
            attName = 'attName';
        });

        describe('AND a boolean value v1', function() {
            var v1;
            beforeEach(function() {
                isBoolean = true;
            });
            describe('AND the attribute attName is attached to el', function() {
                beforeEach(function() {
                    el.hasAttribute.returns(true);
                });
                describe('WHEN v1 is true AND v1 applied to el', function() {
                    beforeEach(function() {
                        v1 = true;
                        ceb._testing.applyAttributeValue(el, attName, v1, isBoolean);
                    });
                    it('THEN nothing should be done', function() {
                        expect(el.setAttribute.called).to.equal(false);
                        expect(el.removeAttribute.called).to.equal(false);
                    });
                });
                describe('WHEN v1 is false AND v1 applied to el', function() {
                    beforeEach(function() {
                        v1 = false;
                        ceb._testing.applyAttributeValue(el, attName, v1, isBoolean);
                    });
                    it('THEN the attribute should be removed from the DOM', function() {
                        expect(el.setAttribute.called).to.equal(false);
                        expect(el.removeAttribute.called).to.equal(true);
                    });
                });
            });
            describe('AND the attribute attName is not attached to el', function() {
                beforeEach(function() {
                    el.hasAttribute.returns(false);
                });
                describe('WHEN v1 is true AND v1 applied to e1', function() {
                    beforeEach(function() {
                        v1 = true;
                        ceb._testing.applyAttributeValue(el, attName, v1, isBoolean);
                    });
                    it('THEN the attribute should be added to the DOM', function() {
                        expect(el.setAttribute.called).to.equal(true);
                        expect(el.removeAttribute.called).to.equal(false);
                    });
                });
                describe('WHEN v1 is false AND v1 applied to e1', function() {
                    beforeEach(function() {
                        v1 = false;
                        ceb._testing.applyAttributeValue(el, attName, v1, isBoolean);
                    });
                    it('THEN nothing should be done', function() {
                        expect(el.setAttribute.called).to.equal(false);
                        expect(el.removeAttribute.called).to.equal(false);
                    });
                });
            });
        });

        describe('AND a none boolean value v1', function() {
            var v1;
            beforeEach(function() {
                isBoolean = false;
            });
            describe('AND the attribute attName is attached to el with the value v0', function() {
                var v0;
                beforeEach(function() {
                    v0 = 'v0';
                    el.getAttribute.returns(v0);
                    el.hasAttribute.returns(true);
                });
                describe('WHEN v1 is defined AND v1 applied to el', function() {
                    beforeEach(function() {
                        v1 = 'test';
                        ceb._testing.applyAttributeValue(el, attName, v1, isBoolean);
                    });
                    it('THEN the attribute value should be updated', function() {
                        expect(el.setAttribute.called).to.equal(true);
                        expect(el.removeAttribute.called).to.equal(false);
                    });
                });
                describe('WHEN v1 is not defined AND v1 applied to el', function() {
                    beforeEach(function() {
                        v1 = null;
                        ceb._testing.applyAttributeValue(el, attName, v1, isBoolean);
                    });
                    it('THEN the attribute value should be removed', function() {
                        expect(el.setAttribute.called).to.equal(false);
                        expect(el.removeAttribute.called).to.equal(true);
                    });
                });
                describe('WHEN v1 is equal to v0 AND v1 applied to el', function() {
                    beforeEach(function() {
                        v1 = v0;
                        ceb._testing.applyAttributeValue(el, attName, v1, isBoolean);
                    });
                    it('THEN nothing should be done', function() {
                        expect(el.setAttribute.called).to.equal(false);
                        expect(el.removeAttribute.called).to.equal(false);
                    });
                });
            });
            describe('AND the attribute attName is not attached to el', function() {
                beforeEach(function() {
                    el.getAttribute.returns(null);
                    el.hasAttribute.returns(false);
                });
                describe('WHEN v1 is defined AND v1 applied to el', function() {
                    beforeEach(function() {
                        v1 = 'test';
                        ceb._testing.applyAttributeValue(el, attName, v1, isBoolean);
                    });
                    it('THEN the attribute value should be added', function() {
                        expect(el.setAttribute.called).to.equal(true);
                        expect(el.removeAttribute.called).to.equal(false);
                    });
                });
                describe('WHEN v1 is not defined AND v1 applied to el', function() {
                    beforeEach(function() {
                        v1 = null;
                        ceb._testing.applyAttributeValue(el, attName, v1, isBoolean);
                    });
                    it('THEN nothing should be done', function() {
                        expect(el.setAttribute.called).to.equal(false);
                        expect(el.removeAttribute.called).to.equal(false);
                    });
                });
            });
        });
    });

});
