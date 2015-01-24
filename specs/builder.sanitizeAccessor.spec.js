/*jshint expr:true, strict:false*/
describe('#builder.sanitizeAccessor', function() {
    var accessor, propName, attName = 'a-prop1';
    beforeEach(function() {
        propName = 'aProp1';
        accessor = {
            propName: propName
        };
    });

    describe('GIVEN an accessor bound to an attribute', function() {
        beforeEach(function() {
            accessor.attribute = true;
        });
        describe('WHEN the accessor is sanitized', function() {
            var result;
            beforeEach(function() {
                result = ceb._testing.sanitizeAccessor(accessor);
            });
            it('THEN the attName is a-prop1', function() {
                expect(accessor.attName).to.eq(attName);
            });
        });
    });

    describe('GIVEN an accessor bound to an attribute with another name', function() {
        var anotherName;
        beforeEach(function() {
            anotherName = 'another-name';
            accessor.attribute = {
                name: anotherName
            };
        });
        describe('WHEN the accessor is sanitized', function() {
            var result;
            beforeEach(function() {
                result = ceb._testing.sanitizeAccessor(accessor);
            });
            it('THEN the attName is another-name', function() {
                expect(accessor.attName).to.eq(anotherName);
            });
        });
    });

    describe('GIVEN an accessor no writable', function() {
        beforeEach(function() {
            accessor.writable = false;
        });
        describe('WHEN the accessor is sanitized', function() {
            var result;
            beforeEach(function() {
                result = ceb._testing.sanitizeAccessor(accessor);
            });
            it('THEN the accessor is not writable', function() {
                expect(accessor.writable).to.eq(false);
            });
        });
    });

    describe('GIVEN an accessor', function() {
        describe('WHEN the accessor is sanitized', function() {
            var result;
            beforeEach(function() {
                result = ceb._testing.sanitizeAccessor(accessor);
            });
            it('THEN the accessor is writable', function() {
                expect(accessor.writable).to.eq(true);
            });
        });
    });

});
