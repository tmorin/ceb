/*jshint expr:true, strict:false*/
describe('#build', function() {
    describe('GIVEN structure struct', function() {
        var struct, counter = 0, tagName, m1;
        beforeEach(function() {
            tagName = 'test-tag-name-' + (counter++);
            m1 = sinon.spy();
            struct = {
                tagName: tagName,
                properties: {
                    prop1: {
                        value: 'value1',
                        propName: 'prop1'
                    }
                },
                methods: {
                    m1: m1
                }
            };
        });
        describe('WHEN the structure is build', function() {
            var Result;
            beforeEach(function() {
                Result = ceb._testing.build(struct);
            });
            it('THEN the Result is a function constructor', function() {
                expect(Result).to.be.instanceOf(Function);
            });
            describe('AND the element is instanciated', function() {
                var instance;
                beforeEach(function() {
                    instance = new Result();
                });
                it('THEN the instance should have a property prop1', function() {
                    expect(instance.prop1).to.eq('value1');
                });
                it('AND the instance should have a method m1', function() {
                    expect(instance.m1).to.be.instanceOf(Function);
                });
                describe('WHEN m1 is called', function() {
                    beforeEach(function() {
                        instance.m1(1, 2, 3);
                    });
                    it('THEN original m1 method is called', function() {
                        m1.calledWith(1, 2, 3);
                    });
                });
            });
        });
    });
});
