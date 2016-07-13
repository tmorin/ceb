import 'webcomponents.js/webcomponents-lite.js';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import 'bootstrap/dist/js/bootstrap.js';

import './todo-app.js';

import $ from 'jquery';
import template from './index.html';

$(() => $(template).appendTo($('#content')));
