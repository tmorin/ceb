import {ceb, delegate, attribute, method, template} from '../../lib/ceb.js';

export default ceb().augment(
    template(`
        <div ui-ref="primary"></div>
        <span ui-ref="title"></span>
        <div ui-ref="secondary"></div>
        <div style="display: none" ceb-content></div>
    `),
    delegate(attribute('ui-title')).to('[ui-ref=title').property('textContent'),
    method('createdCallback').invoke(el => {
        var primaryNodes = Array.prototype.slice.call(el.lightDomNode.querySelectorAll('[primary]'));
        var primaryNode = el.querySelector('[ui-ref=primary]');
        primaryNodes.forEach(action => primaryNode.appendChild(action));

        var secondaryNodes = Array.prototype.slice.call(el.lightDomNode.querySelectorAll(':not([primary])'));
        var secondaryNode = el.querySelector('[ui-ref=secondary]');
        secondaryNodes.forEach(action => secondaryNode.appendChild(action));
    })
).register('ceb-ui-header');
