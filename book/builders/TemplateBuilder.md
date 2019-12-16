# TemplateBuilder

The class `TemplateBuilder` provides service to initialize the HTML content of the custom element.

The static method `TemplateBuilder.get(content)` returns a fresh builder.
The builder expects a content in string or a function providing it.

```javascript
import {TemplateBuilder} from '@tmorin/ceb'
// creates the builder
const builder = TemplateBuilder.get('<strong>the content</strong>')
```

## Initialize the shadow DOM

By default, the builder initializes the light DOM of the custom element.
The method `TemplateBuilder#shadow(focus)` can be used to force the initialization of a shadow DOM.

```javascript
import {TemplateBuilder} from '@tmorin/ceb'
// initializes the shadow DOM of the custom element
const builder = TemplateBuilder.get('a content').shadow()
```

## Example

The registered custom element is initialized with a shadow DOM wrapping its light DOM.

<p class="codepen" data-height="400" data-theme-id="light" data-default-tab="js,result" data-user="tmorin" data-slug-hash="BayQzPK" style="height: 400px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="&amp;lt;/ceb&amp;gt; ~ TemplateBuilder">
  <span>See the Pen <a href="https://codepen.io/tmorin/pen/BayQzPK">
  &lt;/ceb&gt; ~ TemplateBuilder</a> by Thibault Morin (<a href="https://codepen.io/tmorin">@tmorin</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>
