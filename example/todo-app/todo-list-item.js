import {ceb, attribute} from 'es6/lib/ceb.js';
import {idomify} from '../builders/idomify.js';

ceb().augment(
    idomify(`
        <label>
            <input type="checkbox" checked="{{data.done?'':null}}">
            <tpl-text value="{{data.content}}"/>
        </label>
    `),
    attribute('content'),
    attribute('done').boolean()
).register('todo-list-item');
