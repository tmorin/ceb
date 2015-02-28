describe('ceb-feature-cqrs', function() {
    'use strict';

    cebFeatureCqrs.defaultLibrary = 'Rx';

    function insertCeAndGet() {
        var ce = document.createElement(tagName);
        sandbox.appendChild(ce);
        return sandbox.querySelector(tagName);
    }

    var timeout = 50, sandbox = document.createElement('div'), counter = 0, tagName, ce, evtName, cmdName, div, 
    spiedProcess1, spiedProcess2, payload, handler1, handler2, listener1, listener2;

    beforeEach(function() {
        div = document.body.appendChild(sandbox).appendChild(document.createElement('div'));
        tagName = 'tag-ceb-feature-caq-' + (counter++);
        cmdName = 'cmd-' + (counter++);
        evtName = 'evt-' + (counter++);
    });

    describe('A custom element', function() {
        describe('can have handlers', function() {
            var spiedApply;
            beforeEach(function() {
                spiedProcess1 = sinon.spy();
                handler1 = cebFeatureCqrs.handle(cmdName).prepare(function(el, stream) {
                    return stream.map(function (cmd) {
                        return cmd.payload;
                    });
                }).process(spiedProcess1);
                handler2 = cebFeatureCqrs.handle(cmdName, {
                    library: 'Rx'
                }).process(function (ce, cmd) {
                    spiedApply = sinon.spy(cmd.apply);
                    spiedApply(evtName, cmd.payload);
                });
                ceb().name(tagName).feature(cebFeatureCqrs, {
                    handlers: [handler1, handler2]
                }).register();
                ce = insertCeAndGet();
            });
            describe('when the command is sent', function() {
                beforeEach(function(done) {
                    payload = 'payload';
                    ce.sendCommand(cmdName, payload);
                    setTimeout(done, timeout);
                });
                it('should execute the process', function() {
                    expect(spiedProcess1.calledWith(
                        ce,
                        sinon.match.object,
                        payload
                    )).to.eq(true);
                    expect(spiedApply.called).to.eq(true);
                });
                describe('when the element is detached', function () {
                    beforeEach(function (done) {
                        ce.parentNode.removeChild(ce);
                        setTimeout(done, timeout);
                    });
                    it('should be disposed', function () {
                        expect(cebFeatureCqrs(ce).handlers).to.be.null();
                    });
                    describe('when the element is attached', function () {
                        beforeEach(function (done) {
                            sandbox.appendChild(ce);
                            setTimeout(done, timeout);
                        });
                        it('should be disposed', function () {
                            expect(cebFeatureCqrs(ce).handlers).to.be.not.null();
                        });
                    });
                });
            });
        });

        describe('can have listeners', function() {
            beforeEach(function() {
                spiedProcess1 = sinon.spy();
                spiedProcess2 = sinon.spy();
                listener1 = cebFeatureCqrs.listen(evtName).prepare(function(el, stream) {
                    return stream.map(function (evt) {
                        return evt.payload;
                    });
                }).process(spiedProcess1);
                listener2 = cebFeatureCqrs.listen(evtName, {
                    library: 'Rx'
                }).process(spiedProcess2);
                ceb().name(tagName).feature(cebFeatureCqrs, {
                    listeners: [listener1, listener2]
                }).register();
                ce = insertCeAndGet();
            });
            describe('when the command is sent', function() {
                beforeEach(function(done) {
                    payload = 'payload';
                    ce.publishEvent(evtName, payload);
                    setTimeout(done, timeout);
                });
                it('should execute the process', function() {
                    expect(spiedProcess1.calledWith(
                        ce,
                        sinon.match.object,
                        payload)
                    ).to.eq(true);
                });
                describe('when the element is detached', function () {
                    beforeEach(function (done) {
                        ce.parentNode.removeChild(ce);
                        setTimeout(done, timeout);
                    });
                    it('should be disposed', function () {
                        expect(cebFeatureCqrs(ce).listeners).to.be.null();
                    });
                    describe('when the element is attached', function () {
                        beforeEach(function (done) {
                            sandbox.appendChild(ce);
                            setTimeout(done, timeout);
                        });
                        it('should be disposed', function () {
                            expect(cebFeatureCqrs(ce).listeners).to.be.not.null();
                        });
                    });
                });
            });
        });
    });

});
