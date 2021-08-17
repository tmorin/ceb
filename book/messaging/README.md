# Messaging

`<ceb/>` provides a built-in solution for the implementation of the application logic which relies on an Event/Message architecture.

The main purpose is to strictly separate the interaction logic (i.e. the Custom Elements) and the application logic.
The communication between both worlds is handled by an asynchronous API relying on _messages_ transiting within a _bus_.
A _message_ is a simple data structure expressing an action to do, its result or a notification about one of its side effect.
A _bus_ is a component providing a set of commands to emit and receive _messages_. 

The built-in solution provides a _model_ which expresses the primary building blocks of an Event/Message architecture.
Moreover, a built-in implementation relying on the native DOM Event System is also available, c.f. [DomBus] and [DomBusBuilder].

The reference documentation is there: [messaging].

[DomBus]: ../api/classes/messaging.DomBus.html
[DomBusBuilder]: ../api/classes/messaging.DomBusBuilder.html
[messaging]: ../api/modules/messaging.html
