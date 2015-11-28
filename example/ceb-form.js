import 'document-register-element/build/document-register-element.js';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import 'bootstrap/dist/js/bootstrap.js';

import './form/button.js';
import './form/field.js';
import './form/form.js';

import $ from 'jquery';
import template from './ceb-form.html';

$(() => $(template).appendTo($('#content')));
