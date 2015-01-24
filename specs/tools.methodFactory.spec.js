/*jshint expr:true, strict:false*/
describe('#methodFactory', function() {
    describe('GIVEN three wrappers list, a wrapper function and an object o1', function() {
        var wrapper1, wrapper2, wrapper3, wrappers, wrapped, o1, a1,a2, method;
        var dummyWrapper = function (next) {
            return next(arguments);
        };
        var dummyWrapperWithoutArg = function (next) {
            return next();
        };
        beforeEach(function() {
            wrapper1 = sinon.spy(dummyWrapperWithoutArg);
            wrapper2 = sinon.spy(dummyWrapper);
            wrapper3 = sinon.spy(dummyWrapper);
            wrappers = [wrapper1, wrapper2, wrapper3];
            wrapped = sinon.spy();
            a1 = 'value';
            a2 = 'value';
            o1 = {};
        });
        describe('WHEN the method is created', function() {
            beforeEach(function() {
                method = ceb._testing.methodFactory(wrappers, wrapped);
            });
            it('THEN it should return a function', function() {
                expect(method).to.be.an.instanceof(Function);
            });
            describe('AND the method called with o1 as context and a1 as argument', function() {
                beforeEach(function() {
                    method.call(o1, a1, a2);
                });
                it('THEN the wrappers should be called with o1 as context', function() {
                    wrappers.forEach(function (wrapper) {
                        expect(wrapper.called).to.be.eq(true);
                        wrapper.calledOn(o1);
                    });
                });
                it('AND the wrappers should be called with a function, o1 and a1 as argument', function() {
                    wrappers.forEach(function (wrapper) {
                        expect(wrapper.called).to.be.eq(true);
                        var spyCall = wrapper.getCall(0);
                        expect(spyCall.args[0]).to.be.an.instanceof(Function);
                        expect(spyCall.args[1]).to.equal(o1);
                        expect(spyCall.args[2]).to.equal(a1);
                        expect(spyCall.args[3]).to.equal(a2);
                    });
                });
                it('AND the wrapped should be called with o1 as context', function() {
                    wrapped.calledOn(o1);
                });
                it('AND the wrapped should be called with o1 and a1 as arguments', function() {
                    wrapped.calledWith(o1, a1, a2);
                });
            });
        });
    });
});
