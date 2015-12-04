# Templator

This example show how to extends the `script` element in order to compile its content on the fly. 

## From `script` to `ceb-templator`

`ceb-button` is an extension of te native [HTML5 script][HTML5-script].
So, to make it alive, it has to be based on the `HTMLScriptElement` prototype and the `script` tag name.

```javascript
import {element} from 'ceb';

let cebTemplatorBuilder = element().base(Object.create(HTMLScriptElement.prototype), 'script');

export default cebTemplatorBuilder.register('ceb-templator');
```

The `cebTemplatorBuilder` is ready to be used and the custom element too.

```html
<script is="ceb-templator"></script>
```

At the end, the custom element could declared like below.

```html
<script is="ceb-templator" type="text/x-handlebars-template">
    <p>{{items.length}} items</p>
    <ul>
        {{#each items}}
            <li>{{name}}</li>
        {{/each}}
    </ul>
</script>
```

## About rendering

Templating engines are registered according to their respective content type.

```javascript
import {element} from 'ceb';
import handlebars from 'handlebars/dist/handlebars.js';

/* ... */

const COMPILERS = {
    'text/x-handlebars-template'(tpl) {
        return handlebars.compile(tpl);
    }
};

/* ... */
```

## Getting the content type

Listening the values is not necessary, its value will  be used when the rendering will have to be done.

```javascript
import {element, attribute} from 'ceb';

/* ... */

cebTemplatorBuilder.builders(
    attribute('type')
);

/* ... */
```

## Rendering

The custom element provides a method which will return the result compilation.

```javascript
import {element, attribute, method} from 'ceb';

/* ... */

cebTemplatorBuilder.builders(
    method('render').invoke((el, data) => {
        let render = COMPILERS[el.type];
        if (render) {
            return render(el.textContent)(data);
        }
    })
);

/* ... */
```

[HTML5-script]: https://html.spec.whatwg.org/multipage/script.html
