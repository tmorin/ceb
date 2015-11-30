# ceb-form

## From `form` to `ceb-form`

The main custom element of its example is `ceb-form`.
It's an extension of te native [HTML5 form][HTML5-form].
So, to make it alive, it has to be based on the `HTMLFormElement` prototype and the `form` tag name.

```javascript
import {element} from 'ceb';

let cebFormBuilder =  element().base(Object.create(HTMLFormElement.prototype), 'form');

export default cebFormBuilder.register('ceb-form');
```

The `cebFormBuilder` is ready to be used and the custom element too.

```html
<form is="ceb-form">
    <!-- form controls and more -->
</form>
```

## Prevent submission

`ceb-form` should be able to prevent the default form submission behavior.
The attribute `prevent-submit` will handle this.
If `false` (i.e. no present into the DOM), the default behavior will be preserved, otherwise it will be skipped.

The attribute is defined by the `attribute()` builder.

```javascript
import {element, attribute} from 'ceb';

/* ... */
    
cebFormBuilder.builders(
    attribute('prevent-submit').boolean()
);

/* ... */
```

The prevention of the default behavior has to be done into a listener of the `submit` event.
The listener is added by the `on()` builder.

```javascript
import {element, attribute, on} from 'ceb';

/* ... */
    
cebFormBuilder.builders(
    attribute('prevent-submit').boolean(),
    on('submit').invoke((el, evt) => {
        if (el.preventSubmit) {
            evt.preventDefault();
        }
    })
);

/* ... */
```

Create a `ceb-form` without submit prevention:
```html
<form is="ceb-form">
    <!-- form controls and more -->
</form>
```

Create a `ceb-form` the submit prevention:
```html
<form is="ceb-form" prevent-submit>
    <!-- form controls and more -->
</form>
```

## Prevent native validation

`ceb-form` will handle the validation of the form controls it-self.
So, the native validation has to be deactivated.

```javascript
import {element, attribute, method, on} from 'ceb';

/* ... */

cebFormBuilder.builders(
    method('createdCallback').invoke(el => {
        el.setAttribute('novalidate', '');
    })
);

/* ... */
```

At runtime the custom element could be like that:
```html
<form is="ceb-form" novalidate>
    <!-- form controls and more -->
</form>
```

## Add validation concept

Being close to the [HTML5 form][HTML5-form], `ceb-form` provides two methods:

- `checkValidity()`
- `reportValidity()`

The first one, validates the from and returns a summary object.
The second one, call the first one but emit events according to the summary state.
Moreover, if the form is not valid, the first invalid form control is focused.

### Add rules 

Validations are processed according to rules.
Builtin rules are exposed by a dedicated module `./rules.js`.
`ceb-form` exposes the method `addRule()` to defined custom rules.
`ceb-form` exposes handled rules from the property `rules`.

```javascript
import {element, property, attribute, method, on} from 'ceb';
import {RULES} from './rules.js';

/* ... */

cebFormBuilder.builders(
    property('rules').getter(el => RULES.concat(el._rules || [])),
    method('addRule').invoke((el, name, filter = () => false, apply = () => false) => {
        if (!el._rules) {
            el._rules = [];
        }
        el._rules.push({name, filter, apply});
    })
);

/* ... */
```

### Check the validity of a form control

`checkValidity()` is massively based on `checkFormControlValidity`.
`checkFormControlValidity` validates a form control and returns a summary object.

```javascript
import {element, property, attribute, method, on} from 'ceb';

/* ... */

cebFormBuilder.builders(
    method('checkFormControlValidity').invoke((el, control) => {
        let errors = el.rules
            .filter(rule => rule.filter(control))
            .reduce((result, rule) => {
                result[rule.name] = rule.apply(control);
                return result;
            }, {});
        let controlIsInvalid = Object.keys(errors).reduce((invalid, key) => invalid ? invalid : errors[key], false);
        return {
            element: control,
            valid: !controlIsInvalid,
            invalid: controlIsInvalid,
            errors: errors
        };
    })
);

/* ... */
```

### Check the form validity

The property `elementsAsArray` is added to the custom element in order to iterate over the form controls. 

```javascript
import {element, property, attribute, method, on, toArray} from 'ceb';

/* ... */

cebFormBuilder.builders(
    property('elementsAsArray').getter(el => toArray(el.elements)),
    method('checkValidity').invoke(el => {
        let controls = el.elementsAsArray;
        let controlStates = controls.map(el.checkFormControlValidity, el);
        let formIsValid = controlStates.reduce((valid, state) => valid && state.valid, true);
        return {
            form: el,
            valid: formIsValid,
            invalid: !formIsValid,
            controls: controlStates
        };
    })
);

/* ... */
```

### Report the form validity

The reporting is done from custom event having the type `valid` or `invalid`.
The UI part will be later handled by the dedicated custom element `ceb-field`.

`<ceb/>` provides helpers to dispatch event easily.
There, the helper function `dispatchCustomEvent()` is used.

