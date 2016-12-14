import 'document-register-element/build/document-register-element.js';
import './main.less'
import template from './index.html';

window.addEventListener('DOMContentLoaded', () => {
    document.body.querySelector('#content').innerHTML = template;
});
