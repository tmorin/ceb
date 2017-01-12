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

The following mocha's spec is coming from the `ceb`'s specification, `test/ceb.on.spec.js`.

```javascript
import {element, template, on, dispatchCustomEvent} from '../src/ceb.js';

describe('ceb.on()', function () {
    // the sandbox is a div used to host DOM nodes required for the test, especially the tested custom element
    let sandbox;
    
    // before each test case the sandbox is refreshed
    beforeEach(() => {
       if (sandbox) {
           sandbox.parentNode.removeChild(sandbox);
       }
       document.body.appendChild((sandbox = document.createElement('div')));
    });

    // each test case has to be wrapped into a context or describe block
    // in order to setup the sandbox and execute the required stuff, i.e. the GIVEN and WHEN statements
    context('listening events', () => {
        // the purpose of the test is to check events triggered from children of the custom element
        // are listened
        let bubblingListener, el;
        beforeEach(done => {
            // usage of sinon.js to be able to check the listener invokations
            bubblingListener = sinon.spy();

            // register the tested custom element
            element().builders(
                on('custom-event').invoke(bubblingListener),
                template('<input/>')
            ).register('test-on-custom-event');

            // create and append the custom element to the sandbox
            sandbox.appendChild((el = document.createElement('test-on-custom-event')));

            // because the block beforeEach is async, the callback done() has to be called
            // if sandbox is able to listen the triggered event, it's means the custom element was able to do it before
            let listener = () => {
                sandbox.removeEventListener('custom-event', listener);
                done();
            };
            sandbox.addEventListener('custom-event', listener);

            // manage the async "registration" of the custom element using a time out
            setTimeout(() => {
                // trigger the event from a child of the custom element
                dispatchCustomEvent(el.querySelector('input'), 'custom-event');
            }, 10);
        });
        it('should invoke the bubbling listeners', () => {
            // the following expect statement check the invokation of the custom element's listener
            // the assertion if based on chai.js
            expect(bubblingListener).to.have.been.calledOnce;
            expect(bubblingListener).to.be.calledWith(el, sinon.match(Object));
        });
    });
});
```
The usage of `setTimeout()` is required to be sure the custom element is well registered.
Indeed according to the implementation, the registration of custom elements is synchronous or not.
It's mean: a couple of millisecond may be required between the insertion of the custom element into the DOM and its status `ready`. 

[mocha]: http://mochajs.org
[ES2015]: http://www.ecma-international.org/ecma-262/6.0
[BDD]: https://fr.wikipedia.org/wiki/Behavior_driven_development
[ES5]: http://www.ecma-international.org/ecma-262/5.1
[karma]: http://karma-runner.github.io
[webpack]: https://webpack.github.io
[babel]: http://babeljs.io
[circle-ci]: https://circleci.com/gh/tmorin/ceb
[Sauce Labs]: https://saucelabs.com/u/customelementbuilder
[PhantomJS]: http://phantomjs.org
