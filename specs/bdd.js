describe('a custom element', function () {
    'use strict';

    function insertCeAndGet() {
        var ce = document.createElement(tagName);
        sandbox.appendChild(ce);
        return sandbox.querySelector(tagName);
    }

    function dumyWrapper(next) {
        return next(arguments);
    }

    function dumyInterceptor(next, el, value) {
        return next(value);
    }

    var sandbox,
        counter = 0,
        tagName, Ce, ce,
        m1, m2,
        arg1, arg2, arg3,
        w1, w2,
        c1, p1,
        b1, v1, v2,
        a1bis,
        set1, get1,
        iSet1, iSet2, iGet1, iGet2,
        setter1, getter1,
        f1, f2, f3,
        opt1, opt2,
        r;

    beforeEach(function () {
        sandbox = document.createElement('div');
        tagName = 'tag-name-' + (counter++);
        m1 = sinon.spy();
        m2 = sinon.spy();
        arg1 = 'arg1';
        arg2 = 'arg2';
        arg3 = 'arg3';
        w1 = sinon.spy(dumyWrapper);
        w2 = sinon.spy(dumyWrapper);
        c1 = {};
        p1 = {};
        b1 = true;
        v1 = 'value1';
        v2 = 'value2';
        a1bis = 'antother-att-name';
        iSet1 = sinon.spy(dumyInterceptor);
        iSet2 = sinon.spy(dumyInterceptor);
        iGet1 = sinon.spy(dumyInterceptor);
        iGet2 = sinon.spy(dumyInterceptor);
        set1 = sinon.stub();
        get1 = sinon.stub().returns(v1);
        setter1 = sinon.stub().returnsArg(1);
        getter1 = sinon.stub().returnsArg(1);
        f1 = sinon.spy();
        f1.setup = sinon.spy();
        f2 = sinon.spy();
        f2.setup = sinon.spy();
        f3 = sinon.spy();
        opt1 = {};
        opt2 = {};
    });
    afterEach(function () {
        sandbox.innerHTML = '';
    });

    it('can be created from scratch', function () {
        Ce = ceb().name(tagName).register();

        ce = document.createElement(tagName);
        expect(ce.tagName, 'should be created from JavaScript').to.eq(tagName.toUpperCase());

        sandbox.innerHTML = '<' + tagName + '></' + tagName + '>';
        expect(sandbox.querySelector(tagName).tagName, 'should be created from HTML').to.eq(tagName.toUpperCase());
    });

    it('can be created from an existing HTML Element', function () {
        Ce = ceb().name(tagName).extends('button').prototype(Object.create(HTMLButtonElement.prototype)).register();

        ce = document.createElement('button', tagName);
        expect(ce, 'should be created from JavaScript').to.not.eq(undefined);

        sandbox.innerHTML = '<button is="' + tagName + '"></button>';
        expect(sandbox.querySelector('button').tagName, 'should be created from HTML').to.eq('BUTTON');
    });

    it('can not be created twice', function () {
        var builder = ceb().name(tagName);
        Ce = builder.register();
        expect(Ce, 'should be created the first time').to.exist();

        Ce = builder.register();
        expect(Ce, 'should not be created the first time').to.not.exist();
    });

    it('can be created from a given structure', function () {
        var struct = ceb().name('test').methods({
            m1: m1
        }).get();
        Ce = ceb({
            struct: struct
        }).name(tagName).register();

        ce = document.createElement(tagName);
        expect(ce.tagName, 'should be created from JavaScript').to.eq(tagName.toUpperCase());

        sandbox.innerHTML = '<' + tagName + '></' + tagName + '>';
        expect(sandbox.querySelector(tagName).tagName, 'should be created from HTML').to.eq(tagName.toUpperCase());

        expect(ce.m1, 'm1 should be a function').to.be.instanceOf(Function);
    });

    it('can be created from a bad structure', function () {
        Ce = ceb({
            struct: {
                methods: {
                    m1: m1
                }
            }
        }).name(tagName).register();

        ce = document.createElement(tagName);
        expect(ce.tagName, 'should be created from JavaScript').to.eq(tagName.toUpperCase());

        sandbox.innerHTML = '<' + tagName + '></' + tagName + '>';
        expect(sandbox.querySelector(tagName).tagName, 'should be created from HTML').to.eq(tagName.toUpperCase());

        expect(ce.m1, 'm1 should be a function').to.be.instanceOf(Function);
    });

    it('can have methods', function () {
        Ce = ceb().name(tagName).methods({
            m1: m1
        }).register();
        ce = insertCeAndGet();

        expect(ce.m1, 'm1 should be a function').to.be.instanceOf(Function);

        ce.m1(arg1, arg2, arg3);
        expect(m1.calledWith(ce, arg1, arg2, arg3), 'm1 should be a called').to.eq(true);
    });

    it('can have methods having wrappers', function () {
        Ce = ceb().name(tagName).methods({
            m1: m1
        }).wrap('m1', w2, 1).wrap('m1', w1).register();
        ce = insertCeAndGet();

        ce.m1(arg1, arg2, arg3);

        expect(m1.calledWith(ce, arg1, arg2, arg3), 'w1 should be called').to.eq(true);
        expect(w1.calledWith(sinon.match.func, ce, arg1, arg2, arg3), 'w2 should be called').to.true();
        expect(w2.calledWith(sinon.match.func, ce, arg1, arg2, arg3), 'm1 should be called').to.true();
        expect(w2.getCall(0).callId < w1.getCall(0).callId, 'w2 should be called before w1').to.true();
        expect(w1.getCall(0).callId < m1.getCall(0).callId, 'w1 should be called before m1').to.true();
    });

    it('can have constants', function () {
        Ce = ceb().name(tagName).properties({
            c1: {
                value: v1,
                writable: false
            }
        }).register();
        ce = insertCeAndGet();

        expect(ce.c1, 'ce.c1 should be equal to v1').to.eq(v1);

        var error;
        try {
            ce.c1 = null;
        } catch (e) {
            error = e;
        }
        expect(error, 'ce.c1 should not be writable').to.exist();
    });

    it('can have constant but can not have interceptors get and set', function () {
        Ce = ceb().name(tagName).properties({
            c1: {
                value: v1,
                writable: false
            }
        }).intercept('c1', iSet2, iGet2, 1).intercept('c1', iSet1, iGet1).register();
        ce = insertCeAndGet();

        try {
            ce.c1 = null;
        } catch (e) {} finally {
            expect(iSet1.called && iSet1.called, 'iSet1 and iSet1 should not be called').to.false();
        }

        r = ce.c1;
        expect(iGet1.called && iGet2.called, 'iGet1 and iGet2 should not be called').to.false();
    });

    it('can have writable properties', function () {
        Ce = ceb().name(tagName).properties({
            p1: {}
        }).register();
        ce = insertCeAndGet();

        /*jshint -W103 */
        if (ce.__proto__) {
            expect(ce.__proto__, 'ce.p1 should exist').to.have.ownProperty('p1');
        }
        /*jshint +W103 */

        ce.c1 = v1;
        expect(ce.c1, 'ce.p1 should be writable').to.eq(v1);
    });

    it('can have writable properties having a default value', function () {
        Ce = ceb().name(tagName).properties({
            p1: {
                value: v1
            }
        }).register();
        ce = insertCeAndGet();

        expect(ce.p1, 'ce.p1 should be equal to v1').to.eq(v1);

        ce.c1 = v2;
        expect(ce.c1, 'ce.p1 should be writable').to.eq(v2);
    });

    it('can have writable properties having accessors set and get', function () {
        Ce = ceb().name(tagName).properties({
            p1: {
                set: set1,
                get: get1
            }
        }).register();
        ce = insertCeAndGet();

        ce.p1 = v1;
        expect(set1.calledWith(ce, v1), 'set1 should be called').to.be.true();

        r = ce.p1;
        expect(get1.calledWith(ce), 'get1 should be called').to.be.true();
    });

    it('can have writable properties but can not have interceptors get and set', function () {
        Ce = ceb().name(tagName).properties({
            p1: {}
        }).intercept('p1', iSet1, iGet1).intercept('p1', iSet2, iGet2).register();
        ce = insertCeAndGet();

        ce.p1 = v1;
        expect(iSet1.called, 'iSet1 should not be called').to.be.false();
        expect(iSet2.called, 'iSet2 should not be called').to.be.false();

        var r = ce.p1;
        expect(r, 'get value should be v1').to.eq(v1);
        expect(iGet1.called, 'iGet1 should not be called').to.be.false();
        expect(iGet2.called, 'iGet2 should not be called').to.be.false();
    });

    it('can have writable properties having accessors set and get and have interceptors get and set', function () {
        Ce = ceb().name(tagName).properties({
                p1: {
                    set: set1,
                    get: get1
                },
                p2: {
                    set: set1
                },
                p3: {
                    get: get1
                }
            }).intercept('p1', iSet1, iGet1).intercept('p1', iSet2, iGet2)
            .intercept('p2', iSet1, null).intercept('p3', null, iGet2).register();
        ce = insertCeAndGet();

        ce.p1 = v1;
        expect(set1.calledWith(ce, v1), 'setter1 should be called').to.be.true();
        expect(iSet1.calledWith(sinon.match.func, ce, v1), 'iSet1 should be called').to.be.true();
        expect(iSet2.calledWith(sinon.match.func, ce, v1), 'iSet2 should be called').to.be.true();

        var r = ce.p1;
        expect(get1.calledWith(ce), 'getter1 should be called').to.be.true();
        expect(r, 'get value should be v1').to.eq(v1);
        expect(iGet1.calledWith(sinon.match.func, ce), 'iGet1 should be called').to.be.true();
        expect(iGet2.calledWith(sinon.match.func, ce), 'iGet2 should be called').to.be.true();
    });

    it('can have writable properties linked to an attribute', function () {
        Ce = ceb().name(tagName).properties({
            p1: {
                attribute: true
            }
        }).register();
        ce = insertCeAndGet();
        var spiedSetAttribute = sinon.spy(ce, 'setAttribute');
        var spiedGetAttribute = sinon.spy(ce, 'getAttribute');
        var spiedRemoveAttribute = sinon.spy(ce, 'removeAttribute');

        ce.p1 = v1;
        expect(spiedSetAttribute.calledWith('p1', v1), 'the attribute should be updated').to.be.true();

        r = ce.p1;
        expect(spiedGetAttribute.calledWith('p1'), 'the attribute value should be get').to.be.true();

        ce.p1 = v1;
        expect(spiedSetAttribute.calledWith('p1', v1), 'the attribute should be updated').to.be.true();

        ce.p1 = null;
        expect(spiedRemoveAttribute.calledWith('p1'), 'the attribute should be removed').to.be.true();

        ce.setAttribute('p1', v2);
        expect(ce.p1, 'the property value should be sync with attribute value').to.eq(v2);

        ce.removeAttribute('p1');
        expect(ce.p1, 'the property value should be sync with attribute value').to.eq(null);
    });

    it('can have writable properties linked to a boolean attribute', function () {
        Ce = ceb().name(tagName).properties({
            p1: {
                attribute: {
                    boolean: true
                }
            }
        }).register();
        ce = insertCeAndGet();

        ce.p1 = true;
        expect(ce.hasAttribute('p1'), 'property change should update attribute').to.eq(true);

        ce.p1 = false;
        expect(ce.hasAttribute('p1'), 'property change should update attribute').to.eq(false);

        ce.setAttribute('p1', '');
        expect(ce.hasAttribute('p1'), 'property change should update attribute').to.eq(true);

        ce.removeAttribute('p1');
        expect(ce.hasAttribute('p1'), 'property change should update attribute').to.eq(false);
    });

    it('can have writable properties linked to an attribute having another name', function () {
        Ce = ceb().name(tagName).properties({
            p1: {
                attribute: {
                    name: a1bis
                }
            }
        }).register();
        ce = insertCeAndGet();
        var spiedSetAttribute = sinon.spy(ce, 'setAttribute');
        var spiedGetAttribute = sinon.spy(ce, 'getAttribute');
        var spiedRemoveAttribute = sinon.spy(ce, 'removeAttribute');

        ce.p1 = v1;
        expect(spiedSetAttribute.calledWith(a1bis, v1), 'the attribute should be updated').to.be.true();

        r = ce.p1;
        expect(spiedGetAttribute.calledWith(a1bis), 'the attribute value should be get').to.be.true();

        ce.p1 = v1;
        expect(spiedSetAttribute.calledWith(a1bis, v1), 'the attribute should be updated').to.be.true();

        ce.p1 = null;
        expect(spiedRemoveAttribute.calledWith(a1bis), 'the attribute should be removed').to.be.true();
    });

    it('can have writable properties linked to an attribute having a default value', function () {
        Ce = ceb().name(tagName).properties({
            p1: {
                attribute: true,
                value: v1
            }
        }).register();
        ce = insertCeAndGet();

        expect(ce.getAttribute('p1'), 'the attribute should be equal to v1').to.eq(v1);
        expect(ce.p1, 'ce.p1 should be equal to v1').to.eq(v1);
    });

    it('can have writable properties linked to an attribute having a default value but having already an attribute value', function () {
        Ce = ceb().name(tagName).properties({
            p1: {
                attribute: true,
                value: v1
            }
        }).register();
        sandbox.innerHTML = '<' + tagName + ' p1="' + v2 + '"></' + tagName + '>';
        ce = sandbox.querySelector(tagName);

        expect(ce.getAttribute('p1'), 'the attribute should be equal to v2').to.eq(v2);
        expect(ce.p1, 'ce.p1 should be equal to v2').to.eq(v2);
    });

    it('can have writable properties linked to an attribute having a setter and a getter', function () {
        Ce = ceb().name(tagName).properties({
            p1: {
                attribute: true,
                setter: setter1,
                getter: getter1
            }
        }).register();
        ce = insertCeAndGet();
        var spiedSetAttribute = sinon.spy(ce, 'setAttribute');
        var spiedGetAttribute = sinon.spy(ce, 'getAttribute');

        ce.p1 = v1;
        expect(spiedSetAttribute.calledWith('p1', v1), 'the attribute should be updated').to.be.true();
        expect(setter1.calledWith(ce, v1), 'setter1 should be called').to.be.true();

        r = ce.p1;
        expect(spiedGetAttribute.calledWith('p1'), 'the attribute value should be get').to.be.true();
        expect(getter1.calledWith(ce, v1), 'getter1 should be called').to.be.true();
    });

    it('can have writable properties linked to an attribute and hanving interceptors get and set', function () {
        Ce = ceb().name(tagName).properties({
            p1: {
                attribute: true
            }
        }).intercept('p1', iSet1, iGet1).intercept('p1', iSet2, iGet2).register();
        ce = insertCeAndGet();

        ce.p1 = v1;
        expect(iSet1.calledWith(sinon.match.func, ce, v1), 'iSet1 should be called').to.be.true();
        expect(iSet2.calledWith(sinon.match.func, ce, v1), 'iSet2 should be called').to.be.true();

        var r = ce.p1;
        expect(r, 'get value should be v1').to.eq(v1);
        expect(iGet1.calledWith(sinon.match.func, ce), 'iGet1 should be called').to.be.true();
        expect(iGet2.calledWith(sinon.match.func, ce), 'iGet2 should be called').to.be.true();
    });

    it('can have writable properties linked to an attribute having a setter and getter can have interceptors get and set', function () {
        Ce = ceb().name(tagName).properties({
            p1: {
                attribute: true,
                setter: setter1,
                getter: getter1
            }
        }).intercept('p1', iSet1, iGet1).intercept('p1', iSet2, iGet2).register();
        ce = insertCeAndGet();

        ce.p1 = v1;
        expect(setter1.calledWith(ce, v1), 'setter1 should be called').to.be.true();
        expect(iSet1.calledWith(sinon.match.func, ce, v1), 'iSet1 should be called').to.be.true();
        expect(iSet2.calledWith(sinon.match.func, ce, v1), 'iSet2 should be called').to.be.true();

        var r = ce.p1;
        expect(getter1.calledWith(ce), 'getter1 should be called').to.be.true();
        expect(r, 'get value should be v1').to.eq(v1);
        expect(iGet1.calledWith(sinon.match.func, ce), 'iGet1 should be called').to.be.true();
        expect(iGet2.calledWith(sinon.match.func, ce), 'iGet2 should be called').to.be.true();
    });

    it('can have writable properties delegating to an embedded child attribute', function () {
        Ce = ceb().name(tagName).properties({
            p1: {
                delegate: {
                    target: 'span'
                }
            },
            p2: {
                delegate: {
                    target: 'span',
                    property: 'p2bis'
                }
            },
            p3: {
                delegate: {
                    target: 'span',
                    attribute: 'p3bis'
                }
            }
        }).methods({
            createdCallback: function (el) {
                el.innerHTML = '<span></span>';
            }
        }).register();
        ce = insertCeAndGet();
        var child = ce.querySelector('span');

        ce.p1 = v1;
        expect(child.p1, 'child.p1 should be equal to v1').to.eq(v1);
        expect(ce.p1, 'ce.p1 should be equal to v1').to.eq(v1);

        ce.p2 = v1;
        expect(child.p2bis, 'child.p2bis should be equal to v1').to.eq(v1);
        expect(ce.p2, 'ce.p2 should be equal to v1').to.eq(v1);

        ce.p3 = v1;
        expect(child.getAttribute('p3bis'), 'child attribute p3bis should be equal to v1').to.eq(v1);
        expect(ce.p3, 'ce.p3 should be equal to v1').to.eq(v1);
    });

    it('can have writable properties linked to an attribute delegating to an embedded child attribute', function () {
        Ce = ceb().name(tagName).properties({
            p1: {
                attribute: true,
                delegate: {
                    target: 'span'
                }
            },
            p2: {
                attribute: true,
                delegate: {
                    target: 'span',
                    property: 'p2bis'
                }
            },
            p3: {
                attribute: true,
                delegate: {
                    target: 'span',
                    attribute: 'p3bis'
                }
            },
            p4: {
                attribute: true,
                delegate: {
                    target: 'span',
                    boolean: true
                }
            },
            p5: {
                attribute: {
                    boolean: true,
                },
                delegate: {
                    target: 'span'
                }
            }
        }).methods({
            createdCallback: function (el) {
                el.innerHTML = '<span></span>';
            }
        }).register();
        ce = insertCeAndGet();
        var child = ce.querySelector('span');

        ce.p1 = v1;
        expect(child.getAttribute('p1'), 'child.p1 should be equal to v1').to.eq(v1);
        expect(ce.p1, 'ce.p1 should be equal to v1').to.eq(v1);

        ce.p2 = v1;
        expect(child.p2bis, 'child.p2bis should be equal to v1').to.eq(v1);
        expect(ce.p2, 'ce.p2 should be equal to v1').to.eq(v1);

        ce.p3 = v1;
        expect(child.getAttribute('p3bis'), 'child attribute p3bis should be equal to v1').to.eq(v1);
        expect(ce.p3, 'ce.p3 should be equal to v1').to.eq(v1);

        ce.p4 = true;
        expect(child.hasAttribute('p4'), 'child attribute p4 should exist').to.be.true();
        expect(ce.p4, 'ce.p4 should be true').to.be.true();

        ce.p4 = false;
        expect(child.hasAttribute('p4'), 'child attribute p4 should not exist').to.be.false();
        expect(ce.p4, 'ce.p4 should be false').to.be.false();

        ce.p5 = true;
        expect(child.hasAttribute('p5'), 'child attribute p5 should exist').to.be.true();
        expect(ce.p5, 'ce.p5 should be true').to.be.true();

        ce.p5 = false;
        expect(child.hasAttribute('p5'), 'child attribute p5 should not exist').to.be.false();
        expect(ce.p5, 'ce.p5 should be false').to.be.false();
    });

    it('can have features', function () {
        Ce = ceb().name(tagName).feature(f1, opt1).feature(f2, opt2).feature(f3).register();
        ce = insertCeAndGet();

        expect(f1.setup.calledWith(sinon.match.object, sinon.match.object, opt1), 'f1.setup should be called').to.be.true();
        expect(f2.setup.calledWith(sinon.match.object, sinon.match.object, opt1), 'f2.setup should be called').to.be.true();
    });

    it('can have features setup according to their levels', function () {
        Ce = ceb().name(tagName).feature(f1, opt1, 3).feature(f2, opt2, 2).register();
        ce = insertCeAndGet();

        expect(f1.setup.firstCall.callId > f2.setup.firstCall.callId, 'f1.setup should be called after f2.setup').to.be.true();
        expect(f2.setup.calledWith(sinon.match.object, sinon.match.object, opt1), 'f2.setup should be called').to.be.true();
    });

    it('can have features playing with a builder', function () {
        f1.setup = function (struct, builder, options) {
            builder.methods({
                m1: m1,
                m2: m2
            });
        };
        Ce = ceb().name(tagName).feature(f1, opt1).register();
        ce = insertCeAndGet();

        expect(ce.m1).to.be.instanceOf(Function);
        expect(ce.m2).to.be.instanceOf(Function);
    });

});
