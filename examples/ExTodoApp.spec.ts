import '@webcomponents/webcomponentsjs';
import './ExTodoApp';
import {ExTodoApp} from './ExTodoApp';
import {ExTodoItem} from './ExTodoItem';
import {toArray} from '../src/utilities';
import * as assert from 'assert';

describe('ExTodoApp', () => {
    let sandbox: HTMLDivElement, app: ExTodoApp;

    beforeEach(function () {
        sandbox = document.body.appendChild(document.createElement('div'));
        sandbox.innerHTML = `<ex-todo-app></ex-todo-app>`;
        app = sandbox.querySelector('ex-todo-app');
    });

    it('should add items', () => {
        app.onAddItem('todo item #0');
        app.onAddItem('todo item #1');
        const items: Array<ExTodoItem> = toArray(sandbox.querySelectorAll('ex-todo-item'));
        assert.strictEqual(items.length, 2);
        assert.strictEqual(items[0].text, 'todo item #0');
        assert.strictEqual(items[0].done, false);
        assert.strictEqual(items[1].text, 'todo item #1');
        assert.strictEqual(items[1].done, false);
    });

    it('should clean items', () => {
        app.onAddItem('todo item #0');
        app.onAddItem('todo item #1');
        app.onAddItem('todo item #2');

        const itemsBefore: Array<ExTodoItem> = toArray(sandbox.querySelectorAll('ex-todo-item'));
        assert.strictEqual(itemsBefore.length, 3);
        itemsBefore[0].done = true;
        itemsBefore[2].done = true;

        app.onCleanItems();

        const itemsAfter: Array<ExTodoItem> = toArray(sandbox.querySelectorAll('ex-todo-item'));
        assert.strictEqual(itemsAfter.length, 1);
        assert.strictEqual(itemsAfter[0].text, 'todo item #1');
        assert.strictEqual(itemsAfter[0].done, false);
    });

});
