import {ceb, property, on} from 'es6/lib/ceb.js';
import {trigger} from './utils.js';

export default ceb().augment(
    property('items').value(() => ([])),

    on('ui-ready').delegate('[is=ui-template]').skip().invoke((el, evt, template) => {
        template.patch(el, el);
        trigger(el, 'ui-ready');
    })
).register('ui-items');
