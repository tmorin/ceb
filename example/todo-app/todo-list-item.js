import {ceb, attribute, on} from 'es6/lib/ceb.js';
import {idomify} from '../builders/idomify.js';
import {todoify} from './todoify.js';

ceb().augment(
    idomify(`
        <div>
            <label>
                <input
                    type="checkbox"
                    name="completed"
                    checked="{{data.completed?'':null}}"
                    disabled="{{data.completed?'':null}}"
                    value="{{data.index}}" >
                <tpl-text value="data.text" />
            </label>
        </div>
    `),

    todoify().subscribe((el) => {
        var state = el.store.getState().getIn(['todos', parseInt(el.index, 0)]).toJS();
        el.text = state.text;
        el.completed = state.completed;
        el.render();
    }),

    attribute('index'),
    attribute('text'),
    attribute('completed').boolean(),

    on('change').delegate('input[name=completed]').skip().invoke((el, evt) => {
        el.actions.completeTodo(evt.target.value);
    })
).register('todo-list-item');
