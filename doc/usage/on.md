# on()

The function `on()` returns a fresh `OnBuilder` providing services to define event listeners.

The builder is able to simply listening events or handle event delegation.

Listeners are added on `attachedCallback` and removed on `detachedCallback`.

## Listen during the bubbling phase

If the user clicks on the custom element or one of its children, the message _triggered by CEB-EXAMPLE_ will be logged.

```javascript
import {element, on} from 'ceb';
element()
    .builders(
        on('click').invoke((el, evt, target) => console.log('triggered by %s', target.tagName))
    )
    .register('ceb-example');
```

## Listen during the capture phase

If the user clicks on the custom element or one of its children, the message _triggered by CEB-EXAMPLE_ will be logged.

```javascript
import {element, on} from 'ceb';
element()
    .builders(
        on('click').capture().invoke((el, evt, target) => console.log('triggered by %s', target.tagName))
    )
    .register('ceb-example');
```

## .preventDefault() and .stopPropagation()

`.prevent()` will call the method `.preventDefault()` of the event.
`.stop()` will call the method `.stopPropagation()` of the event.
`.skip()` will call the methods `.preventDefault()` and `.stopPropagation()` of the event.

```javascript
import {element, on} from 'ceb';
element()
    .builders(
        on('click').prevent(),
        on('mouseover').stop(),
        on('keypress').skip()
    )
    .register('ceb-example');
```


## Event delegation

If the user clicks on `p.message`, nothing will happened.

If the user clicks on `button.ok` or one of its children, the message _Ok! triggered by BUTTON_ will be logged.

If the user clicks on `button.cancel` or one of its children, the message _Cancel! triggered by BUTTON_ will be logged.

```javascript
import {element, on, template} from 'ceb';
element()
    .builders(
        template(`
            <p class="message"></p>
            <button class="ok"><i class="fa fa-check"></i> Ok</button>
            <button class="cancel"><i class="fa fa-ban"></i> Cancel</button>
        `)
        on('click').delegate('button.ok').invoke((el, evt, target) => console.log('Ok! triggered by %s', target.tagName)),
        on('click').delegate('button.cancel').invoke((el, evt, target) => console.log('Cancelled! triggered by %s', target.tagName))
    )
    .register('ceb-example');
```
