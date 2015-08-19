import {ceb, attribute, method, template} from '../../lib/ceb.js';

export default ceb().augment(
    template(`
        <content></content>
    `),
    attribute('primary').boolean(),
    attribute('ref'),
    method('createdCallback').invoke(el => {
        if (el.ref) {
            var refCebUiAction = document.getElementById(el.ref);
            if (refCebUiAction) {
                //console.log('clone!!', refCebUiAction.innerHTML)
                el.lightDomNode.appendChild(refCebUiAction.cloneNode(true));
            }
        }
    })
).register('ceb-ui-action');
