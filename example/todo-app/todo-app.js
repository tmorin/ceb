import {ceb} from 'es6/lib/ceb.js';
import {idomify} from '../builders/idomify.js';

import template from './todo-app.html!es6/lib/incomplate/incomplate-plugin.js';
import './todo-list.js';
import './todo-form.js';

ceb().augment(
    idomify(template)
).register('todo-app');
