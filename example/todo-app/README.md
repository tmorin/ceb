{% include "/doc/_urls.md" %}
# Todo App

The goal of this example is to create a full single page application managing a list of things to do.

`todo-app` is based on [redux] and [incremental-dom]. 
The logic part of the application is based on the [redux's TodoList example].
The UI part is split into several custom elements and linked to the [redux] stuff with the custom builder [reduxify](../builders/reduxify.md).
The templates of the custom elements are compiled with [idomizer].
Its integration is handled by the custom builder [idomify](../builders/idomify.md).

The live example is alive [there][live-todo-app].

# Logic

According to the [redux's TodoList example], the logic is split into three files:

* `actions.js`: contains the action types and action creators
* `reducers.js`: contains the reducers __todos__  and __visibilityFilter__
* `store.js`: create and expose the redux' store

# UI

The UI part is split into small custom elements. The dependencies are describes below:

* `todo-app`
  * `todo-add`
  * `todo-filters`
  * `todo-clear-completed`
  * `todo-list`
    * `todo-list-item`

[redux's TodoList example]: http://rackt.github.io/redux/docs/basics/ExampleTodoList.html
