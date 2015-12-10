{% include "/doc/_urls.md" %}
# Testing

Writing tests of custom elements can be a little bit tricky.
The following statements try to give guidelines to handle them correctly.
Obviously, these guidelines should not be understood as universal.
They're come from the point of view of the implementation of the `<ceb/>`'s tests.

## Tools and libraries

`<ceb/>`'s tests are written with [mocha] in [ES2015] following the [BDD] style.
The tests are transpilled to [ES5] and then executed with the help of [karma], [webpack] and [babel].

The configuration is available from the following files:

- `karma.config.base.js`: base configuration
- `karma.config.ci.js`: configuration for [circle-ci], i.e. [Sauce Labs]
- `karma.config.local.js`: configuration for local environment, i.e. [PhantomJS]

## Skeleton

Custom elements can only be fully tested from an alive DOM.
So, a sandbox has to be created and destroyed using the [mocha]'s hooks for each tests.
The sandbox content can be initialized by an HTML snippet.
Obviously, additional variables can be initialized to avoid code duplication.

The following snippet is coming from the `ceb-from`'s specification, `example/form/ceb-form.spec.js`.

```javascript
import './ceb-form.js';
import {dispatchMouseEvent, dispatchHtmlEvent} from 'ceb';

describe('ceb-form, () => {
   var sandbox, cebForm, submitBtn, resetBtn;

    beforeEach((done) => {
        if (sandbox) {
            sandbox.parentNode.removeChild(sandbox);
        }
        document.body.appendChild((sandbox = document.createElement('div')));
        sandbox.innerHTML = `
            <form is="ceb-form" prevent-submit>
                <input name="prop1" value="value1">
                <input name="prop2" value="value2">
                <button type="submit"></button>
                <button type="reset"></button>
            </form>
        `;
        cebForm = sandbox.querySelector('form');
        submitBtn = sandbox.querySelector('[type="submit"]');
        resetBtn = sandbox.querySelector('[type="reset"]');
        setTimeout(() => done(), 100);
    });

    afterEach(() => {
        sandbox.innerHTML = '';
    });
});
```

Every looks good, except the following line: `setTimeout(() => done(), 100);`.
Basically: it's ugly.
However it's necessary because the custom elements are created asynchronously according to the native and/or polyfill implementations.
Presently, it's difficult and maybe impossible to know when the custom elements are really _ready_.

## Dealing with events

One of the functionality of `ceb-from` is to prevent the default behavior of the `submit` event.

The following snippet is also coming from the `ceb-from`'s specification.
It's goal is to test the statement described above.

```javascript
it('should prevent submit event', (done) => {
    cebForm.addEventListener('submit', function listener(evt) {
        expect(evt.defaultPrevented).to.be.true;
        cebForm.removeEventListener(cebForm, listener);
        done();
    });
    dispatchMouseEvent(submitBtn, 'click');
});
```

