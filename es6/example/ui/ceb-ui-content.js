import {ceb, template} from '../../lib/ceb.js';

export default ceb().augment(
    template(`
        <div ceb-content></div>
    `)
).register('ceb-ui-content');
