import 'document-register-element/build/document-register-element.js';
import 'babel-polyfill';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

import './weather-app.js';

import $ from 'jquery';
import template from './index.html';

$(() => $(template).appendTo($('#content')));
