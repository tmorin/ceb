describe('A custom element', function () {
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

    var sandbox = document.createElement('div'),
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
        r, child;

    document.body.appendChild(sandbox);

    beforeEach(function () {
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
        r = undefined;
    });

    describe('registered from scratch', function () {
        beforeEach(function () {
            Ce = ceb().name(tagName).register();
        });
        it('should be created from Javascript', function () {
            ce = document.createElement(tagName);
            expect(ce.tagName).to.eq(tagName.toUpperCase());
        });
        describe('', function () {
            beforeEach(function (done) {
                var div = document.createElement('div');
                sandbox.appendChild(div);
                div.innerHTML = '<' + tagName + '></' + tagName + '>';
                setTimeout(done, 0);
            });
            it('should be created from HTML', function () {
                expect(sandbox.querySelector(tagName).tagName).to.eq(tagName.toUpperCase());
            });
        });
    });

    describe('registered from an existing HTML Element', function () {
        beforeEach(function () {
            Ce = ceb().name(tagName).extends('button').prototype(Object.create(HTMLButtonElement.prototype)).register();
        });
        it('should be created from JavaScript', function () {
            ce = document.createElement('button', tagName);
            expect(ce, 'should be created from JavaScript').to.not.eq(undefined);
        });
        describe('', function () {
            beforeEach(function (done) {
                var div = document.createElement('div');
                sandbox.appendChild(div);
                div.innerHTML = '<button is="' + tagName + '"></button>';
                setTimeout(done, 0);
            });
            it('should be created from HTML', function () {
                expect(sandbox.querySelector('button').tagName, 'should be created from HTML').to.eq('BUTTON');
            });
        });
    });

    describe('registered twice', function () {
        var first, second;
        beforeEach(function () {
            var builder = ceb().name(tagName);
            first = builder.register();
            second = builder.register();
        });
        it('should be regsitered the first time', function () {
            expect(first).to.exist();
        });
        it('should not be registered the second time', function () {
            expect(second).to.not.exist();
        });
    });

    describe('registered from a given structure', function () {
        beforeEach(function () {
            var struct = ceb().name('test').methods({
                m1: m1
            }).get();
            Ce = ceb({
                struct: struct
            }).name(tagName).register();
        });
        describe('', function () {
            it('should be created from javaScript', function () {
                ce = document.createElement(tagName);
                expect(ce.tagName).to.eq(tagName.toUpperCase());
                expect(ce.m1).to.be.instanceOf(Function);
            });
        });
        describe('', function () {
            beforeEach(function (done) {
                var div = document.createElement('div');
                sandbox.appendChild(div);
                div.innerHTML = '<' + tagName + '></' + tagName + '>';
                setTimeout(done, 0);
            });
            it('should be created from HTML', function () {
                expect(sandbox.querySelector(tagName).tagName).to.eq(tagName.toUpperCase());
                expect(ce.m1).to.be.instanceOf(Function);
            });
        });
    });

    describe('registered from a bad structure', function () {
        beforeEach(function () {
            Ce = ceb({
                struct: {
                    methods: {
                        m1: m1
                    }
                }
            }).name(tagName).register();
        });
        it('should be created', function () {
            ce = document.createElement(tagName);
            expect(ce.tagName).to.eq(tagName.toUpperCase());
        });
    });

    describe('can have methods which', function () {
        beforeEach(function () {
            Ce = ceb().name(tagName).methods({
                m1: m1
            }).register();
            ce = insertCeAndGet();
            ce.m1(arg1, arg2, arg3);
        });
        it('should be functions', function () {
            expect(ce.m1).to.be.instanceOf(Function);
        });
        it('should be called with the right argumets', function () {
            expect(m1.calledWith(ce, arg1, arg2, arg3)).to.eq(true);
        });
    });

    describe('can have wrappers which', function () {
        beforeEach(function () {
            Ce = ceb().name(tagName).methods({
                m1: m1
            }).wrap('m1', w2, 1).wrap('m1', w1).register();
            ce = insertCeAndGet();
            ce.m1(arg1, arg2, arg3);
        });
        it('should be called with the rights arguments', function () {
            expect(w1.calledWith(sinon.match.func, ce, arg1, arg2, arg3)).to.true();
            expect(w2.calledWith(sinon.match.func, ce, arg1, arg2, arg3)).to.true();
        });
        it('should be called with the right order', function () {
            expect(w2.getCall(0).callId < w1.getCall(0).callId).to.true();
            expect(w1.getCall(0).callId < m1.getCall(0).callId).to.true();
        });
    });

    describe('can have event listeners which', function () {
        beforeEach(function (done) {
            Ce = ceb().name(tagName).listen('anevent, anevent span', m1).register();
            var div = document.createElement('div');
            sandbox.appendChild(div);
            div.innerHTML = '<' + tagName + '><span></span></' + tagName + '>';
            ce = div.querySelector(tagName);
            child = ce.querySelector('span');
            setTimeout(done, 0);
        });
        describe('when an event occured', function () {
            var evt;
            beforeEach(function () {
                try {
                    evt = new CustomEvent('anevent', {
                        'bubbles': true
                    });
                } catch (e) {
                    evt = document.createEvent('CustomEvent');
                    evt.initCustomEvent('anevent', true, true, {});
                }
                child.dispatchEvent(evt);
            });
            it('should be called with the right argumets', function () {
                expect(m1.calledWith(ce, evt)).to.eq(true);
                expect(m1.callCount).to.eq(2);
            });
        });
        describe('when the the element is detached', function () {
            beforeEach(function (done) {
                ce.parentNode.removeChild(ce);
                setTimeout(done, 10);
            });
            it('should be removed', function () {
                expect(ce.__eventHandlers).to.be.null();
            });
        });
    });

    describe('can have constants which', function () {
        var error;
        beforeEach(function () {
            Ce = ceb().name(tagName).properties({
                c1: {
                    value: v1,
                    writable: false
                }
            }).register();
            ce = insertCeAndGet();

            try {
                ce.c1 = v2;
            } catch (e) {
                error = e;
            }
        });
        it('should not be writable', function () {
            expect(ce.c1).to.eq(v1);
            expect(!!error || ce.c1 === v1).to.true();
        });
    });

    describe('can have constants and interceptors get and set which', function () {
        beforeEach(function () {
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
                expect(iSet1.called && iSet1.called).to.false();
            }
            r = ce.c1;
        });
        it('should not be called', function () {
            expect(iGet1.called && iGet2.called).to.false();
            expect(iGet1.called && iGet2.called).to.false();
        });
    });

    describe('can have writable properties wich', function () {
        beforeEach(function () {
            Ce = ceb().name(tagName).properties({
                p1: {}
            }).register();
            ce = insertCeAndGet();
        });
        it('should exist', function () {
            /* jshint -W103 */
            if (ce.__proto__) {
                expect(ce.__proto__).to.have.ownProperty('p1');
            }
            /* jshint +W103 */
        });
        it('should be writable', function () {
            ce.p1 = v1;
            expect(ce.p1).to.eq(v1);
        });
    });

    describe('can have writable properties having a default value which', function () {
        beforeEach(function () {
            Ce = ceb().name(tagName).properties({
                p1: {
                    value: v1
                }
            }).register();
            ce = insertCeAndGet();
        });
        it('should initialized', function () {
            expect(ce.p1).to.eq(v1);
        });
        it('should be writable', function () {
            ce.p1 = v2;
            expect(ce.p1).to.eq(v2);
        });
    });

    describe('can have writable properties having accessors set and get which', function () {
        beforeEach(function () {
            Ce = ceb().name(tagName).properties({
                p1: {
                    set: set1,
                    get: get1
                }
            }).register();
            ce = insertCeAndGet();
        });
        it('should be called on set', function () {
            ce.p1 = v1;
            expect(set1.calledWith(ce, v1)).to.be.true();
        });
        it('should be called on get', function () {
            r = ce.p1;
            expect(get1.calledWith(ce)).to.be.true();
        });
    });

    describe('can have writable properties having interceptors get and set which', function () {
        beforeEach(function () {
            Ce = ceb().name(tagName).properties({
                p1: {}
            }).register();
            ce = insertCeAndGet();
        });
        describe('', function () {
            beforeEach(function () {
                ce.p1 = v1;
            });
            it('should not be called when the properties are set', function () {
                expect(iSet1.called).to.be.false();
                expect(iSet2.called).to.be.false();
            });
        });
        describe('', function () {
            beforeEach(function () {
                ce.p1 = v1;
                r = ce.p1;
            });
            it('should not be called when the properties are get', function () {
                expect(iGet1.called).to.be.false();
                expect(iGet1.called).to.be.false();
            });
        });
    });

    describe('can have writable properties having accessors set and get and have interceptors get and set which', function () {
        beforeEach(function () {
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
            }).intercept('p1', iSet1, iGet1).intercept('p1', iSet2, iGet2).intercept('p2', iSet1, null).intercept('p3', null, iGet2).register();
            ce = insertCeAndGet();
        });
        describe('when properties are set', function () {
            beforeEach(function () {
                ce.p1 = v1;
            });
            it('should be called', function () {
                expect(set1.calledWith(ce, v1)).to.be.true();
                expect(iSet1.calledWith(sinon.match.func, ce, v1)).to.be.true();
                expect(iSet2.calledWith(sinon.match.func, ce, v1)).to.be.true();
            });
        });
        describe('when properties are get', function () {
            beforeEach(function () {
                ce.p1 = v1;
                r = ce.p1;
            });
            it('should be called', function () {
                expect(get1.calledWith(ce)).to.be.true();
                expect(iGet1.calledWith(sinon.match.func, ce)).to.be.true();
                expect(iGet2.calledWith(sinon.match.func, ce)).to.be.true();
            });
            it('should return values', function () {
                expect(r).to.eq(v1);
            });
        });
    });

    describe('can have writable properties linked to an attribute which', function () {
        var spiedSetAttribute, spiedGetAttribute, spiedRemoveAttribute;
        beforeEach(function () {
            Ce = ceb().name(tagName).properties({
                p1: {
                    attribute: true
                }
            }).register();
            ce = insertCeAndGet();
            spiedSetAttribute = sinon.spy(ce, 'setAttribute');
            spiedGetAttribute = sinon.spy(ce, 'getAttribute');
            spiedRemoveAttribute = sinon.spy(ce, 'removeAttribute');
        });
        describe('when properties are set', function () {
            beforeEach(function () {
                ce.p1 = v1;
            });
            it('should have attributes updated', function () {
                expect(ce.getAttribute('p1')).to.eq(v1);
            });
            describe('when properties are set to null', function () {
                beforeEach(function () {
                    ce.p1 = null;
                });
                it('should have attributes removed', function () {
                    expect(ce.hasAttribute('p1')).to.be.false();
                });
            });
        });
        describe('when attributes are updated', function () {
            beforeEach(function () {
                ce.setAttribute('p1', v1);
                // set an attribute which is noot know from the structure should ne break something
                // but up the coverage to 100%
                ce.setAttribute('p2', v1);
            });
            it('should have properties set', function () {
                expect(ce.p1).to.eq(v1);
            });
            describe('when attributes are removed', function () {
                beforeEach(function () {
                    ce.removeAttribute('p1');
                });
                it('should have properties set to null', function () {
                    expect(ce.p1).to.be.null();
                });
            });
        });
    });

    describe('can have writable properties linked to boolean attributes which', function () {
        beforeEach(function () {
            Ce = ceb().name(tagName).properties({
                p1: {
                    attribute: {
                        boolean: true
                    }
                }
            }).register();
            ce = insertCeAndGet();
        });
        describe('when properties are set to true', function () {
            beforeEach(function () {
                ce.p1 = true;
            });
            it('should have attributes updated', function () {
                expect(ce.hasAttribute('p1')).to.be.true();
            });
            describe('when properties are set to false', function () {
                beforeEach(function () {
                    ce.p1 = false;
                });
                it('should have attributes removed', function () {
                    expect(ce.hasAttribute('p1')).to.be.false();
                });
            });
        });
        describe('when properties are updated', function () {
            beforeEach(function () {
                ce.setAttribute('p1', '');
            });
            it('should have properties set to true', function () {
                expect(ce.p1).to.be.true();
            });
            describe('when properties are removed', function () {
                beforeEach(function () {
                    ce.removeAttribute('p1');
                });
                it('should have properties set to false', function () {
                    expect(ce.p1).to.be.false();
                });
            });
        });
    });

    describe('can have writable properties linked to attributes having other names which', function () {
        beforeEach(function () {
            Ce = ceb().name(tagName).properties({
                p1: {
                    attribute: {
                        name: a1bis
                    }
                }
            }).register();
            ce = insertCeAndGet();
        });
        describe('when properties are set', function () {
            beforeEach(function () {
                ce.p1 = v1;
            });
            it('should have attributes updated', function () {
                expect(ce.getAttribute(a1bis)).to.eq(v1);
            });
        });
        describe('when attributes are updated', function () {
            beforeEach(function () {
                ce.setAttribute(a1bis, v2);
            });
            it('should have properties set', function () {
                expect(ce.p1).to.eq(v2);
            });
            describe('when attributes are removed', function () {
                beforeEach(function () {
                    ce.removeAttribute(a1bis);
                });
                it('should have properties set to null', function () {
                    expect(ce.p1).to.be.null();
                });
            });
        });
    });

    describe('can have writable properties linked to attributes having a default value which', function () {
        beforeEach(function () {
            Ce = ceb().name(tagName).properties({
                p1: {
                    attribute: true,
                    value: v1
                }
            }).register();
            ce = insertCeAndGet();
        });
        it('should have attributes initialized', function () {
            expect(ce.getAttribute('p1')).to.eq(v1);
        });
        it('should have properties initialized', function () {
            expect(ce.p1).to.eq(v1);
        });
    });

    describe('can have writable properties linked to attributes having a default and having already an attribute value wich', function () {
        beforeEach(function (done) {
            Ce = ceb().name(tagName).properties({
                p1: {
                    attribute: true,
                    value: v1
                },
                p2: {
                    attribute: {
                        boolean: true
                    },
                    value: false
                }
            }).register();
            var div = document.createElement('div');
            sandbox.appendChild(div);
            div.innerHTML = '<' + tagName + ' p1="' + v2 + '" p2></' + tagName + '>';
            ce = sandbox.querySelector(tagName);
            setTimeout(done, 0);
        });
        it('should have attributes initialized according to their attribute value', function () {
            expect(ce.getAttribute('p1')).to.eq(v2);
            expect(ce.hasAttribute('p2')).to.be.true();
        });
        it('should have properties initialized according to their attribute value', function () {
            expect(ce.p1).to.eq(v2);
            expect(ce.p2).to.eq(true);
        });
    });

    describe('can have writable properties linked to attributes having a setter and a getter which', function () {
        beforeEach(function () {
            Ce = ceb().name(tagName).properties({
                p1: {
                    attribute: true,
                    setter: setter1,
                    getter: getter1
                }
            }).register();
            ce = insertCeAndGet();
        });
        describe('', function () {
            beforeEach(function () {
                ce.p1 = v1;
            });
            it('should be called when properties are set', function () {
                expect(setter1.calledWith(ce, v1)).to.be.true();
            });
            describe('', function () {
                beforeEach(function () {
                    r = ce.p1;
                });
                it('should be called when properties are get', function () {
                    expect(getter1.calledWith(ce, v1)).to.be.true();
                });
            });
        });
    });

    describe('can have writable properties linked to attributes having interceptors get and set which', function () {
        beforeEach(function () {
            Ce = ceb().name(tagName).properties({
                p1: {
                    attribute: true
                }
            }).intercept('p1', iSet1, iGet1).intercept('p1', iSet2, iGet2).register();
            ce = insertCeAndGet();
        });
        describe('when properties are set', function () {
            beforeEach(function () {
                ce.p1 = v1;
            });
            it('should be call', function () {
                expect(iSet1.calledWith(sinon.match.func, ce, v1), 'iSet1 should be called').to.be.true();
                expect(iSet2.calledWith(sinon.match.func, ce, v1), 'iSet2 should be called').to.be.true();
            });
            describe('when properties are get', function () {
                beforeEach(function () {
                    r = ce.p1;
                });
                it('should be call', function () {
                    expect(iGet1.calledWith(sinon.match.func, ce), 'iGet1 should be called').to.be.true();
                    expect(iGet2.calledWith(sinon.match.func, ce), 'iGet2 should be called').to.be.true();
                });
            });
        });
    });

    describe('can have writable properties linked to attributes having a setter and getter and interceptors get and set wich', function () {
        beforeEach(function () {
            Ce = ceb().name(tagName).properties({
                p1: {
                    attribute: true,
                    setter: setter1,
                    getter: getter1
                }
            }).intercept('p1', iSet1, iGet1).intercept('p1', iSet2, iGet2).register();
            ce = insertCeAndGet();
        });
        describe('when properties are set', function () {
            beforeEach(function () {
                ce.p1 = v1;
            });
            it('should be called', function () {
                expect(setter1.calledWith(ce, v1), 'setter1 should be called').to.be.true();
                expect(iSet1.calledWith(sinon.match.func, ce, v1), 'iSet1 should be called').to.be.true();
                expect(iSet2.calledWith(sinon.match.func, ce, v1), 'iSet2 should be called').to.be.true();
            });
            describe('when properties are get', function () {
                beforeEach(function () {
                    r = ce.p1;
                });
                it('should be called', function () {
                    expect(getter1.calledWith(ce), 'getter1 should be called').to.be.true();
                    expect(r, 'get value should be v1').to.eq(v1);
                    expect(iGet1.calledWith(sinon.match.func, ce), 'iGet1 should be called').to.be.true();
                    expect(iGet2.calledWith(sinon.match.func, ce), 'iGet2 should be called').to.be.true();
                });
            });
        });
    });

    describe('can have writable properties delegating to embedded childs properties', function () {
        beforeEach(function () {
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
                }
            }).methods({
                createdCallback: function (el) {
                    el.innerHTML = '<span></span>';
                }
            }).register();
            ce = insertCeAndGet();
            child = ce.querySelector('span');
        });
        describe('', function () {
            beforeEach(function () {
                ce.p1 = v1;
            });
            it('should delegate to childs properties', function () {
                expect(child.p1).to.eq(v1);
                expect(ce.p1).to.eq(v1);
            });
        });
        describe('when properties names are different', function () {
            beforeEach(function () {
                ce.p2 = v1;
            });
            it('should delegate to childs properties', function () {
                expect(child.p2bis).to.eq(v1);
                expect(ce.p2).to.eq(v1);
            });
        });
    });

    describe('can have writable properties delegating to embedded childs attributes', function () {
        beforeEach(function () {
            Ce = ceb().name(tagName).properties({
                p1: {
                    delegate: {
                        target: 'span',
                        attribute: 'p1'
                    }
                },
                p2: {
                    delegate: {
                        target: 'span',
                        attribute: 'p2',
                        boolean: true
                    }
                }
            }).methods({
                createdCallback: function (el) {
                    el.innerHTML = '<span></span>';
                }
            }).register();
            ce = insertCeAndGet();
            child = ce.querySelector('span');
        });
        describe('', function () {
            beforeEach(function () {
                ce.p1 = v1;
            });
            it('should delegate to child attributes', function () {
                expect(child.getAttribute('p1')).to.eq(v1);
                expect(ce.p1).to.eq(v1);
            });
        });
        describe('when targetted attibutes are boolean', function () {
            beforeEach(function () {
                ce.p2 = true;
            });
            it('should delegate to child attributes', function () {
                expect(child.getAttribute('p2')).to.eq('');
                expect(ce.p2).to.eq(true);
            });
        });
    });

    describe('can have writable properties linked to attributes delegating to embedded childs attributes which', function () {
        beforeEach(function () {
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
            child = ce.querySelector('span');
        });
        describe('', function () {
            beforeEach(function (done) {
                ce.setAttribute('p1', v1);
                setTimeout(done, 0);
            });
            it('should delegate to childs attributes', function () {
                expect(child.getAttribute('p1'), 'child attribute should have the good value').to.eq(v1);
                expect(ce.p1, 'element property should have the good value').to.eq(v1);
            });
        });
        describe('when attributes are updated', function () {
            beforeEach(function (done) {
                ce.setAttribute('p2', v1);
                setTimeout(done, 0);
            });
            it('should delegate to childs properties', function () {
                expect(child.p2bis, 'child.p2bis should be equal to v1').to.eq(v1);
                expect(ce.p2, 'ce.p2 should be equal to v1').to.eq(v1);
            });
        });
        describe('when attributes are updated delegating to other childs attributes', function () {
            beforeEach(function () {
                ce.p3 = v1;
            });
            it('should delegate to childs attributes', function () {
                expect(child.getAttribute('p3bis'), 'child attribute p3bis should be equal to v1').to.eq(v1);
                expect(ce.p3, 'ce.p3 should be equal to v1').to.eq(v1);
            });
        });
        describe('when boolean attributes are updated delegating to other childs attributes', function () {
            beforeEach(function (done) {
                ce.setAttribute('p4', '');
                setTimeout(done, 0);
            });
            it('should delegate to the child', function () {
                expect(child.hasAttribute('p4'), 'child attribute p4 should exist').to.be.true();
                expect(ce.p4, 'ce.p4 should be true').to.be.true();
            });
            describe('when boolean attributes are removed delegating to other childs attributes', function () {
                beforeEach(function (done) {
                    ce.removeAttribute('p4', '');
                    setTimeout(done, 0);
                });
                it('should delegate to the child', function () {
                    expect(child.hasAttribute('p4'), 'child attribute p4 should not exist').to.be.false();
                    expect(ce.p4, 'ce.p4 should be false').to.be.false();
                });
            });
        });
    });

    describe('can have features which', function () {
        beforeEach(function () {
            Ce = ceb().name(tagName).feature(f2, opt2, 2).feature(f1, opt1, 1).feature(f3).register();
            ce = insertCeAndGet();
        });
        it('should be setup with the good arguments', function () {
            expect(f1.setup.calledWith(sinon.match.object, sinon.match.object, opt1)).to.be.true();
            expect(f2.setup.calledWith(sinon.match.object, sinon.match.object, opt1)).to.be.true();
        });
        it('should be setup according to their levels', function () {
            expect(f2.setup.firstCall.callId > f1.setup.firstCall.callId).to.be.true();
        });
    });

    describe('can have features playing with a builder which', function () {
        beforeEach(function () {
            f1.setup = function (struct, builder, options) {
                builder.methods({
                    m1: m1,
                    m2: m2
                });
            };
            Ce = ceb().name(tagName).feature(f1, opt1).register();
            ce = insertCeAndGet();
        });
        it('should create functions', function () {
            expect(ce.m1).to.be.instanceOf(Function);
            expect(ce.m2).to.be.instanceOf(Function);
        });
    });

});
