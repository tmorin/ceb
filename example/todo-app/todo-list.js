import {ceb, property, method, on} from 'es6/lib/ceb.js';
import {idomify} from '../builders/idomify.js';

import './todo-list-item.js';

ceb().augment(
    idomify(`
        <tpl-logger content="------ items {{data.items.length}}"/>
        <p>
            Items: <tpl-text value="data.items.length" />
        </p>
        <tpl-each items="data.items" item="item">
            <todo-list-item content="{{item.content}}" done="{{item.done}}"></todo-list-item>
        </tpl-each>
    `),
    property('items').value([{content:'note1', done:true}])
).register('todo-list');
