import {fromJS} from 'immutable';
import {combineReducers, createReducer} from 'immutable-reducers';
import {ADD_TODO, COMPLETE_TODO, SET_VISIBILITY_FILTER, VisibilityFilters} from './actions.js';
const {SHOW_ACTIVE} = VisibilityFilters;

function visibilityFilter(state = SHOW_ACTIVE, action = {}) {
    switch (action.type) {
        case SET_VISIBILITY_FILTER:
            return action.filter;
        default:
            return state;
    }
}

function todos(state = fromJS([]), action = {}) {
    switch (action.type) {
        case ADD_TODO:
            return state.push(fromJS({
                id: action.id,
                text: action.text,
                completed: false
            }));
        case COMPLETE_TODO:
            return state.setIn([parseInt(action.index, 0), 'completed'], true);
        default:
            return state;
    }
}

const todoApp = combineReducers(
    createReducer(['visibilityFilter'], visibilityFilter),
    createReducer(['todos'], todos)
);

export default todoApp;
