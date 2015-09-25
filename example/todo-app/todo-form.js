import {ceb, property, on} from 'es6/lib/ceb.js';
import {idomify} from '../builders/idomify.js';
import {todoify} from './todoify.js';

ceb().augment(
    idomify(`
        <form>
            <input name="text" type="text" required>
            <button type="submit">add</button>
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
