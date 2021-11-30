# Messaging

`<ceb/>` provides a built-in solution for the implementation of the application logic which relies on an Event/Message Architecture.

The original purpose is to strictly separate the interaction logic (i.e. the Custom Elements) and the application logic.
The communication between both worlds is handled by an asynchronous API relying on _messages_ transiting within _buses_.
A _message_ is a simple data structure expressing an action to do, its result or a notification about one of its side effect.
A _bus_ is a component providing a set of commands to emit and receive _messages_. 

The core of the solution is composed of a _model_ and a set of building blocks implementing an Event/Message Architecture.
The reference implementation is a vanilla TypeScript/JavaScript flavor working in almost all JavaScript context: Browser, Node, Electron ...
Additional packages provide support for side concerns like integration, testing ...
