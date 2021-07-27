# PropertyDelegateBuilder

The class `PropertyDelegateBuilder` provides services to delegate the accesses of a property to a single target (i.e. a child node).

The static method `PropertyDelegateBuilder.get(propName)` returns a fresh builder.
The builder expects the name of a property.

```typescript
import {PropertyDelegateBuilder} from '@tmorin/ceb'
// creates the builder
const builder = PropertyDelegateBuilder.get('aProperty')
```

The builder and underlying decorators are also technically documented: [PropertyDelegateBuilder](../api/classes/propertydelegatebuilder.html).

## Set the selector

The method `PropertyDelegateBuilder#to(selector)` has to be used to define the selector.
The selector is mandatory otherwise the builder won't be able to identify the targets.

```typescript
import {PropertyDelegateBuilder} from '@tmorin/ceb'
// delegate the accesses to the property 'aProperty'
const builder = PropertyDelegateBuilder.get('aProperty')
    .to('button');
```

## Shadow DOM

By default, the builder selects targets relative to the light DOM.

The method `PropertyDelegateBuilder#shadow()` can be used to select targets relative to the shadow DOM.

```typescript
import {PropertyDelegateBuilder} from '@tmorin/ceb'
// delegate the accesses to the property 'aProperty'
const builder = PropertyDelegateBuilder.get('aProperty')
    .to('button')
    .shadow();
```

## Bind to another property

By default, the builder mutates the same targets' property.

The method `PropertyDelegateBuilder#property(toPropName)` can be used to force another property name.

```typescript
import {PropertyDelegateBuilder} from '@tmorin/ceb'
// delegate the accesses to the property 'aProperty'
const builder = PropertyDelegateBuilder.get('aProperty')
    .to('button')
    .property('anotherProperty');
```

## Bind to an attribute

The method `PropertyDelegateBuilder#attribute(toAttrName)` can be used to force the mutation of an attribute.

```typescript
import {PropertyDelegateBuilder} from '@tmorin/ceb'
// delegate the accesses to the property 'aProperty'
const builder = PropertyDelegateBuilder.get('aProperty')
    .to('button')
    .attribute('an-attribute');
```

The option `PropertyDelegateBuilder#boolean()` can be used if the attribute is a `boolean`.

```typescript
import {PropertyDelegateBuilder} from '@tmorin/ceb'
// delegate the accesses to the property 'aProperty'
const builder = PropertyDelegateBuilder.get('aProperty')
    .to('button')
    .attribute('a-boolean-attribute')
    .boolean();
```

## The decorator

Property delegations can also be defined using a decorator.

```typescript
import {ElementBuilder, PropertyDelegateBuilder} from '@tmorin/ceb'
// register the custom element
@ElementBuilder.element<MyCustomElement>()
// defines the custom element class
class MyCustomElement extends HTMLElement {
    // define an attribute delegation
    @PropertyDelegateBuilder.delegate('input')
    aProperty = 'a value'
}
```

## Example

The registered custom element is composed of a single `input`.
The boolean property `disabled` is delegated to the attribute `disabled` of the `input`.
The property `placeholder` is delegated to the attribute `placeholder` of the `input`.

<p class="codepen" data-height="400" data-theme-id="light" data-default-tab="js,result" data-slug-hash="eYNeNwa" data-editable="true" data-user="tmorin" style="height: 400px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/tmorin/pen/eYNeNwa">
  &lt;/ceb&gt; ~ PropertyDelegateBuilder</a> by Thibault Morin (<a href="https://codepen.io/tmorin">@tmorin</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>
