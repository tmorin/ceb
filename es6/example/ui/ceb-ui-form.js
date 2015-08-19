import {ceb, template} from '../../lib/ceb.js';

export default ceb().augment(
    template(`
        <form ceb-content></form>
    `)
).register('ceb-ui-form');
