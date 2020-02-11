# OnBuilder

The class `OnBuilder` provides services to listen to DOM events.
Listeners are added on `connectedCallback` and removed on `disconnectedCallback`.

The static method `OnBuilder.get(clauses)` returns a fresh builder.
The builder expects the clauses defining the event types to listen to and eventually a query selector.
Clauses have to be separated by comas.

```javascript
import {OnBuilder} from '@tmorin/ceb'
// creates the builder
const builder = OnBuilder.get('click, dblclick')
```

The builder and underlying decorators are also technically documented: [OnBuilder](../api/classes/onbuilder.html).

## Listening to events from the custom element

By default, the listeners are added to the custom element it-self.

```javascript
import {OnBuilder} from '@tmorin/ceb'
// add a listener to the custom element listening to `click` events
const builder = OnBuilder.get('click').invoke((el, evt, target) => {
    console.log(el.tagName, evt.type, target.tagName);
    console.assert(el.tagName === target.tagName)
})
```

## Listening to events from a child node

The listeners can also be added to a child node.
The query selector targeting the child node has to be given next to the DOM event type.

```javascript
import {OnBuilder} from '@tmorin/ceb'
// add a listener to the first child button listening to `click` events
const builder = OnBuilder.get('click button').invoke((el, evt, target) => {
    console.log(el.tagName, evt.type, target.tagName);
    console.assert(el.tagName !== target.tagName);
    console.assert('BUTTON' === target.tagName)
})
```

## Bubbling and capture phase

By default, the listeners are invoked on the bubbling phase.
The method `OnBuilder#capture()` can be used to force the capture phase.

```javascript
import {OnBuilder} from '@tmorin/ceb'
// add a listener listening `click` events on the capture phase
const builder = OnBuilder.get('click button').capture()
```

More information are available on developer.mozilla.org about [event bubbling and capture].

[Event bubbling and capture]: https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#Event_bubbling_and_capture

## event.preventDefault() and event.stopPropagation()

The method `Event#preventDefault()` and `Event#stopPropagation()` can be automatically called.

```javascript
import {OnBuilder} from '@tmorin/ceb'
// add a listener listening `submit` events and preventing the default behavior
const builder = OnBuilder.get('submit').prevent();
// add a listener listening `submit` events and stopping the event propagation
const builder = OnBuilder.get('button').stop();
// add a listener listening `submit` events and preventing the default behavior as well as stopping the event propagation
const builder = OnBuilder.get('button').skip()
```

## Event delegation

Event delegation allows us to attach a single event listener, to a parent element, that will fire for all descendants matching a selector, whether those descendants exist now or are added in the future.
[c.f. JQuery doc](https://learn.jquery.com/events/event-delegation)

The method `OnBuilder#delegate(selector)` is used to define the selector.

```javascript
import {OnBuilder} from '@tmorin/ceb'
// add a listener listening `click` events on children matching the selector `li button.delete`
const builder = OnBuilder.get('click').delegate('li button.delete')
```

## Shadow DOM

By default, the listeners are listening events coming from the light DOM.

The method `OnBuilder#shadow()` adds the listener to the `shadowRoot` property.
So that, the listener only listen to events coming from the shadow DOM.

```javascript
import {OnBuilder} from '@tmorin/ceb'
// add a listener listening `click` events coming from the shadow DOM
const builder = OnBuilder.get('click').shadow()
```

## The decorator

On listeners can also be defined using decorator.

```javascript
import {ElementBuilder, OnBuilder} from '@tmorin/ceb'
// register the custom element
@ElementBuilder.element<MyCustomElement>();
// defines the custom element class
class MyCustomElement extends HTMLElement {
    // defines the listener
    @OnBuilder.listen('event-name')
    on(data: Event) {
        console.log(data);
    }
}
```

## Example

The registered custom element is an extension of the `ul` element.
It reacts on `click` events coming from `button`.
When a button is clicked, its parent `li` is removed from the DOM.

<p class="codepen" data-height="400" data-theme-id="light" data-default-tab="js,result" data-user="tmorin" data-slug-hash="LYERaao" style="height: 400px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="ceb ~ OnBuilder">
  <span>See the Pen <a href="https://codepen.io/tmorin/pen/LYERaao">
  ceb ~ OnBuilder</a> by Thibault Morin (<a href="https://codepen.io/tmorin">@tmorin</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

