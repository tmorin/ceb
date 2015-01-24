/*jshint expr:true, strict:false*/

describe('#builder', function() {
    var counter = 0, tagName;
    beforeEach(function() {
        tagName = 'test-tag-name-' + (counter++);
    });
    describe('#params', function() {
        var params;
        beforeEach(function() {
            params = {};
        });
        describe('GIVEN an empty params', function() {
            describe('WHEN the builder is called', function() {
                var result, getStruct;
                beforeEach(function() {
                    result = ceb._testing.builder(tagName, params);
                    getStruct = result.get();
                });
                it('THEN the builder\'s struct should be deepping equal to the base struct', function() {
                    expect(getStruct).to.eql(Object.assign({
                        tagName: tagName
                    }, ceb._testing.baseStructFactory()));
                });
            });
            describe('AND a struct', function() {
                var struct;
                beforeEach(function() {
                    struct = {
                        properties: {}
                    };
                    params.struct = struct;
                });
                describe('WHEN the builder is called', function() {
                    var result, getStruct;
                    beforeEach(function() {
                        result = ceb._testing.builder(tagName, params);
                        getStruct = result.get();
                    });
                    it('THEN the builder\'s struct should be equal to the struct', function() {
                        expect(getStruct).to.eql(Object.assign({
                            tagName: tagName
                        }, struct));
                    });
                });
            });
        });
    });

    describe('#wrap', function() {
        var params, struct, methName1, fn1, level1, fn2;
        beforeEach(function() {
            struct = ceb._testing.baseStructFactory();
            params = {
                struct: struct
            };
            methName1 = 'm1';
            fn1 = sinon.spy();
            level1 = 1;
            fn2 = sinon.spy();
        });
        describe('GIVEN a builder', function() {
            var builder;
            beforeEach(function() {
                builder = ceb._testing.builder(tagName, params);
            });
            describe('WHEN two wrapper should be set', function() {
                beforeEach(function() {
                    builder.wrap(methName1, fn1, level1);
                    builder.wrap(methName1, fn2);
                });
                it('THEN the wrapper1 should be set', function() {
                    expect(struct.wrappers[methName1][0]).to.eq(fn1);
                });
                it('AND the level of wrapper1 should be 1', function() {
                    expect(struct.wrappers[methName1][0].level).to.eq(level1);
                });
                it('AND the wrapper2 should be set', function() {
                    expect(struct.wrappers[methName1][1]).to.eq(fn2);
                });
                it('AND the level of wrapper2 should be 0', function() {
                    expect(struct.wrappers[methName1][1].level).to.eq(0);
                });
            });
        });
    });

    describe('#intercept', function() {
        var params, struct, propName, setFn1, getFn1, setFn2, getFn2, level;
        beforeEach(function() {
            struct = ceb._testing.baseStructFactory();
            params = {
                struct: struct
            };
            propName = 'p1';
            setFn1 = sinon.spy();
            getFn1 = sinon.spy();
            setFn2 = sinon.spy();
            getFn2 = sinon.spy();
            level = 1;
        });
        describe('GIVEN a builder', function() {
            var builder;
            beforeEach(function() {
                builder = ceb._testing.builder(tagName, params);
            });
            describe('WHEN two interceptors are set', function() {
                beforeEach(function() {
                    builder.intercept(propName, setFn1, null, level);
                    builder.intercept(propName, null, getFn1);

                    builder.intercept(propName, setFn2, null);
                    builder.intercept(propName, null, getFn2, level);
                });
                it('THEN the fn should be set', function() {
                    expect(struct.interceptors[propName].set[0]).to.eq(setFn1);
                    expect(struct.interceptors[propName].set[1]).to.eq(setFn2);
                    expect(struct.interceptors[propName].get[0]).to.eq(getFn1);
                    expect(struct.interceptors[propName].get[1]).to.eq(getFn2);
                });
                it('THEN the level should be set', function() {
                    expect(struct.interceptors[propName].set[0].level).to.eq(level);
                    expect(struct.interceptors[propName].set[1].level).to.eq(0);
                    expect(struct.interceptors[propName].get[0].level).to.eq(0);
                    expect(struct.interceptors[propName].get[1].level).to.eq(level);
                });
            });
        });
    });

    describe('#extends', function() {
        var params, struct, value;
        beforeEach(function() {
            struct = ceb._testing.baseStructFactory();
            params = {
                struct: struct
            };
            value = 'p1';
        });
        describe('GIVEN a builder', function() {
            var builder;
            beforeEach(function() {
                builder = ceb._testing.builder(tagName, params);
            });
            describe('WHEN extends is set', function() {
                beforeEach(function() {
                    builder.extends(value);
                });
                it('THEN the extends should be set', function() {
                    expect(struct.extends).to.eq(value);
                });
            });
        });
    });

    describe('#prototype', function() {
        var params, struct, value;
        beforeEach(function() {
            struct = ceb._testing.baseStructFactory();
            params = {
                struct: struct
            };
            value = 'p1';
        });
        describe('GIVEN a builder', function() {
            var builder;
            beforeEach(function() {
                builder = ceb._testing.builder(tagName, params);
            });
            describe('WHEN prototype is set', function() {
                beforeEach(function() {
                    builder.prototype(value);
                });
                it('THEN the prototype should be set', function() {
                    expect(struct.prototype).to.eq(value);
                });
            });
        });
    });

    describe('#properties', function() {
        var params, struct, value, someProperties;
        beforeEach(function() {
            struct = ceb._testing.baseStructFactory();
            params = {
                struct: struct
            };
            someProperties = {
                prop1: {}
            };
            value = 'p1';
        });
        describe('GIVEN a builder', function() {
            var builder;
            beforeEach(function() {
                builder = ceb._testing.builder(tagName, params);
            });
            describe('WHEN some properties are set', function() {
                beforeEach(function() {
                    builder.properties(someProperties);
                });
                it('THEN some properties should be set', function() {
                    expect(struct.properties.prop1.propName).to.eq('prop1');
                    expect(struct.properties.prop1.writable).to.eq(true);
                });
            });
            describe('WHEN no properties are set', function() {
                beforeEach(function() {
                    builder.properties(null);
                });
                it('THEN no properties should be set', function() {
                    expect(struct.properties).to.eql({});
                });
            });
        });
    });

    describe('#methods', function() {
        var params, struct, someMethods;
        beforeEach(function() {
            struct = ceb._testing.baseStructFactory();
            params = {
                struct: struct
            };
            someMethods = {
                m1: sinon.spy()
            };
        });
        describe('GIVEN a builder', function() {
            var builder;
            beforeEach(function() {
                builder = ceb._testing.builder(tagName, params);
            });
            describe('WHEN some methods are set', function() {
                beforeEach(function() {
                    builder.methods(someMethods);
                });
                it('THEN the methods should be set', function() {
                    expect(struct.methods.m1).to.eq(someMethods.m1);
                });
            });
        });
    });

    describe('#feature', function() {
        var params, struct, feature1, options1, level1, feature2, options2, level2;
        beforeEach(function() {
            struct = ceb._testing.baseStructFactory();
            params = {
                struct: struct
            };
            feature1 = sinon.spy();
            options1 = {};
            level1 = 1;
            feature2 = sinon.spy();
            options2 = undefined;
            level2 = 0;
        });
        describe('GIVEN a builder', function() {
            var builder;
            beforeEach(function() {
                builder = ceb._testing.builder(tagName, params);
            });
            describe('WHEN two features are set', function() {
                beforeEach(function() {
                    builder.feature(feature1, options1, level1);
                    builder.feature(feature2, options2, undefined);
                });
                it('THEN the features should be set', function() {
                    expect(struct.features[2].fn).to.eq(feature1);
                    expect(struct.features[2].options).to.eq(options1);
                    expect(struct.features[2].level).to.eq(level1);
                    expect(struct.features[3].fn).to.eq(feature2);
                    expect(struct.features[3].options).to.eq(options2);
                    expect(struct.features[3].level).to.eq(0);
                });
            });
        });
    });

    describe('#register', function() {
        var params, struct;
        beforeEach(function() {
            struct = ceb._testing.baseStructFactory();
            params = {
                struct: struct
            };
        });
        describe('GIVEN a builder', function() {
            var builder;
            beforeEach(function() {
                builder = ceb._testing.builder(tagName, params);
            });
            describe('WHEN two features are set', function() {
                var firstResult, secondResult;
                beforeEach(function() {
                    firstResult = builder.register();
                    secondResult = builder.register();
                });
                it('THEN first result build a custom element', function() {
                    expect(firstResult).to.exist;
                });
                it('THEN second result build a custom element', function() {
                    expect(secondResult).to.not.exist;
                });
            });
        });
    });

});
