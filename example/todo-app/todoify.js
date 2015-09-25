import {reduxify} from '../builders/reduxify.js';
import {addTodo, completeTodo, setVisibilityFilter} from './actions.js';
import {store} from './store.js';

export function todoify() {
    return reduxify(store).bind({addTodo, completeTodo, setVisibilityFilter});
}
