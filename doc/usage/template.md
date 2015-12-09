{% include "/doc/_urls.md" %}
# template()

The function `template()` returns a fresh `TemplateBuilder` providing services to define ... a template.

The template can be given as a `string` or a `function`. The function will be called on `createdCallback`.

```javascript
import {element, template} from 'ceb';
element()
    .builders(
        template(`<button></button>`)
    )
    .register('ceb-example');
```

```javascript
import {element, template} from 'ceb';
element()
    .builders(
        template(el => `<button>${el.tagName}</button>`)
    )
    .register('ceb-example');
```

## Light and shadow DOM

According to [caniuse.com], the Shadow DOM isn't yet implemented by most of the browsers.

However, the template builder is able to simulate a part of its behaviors
when a custom element needs to wrap its light DOM with others elements.

## Handling a pseudo Shadow DOM

If the _pseudo Shadow_ flag is not defined, the light DOM of the custom element will be lost.
The flag can be an attribute (`ceb-content`) or like the Shadow DOM specification expect: an element (`content`).

If an attribute (`ceb-content`) is found, the light DOM nodes of the custom element will be moved inside the attribute's element.

If the element (`content`) is found, it will be replaced by a `ceb-lightdom` element, and the light DOM nodes will be moved inside this one.

## Getting the light DOM node

Custom element augmented with `template()` get a property `lightDOM` which returns the light DOM element.
If the template doesn't have the _pseudo Shadow_ flag, the `lightDOM` will return the custom element itself.

Furthermore, the templating process is able to handle embedded light DOM.
In this case, the `lightDOM` value of the root node, will be the `lightDOM` of the last child having a _pseudo Shadow_ flag.

## Example

So, given the following custom element: 
```javascript
import {element, template, attribute, delegate} from 'ceb';
element()
    .builders(
        // when the icon attribute is updated, the icon property will be manually updated 
        attribute('icon').unbound().value('ckeck').listen((el, oldVal, newVal) => el.icon = `fa fa-${newVal}`),

        // when the icon updated, the class attribute of the i element will be updated
        delegate(property('icon')).to('i').attribute('class'),

        // when the attribute or property is updated, the property disabled of the button will be also updated
        delegate(attribute('disabled').boolean()).to('button').property(),

        // when the focus method is invoked, the focus method the button will be also invoked
        delegate(method('focus')).to('button'),

        template(`
            <button>
                <i class="fa fa-check"></i>
                <content></content>
            </button>
        `)
    )
    .register('ceb-example');
```

Which can be used like below:

```html
<ceb-example icon="check" disabled>
    <strong>OK</strong>
</ceb-example>
```

Will be closed to the following HTML fragment:

```html
<ceb-example icon="check" disabled>
    <button>
        <i class="fa fa-check"></i>
        <ceb-lightdom>
            <strong>OK</strong>
        </ceb-lightdom>
    </button>
</ceb-example>
```
