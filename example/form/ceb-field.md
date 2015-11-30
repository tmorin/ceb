# ceb-field

`ceb-field` is like the `form-group` of [bootstrap][bootstrap].

At the beginning:
```javascript
import {element} from 'ceb';

let cebFieldBuilder = element();

export default cebFormBuilder.register('ceb-field');
```

The `cebFieldBuilder` is ready to be used and the custom element too.

```html
<ceb-field>
    <!-- form controls and more -->
</ceb-field>
```

## `.$el`

To be able to nicely play with the DOM, the jquery instance of the custom element is exposed by the property `.$el`.

```javascript
import {element} from 'ceb';
import $ from 'jquery';

/* ... */

cebFieldBuilder.on('before:createdCallback').invoke(el => {
    el.$el = $(el);
});

/* ... */
```

## Be a bootstrap's form-group

```javascript
import {element, method} from 'ceb';

/* ... */

cebFieldBuilder.builders(
    method('createdCallback').invoke(el => {
        el.$el.addClass('form-group').css('display', 'block');
    })
);

/* ... */
```

## Handle validation messages

Validation messages are not given by the events `valid` and `invalid`.
There are handled by the `ceb-field` it-self.

```javascript
import {element, method, property} from 'ceb';

/* ... */

cebFieldBuilder.builders(
    property('messages').value({
        required: 'The field is required.',
        maxlength: data => `The value must be lower than ${data.maxlength} characters.`,
        minlength: data => `The value must be higher than ${data.minlength} characters.`
    })
);

/* ... */
```

## Report validity

The validity states of form controls are stored into the property `_invalidControlStates`.
The method `reportValidity` iterates over theses invalid controls states to update the UI and give a feedback to the user.

```javascript
import {element, method, property} from 'ceb';

/* ... */

cebFieldBuilder.on('before:createdCallback').invoke(el => {
    el._invalidControlStates = [];
});
cebFieldBuilder.builders(
    method('reportValidity').invoke(el => {
        let helpBlockContent = el._invalidControlStates.map(state => {
            let errors = state.errors;
            return Object.keys(errors).map(key => {
                let message = el.messages[key];
                if (typeof message === 'function') {
                    message = message(errors[key]);
                }
                return message;
            });
        }).reduce((string, messages) => [string].concat(messages).join(', '), '');
        el.$el.removeClass('has-error').find('.help-block.errors').remove();
        if (helpBlockContent) {
            el.$el.addClass('has-error').append(`<p class="help-block errors">${helpBlockContent}</p>`);
        }
    })
);

/* ... */
```

## Handle invalid controls

When a control is invalid, the `_invalidControlStates` is updated and `reportValidity` is called.

```javascript
import {element, method, property, on} from 'ceb';

/* ... */

cebFieldBuilder.builders(
    on('invalid').invoke((el, evt) => {
        let currentControlState = evt.detail;
        let persistedControlState = el._invalidControlStates.filter((state => {
            return state.element === currentControlState.element
        }))[0];
        if (persistedControlState) {
            let index = el._invalidControlStates.indexOf(persistedControlState);
            el._invalidControlStates.slice(index, 1);
        }
        el._invalidControlStates.push(currentControlState);
        el.reportValidity();
    })
);

/* ... */
```

## Handle valid controls 

When a control is valid, the `_invalidControlStates` is updated and `reportValidity` is called.

```javascript
import {element, method, property, on} from 'ceb';

/* ... */

cebFieldBuilder.builders(
    on('invalid').invoke((el, evt) => {
        let currentControlState = evt.detail;
        let persistedControlState = el._invalidControlStates.filter((state => {
            return state.element === currentControlState.element
        }))[0];
        if (persistedControlState) {
            let index = el._invalidControlStates.indexOf(persistedControlState);
            el._invalidControlStates.slice(index, 1);
        }
        el._invalidControlStates.push(currentControlState);
        el.reportValidity();
    })
);

/* ... */
```

[bootstrap]: http://getbootstrap.com/
