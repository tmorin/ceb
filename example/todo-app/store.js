import {createStore, compose} from 'redux';
import {devTools, persistState} from 'redux-devtools';
import todoApp from './reducers.js';

const finalCreateStore = compose(
    // Provides support for DevTools
    devTools(),
    // Lets you write ?debug_session=<name> in address bar to persist debug sessions
    persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
)(createStore);

export const store = finalCreateStore(todoApp);

store.subscribe((state) => {
    console.log('state', state);
});
