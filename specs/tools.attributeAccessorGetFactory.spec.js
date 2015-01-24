/*jshint expr:true, strict:false*/
describe('#attributeAccessorGetFactory', function() {
    describe('GIVEN an attname', function() {
        var attName, originalGet, isBoolean, el, value;
        beforeEach(function() {
            el = {
                  hasAttribute:sinon.spy(),
                  removeAttribute:sinon.spy(),
                  getAttribute:sinon.spy(),
                  setAttribute:sinon.spy()
            };
            value = 'value1';
            attName = 'attName';
            originalGet = sinon.spy();
            isBoolean = true;
        });

        describe('AND an orignal get AND a boolean attribute', function() {
            describe('WHEN the getter is created', function() {
                var getter;
                beforeEach(function() {
                    getter = ceb._testing.attributeAccessorSetFactory(attName, originalGet, isBoolean);
                });
                it('THEN the getter is a function', function() {
                    expect(getter).to.be.instanceOf(Function);
                });
            });
            describe('AND a created getter', function() {
                var getter;
                beforeEach(function() {
                    getter = ceb._testing.attributeAccessorGetFactory(attName, originalGet, isBoolean);
                });
                describe('WHEN the getter is called', function() {
                    beforeEach(function() {
                        getter.call(el, el, value);
                    });
                    it('THEN the orignal get is called', function() {
                        expect(originalGet.calledWith(el)).to.be.eq(true);
                    });
                });
            });
        });

        describe('AND no orignal get AND a none boolean attribute', function() {
            beforeEach(function() {

            });
            describe('AND a created getter', function() {
                var getter;
                beforeEach(function() {
                    getter = ceb._testing.attributeAccessorGetFactory(attName, null, false);
                });
                describe('WHEN the getter is called', function() {
                    beforeEach(function() {
                        getter.call(el, el, value);
                    });
                    it('THEN the orignal get is called', function() {
                        expect(originalGet.calledWith(el)).to.be.eq(false);
                    });
                });
            });
        });
    });
});
