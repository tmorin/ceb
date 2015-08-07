import Rx from 'rx';
import cebFeatureCqrs from './ceb-feature-cqrs';

var rootCmdStream = new Rx.Subject();
var rootEvtStream = new Rx.Subject();

var sendCommand = function (name, payload, metadata) {
    rootCmdStream.onNext({
        name: name,
        payload: payload,
        metadata: metadata
    });
};

var publishEvent = function (name, payload, metadata) {
    rootEvtStream.onNext({
        name: name,
        payload: payload,
        metadata: metadata
    });
};

var cmdHandlerFactory = function (el, cmdName, prepareFn, processFn) {
    var cmdStream = rootCmdStream.filter(function (cmd) {
        return cmd.name === cmdName;
    });
    return cmdStream.subscribe(function (cmd) {
        cmd.apply = function (evtName, payload, metadata) {
            publishEvent(evtName, payload, metadata || cmd.metadata);
        };
        if(prepareFn) {
            prepareFn(el, Rx.Observable.just(cmd)).subscribe(function (value) {
                processFn(el, cmd, value);
            });
        } else {
            processFn(el, cmd, cmd);
        }
    });
};

var evtListenerFactory = function (el, evtName, prepareFn, processFn) {
    var evtStream = rootEvtStream.filter(function (evt) {
        return evt.name === evtName;
    });
    return evtStream.subscribe(function (evt) {
        var stream = prepareFn ? prepareFn(el, Rx.Observable.just(evt)) : Rx.Observable.just(evt);
        stream.subscribe(function (value) {
            processFn(el, evt, value);
        });
    });
};

var disposeStream = function (stream) {
    stream.dispose();
};

cebFeatureCqrs.libraries.Rx = {
    sendCommand: sendCommand,
    publishEvent: publishEvent,
    cmdHandlerFactory: cmdHandlerFactory,
    evtListenerFactory: evtListenerFactory,
    destroyCmdHandler: disposeStream,
    destroyListenerHandler: disposeStream
};

export default cebFeatureCqrs;