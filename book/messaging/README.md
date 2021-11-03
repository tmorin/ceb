# Messaging

`<ceb/>` provides a built-in solution for the implementation of the application logic which relies on an Event/Message architecture.

The main purpose is to strictly separate the interaction logic (i.e. the Custom Elements) and the application logic.
The communication between both worlds is handled by an asynchronous API relying on _messages_ transiting within a _bus_.
A _message_ is a simple data structure expressing an action to do, its result or a notification about one of its side effect.
A _bus_ is a component providing a set of commands to emit and receive _messages_. 

The core of the solution is composed of a _model_ and a set of building blocks implementing an Event/Message architecture.
The core is part of the [@tmorin/ceb-messaging-core](https://www.npmjs.com/package/@tmorin/ceb-messaging-core) package.
Its usage is cover by the reference documentation: [@tmorin/ceb-messaging-core](../api/modules/_tmorin_ceb_messaging_core.html).

Moreover, the solution provides two implementations of the _model_.
The first one is a DOM base implementation: [@tmorin/ceb-messaging-dom](https://www.npmjs.com/package/@tmorin/ceb-messaging-dom).
Its usage is cover by the reference documentation: [@tmorin/ceb-messaging-dom](../api/modules/_tmorin_ceb_messaging_dom.html).
It leverages on the native DOM Event System to handles the messages.
The second one is a vanilla TypeScript/JavaScript implementation: [@tmorin/ceb-messaging-simple](https://www.npmjs.com/package/@tmorin/ceb-messaging-simple).
Its usage is cover by the reference documentation: [@tmorin/ceb-messaging-simple](../api/modules/_tmorin_ceb_messaging_simple.html).

Finally, the solution provides also a Bus adapter for the [Inter Process Communication](https://en.wikipedia.org/wiki/Inter-process_communication) implementation of Electron: [@tmorin/ceb-messaging-bus-adapter-ipc](https://www.npmjs.com/package/@tmorin/ceb-messaging-bus-adapter-ipc).
Its usage is cover by the reference documentation: [@tmorin/ceb-messaging-bus-adapter-ipc](../api/modules/_tmorin_ceb_messaging_bus_adapter_ipc.html).
