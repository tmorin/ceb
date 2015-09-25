import {ceb, property, method, on} from 'es6/lib/ceb.js';
import {idomify} from '../builders/idomify.js';
import './todo-list-item.js';
import {todoify} from './todoify.js';

ceb().augment(
    idomify(`
        <p>
            <label>
                <input type="radio" name="visibility" value="SHOW_ACTIVE" checked="{{data.visibility === 'SHOW_ACTIVE' || null}}">
                Active
                (<tpl-text value="data.activeItems.length" />)
            </label>
            <label>
                <input type="radio" name="visibility" value="SHOW_COMPLETED" checked="{{data.visibility === 'SHOW_COMPLETED' || null}}">
                Completed
                (<tpl-text value="data.completedItems.length" />)
            </label>
            <label>
                <input type="radio" name="visibility" value="SHOW_ALL" checked="{{data.visibility === 'SHOW_ALL' || null}}">
                All
                (<tpl-text value="data.allItems.length" />)
            </label>
        </p>
        <tpl-each items="data.visibleItems" item="item">
            <todo-list-item
                tpl-placeholder
                tpl-key="item-{{item.id}}"
                id="item-{{item.id}}"
                text="{{item.text}}"
                completed="{{item.completed?'':null}}"
                index="{{index}}"/>
        </tpl-each>
    `),

    todoify().subscribe((el) => {
        let newState = el.store.getState().toJS();
        el.allItems = newState.todos;
        el.visibility = newState.visibilityFilter;
        el.render();
    }),

    property('allItems').value([]),
    property('completedItems').getter((el) => el.allItems.filter(v => v.completed)),
    property('activeItems').getter((el) => el.allItems.filter(v => {
        console.log('activeItems keep %s : %s', v.id, !v.completed);
        return !v.completed;
    })),
    property('visibleItems').getter((el) => {
        switch (el.visibility) {
            case 'SHOW_COMPLETED':
                return el.completedItems;
            case 'SHOW_ACTIVE':
                return el.activeItems;
            default:
                return el.allItems;
        }
    }),
    property('visibility'),

    method('createdCallback').invoke(el => {
        let newState = el.store.getState().toJS();
        el.allItems = newState.todos;
        el.visibility = newState.visibilityFilter;
    }),

    on('change').delegate('input[name=visibility]').skip().invoke((el, evt) => {
        el.actions.setVisibilityFilter(evt.target.value);
    })
).register('todo-list');
