import {ceb, property, on} from '../../es6/lib/ceb.js';
import {idomify} from '../builders/idomify.js';
import {todoify} from './todoify.js';

ceb().builders(
    idomify(`
        <ul class="list-inline">
            <li class="checkbox">
                <label>
                    <input type="radio" name="visibility" value="SHOW_ACTIVE" checked="{{data.state.visibilityFilter === 'SHOW_ACTIVE' || null}}">
                    Active
                    (<tpl-text value="data.activeCounter" />)
                </label>
            </li>
            <li class="checkbox">
                <label>
                    <input type="radio" name="visibility" value="SHOW_COMPLETED" checked="{{data.state.visibilityFilter === 'SHOW_COMPLETED' || null}}">
                    Completed
                    (<tpl-text value="data.completedCounter" />)
                </label>
            </li>
            <li class="checkbox">
                <label>
                    <input type="radio" name="visibility" value="SHOW_ALL" checked="{{data.state.visibilityFilter === 'SHOW_ALL' || null}}">
                    All
                    (<tpl-text value="data.allCounter" />)
                </label>
            </li>
        </ul>
    `),

    todoify(),

    property('state').setter((el, value) => {
        el._state = value;
        el.allCounter = value.todos.length;
        el.completedCounter = value.todos.filter(item => item.completed).length;
        el.activeCounter = el.allCounter - el.completedCounter;
        el.render();
    }).getter(el => el._state),

    on('change').delegate('input[name=visibility]').skip().invoke((el, evt) => {
        el.actions.setVisibilityFilter(evt.target.value);
    })
).register('todo-filters');
