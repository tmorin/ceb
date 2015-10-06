import {ceb, method} from 'es6/lib/ceb.js';
import {idomify} from '../builders/idomify.js';
import {todoify} from './todoify.js';

import './todo-list.js';
import './todo-add.js';
import './todo-filters.js';
import './todo-clear-completed.js';

ceb().augment(
    idomify(`
        <p class="row">
            <div class="col-sm-12">
                <todo-add tpl-placeholder></todo-add>
            </div>
        </p>
        <p class="row">
            <div class="col-sm-6">
                <todo-filters tpl-placeholder></todo-filters>
            </div>
            <div class="col-sm-6">
                <todo-clear-completed tpl-placeholder></todo-clear-completed>
            </div>
        </p>
        <p class="row">
            <div class="col-sm-12">
                <todo-list tpl-placeholder></todo-list>
            </div>
        </p>
    `),

    todoify(),

    method('createdCallback').invoke(el => el.render())
).register('todo-app');
