# FieldBuilder

The class `FieldBuilder` provides services to define fields.
A field is an attribute bound to a property.
The value is hosted by the attribute but it can be mutated using the bound property.

The static method `FieldBuilder.get(attrName)` returns a fresh builder.
The builder expects the name of the property in camel case.

```javascript
import {FieldBuilder} from '@tmorin/ceb'
// creates the builder
const builder = FieldBuilder.get('aField')
```

## Boolean value

By default a field is a string value.
The method `FieldBuilder#boolean()` can be used to force a boolean one.

```javascript
import {FieldBuilder} from '@tmorin/ceb'
// creates the builder
const builder = FieldBuilder.get('aBooleanField').boolean()
```

The value `true` means the attribute exists: `element.hasAttribute('a-boolean-value') === true`.
When `true`, the value of the attribute is an empty string.

The value `false` means the attribute doesn't exist: `element.hasAttribute('a-boolean-value') === false`.

## Attribute name

By default, the attribute name is the kebab case of the property name.
It can be overridden using the method `FieldBuilder#attribute(attrName)`.


```javascript
import {FieldBuilder} from '@tmorin/ceb'
// creates the builder and overrides the attribute name
const builder = FieldBuilder.get('aField').attribute('another-attribute-name')
```

## Reacting on changes

Listeners can be registered in order to react on field changes.
The method `FieldBuilder#listener(listener)` can be used to set the default value.

```javascript
import {FieldBuilder} from '@tmorin/ceb'
// creates the builder and add a listener
const builder = FieldBuilder.get('aField').listener((el, data) => {
    console.log(el.tagName, data.propName, data.attrName, data.oldVal, data.newVal);
})
```

## An example

The registered custom element is the item of a todo list.
Its API is two fields.
The first one, `content`, is the description of the task.
The second one, `done`, is a boolean saying if the task is done or not.

<p class="codepen" data-height="400" data-theme-id="light" data-default-tab="js,result" data-user="tmorin" data-slug-hash="xxbEyRg" style="height: 400px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="ceb - FieldBuilder">
  <span>See the Pen <a href="https://codepen.io/tmorin/pen/xxbEyRg">
  ceb - FieldBuilder</a> by Thibault Morin (<a href="https://codepen.io/tmorin">@tmorin</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>
