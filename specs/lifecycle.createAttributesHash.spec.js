/*jshint expr:true, strict:false*/
describe('#createAttributesHash', function() {
    describe('GIVEN a sanitized structure struct', function() {
        var struct;
        beforeEach(function() {
            struct = {
                properties: {}
            };
        });
        describe('AND a property a1 AND properties a2 and a3 linked to them attributes', function() {
            var a1, a2, a3;
            beforeEach(function() {
                a1 = struct.properties.a1 = {};
                a2 = struct.properties.a2 = {
                    attName: 'att2'
                };
                a3 = struct.properties.a3 = {
                    attName: 'att3'
                };
            });
            describe('WHEN the attributes hash is created', function() {
                var result;
                beforeEach(function() {
                    result = ceb._testing.createAttributesHash(struct);
                });
                it('THEN the result is an object', function() {
                    expect(result).to.be.instanceOf(Object);
                });
                it('AND the property att2 is a2', function() {
                    expect(result.att2).to.be.eql(a2);
                });
                it('AND the property att3 is a3', function() {
                    expect(result.att3).to.be.eql(a3);
                });
            });
        });
    });
});
