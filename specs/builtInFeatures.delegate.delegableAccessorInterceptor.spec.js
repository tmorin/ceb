/*jshint expr:true, strict:false*/
describe('#builtInFeatures.delegate.delegableAccessorInterceptor', function() {
    describe('GIVEN an element el AND a value v1 and an accesor a1', function() {
        var el, v1, a1, next, target;
        beforeEach(function() {
            target = {
                hasAttribute: sinon.stub(),
                getAttribute: sinon.stub(),
                setAttribute: sinon.spy(),
                removeAttribute: sinon.spy()
            };
            v1 = 'value';
            el = {
                querySelector: sinon.stub().returns(target),
                a1: v1
            };
            a1 = {
                propName: 'a1',
                delegate: {
                    target: 'input'
                }
            };
            next = sinon.spy();
        });

        describe('AND a1 configured with delegate.property to b1', function() {
            beforeEach(function() {
                a1.delegate.property = 'b1';
            });
            describe('WHEN the interceptor is called', function() {
                beforeEach(function() {
                    ceb._testing.builtInFeatures.delegate.delegableAccessorInterceptor(a1, next, el, v1);
                });
                it('THEN the target\'s property b1 is v1', function() {
                    expect(target.a1).to.equal(undefined);
                    expect(target.b1).to.equal(v1);
                    expect(target.setAttribute.called).to.be.eq(false);
                    expect(target.removeAttribute.called).to.be.eq(false);
                });
            });
        });
        describe('AND a1 configured with delegate.attribute to b1', function() {
            beforeEach(function() {
                a1.delegate.attribute = 'b1';
            });
            describe('WHEN the interceptor is called', function() {
                beforeEach(function() {
                    ceb._testing.builtInFeatures.delegate.delegableAccessorInterceptor(a1, next, el, v1);
                });
                it('THEN the target\'s attribute b1 is v1', function() {
                    expect(target.a1).to.equal(undefined);
                    expect(target.b1).to.equal(undefined);
                    expect(target.setAttribute.called).to.be.eq(true);
                    expect(target.setAttribute.calledWith('b1', v1)).to.be.eq(true);
                    expect(target.removeAttribute.called).to.be.eq(false);
                });
            });
        });
        describe('AND a1 configured without delegate.property and delegate.attribute', function() {
            describe('WHEN the interceptor is called', function() {
                beforeEach(function() {
                    ceb._testing.builtInFeatures.delegate.delegableAccessorInterceptor(a1, next, el, v1);
                });
                it('THEN the target\'s property a1 is v1', function() {
                    expect(target.a1).to.equal(v1);
                    expect(target.b1).to.equal(undefined);
                    expect(target.setAttribute.called).to.be.eq(false);
                    expect(target.removeAttribute.called).to.be.eq(false);
                });
            });
        });
        describe('AND a1 configured with attName to b1', function() {
            beforeEach(function() {
                a1.attName = 'b1';
            });
            describe('WHEN the interceptor is called', function() {
                beforeEach(function() {
                    ceb._testing.builtInFeatures.delegate.delegableAccessorInterceptor(a1, next, el, v1);
                });
                it('THEN the target\'s attribute b1 is v1', function() {
                    expect(target.a1).to.equal(undefined);
                    expect(target.b1).to.equal(undefined);
                    expect(target.setAttribute.called).to.be.eq(true);
                    expect(target.setAttribute.calledWith('b1', v1)).to.be.eq(true);
                    expect(target.removeAttribute.called).to.be.eq(false);
                });
            });
        });

        describe('AND a1 configured with attribute.boolean to true', function() {
            beforeEach(function() {
                v1 = true;
                a1.attribute = {
                    boolean: true
                };
                a1.attName = 'a1';
            });
            describe('WHEN the interceptor is called', function() {
                beforeEach(function() {
                    ceb._testing.builtInFeatures.delegate.delegableAccessorInterceptor(a1, next, el, v1);
                });
                it('THEN the target\'s attribute a1 is v1', function() {
                    expect(target.a1).to.equal(undefined);
                    expect(target.b1).to.equal(undefined);
                    expect(target.setAttribute.called).to.be.eq(true);
                    expect(target.setAttribute.calledWith('a1', '')).to.be.eq(true);
                    expect(target.removeAttribute.called).to.be.eq(false);
                });
            });
        });
        describe('AND a1 configured with delegate.boolean to true', function() {
            beforeEach(function() {
                v1 = true;
                a1.delegate.boolean = true;
                a1.attName = 'a1';
            });
            describe('WHEN the interceptor is called', function() {
                beforeEach(function() {
                    ceb._testing.builtInFeatures.delegate.delegableAccessorInterceptor(a1, next, el, v1);
                });
                it('THEN the target\'s attribute a1 is v1', function() {
                    expect(target.a1).to.equal(undefined);
                    expect(target.b1).to.equal(undefined);
                    expect(target.setAttribute.called).to.be.eq(true);
                    expect(target.setAttribute.calledWith('a1', '')).to.be.eq(true);
                    expect(target.removeAttribute.called).to.be.eq(false);
                });
            });
        });
    });
});
