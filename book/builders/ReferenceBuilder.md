# ReferenceBuilder

The class `ReferenceBuilder` provides services to bind a property to a embedded DOM element.

The static method `ReferenceBuilder.get(propName)` returns a fresh builder.
The builder expects the name of the property in camel case.

```javascript
import {ReferenceBuilder} from '@tmorin/ceb'
// creates the builder
const builder = ReferenceBuilder.get('myInput')
```

## Default selector

By default, the builder binds the property to a child having the same id.
For instance, the property `propName` is bound to the selector `#propName`.

The method `ReferenceBuilder#selector(selector)` can be used to override the default selector.

```javascript
import {ReferenceBuilder} from '@tmorin/ceb'
// initializes the shadow DOM of the custom element
const builder = ReferenceBuilder.get('myInput').selector('input.my-input')
```

## Bind to list of elements

By default, the builder binds the property to a single element.

The method `ReferenceBuilder#array()` can be used to bind the property to a list of matching elements.

```javascript
import {ReferenceBuilder} from '@tmorin/ceb'
// initializes the shadow DOM of the custom element
const builder = ReferenceBuilder.get('activeLiList').selector('li.active').array()
```

## Bind relative to the shadow DOM

By default, the builder binds the property relative to the light DOM.

The method `ReferenceBuilder#shadow()` can be used to bind the property relative to the  shadow DOM.

```javascript
import {ReferenceBuilder} from '@tmorin/ceb'
// initializes the shadow DOM of the custom element
const builder = ReferenceBuilder.get('button').shadow()
```

## Example

The registered custom element counts the number of selected `li` and displays it.

<p class="codepen" data-height="400" data-theme-id="light" data-default-tab="js,result" data-user="tmorin" data-slug-hash="LYEbRLE" style="height: 400px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="&amp;lt;/ceb&amp;gt; ~ ReferenceBuilder">
  <span>See the Pen <a href="https://codepen.io/tmorin/pen/LYEbRLE">
  &lt;/ceb&gt; ~ ReferenceBuilder</a> by Thibault Morin (<a href="https://codepen.io/tmorin">@tmorin</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>
