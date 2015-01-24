/*jshint expr:true, strict:false*/
describe('#compareLevels', function() {
    describe('GIVEN o1 with level1 and o2 with level2', function() {
        var o1, o2, result;
        beforeEach(function() {
            o1 = {
                level: 1
            };
            o2 = {
                level: 2
            };
        });
        describe('WHEN o1 is compared to o2', function() {
            beforeEach(function() {
                result = ceb._testing.compareLevels(o1, o2);
            });
            it('THEN the comparaison should be negative', function() {
                expect(result).to.equal(false);
            });
        });
        describe('WHEN o2 is compared to o1', function() {
            beforeEach(function() {
                result = ceb._testing.compareLevels(o2, o1);
            });
            it('THEN the comparaison should be positive', function() {
                expect(result).to.equal(true);
            });
        });
    });
});
