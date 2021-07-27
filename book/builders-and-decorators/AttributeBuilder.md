# AttributeBuilder

The class `AttributeBuilder` provides services to initialize an attribute and react on changes.

The static method `AttributeBuilder.get(attrName)` returns a fresh builder.
The builder expects the name of the attribute in kebab case.

```typescript
import {AttributeBuilder} from '@tmorin/ceb'
// creates the builder
const builder = AttributeBuilder.get('an-attribute')
```

The builder and underlying decorators are also technically documented: [AttributeBuilder](../api/classes/attributebuilder.html).

## Boolean value

By default an attribute is a string value.
The method `AttributeBuilder#boolean()` can be used to force a boolean one.

```typescript
import {AttributeBuilder} from '@tmorin/ceb'
// creates the builder
const builder = AttributeBuilder.get('a-boolean-attribute').boolean()
```

The value `true` means the attribute exists: `element.hasAttribute('a-boolean-value') === true`.
When `true`, the value of the attribute is an empty string.

The value `false` means the attribute doesn't exist: `element.hasAttribute('a-boolean-value') === false`.

## Default value

Once instantiated, an attribute can have a default value.
The method `AttributeBuilder#default(value)` can be used to set the default value.

```typescript
import {AttributeBuilder} from '@tmorin/ceb'
// creates the builder and set the default value `a default value`
const builder = AttributeBuilder.get('an-attribute').default('a default value')
```

An attribute of type boolean can also have a default value.

```typescript
import {AttributeBuilder} from '@tmorin/ceb'
// creates the builder and set the default value `false`
const builder = AttributeBuilder.get('an-attribute').boolean().default(true)
```

## Reacting on changes

Listeners can be registered in order to react on attribute changes.
The method `AttributeBuilder#listener(listener)` can be used to set the default value.

```typescript
import {AttributeBuilder} from '@tmorin/ceb'
// creates the builder and add a listener
const builder = AttributeBuilder.get('an-attribute').listener((el, data) => {
    console.log(el.tagName, data.attrName, data.oldVal, data.newVal);
})
```

## The decorator

Attributes can also be defined using a decorator.

```typescript
import {ElementBuilder, AttributeBuilder, AttributeListenerData} from '@tmorin/ceb'
// register the custom element
@ElementBuilder.element<MyCustomElement>()
// defines the custom element class
class MyCustomElement extends HTMLElement {
    // bind the method to the attribute 'an-attribute'
    @AttributeBuilder.listen()
    onAnAttribute(data: AttributeListenerData) {
        console.log(data);
    }
}
```

## An example

The registered custom element is the item of a todo list.
Its API is two attributes.
The first one, `content`, is the description of the task.
The second one, `done`, is a boolean saying if the task is done or not.

<p class="codepen" data-height="400" data-theme-id="light" data-default-tab="js,result" data-slug-hash="vYEXVKd" data-editable="true" data-user="tmorin" style="height: 400px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/tmorin/pen/vYEXVKd">
  &lt;/ceb&gt; ~ AttributeBuilder</a> by Thibault Morin (<a href="https://codepen.io/tmorin">@tmorin</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>
