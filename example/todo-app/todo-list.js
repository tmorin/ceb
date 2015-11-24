import {ceb, property} from '../../src/ceb.js';
import {idomify} from '../builders/idomify.js';
import {todoify} from './todoify.js';
import './todo-list-item.js';

ceb().builders(
    idomify(`
        <tpl-if expression="data.items.length < 1">
            <p class="text-muted">no todos to display</p>
        <tpl-else/>
            <tpl-each items="data.items" item="item">
                <todo-list-item tpl-placeholder tpl-key="{{item.id}}" item="{{item}}"/>
            </tpl-each>
        </tpl-if>
    `),

    todoify(),

    property('state').setter((el, value) => {
        el._state = value;
        switch (value.visibilityFilter) {
            case 'SHOW_COMPLETED':
                el.items = value.todos.filter(v => v.completed);
                break;
            case 'SHOW_ACTIVE':
                el.items = value.todos.filter(v => (!v.completed));
                break;
            default:
                el.items = value.todos;
        }
        el.render();
    }).getter(el => el._state)
).register('todo-list');
