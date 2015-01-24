/*jshint expr:true, strict:false*/
describe('#emptyFn', function() {
    describe('GIVEN nothing', function() {
        describe('WHEN two empty functions are required', function() {
            var fn1, fn2;
            beforeEach(function() {
                fn1 = ceb._testing.emptyFn();
                fn2 = ceb._testing.emptyFn();
            });
            it('THEN the two functions are function', function() {
                expect(fn1).to.be.instanceOf(Function);
                expect(fn2).to.be.instanceOf(Function);
            });
            it('AND the two functions are different', function() {
                expect(fn1).to.be.not.equals(fn2);
            });
        });
    });
});
