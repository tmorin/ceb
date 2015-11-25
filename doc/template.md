# template()

The function `template()` returns a fresh `TemplateBuilder` providing services to define ... a template.

## Import

```javascript
import {template} from 'ceb';
```

## Usage

The template can be given as a `string` or a `function`. The function will be called on `createdCallback`.

```javascript
import {ceb, template} from 'ceb';
ceb()
    .builders(
        template(`<button></button>`)
    )
    .register('ceb-example');
```

```javascript
import {ceb, template} from 'ceb';
ceb()
    .builders(
        template(el => `<button>${el.tagName}</button>`)
    )
    .register('ceb-example');
```

## Light and shadow DOM

According to [caniuse.com](http://caniuse.com/#search=Shadow%20DOM),
the Shadow DOM isn't yet implemented by most of the browsers.
However, the template builder is able to simulate its behaviors when a custom element needs to wrap its light DOM with others elements.

### Handling a pseudo Shadow DOM

If the _pseudo Shadow_ flag is not defined, the light DOM of the custom element will be lost.
The flag can be an attribute (`ceb-content`) or like the Shadow DOM specification expect: an element (`content`).

If an attribute (`ceb-content`) is found, the light DOM nodes of the custom element will be moved inside the attribute element.

If the element (`content`) is found, it will be replaced by a `ceb-lightdom` element, and the light DOM nodes will be moved inside this one.

### Getting the light DOM node

Custom element augmented with `template()` get a property `lightDom` which returns the light DOM element.
If the template doesn't have the _pseudo Shadow_ flag, the `lightDom` will return the custom element itself.

Furthermore, the templating process is able to handle embedded light DOM.
In this case, the `lightDom` value of the root node, will be the `lightDom` of the last child having a _pseudo Shadow_ flag.

### Example

So, given the following custom element: 
```javascript
import {ceb, template, attribute, delegate} from 'ceb';
ceb()
    .builders(
        delegate(attribute('icon')).to('i').setter((el, name) => `fa fa-${name}`).attribute('class'),
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
<ceb-example icon="check"><strong>OK</strong></ceb-example>
```

The rendered DOM of `ceb-example` will be closed to the following fragment:

```html
<ceb-example icon="check">
    <i class="fa fa-check"></i>
    <span><strong>OK</strong></span>
</ceb-example>
```
