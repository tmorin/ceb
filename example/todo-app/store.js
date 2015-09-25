import {createStore} from 'redux';
import {fromJS} from 'immutable';
import todoApp from './reducers.js';

export const store = createStore(todoApp, fromJS({
    todos: [{text: 'note1', completed: false, id: 0}, {text: 'note2', completed: false, id: 1}]
}));

console.log('initial state', store.getState().toJS().todos.length);
store.subscribe(() => {
    console.log('global listener', store.getState().toJS());
})
