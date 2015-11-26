import 'document-register-element/build/document-register-element.js';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import 'bootstrap/dist/js/bootstrap.js';

import './elements/ceb-address-selector.js';

import './ceb-address-selector.css';

import $ from 'jquery';
import template from './ceb-address-selector.html';

$(() => $(template).appendTo($('body')));