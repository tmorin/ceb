import 'document-register-element/build/document-register-element.js';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import 'bootstrap/dist/js/bootstrap.js';

import './ceb-button.js';
import './ceb-field.js';
import './ceb-form.js';

import $ from 'jquery';
import template from './index.tpl.html';

$(() => $(template).appendTo($('#content')));
