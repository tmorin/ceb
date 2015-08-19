import {ceb, attribute, template} from '../../lib/ceb.js';

export default ceb().augment(
    template(`
        <div ceb-content></div>
    `),
    attribute('hidden')
        .setter((el, value) => {
            el.style.display = value ? 'none' : undefined;
            return value;
        })
        .boolean()
).register('ceb-ui-page');
