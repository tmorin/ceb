import {element, method, on} from '../../src/ceb.js';
import {idomify} from '../builders/idomify.js';
import {todoify} from './todoify.js';

element().builders(
    idomify(`
        <form>
            <div class="input-group">
                <input required placeholder="something to do ..." name="text" class="form-control" type="text">
                <span class="input-group-btn">
                    <button type="submit" class="btn btn-default btn-primary">
                        <span class="glyphicon glyphicon-plus" aria-hidden="true"></span>
                   </button>
                </span>
            </div>
        </form>
    `),

    todoify(),

    method('createdCallback').invoke(el => el.render()),

    on('submit').skip().invoke((el, evt) => {
        let text = evt.target.text.value;
        if (text) {
            el.actions.addTodo(text);
            evt.target.text.value = '';
        }
    })
).register('todo-add');
