import {ceb, method} from '../../lib/ceb.js';

export default ceb().augment(
    method('createdCallback').invoke(el => {
        el.style.display = 'none';
    })
).register('ceb-ui-actions');
