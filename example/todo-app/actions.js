/*
 * action types
 */

export const ADD_TODO = 'ADD_TODO';
export const COMPLETE_TODO = 'COMPLETE_TODO';
export const CLEAR_COMPLETED_TODOS = 'CLEAR_COMPLETED_TODOS';
export const SET_VISIBILITY_FILTER = 'SET_VISIBILITY_FILTER';

/*
 * other constants
 */

export const VisibilityFilters = {
    SHOW_ALL: 'SHOW_ALL',
    SHOW_COMPLETED: 'SHOW_COMPLETED',
    SHOW_ACTIVE: 'SHOW_ACTIVE'
};

/*
 * action creators
 */

export function addTodo(text) {
    return { type: ADD_TODO, text, id: `item-${Date.now()}` };
}

export function completeTodo(id) {
    return { type: COMPLETE_TODO, id };
}

export function clearCompletedTodos() {
    return { type: CLEAR_COMPLETED_TODOS };
}

export function setVisibilityFilter(filter) {
    return { type: SET_VISIBILITY_FILTER, filter };
}
