import 'document-register-element/build/document-register-element.js';

import 'babel-polyfill';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import 'bootstrap/dist/js/bootstrap.js';

import './elements/ceb-grid.js';

import './ceb-grid.css';

import $ from 'jquery';
import template from './ceb-grid.html';

$(() => {
    $(template).appendTo($('body'));

    setTimeout(function () {
        /* start the memory store */
        var memoryStore = document.getElementById('memoryStore');
        for (var i = 0; i < 9999; i++) {
            memoryStore.data.push({
                id: 'id' + i,
                firstname: 'firstname ' + i,
                lastname: 'lastname ' + i,
                birthdate: new Date()
            });
        }
        var memoryGrid = document.getElementById('memoryGrid');
        memoryGrid.refresh();

        /* start the rest store */
        var restStore = document.getElementById('restStore');
        restStore.options = {
            ajax: {
                crossDomain: 'true',
                url: 'https://en.wikipedia.org/w/api.php',
                data: {
                    action: 'query',
                    list: 'search',
                    format: 'json',
                    srnamespace: '0',
                    srinfo: 'totalhits',
                    srprop: 'size|wordcount|timestamp|snippet|titlesnippet|redirecttitle|redirectsnippet|sectiontitle|sectionsnippet'
                },
                dataType: 'jsonp',
                type: 'GET'
            }
        };
        restStore.toData = function (req) {
            var data = {
                srsearch: req.filterBy,
                sroffset: req.pagination.from,
                srlimit: req.pagination.size
            };
            return data;
        };
        restStore.toResponse = function (payload, req) {
            if (!payload.error) {
                var data = payload.query.search;
                var pagination = {
                    from: req.pagination.from,
                    size: payload.query.search.length,
                    max: payload.query.searchinfo.totalhits
                };
                return {
                    data: data,
                    pagination: pagination
                };
            }
        };
        var restGrid = document.getElementById('restGrid');
        restGrid.refresh();

        /* setup the filter form */
        var filterForm = document.getElementById('filterForm');
        filterForm.toggleFormActivation = function (value) {
            this.submitBtn.disabled = value;
            this.submitBtn.textContent = value ? 'filtering ...' : 'apply filter';
            this.resetBtn.disabled = value;
            this.filterQuery.disabled = value;
        };
        filterForm.addEventListener('submit', function (evt) {
            evt.preventDefault();
            evt.target.toggleFormActivation(true);
            var query = '*' + evt.target.filterQuery.value + '*';
            memoryGrid.filterBy = {
                firstname: query,
                lastname: query
            };
            memoryGrid.refresh();
            restGrid.filterBy = evt.target.filterQuery.value;
            restGrid.refresh().then(function () {
                evt.target.toggleFormActivation(false);
            }, function () {
                evt.target.toggleFormActivation(false);
            });
        });
        filterForm.addEventListener('reset', function (evt) {
            memoryGrid.filterBy = null;
            memoryGrid.refresh();
            restGrid.filterBy = null;
            restGrid.refresh();
        });
    });
});
