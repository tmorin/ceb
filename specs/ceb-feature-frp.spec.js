describe('ceb-feature-frp', function () {
    'use strict';

    cebFeatureFrp.defaultLibrary = 'Rx';

    function insertCeAndGet() {
        var ce = document.createElement(tagName);
        sandbox.appendChild(ce);
        return sandbox.querySelector(tagName);
    }

    var timeout = 20,
        sandbox = document.createElement('div'),
        counter = 0,
        tagName,
        ce, ceCloned,
        div,
        disposable1,
        aDisposableFactory1,
        callback1,
        disposable2,
        aDisposableFactory2,
        callback2,
        disposable3,
        aDisposableFactory3,
        callback3,
        spiedSet;

    beforeEach(function () {
        div = document.body.appendChild(sandbox).appendChild(document.createElement('div'));
        tagName = 'tag-ceb-feature-frp-' + (counter++);

        disposable1 = new window.Rx.Subject();
        sinon.spy(disposable1, 'dispose');
        aDisposableFactory1 = sinon.stub().returns(disposable1);
        callback1 = sinon.spy();

        disposable2 = new window.Rx.Subject();
        sinon.spy(disposable2, 'dispose');
        aDisposableFactory2 = sinon.stub().returns(disposable2);
        callback2 = sinon.spy();

        disposable3 = new window.Rx.Subject();
        sinon.spy(disposable3, 'dispose');
        aDisposableFactory3 = sinon.stub().returns(disposable3);
        callback3 = sinon.spy();
        spiedSet = sinon.spy();

    });

    describe('A custom element', function () {

        describe('having an observable properties', function () {
            beforeEach(function (done) {
                ceb().name(tagName).properties({
                    p1: {
                        observable: true
                    },
                    p2: {
                        attribute: true,
                        observable: true
                    },
                    p3: {
                        set: spiedSet,
                        observable: true
                    }
                }).feature(cebFeatureFrp).register();
                ce = insertCeAndGet();
                setTimeout(done, timeout);
            });
            it('should be have an observer', function () {
                expect(ce.p1Observer).to.exist();
                expect(ce.p2Observer).to.exist();
                expect(ce.p3Observer).to.exist();
            });
            describe('when the property is set', function () {
                beforeEach(function (done) {
                    ce.p1Observer.subscribe(callback1);
                    ce.p1 = 'test';
                    ce.p2Observer.subscribe(callback2);
                    ce.p2 = 'test';
                    ce.p3Observer.subscribe(callback2);
                    ce.p3 = 'test';
                    setTimeout(done, timeout);
                });
                it('should be observed', function () {
                    expect(callback1.calledWith('test')).to.exist();
                    expect(callback2.calledWith('test')).to.exist();
                    expect(callback3.calledWith('test')).to.exist();
                });
                describe('when the element is cloned', function () {
                    beforeEach(function (done) {
                        ceCloned = ce.cloneNode(true);
                        sandbox.appendChild(ceCloned);
                        setTimeout(done, timeout);
                    });
                    describe('and the property is set', function () {
                        var callback2;
                        beforeEach(function (done) {
                            callback2 = sinon.spy();
                            ceCloned.p1Observer.subscribe(callback2);
                            ceCloned.p1 = 'test';
                            setTimeout(done, timeout);
                        });
                        it('should be observed', function () {
                            expect(callback2.calledWith('test')).to.exist();
                        });
                    });
                });
            });
            describe('when the element is detached', function () {
                beforeEach(function (done) {
                    ce.parentNode.removeChild(ce);
                    setTimeout(done, timeout);
                });
                it('should not have observer', function () {
                    expect(ce.p1Observer).to.not.exist();
                });
                describe('when the element is attached', function () {
                    beforeEach(function (done) {
                        sandbox.appendChild(ce);
                        setTimeout(done, timeout);
                    });
                    it('should have observer', function () {
                        expect(ce.p1Observer).to.exist();
                    });
                });
            });
        });

        describe('can have observers which', function () {
            beforeEach(function (done) {

                ceb().name(tagName).feature(cebFeatureFrp, {
                    disposables: [
                        aDisposableFactory1,
                        cebFeatureFrp.disposable(function () {
                            return disposable2;
                        }).handlers(function () {}),
                        cebFeatureFrp.disposable(function () {
                            return {};
                        }).handlers(function () {
                            return disposable3;
                        }),
                        cebFeatureFrp.disposable(function () {
                            return {};
                        }).handlers(function () {
                            return {};
                        })
                    ]
                }).register();
                ce = insertCeAndGet();
                setTimeout(done, timeout);
            });
            it('should be created', function () {
                expect(aDisposableFactory1.calledWith(ce)).to.exist();
            });
            describe('when the element is detached', function () {
                beforeEach(function (done) {
                    ce.parentNode.removeChild(ce);
                    setTimeout(done, timeout);
                });
                it('should be disposed', function () {
                    expect(disposable1.dispose.called).to.be.true();
                    expect(disposable3.dispose.called).to.be.true();
                    expect(disposable3.dispose.called).to.be.true();
                });
                describe('when the element is attached', function () {
                    beforeEach(function (done) {
                        sandbox.appendChild(ce);
                        setTimeout(done, timeout);
                    });
                    it('should be disposed', function () {
                        expect(aDisposableFactory1.calledWith(ce)).to.exist();
                    });
                });
            });
        });

    });

});
