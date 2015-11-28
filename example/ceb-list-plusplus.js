import 'document-register-element/build/document-register-element.js';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import 'bootstrap/dist/js/bootstrap.js';

import './elements/ceb-list-plusplus.js';

import $ from 'jquery';
import template from './ceb-list-plusplus.html';

$(() => $(template).appendTo($('#content')));