```javascript
import {element, property, attribute, method, on, toArray, dispatchCustomEvent} from 'ceb';

/* ... */

cebFormBuilder.builders(
    method('reportValidity').invoke(el => {
        let formState = el.checkValidity();
        let formEventType = formState.valid ? 'valid' : 'invalid';
        dispatchCustomEvent(el, formEventType, {
            detail: formState
        });
        formState.controls.forEach(controlState => {
            let controlEventType = controlState.valid ? 'valid' : 'invalid';
            dispatchCustomEvent(controlState.element, controlEventType, {
                detail: controlState
            })
        });
        let firstElement = el.elementsAsArray[0];
        if (firstElement) {
            firstElement.focus();
        }
        return formState;
    })
);

/* ... */
```

## Validate on events

`ceb-form` should be able to report validity according to events.
For instance, on `submit` when the form is invalid, the event propagation should be stopped and the validity reported. 
In another hand, when an input emitted `change`, it should be validated and its validity reported.

`ceb-form` provided two attributes letting the consumer to choose the events to listen.

- `validate-on`
- `validate-control-on`

The events specify using `validate-on` will force the form validation.
The events specify using `validate-control-on` will just validate the event's target.

An helper function has to be defined in order to facilitate the conversion from string to array:
```javascript
import {element, property, attribute, method, on, toArray, dispatchCustomEvent} from 'ceb';

/* ... */

function toEventTypes(string) {
    return (string || '').split(',').map(name => name.toLowerCase()).filter(name => name);
}

/* ... */
```

### Validate the form on events

The event are added and removed dynamically according to the value of the attribute `validate-on`.
And accordingly added or removed when the element is attached or detached. 

```javascript
import {element, property, attribute, method, on, toArray, dispatchCustomEvent} from 'ceb';

/* ... */

cebFormBuilder.on('after:createdCallback').invoke(el => {
    // keep a reference of the listener
    el._validateFormListener = function (evt) {
        let formState = el.reportValidity();
        if (formState.invalid) {
            evt.stopPropagation();
        }
    };
});
cebFormBuilder.on('before:attachedCallback').invoke(el => {
    // add listeners when attached
    toEventTypes(el.validateOn).forEach(type => el.addEventListener(type, el._validateFormListener));
});
cebFormBuilder.on('before:detachedCallback').invoke(el => {
    // remove listeners when attached
    toEventTypes(el.validateOn).forEach(type => el.removeEventListener(type, el._validateFormListener));
});
cebFormBuilder.builders(
    // dynamically add/remove listeners according to the updated value
    attribute('validate-on').listen((el, oldVal, newVal) => {
        toEventTypes(oldVal).forEach(type => el.removeEventListener(type, el._validateFormListener));
        toEventTypes(newVal).forEach(type => el.addEventListener(type, el._validateFormListener));
    })
);

/* ... */
```

### Validate controls on events

The event are added and removed dynamically according to the value of the attribute `validate-control-on`.
And accordingly added or removed when the element is attached or detached. 

```javascript
import {element, property, attribute, method, on, toArray, dispatchCustomEvent} from 'ceb';

/* ... */

cebFormBuilder.on('after:createdCallback').invoke(el => {
    // keep a reference of the listener
    el._validateControlListener = function (evt) {
        let control = evt.target;
        let controlState = el.checkFormControlValidity(control);
        let controlEventType = controlState.valid ? 'valid' : 'invalid';
        dispatchCustomEvent(control, controlEventType, {
            detail: controlState
        });
    };
});
cebFormBuilder.on('before:attachedCallback').invoke(el => {
    // add listeners when attached
    toEventTypes(el.validateControlOn).forEach(type => el.addEventListener(type, el._validateControlListener));
});
cebFormBuilder.on('before:detachedCallback').invoke(el => {
    // remove listeners when attached
    toEventTypes(el.validateControlOn).forEach(type => el.removeEventListener(type, el._validateControlListener));
});
cebFormBuilder.builders(
    // dynamically add/remove listeners according to the updated value
    attribute('validate-control-on').listen((el, oldVal, newVal) => {
        toEventTypes(oldVal).forEach(type => el.removeEventListener(type, el._validateControlListener));
        toEventTypes(newVal).forEach(type => el.addEventListener(type, el._validateControlListener));
    })
);

/* ... */
```

### Reset validation state on reset

On `reset`, the form should dispatch a `valid` event.

```javascript
import {element, property, attribute, method, on, toArray, dispatchCustomEvent} from 'ceb';

/* ... */

cebFormBuilder.builders(
    on('reset').invoke(el => {
        let controlStates = el.elementsAsArray.map(control => ({
            element: control,
            valid: true,
            invalid: false,
            errors: {}
        }));
        let formState = {
            valid: true,
            invalid: false,
            controls: controlStates
        };
        dispatchCustomEvent(el, 'valid', {
            detail: formState
        });
        controlStates.forEach(state => dispatchCustomEvent(state.element, 'valid', {
            detail: state
        }));
    })
);

/* ... */
```

[HTML5-form]: https://html.spec.whatwg.org/multipage/forms.html
