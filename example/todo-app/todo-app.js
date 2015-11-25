import {element, method} from '../../src/ceb.js';
import {idomify} from '../builders/idomify.js';
import {todoify} from './todoify.js';

import './todo-list.js';
import './todo-add.js';
import './todo-filters.js';
import './todo-clear-completed.js';

element().builders(
    idomify(`
        <p class="row">
            <div class="col-sm-12">
                <todo-add tpl-placeholder tpl-key="'todo-add'"></todo-add>
            </div>
        </p>
        <p class="row">
            <div class="col-sm-6">
                <todo-filters tpl-placeholder tpl-key="'todo-filters'"></todo-filters>
            </div>
            <div class="col-sm-6">
                <todo-clear-completed tpl-placeholder tpl-key="'todo-clear-completed'"></todo-clear-completed>
            </div>
        </p>
        <p class="row">
            <div class="col-sm-12">
                <todo-list tpl-placeholder tpl-key="'todo-list'"></todo-list>
            </div>
        </p>
    `),

    todoify(),

    method('createdCallback').invoke(el => el.render())
).register('todo-app');
