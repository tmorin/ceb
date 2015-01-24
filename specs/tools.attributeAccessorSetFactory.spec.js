/*jshint expr:true, strict:false*/
describe('#attributeAccessorSetFactory', function() {
    describe('GIVEN an attname', function() {
        var attName, originalSet, isBoolean, el, value;
        beforeEach(function() {
            el = {
                  hasAttribute:sinon.spy(),
                  removeAttribute:sinon.spy(),
                  getAttribute:sinon.spy(),
                  setAttribute:sinon.spy()
            };
            value = 'value1';
            attName = 'attName';
            originalSet = sinon.spy();
            isBoolean = true;
        });

        describe('AND an orignal set AND a boolean attribute', function() {
            describe('WHEN the setter is created', function() {
                var setter;
                beforeEach(function() {
                    setter = ceb._testing.attributeAccessorSetFactory(attName, originalSet, isBoolean);
                });
                it('THEN the setter is a function', function() {
                    expect(setter).to.be.instanceOf(Function);
                });
            });
            describe('AND a created setter', function() {
                var setter;
                beforeEach(function() {
                    setter = ceb._testing.attributeAccessorSetFactory(attName, originalSet, isBoolean);
                });
                describe('WHEN the setter is called', function() {
                    beforeEach(function() {
                        setter.call(el, el, value);
                    });
                    it('THEN the orignal set is called', function() {
                        expect(originalSet.calledWith(el, value)).to.be.eq(true);
                    });
                });
            });
        });

        describe('AND no orignal set AND a boolean attribute', function() {
            beforeEach(function() {
                isBoolean = true;
            });
            describe('AND a created setter', function() {
                var setter;
                beforeEach(function() {
                    setter = ceb._testing.attributeAccessorSetFactory(attName, null, isBoolean);
                });
                describe('WHEN the setter is called', function() {
                    beforeEach(function() {
                        setter.call(el, el, value);
                    });
                    it('THEN the orignal set is not called', function() {
                        expect(originalSet.called).to.be.eq(false);
                    });
                });
            });
        });
    });
});
