import {ceb, on, property} from '../../es6/lib/ceb.js';
import {idomify} from '../builders/idomify.js';
import {todoify} from './todoify.js';

ceb().builders(
    idomify(`
        <button type="button" name="clearCompletedTodos" class="btn btn-danger btn-block" disabled="{{data.buttonDisabled ? '' : null}}">
            <span class="glyphicon glyphicon-erase" aria-hidden="true"></span>
            Clear completed todos
        </button>
    `),

    todoify(),

    property('state').setter((el, value) => {
        el._state = value;
        el.buttonDisabled = value.todos.filter(item => item.completed).length < 1;
        el.render();
    }).getter(el => el._state),

    on('click').delegate('button[name=clearCompletedTodos]').skip().invoke((el) => el.actions.clearCompletedTodos())
).register('todo-clear-completed');
