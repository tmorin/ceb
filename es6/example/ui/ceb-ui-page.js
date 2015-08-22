import {ceb, attribute, method,template} from '../../lib/ceb.js';
import immutable from 'immutable';

export default ceb().augment(
    template(`
        <div ceb-content></div>
    `),

    attribute('hidden')
        .setter((el, value) => {
            el.style.display = value ? 'none' : undefined;
            setTimeout(() => {
                let bubble = true;
                if (value) {
                    el.dispatchEvent(new CustomEvent('ceb-page-hide', {bubble}));
                } else {
                    el.dispatchEvent(new CustomEvent('ceb-page-show', {bubble}));
                }
            }, 0);
            return value;
        })
        .boolean()
        .value(true),

    method('attachedCallback').invoke((el) => {
        el._cebAppContext = new immutable.Map();
    })

).register('ceb-ui-page');
