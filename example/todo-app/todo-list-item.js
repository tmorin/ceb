import {ceb, property, attribute, method, on} from 'es6/lib/ceb.js';
import {idomify} from '../builders/idomify.js';
import {todoify} from './todoify.js';

ceb().augment(
    idomify(`
        <div class="checkbox">
            <label>
                <input
                    type="checkbox"
                    name="completed"
                    checked="{{data.item.completed?'':null}}"
                    disabled="{{data.item.completed?'':null}}"
                    value="{{data.item.id}}" >
                <tpl-text value="data.item.text" />
            </label>
        </div>
    `),

    todoify(),

    property('item').setter((el, value) => {
        el._items = value;
        el.render();
    }).getter(el => {
        return el._items
    }),

    attribute('id'),
    attribute('text'),
    attribute('completed').boolean(),

    on('change').delegate('input[name=completed]').skip().invoke((el, evt) => {
        el.actions.completeTodo(evt.target.value);
    })
).register('todo-list-item');
