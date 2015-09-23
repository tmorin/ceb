import {ceb, property, method, on} from 'es6/lib/ceb.js';
import {idomify} from '../builders/idomify.js';

import './todo-list.js';
import './todo-form.js';

ceb().augment(
    idomify(`
        <tpl-placeholder>
            <todo-list></todo-list>
            <todo-form></todo-form>
        </tpl-placeholder>
    `)
).register('todo-app');
