import 'document-register-element/build/document-register-element.js';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import 'bootstrap/dist/js/bootstrap.js';

import './todo-app/todo-app';

import $ from 'jquery';
import template from './todo-app.html';

$(() => $(template).appendTo($('body')));
