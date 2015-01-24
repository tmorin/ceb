/*jshint expr:true, strict:false*/
describe('#listValues', function() {
    describe('GIVEN an object with two properties', function() {
        var object;
        beforeEach(function() {
            object = {
                prop1: 'value1',
                prop2: 'value2'
            };
        });
        describe('WHEN list values is called', function() {
            var result;
            beforeEach(function() {
                result = ceb._testing.listValues(object);
            });
            it('THEN two values are into an array', function() {
                expect(result).to.be.instanceOf(Array);
                expect(result).to.include('value1');
                expect(result).to.include('value2');
            });
        });
    });
    describe('GIVEN no object with two properties', function() {
        var object;
        beforeEach(function() {
            object = null;
        });
        describe('WHEN list values is called', function() {
            var result;
            beforeEach(function() {
                result = ceb._testing.listValues(object);
            });
            it('THEN no values are into an array', function() {
                expect(result).to.be.instanceOf(Array);
                expect(result).to.length(0);
            });
        });
    });
});
