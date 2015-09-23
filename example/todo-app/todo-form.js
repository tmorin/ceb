import {ceb, property, method, on} from 'es6/lib/ceb.js';
import {idomify} from '../builders/idomify.js';

import {addTodo} from './actions.js';
import {store} from './store.js';

ceb().augment(
    idomify(`
        <form>
            <input name="text" type="text" required>
            <button type="submit">add</button>
        </form>
    `),

    on('submit').skip().invoke((el, evt) => {
        let text = evt.target.text.value;
        if (text) {
            store.dispatch(addTodo(text));
        }
    })
).register('todo-form');
