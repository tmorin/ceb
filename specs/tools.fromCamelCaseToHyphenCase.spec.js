/*jshint expr:true, strict:false*/
describe('#fromCamelCaseToHyphenCase', function() {
    describe('GIVEN a property name IAmAPropertyName', function() {
        var propertyName, result;
        beforeEach(function() {
            propertyName = 'IAmAPropertyName';
        });
        describe('WHEN IAmAPropertyName is transform to hyphen case', function() {
            beforeEach(function() {
                result = ceb._testing.fromCamelCaseToHyphenCase(propertyName);
            });
            it('THEN the result shoud be i-am-a-property-name', function() {
                expect(result).to.equal('i-am-a-property-name');
            });
        });
    });
});
