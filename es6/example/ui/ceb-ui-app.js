import {ceb, attribute, method, template} from '../../lib/ceb.js';

export default ceb().augment(
    template(`
        <div ceb-content></div>
    `),
    attribute('start-page'),
    method('createdCallback').invoke(el => {
        el.display(el.startPage);
    }),
    method('display').invoke((el, pageId) => {
        var cebUiPages = Array.prototype.slice.call(el.lightDomNode.querySelectorAll('ceb-ui-page'));
        cebUiPages.filter(page => page.id !== pageId).forEach(page => page.hidden = true);
    })
).register('ceb-ui-app');
