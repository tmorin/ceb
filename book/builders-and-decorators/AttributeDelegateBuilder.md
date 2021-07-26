# AttributeDelegateBuilder

The class `AttributeDelegateBuilder` provides services to delegate the mutations of an attribute to targets (i.e. a child nodes).

The static method `AttributeDelegateBuilder.get(attributeBuilder)` returns a fresh builder.
The builder expects the instance of an `AttributeBuilder`.

```javascript
import {AttributeDelegateBuilder, AttributeBuilder} from '@tmorin/ceb'
// creates the builder
const builder = AttributeDelegateBuilder.get(AttributeBuilder.get('an-attribute'))
```

The builder and underlying decorators are also technically documented: [AttributeDelegateBuilder](../api/classes/attributedelegatebuilder.html).

## Set the selector

The method `AttributeDelegateBuilder#to(selector)` has to be used to define the selector.
The selector is mandatory otherwise the builder won't be able to identify the targets.

```javascript
import {AttributeDelegateBuilder, AttributeBuilder} from '@tmorin/ceb'
// delegate the accesses to the attribute 'an-attribute'
const builder = AttributeDelegateBuilder.get(AttributeBuilder.get('an-attribute'))
    .to('button');
```

## Shadow DOM

By default, the builder selects targets relative to the light DOM.

The method `AttributeDelegateBuilder#shadow()` can be used to select targets relative to the shadow DOM.

```javascript
import {AttributeDelegateBuilder, AttributeBuilder} from '@tmorin/ceb'
// delegate the accesses to the attribute 'an-attribute'
const builder = AttributeDelegateBuilder.get(AttributeBuilder.get('an-attribute'))
    .to('button')
    .shadow();
```

## Bind to another attribute

By default, the builder mutates the same targets' attribute.

The method `AttributeDelegateBuilder#attribute(toAttrName)` can be used to force another attribute name.

```javascript
import {AttributeDelegateBuilder, AttributeBuilder} from '@tmorin/ceb'
// delegate the accesses to the attribute 'an-attribute'
const builder = AttributeDelegateBuilder.get(AttributeBuilder.get('an-attribute'))
    .to('button')
    .attribute('another-attribute');
```

## Bind to a property

The method `AttributeDelegateBuilder#property(toPropName)` can be used to force the mutation of a property.

```javascript
import {AttributeDelegateBuilder, AttributeBuilder} from '@tmorin/ceb'
// delegate the accesses to the attribute 'an-attribute'
const builder = AttributeDelegateBuilder.get(AttributeBuilder.get('an-attribute'))
    .to('button')
    .property('aProperty');
```

## The decorator

Attribute delegations can also be defined using a decorator.

```javascript
import {ElementBuilder, AttributeDelegateBuilder} from '@tmorin/ceb'
// register the custom element
@ElementBuilder.element<MyCustomElement>()
// define an attribute delegation
@AttributeDelegateBuilder.delegate('value', 'input')
// defines the custom element class
class MyCustomElement extends HTMLElement {
}
```

## Example

The registered custom element is composed of an `input` and a button `button`.
The boolean attribute `disabled` is delegated to both `input` and `button`.
The attribute `placeolder` is delegated to the `input`.
The attribute `label` is delegated to the `textContent` property of the `button`.

<p class="codepen" data-height="400" data-theme-id="light" data-default-tab="js,result" data-user="tmorin" data-slug-hash="XWJNOwN" style="height: 400px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="&amp;lt;/ceb&amp;gt; ~ AttributeDelegateBuilder">
  <span>See the Pen <a href="https://codepen.io/tmorin/pen/XWJNOwN">
  &lt;/ceb&gt; ~ AttributeDelegateBuilder</a> by Thibault Morin (<a href="https://codepen.io/tmorin">@tmorin</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>
