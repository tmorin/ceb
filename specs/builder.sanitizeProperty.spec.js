/*jshint expr:true, strict:false*/
describe('#builder.sanitizeProperty', function() {
    var property, propName, attName = 'a-prop1';
    beforeEach(function() {
        propName = 'aProp1';
        property = {
            propName: propName
        };
    });

    describe('GIVEN a property bound to an attribute', function() {
        beforeEach(function() {
            property.attribute = true;
        });
        describe('WHEN the property is sanitized', function() {
            var result;
            beforeEach(function() {
                result = ceb._testing.sanitizeProperty(property);
            });
            it('THEN the attName is a-prop1', function() {
                expect(property.attName).to.eq(attName);
            });
        });
    });

    describe('GIVEN a property bound to an attribute with another name', function() {
        var anotherName;
        beforeEach(function() {
            anotherName = 'another-name';
            property.attribute = {
                name: anotherName
            };
        });
        describe('WHEN the property is sanitized', function() {
            var result;
            beforeEach(function() {
                result = ceb._testing.sanitizeProperty(property);
            });
            it('THEN the attName is another-name', function() {
                expect(property.attName).to.eq(anotherName);
            });
        });
    });

    describe('GIVEN a property no writable', function() {
        beforeEach(function() {
            property.writable = false;
        });
        describe('WHEN the property is sanitized', function() {
            var result;
            beforeEach(function() {
                result = ceb._testing.sanitizeProperty(property);
            });
            it('THEN the property is not writable', function() {
                expect(property.writable).to.eq(false);
            });
        });
    });

    describe('GIVEN a property', function() {
        describe('WHEN the property is sanitized', function() {
            var result;
            beforeEach(function() {
                result = ceb._testing.sanitizeProperty(property);
            });
            it('THEN the property is writable', function() {
                expect(property.writable).to.eq(true);
            });
        });
    });

});
