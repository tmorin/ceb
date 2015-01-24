/*jshint expr:true, strict:false*/
describe('#createMethodsHash', function() {
    describe('GIVEN a sanitized structure struct', function() {
        var struct;
        beforeEach(function() {
            struct = {
                wrappers: {},
                methods: {}
            };
        });
        describe('AND a method m1 wrapped by w1 AND a method m2 wrapped by w2', function() {
            var m1, m2, w1, w2;
            beforeEach(function() {
                m1 = struct.methods.m1 = sinon.spy();
                m2 = struct.methods.m2 = sinon.spy();
                w1 = sinon.spy();
                w2 = sinon.spy();
                struct.wrappers.m1 = [w1];
                struct.wrappers.m2 = [w2];
            });
            describe('WHEN the methods hash is created', function() {
                var result;
                beforeEach(function() {
                    result = ceb._testing.createMethodsHash(struct);
                });
                it('THEN the result is an object', function() {
                    expect(result).to.be.instanceOf(Object);
                });
                it('AND the property m1 is a function', function() {
                    expect(result.m1).to.be.instanceOf(Function);
                });
                it('AND the property m1 is not inintal m1', function() {
                    expect(result.m1).to.not.eq(m1);
                });
                it('AND the property m2 is a function', function() {
                    expect(result.m2).to.be.instanceOf(Function);
                });
                it('AND the property m2 is not inintal m2', function() {
                    expect(result.m2).to.not.eq(m2);
                });
            });
        });
    });
});
