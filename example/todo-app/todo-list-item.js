import {ceb, property, on} from '../../es6/lib/ceb.js';
import {idomify} from '../builders/idomify.js';
import {todoify} from './todoify.js';

ceb().builders(
    idomify(`
        <div class="checkbox">
            <label>
                <input
                    type="checkbox"
                    name="completed"
                    checked="{{data.item.completed ? '' : null}}"
                    disabled="{{data.item.completed ? '' : null}}"
                    value="{{data.item.id}}" >
                <tpl-text value="data.item.text" />
            </label>
        </div>
    `),

    todoify(),

    property('item').setter((el, value) => {
        el._items = value;
        el.render();
    }).getter(el => el._items),

    on('change').delegate('input[name=completed]').skip().invoke((el, evt) => {
        el.actions.completeTodo(evt.target.value);
    })
).register('todo-list-item');
