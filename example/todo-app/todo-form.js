import {ceb, property, on} from 'es6/lib/ceb.js';
import {idomify} from '../builders/idomify.js';
import {todoify} from './todoify.js';

ceb().augment(
    idomify(`
        <form>
            <div class="input-group">
                <input required placeholder="an item" name="text" class="form-control" type="text">
                <span class="input-group-btn">
                    <button type="submit" class="btn btn-default">
                        <span class="glyphicon glyphicon-plus" aria-hidden="true"></span>
                   </button>
                </span>
            </div>
        </form>
    `),

    todoify(),

    on('submit').skip().invoke((el, evt) => {
        let text = evt.target.text.value;
        if (text) {
            console.log('dispatch action', text);
            el.actions.addTodo(text);
            evt.target.text.value = '';
        }
    })
).register('todo-form');
