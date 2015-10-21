import {createStore} from 'redux';
import {fromJS} from 'immutable';
import todoApp from './reducers.js';

let todos = [];
for(let i = 0; i < 11; i++) {
    todos.push({
        text: `note ${i}`,
        completed: i%2 === 0,
        id: `item-${i}`
    });
}

export const store = createStore(todoApp, fromJS({todos}));
