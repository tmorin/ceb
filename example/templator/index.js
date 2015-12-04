import 'document-register-element/build/document-register-element.js';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import 'bootstrap/dist/js/bootstrap.js';

import './ceb-templator.js';

import $ from 'jquery';
import template from './index.html';

$(() => {
    $(template).appendTo($('#content'));

    setTimeout(function () {
        var data = {
            items: [{
                name: 'item1'
            }, {
                name: 'item2'
            }, {
                name: 'item3'
            }]
        };

        var withHandlebars = document.getElementById('withHandlebars');
        var withHandlebarsFrom = document.getElementById('withHandlebarsFrom');
        var withHandlebarsTo = document.getElementById('withHandlebarsTo');
        var withHandlebarsLive = document.getElementById('withHandlebarsLive');

        withHandlebarsFrom.textContent = withHandlebars.outerHTML;
        withHandlebarsTo.textContent = withHandlebars.render(data);
        withHandlebarsLive.innerHTML = withHandlebars.render(data);
    });
});
