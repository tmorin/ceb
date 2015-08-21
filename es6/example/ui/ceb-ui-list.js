import {ceb, method, property, template} from '../../lib/ceb.js';
import {template as lodashTemplate, toArray, isString, result} from 'lodash/index';

export default ceb().augment(
    template(`
        <ul ceb-content></ul>
    `),

    property('template').getter(el => {
        if (!el._cebUiListTpl) {
            el._cebUiListTpl = result(el.querySelector('[template]'), 'textContent');
        }
        return el._cebUiListTpl;
    }).setter((el, tpl) => {
        if (isString(tpl)) {
            el._cebUiListTpl = tpl;
            el._cebUiListTplFunc = null;
        }
    }),

    property('templateAsFunction').getter(el => {
        if (!el._cebUiListTplFunc) {
            el._cebUiListTplFunc = lodashTemplate(el.template || '');
        }
        return el._cebUiListTplFunc;
    }),

    method('addItem').invoke((el, item) => {
        let docFragment = document.createDocumentFragment(), li;
        docFragment.appendChild((li = document.createElement('li')));
        li.innerHTML = el.templateAsFunction(item);
        el.appendChild(docFragment);
    })

).register('ceb-ui-list');
