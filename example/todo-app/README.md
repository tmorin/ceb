{% include "/doc/_urls.md" %}
# Todo App

The goal of this example is to create a full single page application managing a list of things to do.

`todo-app` is based on [redux] and [incremental-dom]. 
The logic part of the application is based on the [redux's TodoList example](http://rackt.github.io/redux/docs/basics/ExampleTodoList.html).
The UI part is split into several custom elements and linked to the [redux] stuff with the custom builder [reduxify](../builders/reduxify.md).
The templates of the custom elements are compiled with [idomizer].
Its integration is handled by the custom builder [idomify](../builders/idomify.md).

The live example is available [there][ceb examples].
