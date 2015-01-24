/*jshint expr:true, strict:false*/
describe('#createAttributesHash', function() {
    describe('GIVEN a sanitized structure struct', function() {
        var struct;
        beforeEach(function() {
            struct = {
                accessors: {}
            };
        });
        describe('AND an accessor a1 AND accessors a2 and a3 linked to an attribute', function() {
            var a1, a2, a3;
            beforeEach(function() {
                a1 = struct.accessors.a1 = {};
                a2 = struct.accessors.a2 = {
                    attName: 'att2'
                };
                a3 = struct.accessors.a3 = {
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
