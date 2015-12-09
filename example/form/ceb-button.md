{% include "/doc/_urls.md" %}
# ceb-button

## From `button` to `ceb-button`

`ceb-button` is an extension of te native [HTML5 button].
So, to make it alive, it has to be based on the `HTMLButtonElement` prototype and the `button` tag name.

```javascript
import {element} from 'ceb';

let cebButtonBuilder = element().base(Object.create(HTMLButtonElement.prototype), 'button');

export default cebButtonBuilder.register('ceb-button');
```

The `cebButtonBuilder` is ready to be used and the custom element too.

```html
<button is="ceb-button"></form>
```

## `.$el`

To be able to nicely play with the DOM, the jquery instance of the custom element is exposed by the property `.$el`.

```javascript
import {element} from 'ceb';
import $ from 'jquery';

/* ... */

cebButtonBuilder.on('before:createdCallback').invoke(el => {
    el.$el = $(el);
});

/* ... */
```

## Be a bootstrap's btn

```javascript
import {element, method} from 'ceb';

/* ... */

cebButtonBuilder.builders(
    method('createdCallback').invoke(el => {
        el.$el.addClass('btn');
    })
);

/* ... */
```

## Handle alternative styles

According to the alternative style of the button (primary, success, warning, etc.),
the class attribute has to be updated.

```javascript
import {element, method, attribute} from 'ceb';

/* ... */

cebButtonBuilder.builders(
    attribute('alt-style')
        .value('default')
        .listen((el, oldValue, newValue) => {
            el.$el.removeClass('btn-' + oldValue).addClass('btn-' + newValue);
        })
);

/* ... */
```
