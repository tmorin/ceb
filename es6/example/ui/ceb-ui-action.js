import {ceb, property, attribute, method, delegate, template, on} from '../../lib/ceb.js';
import {toArray, camelCase, startsWith, assign} from 'lodash/index';

export default ceb().augment(
    template(`
        <content></content>
    `),
    attribute('primary').boolean(),
    attribute('ref'),
    property('params').getter(el => {
        return toArray(el.attributes)
            .filter(attr => startsWith(attr.name, 'param-'))
            .map(attr => {
                let name = camelCase(attr.name.replace('param-', '')),
                    value = attr.value;
                return {name, value};
            }).reduce((a, b) => {
                a[b.name] = b.value;
                return a;
            }, {});
    }),
    attribute('name'),
    delegate(attribute('disabled').boolean()).to('[ceb-ui-action-target]').property('disabled'),
    method('createdCallback').invoke(el => {
        let refCebUiAction;
        if (el.ref && (refCebUiAction = document.getElementById(el.ref))) {
            el.lightDomNode.appendChild(refCebUiAction.cloneNode(true));
        }
    }),
    on('click').delegate('[ceb-ui-action-target]').skip().invoke((el) => {
        el.dispatchEvent(new CustomEvent('ceb-action', {
            bubbles: true,
            detail: {
                name: el.name,
                params: el.params
            }
        }));
    }),
    on('ceb-action').delegate('ceb-ui-action').invoke((el, evt) => {
        evt.stopPropagation();
        evt.preventDefault();
        el.dispatchEvent(new CustomEvent('ceb-action', {
            bubbles: true,
            detail: {
                name: evt.detail.name,
                params: assign({}, evt.detail.params, el.params)
            }
        }));
    })
).register('ceb-ui-action');
