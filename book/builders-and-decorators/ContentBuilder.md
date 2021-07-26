# ContentBuilder

The class `ContentBuilder` provides service to initialize the HTML content of the custom element.

The static method `ContentBuilder.get(content)` returns a fresh builder.
The builder expects a content in string or a function providing it.

```javascript
import {ContentBuilder} from '@tmorin/ceb'
// creates the builder
const builder = ContentBuilder.get('<strong>the content</strong>')
```

The builder and underlying decorators are also technically documented: [ContentBuilder](../api/classes/contentbuilder.html).

## Initialize the shadow DOM

By default, the builder initializes the light DOM of the custom element.
The method `ContentBuilder#shadow(focus)` can be used to force the initialization of a shadow DOM.

```javascript
import {ContentBuilder} from '@tmorin/ceb'
// initializes the shadow DOM of the custom element
const builder = ContentBuilder.get('a content').shadow()
```

## The decorator

Templates can also be defined using decorators.

```javascript
import {ElementBuilder, ContentBuilder} from '@tmorin/ceb'
// register the custom element
@ElementBuilder.element<MyCustomElement>()
// define the template
@ContentBuilder.template({content: '<p><input></p>', isShadow: true})
// defines the custom element class
class MyCustomElement extends HTMLElement {
}
```

## Example

The registered custom element is initialized with a shadow DOM wrapping its light DOM.

<p class="codepen" data-height="400" data-theme-id="light" data-default-tab="js,result" data-user="tmorin" data-slug-hash="BayQzPK" style="height: 400px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="&amp;lt;/ceb&amp;gt; ~ ContentBuilder">
  <span>See the Pen <a href="https://codepen.io/tmorin/pen/BayQzPK">
  &lt;/ceb&gt; ~ ContentBuilder</a> by Thibault Morin (<a href="https://codepen.io/tmorin">@tmorin</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>
